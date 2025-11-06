// ダービーのデータ型定義
export interface Derby {
  id: number;
  name: string; // ダービー名
  team1: string; // チーム1のテキスト名
  team2: string; // チーム2のテキスト名
  // ★追加★ チーム1とチーム2の画像パス
  team1Image: any; // 画像は require() で読み込むため any 型
  team2Image: any;
}

// ダービーのリスト
export const DERBY_LIST: Derby[] = [
  { 
    id: 1, 
    name: "ノースロンドン・ダービー", 
    team1: "アーセナル", team2: "トッテナム",
    team1Image: require('../../assets/images/arsenal.png'),     
    team2Image: require('../../assets/images/tottenham.png'),    
  },
  { 
    id: 2, 
    name: "マンチェスター・ダービー", 
    team1: "マン C", team2: "マン U",
    team1Image: require('../../assets/images/manchestercity.png'),
    team2Image: require('../../assets/images/manchesterunited.png'),
  },
  { 
    id: 3, 
    name: "マージーサイド・ダービー", 
    team1: "リヴァプール", team2: "エヴァートン",
    team1Image: require('../../assets/images/liverpool.png'),
    team2Image: require('../../assets/images/everton.png'),
  },
  { 
    id: 4, 
    name: "タイン・ウェア・ダービー", 
    team1: "ニューカッスル", team2: "サンダーランド",
    team1Image: require('../../assets/images/newcastle.png'),
    team2Image: require('../../assets/images/sunderland.png'),
  },
  { 
    id: 5, 
    name: "ウェストロンドン・ダービー", 
    team1: "チェルシー", team2: "フラム",
    team1Image: require('../../assets/images/chelsea.png'),
    team2Image: require('../../assets/images/fulham.png'),
  },
  { 
    id: 6, 
    name: "ブラックカントリー・ダービー", 
    team1: "WBA", team2: "ウルブス",
    team1Image: require('../../assets/images/westbromwichalbion.png'),
    team2Image: require('../../assets/images/wolverhamoton.png'),
  },
  { 
    id: 7, 
    name: "M23 ダービー", 
    team1: "ブライトン", team2: "C・パレス",
    team1Image: require('../../assets/images/brighton.png'),
    team2Image: require('../../assets/images/crystalpalace.png'),
  },
  { 
    id: 8, 
    name: "スティール・シティ・ダービー", 
    team1: "シェフィールド U", team2: "シェフィールド W",
    team1Image: require('../../assets/images/sheffieldunited.png'),
    team2Image: require('../../assets/images/sheffieldwednesday.png'),
  },
];