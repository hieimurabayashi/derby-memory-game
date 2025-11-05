import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Button,
  ScrollView,
  Modal, // ★ Alert の代わりに Modal を使う
  Text,  // ★ Modal の中で Text を使う
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

  // ★ Modal（モーダル）用の状態を追加
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  // (クリア判定の useEffect は変更なし)
  useEffect(() => {
    if (board.length > 0 && board.every(card => card.isMatched)) {
      // クリア時はアラートのままでも良いが、一貫性のためにモーダルにする
      setModalText("コンプリート！\n全てのダービーを見つけました！");
      setIsModalVisible(true);
      // Alert.alert(...)
    }
  }, [board]);

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

  // ★ マッチ判定 (Alert を Modal に変更)
  const checkMatch = () => {
    const [first, second] = selectedCards;

    if (first.derbyGroupId === second.derbyGroupId) {
      // --- マッチした ---
      setBoard(prevBoard =>
        prevBoard.map(card =>
          card.derbyGroupId === first.derbyGroupId
            ? { ...card, isMatched: true }
            : card
        )
      );
      
      // ★ Alert.alert の代わりに Modal の内容と表示を設定
      setModalText(
        `「${first.teamName}」 vs 「${second.teamName}」\n\n${first.derbyName}です！`
      );
      setIsModalVisible(true);

      // resetTurn() はモーダルを閉じる時に呼ぶため、ここでは呼ばない
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
        resetTurn(); // マッチしない時は通常通りリセット
      }, 1000);
    }
  };

  // ターンをリセット
  const resetTurn = () => {
    setSelectedCards([]);
    setIsChecking(false);
  };

  // ゲームリセット (クリアモーダルも閉じる)
  const resetGame = () => {
    setBoard(createShuffledBoard());
    setSelectedCards([]);
    setIsChecking(false);
    setIsModalVisible(false); // ★ モーダルを閉じる
  };

  // ★ モーダルを閉じるための関数
  const closeModal = () => {
    const allMatched = board.every(card => card.isMatched);
    if (allMatched) {
      // クリア後のモーダルならリセット
      resetGame();
    } else {
      // 途中のマッチならターンだけリセット
      setIsModalVisible(false);
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

      {/* ★★★ ここからModalを追加 ★★★ */}
      <Modal
        visible={isModalVisible}
        transparent={true} // 背景を透明に
        animationType="fade" // フェードイン
        onRequestClose={closeModal} // (Androidの戻るボタン用)
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>マッチ！</Text>
            <Text style={styles.modalBody}>{modalText}</Text>
            <Button title="OK" onPress={closeModal} />
          </View>
        </View>
      </Modal>
      {/* ★★★ ここまで ★★★ */}
      
    </SafeAreaView>
  );
}

// --- スタイル (Modal用スタイルを追加) ---
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

  // ★★★ ここからModal用スタイルを追加 ★★★
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明の黒
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
    shadowColor: '#000', // 影 (Webでも効く)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // (Android用)
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
    lineHeight: 24, // 行間
  },
  // ★★★ ここまで ★★★
});