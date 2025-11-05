import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Button,
  Alert,
  ScrollView,
} from 'react-native';

// ★重要★ 上記で作成したファイル構成に基づいてインポート
import { DERBY_LIST } from './src/data/derbies';
import { DerbyCard } from './src/components/DerbyCard';

// カードの状態の型
interface CardState {
  cardId: number;       // 0-15の固有ID
  derbyGroupId: number; // どのダービーか (derbies.tsのid)
  teamName: string;
  derbyName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// チームカードのボードを作成・シャッフルする
const createShuffledBoard = (): CardState[] => {
  const teamCards: Omit<CardState, 'cardId' | 'isFlipped' | 'isMatched'>[] = [];

  // ダービーリストからチーム1とチーム2のカードを別々に生成
  DERBY_LIST.forEach(derby => {
    teamCards.push({
      derbyGroupId: derby.id,
      teamName: derby.team1,
      derbyName: derby.name,
    });
    teamCards.push({
      derbyGroupId: derby.id,
      teamName: derby.team2,
      derbyName: derby.name,
    });
  });

  // 16枚のチームカードをシャッフルし、IDを付与
  return teamCards
    .sort(() => Math.random() - 0.5)
    .map((card, index) => ({
      ...card,
      cardId: index,
      isFlipped: false,
      isMatched: false,
    }));
};

// --- アプリ本体 ---
export default function App() {
  const [board, setBoard] = useState<CardState[]>(createShuffledBoard());
  const [selectedCards, setSelectedCards] = useState<CardState[]>([]);
  const [isChecking, setIsChecking] = useState(false); // チェック中フラグ

  // 2枚選択されたら判定
  useEffect(() => {
    if (selectedCards.length === 2) {
      setIsChecking(true);
      checkMatch();
    }
  }, [selectedCards]);

  // クリア判定
  useEffect(() => {
    if (board.length > 0 && board.every(card => card.isMatched)) {
      Alert.alert('コンプリート！', '全てのダービーを見つけました！', [
        { text: 'リセット', onPress: resetGame },
      ]);
    }
  }, [board]);

  // カードクリック処理
  const handleCardPress = (pressedCard: CardState) => {
    if (isChecking || pressedCard.isFlipped || pressedCard.isMatched) {
      return;
    }
    // カードを表にする
    setBoard(prevBoard =>
      prevBoard.map(card =>
        card.cardId === pressedCard.cardId ? { ...card, isFlipped: true } : card
      )
    );
    setSelectedCards([...selectedCards, pressedCard]);
  };

  // マッチ判定
  const checkMatch = () => {
    const [first, second] = selectedCards;

    // 2枚の derbyGroupId が同じか？
    if (first.derbyGroupId === second.derbyGroupId) {
      // --- マッチした ---
      setBoard(prevBoard =>
        prevBoard.map(card =>
          card.derbyGroupId === first.derbyGroupId
            ? { ...card, isMatched: true }
            : card
        )
      );
      // ダービー名を表示
      Alert.alert(
        'マッチ！',
        `「${first.teamName}」 vs 「${second.teamName}」\n\n${first.derbyName}です！`
      );
      resetTurn();
    } else {
      // --- マッチしない ---
      setTimeout(() => {
        setBoard(prevBoard =>
          prevBoard.map(card =>
            card.cardId === first.cardId || card.cardId === second.cardId
              ? { ...card, isFlipped: false }
              : card
          )
        );
        resetTurn();
      }, 1000); // 1秒後に戻す
    }
  };

  // ターンをリセット
  const resetTurn = () => {
    setSelectedCards([]);
    setIsChecking(false);
  };

  // ゲームリセット
  const resetGame = () => {
    setBoard(createShuffledBoard());
    setSelectedCards([]);
    setIsChecking(false);
  };

  // --- 画面表示 ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.board}>
          {board.map(card => (
            <DerbyCard
              key={card.cardId}
              teamName={card.teamName} // カードにチーム名を渡す
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onPress={() => handleCardPress(card)}
            />
          ))}
        </View>
        <Button title="リセット" onPress={resetGame} color="#CC0000" />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- スタイル ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    minHeight: '100%',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '95%',
    maxWidth: 500,
    marginBottom: 20,
  },
});