import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Button,
  ScrollView,
  Modal, // モーダルを使用
  Text,
} from 'react-native';

import { DERBY_LIST } from './src/data/derbies';
import { DerbyCard } from './src/components/DerbyCard';

// (CardState, createShuffledBoard 関数は変更なし)
interface CardState {
  cardId: number;
  derbyGroupId: number;
  teamName: string;
  derbyName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const createShuffledBoard = (): CardState[] => {
  const teamCards: Omit<CardState, 'cardId' | 'isFlipped' | 'isMatched'>[] = [];

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
  const [isChecking, setIsChecking] = useState(false);

  // Modal（モーダル）用の状態
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState(""); // ★ タイトルも動的に変更
  const [modalText, setModalText] = useState("");

  // ★★★ 修正点① ★★★
  // クリア判定の useEffect は削除する
  // useEffect(() => {
  //   if (board.length > 0 && board.every(card => card.isMatched)) {
  //     ...
  //   }
  // }, [board]); // ← このブロック全体を削除

  // (2枚選択の useEffect は変更なし)
  useEffect(() => {
    if (selectedCards.length === 2) {
      setIsChecking(true);
      checkMatch();
    }
  }, [selectedCards]);

  // (handleCardPress は変更なし)
  const handleCardPress = (pressedCard: CardState) => {
    if (isChecking || pressedCard.isFlipped || pressedCard.isMatched) {
      return;
    }
    setBoard(prevBoard =>
      prevBoard.map(card =>
        card.cardId === pressedCard.cardId ? { ...card, isFlipped: true } : card
      )
    );
    setSelectedCards([...selectedCards, pressedCard]);
  };

  // ★★★ 修正点② ★★★
  // マッチ判定 (クリア判定をこの中に統合)
  const checkMatch = () => {
    const [first, second] = selectedCards;

    if (first.derbyGroupId === second.derbyGroupId) {
      // --- マッチした ---
      
      // これが最後のペアかどうかを、ボード更新「前」にチェック
      // (マッチしていないカードが、今めくった2枚だけか？)
      const isGameComplete = board.filter(card => !card.isMatched).length === 2;

      // ボードの状態を更新
      setBoard(prevBoard =>
        prevBoard.map(card =>
          card.derbyGroupId === first.derbyGroupId
            ? { ...card, isMatched: true }
            : card
        )
      );
      
      if (isGameComplete) {
        // 最後のペアだった場合
        setModalTitle("🎉コンプリート！🎉");
        setModalText(
          `「${first.teamName}」 vs 「${second.teamName}」\n\n${first.derbyName}です！\n\n全てのダービーを見つけました！`
        );
        setIsModalVisible(true);
      } else {
        // まだ途中のペアの場合
        setModalTitle("マッチ！");
        setModalText(
          `「${first.teamName}」 vs 「${second.teamName}」\n\n${first.derbyName}です！`
        );
        setIsModalVisible(true);
      }

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
      }, 1000);
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
    setIsModalVisible(false);
  };

  // ★★★ 修正点③ ★★★
  // モーダルを閉じるための関数 (ロジックをシンプルに)
  const closeModal = () => {
    setIsModalVisible(false); // 閉じる

    const allMatched = board.every(card => card.isMatched);
    if (allMatched) {
      // ボードが全部マッチ済なら（＝クリア後なら）リセット
      resetGame();
    } else {
      // まだ途中ならターンだけリセット
      resetTurn();
    }
  };

  // --- 画面表示 ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.board}>
          {board.map(card => (
            <DerbyCard
              key={card.cardId}
              teamName={card.teamName}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onPress={() => handleCardPress(card)}
            />
          ))}
        </View>
        <Button title="リセット" onPress={resetGame} color="#CC0000" />
      </ScrollView>

      {/* モーダル表示 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* ★ タイトルを動的に設定 */}
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalBody}>{modalText}</Text>
            <Button title="OK" onPress={closeModal} />
          </View>
        </View>
      </Modal>
      
    </SafeAreaView>
  );
}

// --- スタイル (変更なし) ---
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
});