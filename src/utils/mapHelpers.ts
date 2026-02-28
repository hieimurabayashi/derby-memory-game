import { Coordinate } from '../data/derbies';

// --- 距離計算 (変更なし) ---
export const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
  const R = 6371; 
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLon = deg2rad(coord2.lon - coord1.lon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// --- メルカトル図法用の緯度変換関数を追加 ---
// 緯度をメルカトル投影上のY座標（比率）に変換するための数式です
const latToMercatorY = (lat: number): number => {
  const rad = deg2rad(lat);
  return Math.log(Math.tan(Math.PI / 4 + rad / 2));
};

// --- 地図画像とのマッピング設定 ---
// ★ 無理やり広げるのをやめて、実際のイギリス周辺の正確な緯度経度に近づけます
// ※お使いの地図画像(SVGなど)の余白に合わせて、ここは微調整してください
const MAP_BOUNDS = {
  NORTH: 58.7, // スコットランド北端あたり
  SOUTH: 49.9, // イングランド南端あたり
  WEST: -8.2,  // アイルランド西端あたり (地図画像に含まれる西の端)
  EAST: 1.8,   // イングランド東端あたり (本来の正しい経度)
};

// 緯度経度を、地図画像上のパーセント位置(0.0〜1.0)に変換する関数
export const getRelativePosition = (coord: Coordinate) => {
  // 経度はそのまま線形計算でOK（X軸は歪まないため）
  const lonRange = MAP_BOUNDS.EAST - MAP_BOUNDS.WEST;
  const leftPercent = (coord.lon - MAP_BOUNDS.WEST) / lonRange;

  // 緯度はメルカトル変換をかけてからパーセントを計算する
  const topY = latToMercatorY(MAP_BOUNDS.NORTH);
  const bottomY = latToMercatorY(MAP_BOUNDS.SOUTH);
  const currentY = latToMercatorY(coord.lat);
  
  const yRange = topY - bottomY;
  // 北が上(0.0)、南が下(1.0)になるように反転して計算
  const topPercent = (topY - currentY) / yRange;

  return {
    x: leftPercent, // 0.0(左端) 〜 1.0(右端)
    y: topPercent,  // 0.0(上端) 〜 1.0(下端)
  };
};