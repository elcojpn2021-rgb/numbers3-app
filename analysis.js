/**
 * ナンバーズ3 分析エンジン
 * stats-data.js のデータを使って各種分析・予想を行う純粋関数群
 */

const POSITIONS = ['hundred', 'ten', 'one'];
const POSITION_LABEL = { hundred: '百の位', ten: '十の位', one: '一の位' };

// ---------- 0. CSV生データからの動的集計 (Web自動取得したデータ用) ----------
// draws: [{ round, date: Date, number: '038' }, ...] 形式を想定

function buildYearlyDataFromDraws(draws) {
  const yearly = {};
  draws.forEach((d) => {
    const year = d.date.getFullYear();
    if (!yearly[year]) {
      yearly[year] = {};
      for (let i = 0; i <= 9; i++) yearly[year][i] = { total: 0, hundred: 0, ten: 0, one: 0 };
    }
    const digits = d.number.split('').map(Number);
    const posKeys = ['hundred', 'ten', 'one'];
    digits.forEach((digit, idx) => {
      yearly[year][digit].total += 1;
      yearly[year][digit][posKeys[idx]] += 1;
    });
  });
  return yearly;
}

function buildMonthlyDataFromDraws(draws) {
  const monthly = {};
  for (let m = 1; m <= 12; m++) {
    monthly[m] = { digits: {} };
    for (let i = 0; i <= 9; i++) monthly[m].digits[i] = { total: 0, hundred: 0, ten: 0, one: 0 };
  }
  draws.forEach((d) => {
    const month = d.date.getMonth() + 1;
    const digits = d.number.split('').map(Number);
    const posKeys = ['hundred', 'ten', 'one'];
    digits.forEach((digit, idx) => {
      monthly[month].digits[digit].total += 1;
      monthly[month].digits[digit][posKeys[idx]] += 1;
    });
  });
  for (let m = 1; m <= 12; m++) {
    const entries = Object.entries(monthly[m].digits).map(([digit, v]) => ({ digit: Number(digit), total: v.total }));
    entries.sort((a, b) => b.total - a.total);
    monthly[m].mostFrequent = entries.length ? entries[0].digit : null;
    monthly[m].leastFrequent = entries.length ? entries[entries.length - 1].digit : null;
  }
  return monthly;
}

function buildEvenOddPatternsFromDraws(draws) {
  const counts = {};
  const keys = [];
  ['E', 'O'].forEach((a) => ['E', 'O'].forEach((b) => ['E', 'O'].forEach((c) => keys.push(`${a}${b}${c}`))));
  keys.forEach((k) => (counts[k] = 0));

  draws.forEach((d) => {
    const digits = d.number.split('').map(Number);
    const key = digits.map((n) => (n % 2 === 0 ? 'E' : 'O')).join('');
    if (counts[key] !== undefined) counts[key] += 1;
  });

  const total = draws.length || 1;
  return keys.map((k) => ({
    pattern: k.split(''),
    count: counts[k],
    rate: Number(((counts[k] / total) * 100).toFixed(1)),
  }));
}

function buildRecentDrawsFromDraws(draws, n = 20) {
  // draws は日付昇順/降順どちらでも受け付け、round降順(新しい順)に整列して返す
  const sorted = [...draws].sort((a, b) => b.round - a.round);
  return sorted.slice(0, n).map((d) => ({
    round: d.round,
    date: d.date.toISOString().slice(0, 10),
    number: d.number,
  }));
}

// ---------- 1. 頻出数字分析 (直近2年: 2025+2026を重み付け合算) ----------
function getFrequentDigits(yearlyData, { recentYearWeight = 1.4 } = {}) {
  const years = Object.keys(yearlyData);
  const score = {}; // digit -> { total, hundred, ten, one }
  for (let d = 0; d <= 9; d++) score[d] = { total: 0, hundred: 0, ten: 0, one: 0 };

  years.forEach((y) => {
    const weight = Number(y) === Math.max(...years.map(Number)) ? recentYearWeight : 1.0;
    for (let d = 0; d <= 9; d++) {
      const rec = yearlyData[y][d];
      score[d].total += rec.total * weight;
      score[d].hundred += rec.hundred * weight;
      score[d].ten += rec.ten * weight;
      score[d].one += rec.one * weight;
    }
  });

  const overallRanking = Object.entries(score)
    .map(([digit, v]) => ({ digit: Number(digit), score: v.total }))
    .sort((a, b) => b.score - a.score);

  const positionRanking = {};
  POSITIONS.forEach((pos) => {
    positionRanking[pos] = Object.entries(score)
      .map(([digit, v]) => ({ digit: Number(digit), score: v[pos] }))
      .sort((a, b) => b.score - a.score);
  });

  return { score, overallRanking, positionRanking };
}

// ---------- 2. 購入月特化の頻出数字 ----------
function getMonthlyFrequentDigits(monthlyData, month) {
  const m = monthlyData[month];
  if (!m) return null;
  const overallRanking = Object.entries(m.digits)
    .map(([digit, v]) => ({ digit: Number(digit), total: v.total }))
    .sort((a, b) => b.total - a.total);
  const positionRanking = {};
  POSITIONS.forEach((pos) => {
    positionRanking[pos] = Object.entries(m.digits)
      .map(([digit, v]) => ({ digit: Number(digit), value: v[pos] }))
      .sort((a, b) => b.value - a.value);
  });
  return { mostFrequent: m.mostFrequent, leastFrequent: m.leastFrequent, overallRanking, positionRanking };
}

// ---------- 3. 偶数奇数パターン分析 ----------
function getTopEvenOddPatterns(patterns, topN = 3) {
  return [...patterns].sort((a, b) => b.rate - a.rate).slice(0, topN);
}

function patternToDigitConstraint(pattern) {
  // ['E','O','E'] -> どの桁が偶数/奇数か
  return pattern.map((p) => (p === 'E' ? 'even' : 'odd'));
}

// ---------- 4. レア数字(出現頻度の少ない数字)傾向分析 ----------
function getRareDigits(yearlyData, latestYear) {
  const latest = yearlyData[latestYear];
  const ranking = Object.entries(latest)
    .map(([digit, v]) => ({ digit: Number(digit), total: v.total }))
    .sort((a, b) => a.total - b.total);
  return ranking;
}

// 直近N回の実際の当選番号から「しばらく出ていない数字」を検出
function getColdDigitsFromRecent(recentDraws, sinceN = 20) {
  const draws = recentDraws.slice(0, sinceN);
  const lastSeen = {}; // digit -> 何回前に最後に出たか
  for (let d = 0; d <= 9; d++) lastSeen[d] = null;

  draws.forEach((draw, idx) => {
    const digits = draw.number.split('').map(Number);
    digits.forEach((d) => {
      if (lastSeen[d] === null) lastSeen[d] = idx; // 0 = 最新回
    });
  });

  return Object.entries(lastSeen)
    .map(([digit, idx]) => ({
      digit: Number(digit),
      roundsSinceSeen: idx === null ? `${sinceN}回以上` : idx,
    }))
    .sort((a, b) => {
      const av = a.roundsSinceSeen === `${sinceN}回以上` ? 999 : a.roundsSinceSeen;
      const bv = b.roundsSinceSeen === `${sinceN}回以上` ? 999 : b.roundsSinceSeen;
      return bv - av;
    });
}

// ---------- 5. 数字組合せパターン分析(直近実データからボックス型の重複傾向) ----------
function getComboPatternStats(recentDraws) {
  let straightCount = 0; // 3つとも異なる
  let doubleCount = 0; // 2つ同じ
  let tripleCount = 0; // 3つ同じ(ゾロ目)

  recentDraws.forEach((draw) => {
    const digits = draw.number.split('');
    const unique = new Set(digits).size;
    if (unique === 3) straightCount++;
    else if (unique === 2) doubleCount++;
    else tripleCount++;
  });

  const total = recentDraws.length;
  return {
    total,
    straight: { count: straightCount, rate: ((straightCount / total) * 100).toFixed(1) },
    double: { count: doubleCount, rate: ((doubleCount / total) * 100).toFixed(1) },
    triple: { count: tripleCount, rate: ((tripleCount / total) * 100).toFixed(1) },
  };
}

// ---------- 6. 総合予想生成 ----------
// 最終出力は5パターン固定:
//   高確率(直近2年の頻出数字を主軸) ×2
//   月特化(購入月の傾向を主軸)      ×2
//   穴場(出現頻度の低いレア数字を主軸) ×1
function weightedPick(scoresArr, excludeSet = new Set()) {
  const pool = scoresArr.filter((s) => !excludeSet.has(s.digit));
  const totalScore = pool.reduce((sum, s) => sum + Math.max(s.score, 0.1), 0);
  let r = Math.random() * totalScore;
  for (const s of pool) {
    r -= Math.max(s.score, 0.1);
    if (r <= 0) return s.digit;
  }
  return pool[0].digit;
}

// 年別スコアと月別スコアを任意の比率で合成した桁別スコアを作る
function buildCombinedScore(freq, monthly, yearlyWeight) {
  const combined = {};
  POSITIONS.forEach((pos) => {
    const yearlyMax = Math.max(...freq.positionRanking[pos].map((s) => s.score)) || 1;
    const monthlyMax = Math.max(...monthly.positionRanking[pos].map((m) => m.value)) || 1;
    combined[pos] = freq.positionRanking[pos].map(({ digit, score }) => {
      const monthlyEntry = monthly.positionRanking[pos].find((m) => m.digit === digit);
      const normalizedYearly = score / yearlyMax;
      const normalizedMonthly = (monthlyEntry ? monthlyEntry.value : 0) / monthlyMax;
      return { digit, score: normalizedYearly * yearlyWeight + normalizedMonthly * (1 - yearlyWeight) };
    });
  });
  return combined;
}

function pickNumberFromScore(combinedScore, pattern, poolSize = 4) {
  return POSITIONS.map((pos, idx) => {
    const wantEven = pattern[idx] === 'E';
    const candidates = combinedScore[pos]
      .filter((s) => (s.digit % 2 === 0) === wantEven)
      .sort((a, b) => b.score - a.score);
    const topCandidates = candidates.slice(0, poolSize);
    return weightedPick(topCandidates.length ? topCandidates : combinedScore[pos].slice(0, poolSize));
  }).join('');
}

function generatePredictions(yearlyData, monthlyData, evenOddPatterns, month) {
  const freq = getFrequentDigits(yearlyData);
  const monthly = getMonthlyFrequentDigits(monthlyData, month);
  const topPatterns = getTopEvenOddPatterns(evenOddPatterns, 4);

  const predictions = [];

  // --- 高確率 ×2 (年別頻出を主軸, 90%年別 / 10%月別) ---
  const highProbScore = buildCombinedScore(freq, monthly, 0.9);
  for (let i = 0; i < 2; i++) {
    const pattern = topPatterns[i % topPatterns.length].pattern;
    predictions.push({
      number: pickNumberFromScore(highProbScore, pattern),
      basis: `直近2年の頻出数字を主軸に、偶奇パターン(${pattern.map((x) => (x === 'E' ? '偶' : '奇')).join('')})で選出`,
      type: '高確率',
    });
  }

  // --- 月特化 ×2 (月別傾向を主軸, 20%年別 / 80%月別) ---
  const monthScore = buildCombinedScore(freq, monthly, 0.2);
  for (let i = 0; i < 2; i++) {
    const pattern = topPatterns[(i + 1) % topPatterns.length].pattern;
    predictions.push({
      number: pickNumberFromScore(monthScore, pattern),
      basis: `${month}月の当選傾向を主軸に、偶奇パターン(${pattern.map((x) => (x === 'E' ? '偶' : '奇')).join('')})で選出`,
      type: '月特化',
    });
  }

  // --- 穴場 ×1 (出現頻度の低いレア数字を主軸) ---
  const latestYear = Math.max(...Object.keys(yearlyData).map(Number));
  const rare = getRareDigits(yearlyData, latestYear);
  const rarePool = rare.slice(0, 5).map((r) => ({ digit: r.digit, score: 1 / (r.total + 1) }));
  const rareDigits = POSITIONS.map(() => weightedPick(rarePool));
  predictions.push({
    number: rareDigits.join(''),
    basis: `${latestYear}年の出現頻度が低い数字を中心に選出(逆張り予想)`,
    type: '穴場',
  });

  return predictions;
}

if (typeof module !== 'undefined') {
  module.exports = {
    POSITIONS,
    POSITION_LABEL,
    buildYearlyDataFromDraws,
    buildMonthlyDataFromDraws,
    buildEvenOddPatternsFromDraws,
    buildRecentDrawsFromDraws,
    getFrequentDigits,
    getMonthlyFrequentDigits,
    getTopEvenOddPatterns,
    patternToDigitConstraint,
    getRareDigits,
    getColdDigitsFromRecent,
    getComboPatternStats,
    generatePredictions,
  };
}
