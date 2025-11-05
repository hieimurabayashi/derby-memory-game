import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Image } from 'react-native'; // ★ Image をインポート

interface Props {
  // teamName: string; // ★ テキストの teamName はもう不要
  teamImage: any;   // ★ 画像を表示するためのプロパティを追加
  isFlipped: boolean;
  isMatched: boolean;
  onPress: () => void;
}

export const DerbyCard: React.FC<Props> = ({ 
  // teamName, // ★ teamName を削除
  teamImage, // ★ teamImage を受け取る
  isFlipped, 
  isMatched, 
  onPress 
}) => {
  
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
        // ★ 画像を表示するように変更 ★
        <Image 
          source={teamImage} // teamImage を画像ソースとして使う
          style={styles.cardImage} // 画像用のスタイル
          resizeMode="contain" // 画像がはみ出さないように調整
        />
      ) : (
        <Text style={styles.questionMark}>?</Text> // 裏面は引き続き「?」
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
    overflow: 'hidden', // ★ 画像がはみ出さないようにクリップ
  },
  flipped: {
    backgroundColor: '#FFFFFF',
  },
  matched: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  // ★ 新しい画像用スタイル ★
  cardImage: {
    width: '90%', // カードの幅に合わせて調整
    height: '90%', // カードの高さに合わせて調整
  },
  // ★ クエスチョンマークのスタイルを調整 ★
  questionMark: {
    fontSize: 24, // 少し大きくする
    fontWeight: 'bold',
    color: '#FFFFFF', // 裏面の文字色を白に
  }
});