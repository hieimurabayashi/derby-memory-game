import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ★ 作成した3つの画面をインポート
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { DerbyInfoScreen } from './src/screens/DerbyInfoScreen';

// 画面遷移の仕組み（Stack）を作成
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home" // ★ 最初に表示する画面
        screenOptions={{
          headerStyle: {
            backgroundColor: '#003366', // ヘッダーの色
          },
          headerTintColor: '#FFFFFF', // ヘッダーの文字色
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* 画面を登録 */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'イングランド・ダービー' }} // ホーム画面のヘッダータイトル
        />
        <Stack.Screen 
          name="Game" 
          component={GameScreen} 
          options={{ title: '神経衰弱' }} // ゲーム画面のヘッダータイトル
        />
        <Stack.Screen 
          name="Info" 
          component={DerbyInfoScreen} 
          options={{ title: 'ダービーの背景' }} // 情報画面のヘッダータイトル
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}