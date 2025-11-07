import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button } from 'react-native';
import { derbyInfos } from '../data/infoData'; // 作成したデータファイルをインポート

// 1-4番目のデータだけを取得
const page1Infos = derbyInfos.slice(0, 4);

export const DerbyInfoScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* スクロールを削除し、View に変更 */}
      <View style={styles.content}>
        {page1Infos.map((info, index) => (
          <View key={index} style={styles.infoBlock}>
            <Text style={styles.title}>{info.title}</Text>
            {/* 説明文はWebで収まるよう1行だけ表示 (クリックで詳細) にしても良いですが、一旦そのまま入れます */}
            <Text style={styles.description} numberOfLines={2}>{info.desc}</Text>
          </View>
        ))}
      </View>
      
      {/* ページナビゲーションボタン */}
      <View style={styles.navButtonContainer}>
        <Button
          title="次のページ (5-8) →"
          onPress={() => navigation.navigate('InfoPage2')} // 2ページ目へ
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    justifyContent: 'space-between', // コンテンツとボタンを上下に分離
  },
  content: {
    padding: 15,
  },
  infoBlock: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#003366',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  navButtonContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#FFF',
  },
});