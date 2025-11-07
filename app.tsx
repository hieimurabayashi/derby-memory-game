import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { DerbyInfoScreen } from './src/screens/DerbyInfoScreen'; // 1ページ目
import { DerbyInfoScreen2 } from './src/screens/DerbyInfoScreen2'; // ★ 2ページ目をインポート

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#003366',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'イングランド・ダービー' }}
        />
        <Stack.Screen 
          name="Game" 
          component={GameScreen} 
          options={{ title: '神経衰弱' }}
        />
        <Stack.Screen 
          name="Info" // ホームからの名前は 'Info' のまま
          component={DerbyInfoScreen} 
          options={{ title: 'ダービーの背景 (1/2)' }} // ★ タイトル変更
        />
        <Stack.Screen 
          name="InfoPage2" // ★ 2ページ目を 'InfoPage2' として登録
          component={DerbyInfoScreen2} 
          options={{ title: 'ダービーの背景 (2/2)' }} // ★ タイトル変更
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}