import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Button,
  Alert,
  ScrollView,
} from 'react-native';

// 上記で作成した2つのファイルをインポート
import { DERBY_LIST } from './src/derbyData';
import { GameCard } from './src/components/GameCard';

// 1枚のカードが持つ状態の「型」
interface CardState {
  cardId: number;       // カード固有のID (0-15)
  derbyGroupId: number; // 属するダービーのID (derbyData.ts の id と一致)
  teamName: string;     // 表示するチーム名
  derbyName: string;    // マッチ時に表示するダービー名
  isFlipped: boolean;
  isMatched: boolean;
}

// チームカードのボードを作成・シャッフルする関数
const createShuffledBoard = (): CardState[] => {
  const teamCards: Omit<CardState, 'cardId' | 'isFlipped' | 'isMatched'>[] = [];

  // ダービーリストから、チーム1とチーム2のカードを別々に生成
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

  // チームカード(16枚)をシャッフルし、0から15のIDを付与
  return teamCards
    .sort(() => Math.random() - 0.5) // ランダムに並び替え
    .map((card, index) => ({
      ...card,
      cardId: index, // 固有ID
      isFlipped: false,
      isMatched: false,
    }));
};

// アプリ本体のコンポーネント
export default function App() {
  // --- State (状態) ---
  const [board, setBoard] = useState<CardState[]>(createShuffledBoard());
  const [selectedCards, setSelectedCards] = useState<CardState[]>([]);
  const [isChecking, setIsChecking] = useState(false); // 2枚めくってチェック中か

  // --- Effect (監視) ---

  // 2枚選択されたら、checkMatch関数を呼び出す
  useEffect(() => {
    if (selectedCards.length === 2) {
      setIsChecking(true); // チェック開始
      checkMatch();
    }
  }, [selectedCards]);

  // 全てマッチしたか（クリア判定）
  useEffect(() => {
    if (board.length > 0 && board.every(card => card.isMatched)) {
      Alert.alert('コンプリート！', '全てのダービーを見つけました！', [
        { text: 'リセット', onPress: resetGame },
      ]);
    }
  }, [board]);

  // --- Functions (関数) ---

  // カードがクリックされた時の処理
  const handleCardPress = (pressedCard: CardState) => {
    // チェック中、または既に開かれているカードは無視
    if (isChecking || pressedCard.isFlipped || pressedCard.isMatched) {
      return;
    }

    // 押されたカードを表にする
    setBoard(prevBoard =>
      prevBoard.map(card =>
        card.cardId === pressedCard.cardId ? { ...card, isFlipped: true } : card
      )
    );
    // 選択中リストに追加
    setSelectedCards([...selectedCards, pressedCard]);
  };

  // 2枚のカードのマッチ判定
  const checkMatch = () => {
    const [first, second] = selectedCards;

    // 2枚の「derbyGroupId」が同じか？ (例: どちらも ID 1 (ノースロンドン) か？)
    if (first.derbyGroupId === second.derbyGroupId) {
      // --- マッチした ---
      setBoard(prevBoard =>
        prevBoard.map(card =>
          card.derbyGroupId === first.derbyGroupId
            ? { ...card, isMatched: true } // マッチ済みに変更
            : card
        )
      );
      // ダービー名を表示
      Alert.alert(
        'マッチ！',
        `「${first.teamName}」 vs 「${second.teamName}」\n\n${first.derbyName}です！`
      );
      resetTurn(); // ターンリセット
    } else {
      // --- マッチしない ---
      setTimeout(() => {
        setBoard(prevBoard =>
          prevBoard.map(card =>
            // 2枚のカードを裏に戻す
            card.cardId === first.cardId || card.cardId === second.cardId
              ? { ...card, isFlipped: false }
              : card
          )
        );
        resetTurn(); // ターンリセット
      }, 1000); // 1秒後に戻す
    }
  };

  // ターンをリセットする
  const resetTurn = () => {
    setSelectedCards([]);
    setIsChecking(false); // チェック終わり
  };

  // ゲーム全体をリセット
  const resetGame = () => {
    setBoard(createShuffledBoard());
    setSelectedCards([]);
    setIsChecking(false);
  };

  // --- Render (画面表示) ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* ゲームボード */}
        <View style={styles.board}>
          {board.map(card => (
            <GameCard
              key={card.cardId}
              teamName={card.teamName} // カードにチーム名を渡す
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onPress={() => handleCardPress(card)}
            />
          ))}
        </View>

        {/* リセットボタン */}
        <Button title="リセット" onPress={resetGame} color="#CC0000" />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles (スタイル) ---
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