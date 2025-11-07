import React from 'react';
import { View, Button, StyleSheet, SafeAreaView, Text, Image } from 'react-native';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>イングランド・ダービー</Text>
        <Text style={styles.subtitle}>神経衰弱</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="ゲームスタート"
            onPress={() => navigation.navigate('Game')} // 'Game' 画面へ
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="ダービーの背景"
            color="#666" 
            onPress={() => navigation.navigate('Info')} // ★ 'InfoPage1' ではなく 'Info' にする
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// (スタイルは変更なし)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#333',
    marginBottom: 50,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '80%',
    maxWidth: 300,
    marginVertical: 10,
  },
});