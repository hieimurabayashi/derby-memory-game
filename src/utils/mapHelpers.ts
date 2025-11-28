import { Coordinate } from '../data/derbies';

// 2点間の距離を計算する関数 (Haversine formula)
// 戻り値はキロメートル(km)
export const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
  const R = 6371; // 地球の半径 (km)
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLon = deg2rad(coord2.lon - coord1.lon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 小数点第1位まで丸める
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// ... (前半は変更なし)

// --- 地図画像とのマッピング設定 ---
const MAP_BOUNDS = {
  NORTH: 60.0,
  SOUTH: 49.5,
  // ピンを左へ動かすために、西の数値を -11.0 から -9.0 に変更します
  // (計算式の分母が変わり、相対位置が左にシフトします)
  WEST: -9.0, 
  
  // 東の数値は 6.0 のままでOK（または微調整で 7.0 など）
  EAST: 6.0,   
};

// ... (後半は変更なし)

// 緯度経度を、地図画像上のパーセント位置(0.0〜1.0)に変換する関数
export const getRelativePosition = (coord: Coordinate) => {
  const latRange = MAP_BOUNDS.NORTH - MAP_BOUNDS.SOUTH;
  const lonRange = MAP_BOUNDS.EAST - MAP_BOUNDS.WEST;

  // 上からの位置 (緯度は北の方が値が大きいので反転)
  const topPercent = (MAP_BOUNDS.NORTH - coord.lat) / latRange;
  // 左からの位置
  const leftPercent = (coord.lon - MAP_BOUNDS.WEST) / lonRange;

  return {
    x: leftPercent, // 0.0(左端) 〜 1.0(右端)
    y: topPercent,  // 0.0(上端) 〜 1.0(下端)
  };
};