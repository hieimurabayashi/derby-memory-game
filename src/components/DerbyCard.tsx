import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  teamName: string; // カードに表示するチーム名
  isFlipped: boolean;
  isMatched: boolean;
  onPress: () => void;
}

export const DerbyCard: React.FC<Props> = ({ teamName, isFlipped, isMatched, onPress }) => {
  
  const cardStyle: ViewStyle[] = [styles.card];
  if (isFlipped) cardStyle.push(styles.flipped);
  if (isMatched) cardStyle.push(styles.matched);

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={onPress}
      disabled={isFlipped || isMatched}
    >
      {isFlipped || isMatched ? (
        <Text style={styles.text}>{teamName}</Text> // めくれたらチーム名表示
      ) : (
        <Text style={styles.text}>?</Text> // 裏面
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '23%',
    aspectRatio: 2 / 3,
    margin: '1%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003366',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  flipped: {
    backgroundColor: '#FFFFFF', // 表面は白
  },
  matched: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
 // src/components/DerbyCard.tsx の一番下

 text: {
  fontSize: 14,       // ★ 10 から 14 に変更
  fontWeight: 'bold',
  textAlign: 'center',
  color: 'red',     // ★ '#000000' から 'red' に変更
},
});