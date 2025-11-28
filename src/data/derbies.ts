// 座標の型定義
export interface Coordinate {
  lat: number; // 緯度
  lon: number; // 経度
}

// ダービーのデータ型定義 (座標とスタジアム名を追加)
export interface Derby {
  id: number;
  name: string;
  team1: string;
  team2: string;
  team1Image: any;
  team2Image: any;
  // ★追加: 各チームの座標とスタジアム名
  team1Coord: Coordinate;
  team2Coord: Coordinate;
  team1Stadium: string;
  team2Stadium: string;
}

// ダービーのリスト (実在のスタジアム座標を追加)
export const DERBY_LIST: Derby[] = [
  { 
    id: 1, name: "ノースロンドン・ダービー", 
    team1: "アーセナル", team2: "トッテナム",
    team1Image: require('../../assets/images/arsenal.png'),
    team2Image: require('../../assets/images/tottenham.png'),
    // エミレーツ・スタジアム
    team1Coord: { lat: 51.5549, lon: -0.1084 }, team1Stadium: "エミレーツ",
    // トッテナム・ホットスパー・スタジアム
    team2Coord: { lat: 51.6042, lon: -0.0662 }, team2Stadium: "トッテナムHS",
  },
  { 
    id: 2, name: "マンチェスター・ダービー", 
    team1: "マン C", team2: "マン U",
    team1Image: require('../../assets/images/man_city.png'),
    team2Image: require('../../assets/images/man_united.png'),
    // エティハド・スタジアム
    team1Coord: { lat: 53.4831, lon: -2.2004 }, team1Stadium: "エティハド",
    // オールド・トラッフォード
    team2Coord: { lat: 53.4631, lon: -2.2913 }, team2Stadium: "オールド・トラッフォード",
  },
  { 
    id: 3, name: "マージーサイド・ダービー", 
    team1: "リヴァプール", team2: "エヴァートン",
    team1Image: require('../../assets/images/liverpool.png'),
    team2Image: require('../../assets/images/everton.png'),
    // アンフィールド
    team1Coord: { lat: 53.4308, lon: -2.9608 }, team1Stadium: "アンフィールド",
    // グディソン・パーク
    team2Coord: { lat: 53.4388, lon: -2.9663 }, team2Stadium: "グディソン・パーク",
  },
  { 
    id: 4, name: "タイン・ウェア・ダービー", 
    team1: "ニューカッスル", team2: "サンダーランド",
    team1Image: require('../../assets/images/newcastle.png'),
    team2Image: require('../../assets/images/sunderland.png'),
    // セント・ジェームズ・パーク
    team1Coord: { lat: 54.9756, lon: -1.6218 }, team1Stadium: "Stジェームズ・パーク",
    // スタジアム・オブ・ライト
    team2Coord: { lat: 54.9146, lon: -1.3884 }, team2Stadium: "スタジアム・オブ・ライト",
  },
  { 
    id: 5, name: "ウェストロンドン・ダービー", 
    team1: "チェルシー", team2: "フラム",
    team1Image: require('../../assets/images/chelsea.png'),
    team2Image: require('../../assets/images/fulham.png'),
    // スタンフォード・ブリッジ
    team1Coord: { lat: 51.4817, lon: -0.1910 }, team1Stadium: "スタンフォード・ブリッジ",
    // クレイヴン・コテージ
    team2Coord: { lat: 51.4749, lon: -0.2208 }, team2Stadium: "クレイヴン・コテージ",
  },
  { 
    id: 6, name: "ブラックカントリー・ダービー", 
    team1: "WBA", team2: "ウルブス",
    team1Image: require('../../assets/images/wba.png'), 
    team2Image: require('../../assets/images/wolves.png'),
    // ザ・ホーソーンズ
    team1Coord: { lat: 52.5091, lon: -1.9639 }, team1Stadium: "ザ・ホーソーンズ",
    // モリニュー・スタジアム
    team2Coord: { lat: 52.5902, lon: -2.1304 }, team2Stadium: "モリニュー",
  },
  { 
    id: 7, name: "M23 ダービー", 
    team1: "ブライトン", team2: "C・パレス",
    team1Image: require('../../assets/images/brighton.png'),
    team2Image: require('../../assets/images/crystal_palace.png'),
    // アメックス・スタジアム
    team1Coord: { lat: 50.8618, lon: -0.0837 }, team1Stadium: "アメックス",
    // セルハースト・パーク
    team2Coord: { lat: 51.3983, lon: -0.0855 }, team2Stadium: "セルハースト・パーク",
  },
  { 
    id: 8, name: "スティール・シティ・ダービー", 
    team1: "シェフィールド U", team2: "シェフィールド W",
    team1Image: require('../../assets/images/sheffield_u.png'),
    team2Image: require('../../assets/images/sheffield_w.png'),
    // ブラモール・レーン
    team1Coord: { lat: 53.3703, lon: -1.4709 }, team1Stadium: "ブラモール・レーン",
    // ヒルズボロ・スタジアム
    team2Coord: { lat: 53.4115, lon: -1.5008 }, team2Stadium: "ヒルズボロ",
  },
];