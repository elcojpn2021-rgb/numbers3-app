/**
 * ナンバーズ3 統計データ
 * 出典: NUMBERS3通信 (numbers3.money-plan.net) 各種集計ページより実データを収集
 *  - 年別出現回数: https://numbers3.money-plan.net/sum_year/ (2025年・2026年分)
 *  - 月別出現回数: https://numbers3.money-plan.net/sum_month/ (全期間集計, 第6477回時点)
 *  - 偶数奇数パターン: https://numbers3.money-plan.net/sum_even/ (全7045回集計)
 *  - 直近実当選番号: mk-mode SITE (第7026回〜第7045回)
 *
 * データ更新方法は README_運用ガイド.md を参照。
 * 半年〜1年に一度、上記サイトを見て YEARLY_DATA と RECENT_DRAWS を更新してください。
 */

// 年別・桁別 出現回数 (直近2年分: 2025年フル + 2026年分[8月10日/第7045回時点])
// total = 3桁のどこかにその数字が出た回数, hundred/ten/one = 桁ごとの回数
const YEARLY_DATA = {
  2025: {
    0: { total: 78, hundred: 21, ten: 28, one: 29 },
    1: { total: 75, hundred: 33, ten: 24, one: 18 },
    2: { total: 81, hundred: 29, ten: 25, one: 27 },
    3: { total: 74, hundred: 25, ten: 26, one: 23 },
    4: { total: 78, hundred: 25, ten: 26, one: 27 },
    5: { total: 69, hundred: 23, ten: 31, one: 15 },
    6: { total: 91, hundred: 32, ten: 26, one: 33 },
    7: { total: 74, hundred: 22, ten: 28, one: 24 },
    8: { total: 73, hundred: 28, ten: 17, one: 28 },
    9: { total: 78, hundred: 19, ten: 26, one: 33 },
  },
  2026: {
    // 2026年1月〜8月10日(第7045回)までの部分年データ
    0: { total: 45, hundred: 21, ten: 8, one: 16 },
    1: { total: 45, hundred: 18, ten: 13, one: 14 },
    2: { total: 45, hundred: 12, ten: 22, one: 11 },
    3: { total: 56, hundred: 13, ten: 21, one: 22 },
    4: { total: 53, hundred: 20, ten: 20, one: 13 },
    5: { total: 32, hundred: 11, ten: 10, one: 11 },
    6: { total: 49, hundred: 22, ten: 14, one: 13 },
    7: { total: 48, hundred: 12, ten: 15, one: 21 },
    8: { total: 45, hundred: 13, ten: 15, one: 17 },
    9: { total: 50, hundred: 14, ten: 18, one: 18 },
  },
};

// 月別・桁別 出現回数 (全期間集計 = 何十年分もの母数からの「その月に出やすい数字」傾向)
const MONTHLY_DATA = {
  1: { mostFrequent: 2, leastFrequent: 6, digits: {
    0:{total:145,hundred:50,ten:55,one:40}, 1:{total:146,hundred:38,ten:58,one:50},
    2:{total:177,hundred:56,ten:63,one:58}, 3:{total:152,hundred:46,ten:59,one:47},
    4:{total:137,hundred:51,ten:41,one:45}, 5:{total:170,hundred:52,ten:53,one:65},
    6:{total:133,hundred:53,ten:40,one:40}, 7:{total:152,hundred:61,ten:40,one:51},
    8:{total:146,hundred:47,ten:46,one:53}, 9:{total:166,hundred:54,ten:53,one:59},
  }},
  2: { mostFrequent: 0, leastFrequent: 2, digits: {
    0:{total:164,hundred:60,ten:49,one:55}, 1:{total:160,hundred:49,ten:56,one:55},
    2:{total:147,hundred:46,ten:48,one:53}, 3:{total:147,hundred:54,ten:53,one:40},
    4:{total:152,hundred:53,ten:50,one:49}, 5:{total:148,hundred:48,ten:54,one:46},
    6:{total:152,hundred:42,ten:55,one:55}, 7:{total:153,hundred:53,ten:50,one:50},
    8:{total:150,hundred:51,ten:48,one:51}, 9:{total:163,hundred:56,ten:49,one:58},
  }},
  3: { mostFrequent: 3, leastFrequent: 5, digits: {
    0:{total:162,hundred:53,ten:57,one:52}, 1:{total:164,hundred:55,ten:52,one:57},
    2:{total:168,hundred:52,ten:68,one:48}, 3:{total:183,hundred:56,ten:69,one:58},
    4:{total:168,hundred:61,ten:59,one:48}, 5:{total:159,hundred:54,ten:57,one:48},
    6:{total:166,hundred:58,ten:51,one:57}, 7:{total:176,hundred:54,ten:49,one:73},
    8:{total:170,hundred:49,ten:53,one:68}, 9:{total:176,hundred:72,ten:49,one:55},
  }},
  4: { mostFrequent: 0, leastFrequent: 7, digits: {
    0:{total:184,hundred:54,ten:65,one:65}, 1:{total:170,hundred:75,ten:47,one:48},
    2:{total:166,hundred:47,ten:61,one:58}, 3:{total:153,hundred:48,ten:45,one:60},
    4:{total:158,hundred:49,ten:53,one:56}, 5:{total:150,hundred:44,ten:54,one:52},
    6:{total:165,hundred:64,ten:55,one:46}, 7:{total:145,hundred:51,ten:56,one:38},
    8:{total:160,hundred:46,ten:51,one:63}, 9:{total:178,hundred:65,ten:56,one:57},
  }},
  5: { mostFrequent: 9, leastFrequent: 5, digits: {
    0:{total:155,hundred:49,ten:61,one:45}, 1:{total:155,hundred:47,ten:56,one:52},
    2:{total:169,hundred:56,ten:50,one:63}, 3:{total:182,hundred:57,ten:63,one:62},
    4:{total:162,hundred:60,ten:47,one:55}, 5:{total:153,hundred:47,ten:55,one:51},
    6:{total:169,hundred:49,ten:61,one:59}, 7:{total:178,hundred:57,ten:59,one:62},
    8:{total:158,hundred:61,ten:49,one:48}, 9:{total:199,hundred:77,ten:59,one:63},
  }},
  6: { mostFrequent: 2, leastFrequent: 1, digits: {
    0:{total:159,hundred:58,ten:51,one:50}, 1:{total:142,hundred:45,ten:46,one:51},
    2:{total:167,hundred:56,ten:49,one:62}, 3:{total:159,hundred:55,ten:54,one:50},
    4:{total:167,hundred:54,ten:64,one:49}, 5:{total:154,hundred:48,ten:56,one:50},
    6:{total:143,hundred:56,ten:41,one:46}, 7:{total:167,hundred:59,ten:50,one:58},
    8:{total:152,hundred:50,ten:50,one:52}, 9:{total:162,hundred:43,ten:63,one:56},
  }},
  7: { mostFrequent: 8, leastFrequent: 2, digits: {
    0:{total:164,hundred:55,ten:55,one:54}, 1:{total:154,hundred:45,ten:51,one:58},
    2:{total:147,hundred:49,ten:50,one:48}, 3:{total:167,hundred:58,ten:49,one:60},
    4:{total:170,hundred:54,ten:61,one:55}, 5:{total:148,hundred:56,ten:51,one:41},
    6:{total:150,hundred:53,ten:45,one:52}, 7:{total:172,hundred:57,ten:57,one:58},
    8:{total:188,hundred:66,ten:52,one:70}, 9:{total:178,hundred:53,ten:75,one:50},
  }},
  8: { mostFrequent: 8, leastFrequent: 4, digits: {
    0:{total:171,hundred:57,ten:58,one:56}, 1:{total:172,hundred:52,ten:59,one:61},
    2:{total:174,hundred:58,ten:47,one:69}, 3:{total:165,hundred:52,ten:57,one:56},
    4:{total:151,hundred:49,ten:55,one:47}, 5:{total:168,hundred:49,ten:65,one:54},
    6:{total:164,hundred:64,ten:53,one:47}, 7:{total:156,hundred:44,ten:52,one:60},
    8:{total:177,hundred:63,ten:61,one:53}, 9:{total:155,hundred:63,ten:44,one:48},
  }},
  9: { mostFrequent: 7, leastFrequent: 0, digits: {
    0:{total:148,hundred:45,ten:58,one:45}, 1:{total:164,hundred:67,ten:48,one:49},
    2:{total:168,hundred:59,ten:56,one:53}, 3:{total:149,hundred:47,ten:60,one:42},
    4:{total:165,hundred:53,ten:55,one:57}, 5:{total:148,hundred:47,ten:40,one:61},
    6:{total:157,hundred:51,ten:54,one:52}, 7:{total:169,hundred:52,ten:60,one:57},
    8:{total:162,hundred:52,ten:53,one:57}, 9:{total:166,hundred:59,ten:48,one:59},
  }},
  10: { mostFrequent: 4, leastFrequent: 5, digits: {
    0:{total:164,hundred:44,ten:52,one:68}, 1:{total:174,hundred:63,ten:56,one:55},
    2:{total:154,hundred:61,ten:44,one:49}, 3:{total:170,hundred:55,ten:54,one:61},
    4:{total:186,hundred:68,ten:56,one:62}, 5:{total:146,hundred:39,ten:54,one:53},
    6:{total:169,hundred:55,ten:61,one:53}, 7:{total:159,hundred:43,ten:65,one:51},
    8:{total:172,hundred:68,ten:51,one:53}, 9:{total:171,hundred:59,ten:62,one:50},
  }},
  11: { mostFrequent: 0, leastFrequent: 7, digits: {
    0:{total:176,hundred:54,ten:64,one:58}, 1:{total:161,hundred:52,ten:49,one:60},
    2:{total:161,hundred:53,ten:48,one:60}, 3:{total:151,hundred:59,ten:51,one:41},
    4:{total:163,hundred:41,ten:58,one:64}, 5:{total:160,hundred:48,ten:42,one:70},
    6:{total:165,hundred:66,ten:56,one:43}, 7:{total:149,hundred:59,ten:54,one:36},
    8:{total:167,hundred:55,ten:54,one:58}, 9:{total:170,hundred:54,ten:65,one:51},
  }},
  12: { mostFrequent: 3, leastFrequent: 7, digits: {
    0:{total:153,hundred:52,ten:47,one:54}, 1:{total:167,hundred:55,ten:60,one:52},
    2:{total:155,hundred:56,ten:53,one:46}, 3:{total:180,hundred:68,ten:59,one:53},
    4:{total:158,hundred:53,ten:63,one:42}, 5:{total:159,hundred:53,ten:55,one:51},
    6:{total:169,hundred:59,ten:48,one:62}, 7:{total:150,hundred:41,ten:54,one:55},
    8:{total:171,hundred:53,ten:57,one:61}, 9:{total:161,hundred:51,ten:45,one:65},
  }},
};

// 偶数奇数パターン (ストレート, 全7045回集計, 期待値 881回/パターン)
// 順序: [百,十,一] E=偶数 O=奇数
const EVEN_ODD_PATTERNS_STRAIGHT = [
  { pattern: ['E','E','E'], count: 916, rate: 13.0 },
  { pattern: ['E','O','O'], count: 908, rate: 12.9 },
  { pattern: ['O','O','O'], count: 899, rate: 12.8 },
  { pattern: ['E','O','E'], count: 887, rate: 12.6 },
  { pattern: ['O','E','E'], count: 868, rate: 12.3 },
  { pattern: ['O','O','E'], count: 862, rate: 12.2 },
  { pattern: ['E','E','O'], count: 855, rate: 12.1 },
  { pattern: ['O','E','O'], count: 850, rate: 12.1 },
];

// 直近実際の当選番号 (第7026回〜第7045回, mk-mode SITEより)
const RECENT_DRAWS = [
  { round: 7045, date: '2026-08-10', number: '180' },
  { round: 7044, date: '2026-08-07', number: '487' },
  { round: 7043, date: '2026-08-06', number: '163' },
  { round: 7042, date: '2026-08-05', number: '750' },
  { round: 7041, date: '2026-08-04', number: '722' },
  { round: 7040, date: '2026-08-03', number: '313' },
  { round: 7039, date: '2026-07-31', number: '838' },
  { round: 7038, date: '2026-07-30', number: '424' },
  { round: 7037, date: '2026-07-29', number: '038' },
  { round: 7036, date: '2026-07-28', number: '420' },
  { round: 7035, date: '2026-07-27', number: '432' },
  { round: 7034, date: '2026-07-24', number: '777' },
  { round: 7033, date: '2026-07-23', number: '147' },
  { round: 7032, date: '2026-07-22', number: '492' },
  { round: 7031, date: '2026-07-21', number: '413' },
  { round: 7030, date: '2026-07-20', number: '053' },
  { round: 7029, date: '2026-07-17', number: '388' },
  { round: 7028, date: '2026-07-16', number: '456' },
  { round: 7027, date: '2026-07-15', number: '583' },
  { round: 7026, date: '2026-07-14', number: '939' },
];

if (typeof module !== 'undefined') {
  module.exports = { YEARLY_DATA, MONTHLY_DATA, EVEN_ODD_PATTERNS_STRAIGHT, RECENT_DRAWS };
}
