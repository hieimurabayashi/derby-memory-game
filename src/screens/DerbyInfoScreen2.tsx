import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button } from 'react-native';
import { derbyInfos } from '../data/infoData'; // データファイルをインポート

// 5-8番目のデータだけを取得
const page2Infos = derbyInfos.slice(4, 8);

export const DerbyInfoScreen2 = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {page2Infos.map((info, index) => (
          <View key={index} style={styles.infoBlock}>
            <Text style={styles.title}>{info.title}</Text>
            <Text style={styles.description} numberOfLines={2}>{info.desc}</Text>
          </View>
        ))}
      </View>
      
      {/* ページナビゲーションボタン */}
      <View style={styles.navButtonContainer}>
        <Button
          title="← 前のページ (1-4)"
          onPress={() => navigation.goBack()} // 前の画面 (1ページ目) に戻る
        />
      </View>
    </SafeAreaView>
  );
};

// スタイルは1ページ目とほぼ同じ
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    justifyContent: 'space-between',
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