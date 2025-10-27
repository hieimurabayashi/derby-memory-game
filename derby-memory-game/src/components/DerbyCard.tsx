import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
  onPress: () => void;
}

export const DerbyCard: React.FC<Props> = ({ name, isFlipped, isMatched, onPress }) => {
  const cardStyle: ViewStyle[] = [styles.card];

  if (isFlipped) {
    cardStyle.push(styles.flipped);
  }
  if (isMatched) {
    cardStyle.push(styles.matched);
  }

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={onPress}
      disabled={isFlipped || isMatched}
    >
      {isFlipped || isMatched ? (
        <Text style={styles.text}>{name}</Text>
      ) : (
        <Text style={styles.text}>?</Text>
      )}
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  card: {
    // 変更点: 1行に5枚表示するため幅を調整
    width: '18%', // 以前は '23%'
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
    backgroundColor: '#FFFFFF',
  },
  matched: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  text: {
    // 変更点: 幅が狭くなるためフォントを少し小さくする
    fontSize: 9, // 以前は 10
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
});