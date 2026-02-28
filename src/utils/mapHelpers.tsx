import React, { useCallback, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, Polyline } from '@react-google-maps/api';
import { Coordinate } from '../data/derbies';

// mapHelpers.tsx の上部
const containerStyle = {
  width: '100%',
  height: '400px', // ★ '100%' から '400px' などの固定値に変更してテスト！
};
interface DerbyMapProps {
  teamACoord: Coordinate;
  teamBCoord: Coordinate;
}

export const DerbyMap: React.FC<DerbyMapProps> = ({ teamACoord, teamBCoord }) => {
  // Google Maps APIキーを設定（環境変数に入れることをおすすめします）
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  // 地図が読み込まれた時に、2つのピンが画面に収まるように視点を調整する
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    // チームAとチームBの座標をBounds（境界）に追加
    bounds.extend({ lat: teamACoord.lat, lng: teamACoord.lon });
    bounds.extend({ lat: teamBCoord.lat, lng: teamBCoord.lon });
    
    // 境界に合わせて地図を自動ズーム＆センタリング
    mapInstance.fitBounds(bounds);
    
    setMap(mapInstance);
  }, [teamACoord, teamBCoord]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) return <div>Map Loading...</div>;

  // Polyline用のパス（2点間に直線を引くオプション）
  const path = [
    { lat: teamACoord.lat, lng: teamACoord.lon },
    { lat: teamBCoord.lat, lng: teamBCoord.lon }
  ];

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: true, // 余計なUI（ストリートビューなど）を消してすっきりさせる
        zoomControl: true,      // ズームボタンだけ残す
      }}
    >
      {/* チームAのピン */}
      <Marker position={{ lat: teamACoord.lat, lng: teamACoord.lon }} />
      
      {/* チームBのピン */}
      <Marker position={{ lat: teamBCoord.lat, lng: teamBCoord.lon }} />

      {/* （おまけ）2つのスタジアムの間に直線を引く */}
      <Polyline
        path={path}
        options={{ strokeColor: '#FF0000', strokeWeight: 2, strokeOpacity: 0.8 }}
      />
    </GoogleMap>
  );
};