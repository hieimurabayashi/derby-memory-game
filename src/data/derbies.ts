// ダービーのデータ構造（型）
export interface Derby {
  id: number;
  name: string; // ダービー名 (例: ノースロンドン・ダービー)
  team1: string; // チーム1 (例: アーセナル)
  team2: string; // チーム2 (例: トッテナム)
}

// ダービーのリスト (8個)
export const DERBY_LIST: Derby[] = [
  { id: 1, name: "ノースロンドン・ダービー", team1: "アーセナル", team2: "トッテナム" },
  { id: 2, name: "マンチェスター・ダービー", team1: "マン C", team2: "マン U" },
  { id: 3, name: "マージーサイド・ダービー", team1: "リヴァプール", team2: "エヴァートン" },
  { id: 4, name: "タイン・ウェア・ダービー", team1: "ニューカッスル", team2: "サンダーランド" },
  { id: 5, name: "ウェストロンドン・ダービー", team1: "チェルシー", team2: "フラム" },
  { id: 6, name: "ブラックカントリー・ダービー", team1: "WBA", team2: "ウルブス" },
  { id: 7, name: "M23 ダービー", team1: "ブライトン", team2: "C・パレス" },
  { id: 8, name: "スティール・シティ・ダービー", team1: "シェフィールド U", team2: "シェフィールド W" },
];