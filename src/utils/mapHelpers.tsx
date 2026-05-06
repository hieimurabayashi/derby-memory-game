import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Coordinate } from '../data/derbies'; // 既存の型

interface DerbyMapProps {
  teamACoord: Coordinate;
  teamBCoord: Coordinate;
}

export const DerbyMap: React.FC<DerbyMapProps> = ({ teamACoord, teamBCoord }) => {
  // MapViewを操作するためのRef
  const mapRef = useRef<MapView>(null);

  // 地図の準備ができたら、2つのスタジアムが画面に収まるように視点を自動調整
  const onMapReady = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: teamACoord.lat, longitude: teamACoord.lon },
          { latitude: teamBCoord.lat, longitude: teamBCoord.lon },
        ],
        {
          // ピンが見切れないように画面端に少し余白を持たせる
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: false, // 初期表示なのでアニメーションなしでパッと表示
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onMapReady={onMapReady}
        // 初期表示位置（視点調整までの数ミリ秒間表示される場所。2点の中間を指定）
        initialRegion={{
          latitude: (teamACoord.lat + teamBCoord.lat) / 2,
          longitude: (teamACoord.lon + teamBCoord.lon) / 2,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {/* チームAのスタジアムピン */}
        <Marker 
          coordinate={{ latitude: teamACoord.lat, longitude: teamACoord.lon }} 
          pinColor="blue" // 必要に応じてチームカラーに変更できます
        />
        
        {/* チームBのスタジアムピン */}
        <Marker 
          coordinate={{ latitude: teamBCoord.lat, longitude: teamBCoord.lon }} 
          pinColor="red" 
        />

        {/* 2つのスタジアムの間に直線を引く */}
        <Polyline
          coordinates={[
            { latitude: teamACoord.lat, longitude: teamACoord.lon },
            { latitude: teamBCoord.lat, longitude: teamBCoord.lon },
          ]}
          strokeColor="#FF0000"
          strokeWidth={3}
        />
      </MapView>
    </View>
  );
};

// スタイリング（React Native用のStyleSheetを使用）
const styles = StyleSheet.create({
  container: {
    height: 400, // ご希望の高さ
    width: '100%',
    overflow: 'hidden',
    borderRadius: 10, // 角丸にすると少しモダンになります
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});