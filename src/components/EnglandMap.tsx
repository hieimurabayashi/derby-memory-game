import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, LayoutChangeEvent, Dimensions } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Coordinate, Derby } from '../data/derbies';
import { calculateDistance, getRelativePosition } from '../utils/mapHelpers';

interface Props {
  activeCoords: Coordinate[];
  matchedDerby: Derby | null;
}

export const EnglandMap: React.FC<Props> = ({ activeCoords, matchedDerby }) => {
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setMapSize({ width, height });
  };

  const toPixel = (coord: Coordinate) => {
    const rel = getRelativePosition(coord);
    return {
      x: rel.x * mapSize.width,
      y: rel.y * mapSize.height,
    };
  };

  let matchInfo = null;
  if (matchedDerby && mapSize.width > 0) {
    const p1 = toPixel(matchedDerby.team1Coord);
    const p2 = toPixel(matchedDerby.team2Coord);
    const distance = calculateDistance(matchedDerby.team1Coord, matchedDerby.team2Coord);
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    matchInfo = { p1, p2, distance, midX, midY };
  }

  return (
    <View style={styles.container}>
      {/* ★修正ポイント: 
        地図を囲む View (mapWrapper) を作り、アスペクト比を固定します。
        aspectRatio: 0.75 (横:縦 = 3:4) くらいが英国地図には一般的です。
      */}
      <View style={styles.mapWrapper} onLayout={onLayout}>
        <Image
          source={require('../../assets/images/england_map.png')}
          style={styles.mapImage}
          resizeMode="stretch" // 比率を固定した枠に対してストレッチするので歪まない
        />

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
                strokeDasharray="5, 5"
              />
            )}
          </Svg>
        )}

        {matchInfo && (
          <View style={[styles.distanceLabelBox, { left: matchInfo.midX - 40, top: matchInfo.midY - 15 }]}>
            <Text style={styles.distanceText}>{matchInfo.distance} km</Text>
          </View>
        )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A0C8F0',
    alignItems: 'center', // 中央寄せ
    justifyContent: 'center',
    width: '100%',
  },
  // ★追加: 地図の比率を固定するラッパー
  mapWrapper: {
    width: '100%',
    aspectRatio: 0.75, // ★ここが重要：横幅に対して高さを固定比率にする (0.75 = 4:3の縦長)
    position: 'relative',
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
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
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
    zIndex: 10, // ラベルを最前面に
  },
  distanceText: {
    fontWeight: 'bold',
    color: 'red',
    fontSize: 12,
  }
});