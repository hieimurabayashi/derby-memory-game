import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, LayoutChangeEvent } from 'react-native';
import Svg, { Line } from 'react-native-svg'; // SVGライブラリ
import { Coordinate, Derby } from '../data/derbies';
import { calculateDistance, getRelativePosition } from '../utils/mapHelpers';

interface Props {
  activeCoords: Coordinate[]; // 現在めくられているカードの座標リスト
  matchedDerby: Derby | null; // 直近でマッチしたダービー情報（線引く用）
}

export const EnglandMap: React.FC<Props> = ({ activeCoords, matchedDerby }) => {
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  // 地図の表示サイズを取得する
  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setMapSize({ width, height });
  };

  // 座標を画面上のピクセル位置に変換するヘルパー
  const toPixel = (coord: Coordinate) => {
    const rel = getRelativePosition(coord);
    return {
      x: rel.x * mapSize.width,
      y: rel.y * mapSize.height,
    };
  };

  // マッチ時の情報計算（線と距離）
  let matchInfo = null;
  if (matchedDerby && mapSize.width > 0) {
    const p1 = toPixel(matchedDerby.team1Coord);
    const p2 = toPixel(matchedDerby.team2Coord);
    const distance = calculateDistance(matchedDerby.team1Coord, matchedDerby.team2Coord);
    // 距離ラベルの表示位置（中間点）
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    matchInfo = { p1, p2, distance, midX, midY };
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      {/* 地図画像背景 */}
      {/* ★TODO: assets/images/england_map.png を用意して置き換えてください */}
      <Image
        source={require('../../assets/images/england_map.png')}
        style={styles.mapImage}
        resizeMode="stretch" // ★ここを "contain" から "stretch" に変更
      />

      {/* SVGレイヤー (線を引くため) */}
      {mapSize.width > 0 && (
        <Svg height={mapSize.height} width={mapSize.width} style={StyleSheet.absoluteFill}>
          {matchInfo && (
            <Line
              x1={matchInfo.p1.x}
              y1={matchInfo.p1.y}
              x2={matchInfo.p2.x}
              y2={matchInfo.p2.y}
              stroke="red"
              strokeWidth="3"
              strokeDasharray="5, 5" // 点線にする
            />
          )}
        </Svg>
      )}

      {/* 距離ラベル表示 */}
      {matchInfo && (
        <View style={[styles.distanceLabelBox, { left: matchInfo.midX - 40, top: matchInfo.midY - 15 }]}>
          <Text style={styles.distanceText}>{matchInfo.distance} km</Text>
        </View>
      )}

      {/* マーカー表示 (現在選択中のチーム) */}
      {mapSize.width > 0 && activeCoords.map((coord, index) => {
        const pixel = toPixel(coord);
        return (
          <View
            key={index}
            style={[styles.marker, { left: pixel.x - 10, top: pixel.y - 10 }]}
          >
            <View style={styles.markerInner} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#A0C8F0', // 海の色っぽい背景
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  marker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.3)', // 赤く光るエフェクト
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red', // 中心の点
    borderWidth: 1,
    borderColor: 'white',
  },
  distanceLabelBox: {
    position: 'absolute',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'red',
    width: 80,
    alignItems: 'center',
  },
  distanceText: {
    fontWeight: 'bold',
    color: 'red',
    fontSize: 12,
  }
});