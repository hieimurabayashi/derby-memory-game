import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Button,
  ScrollView,
  Modal,
  Text,
} from 'react-native';

import { DERBY_LIST } from './src/data/derbies';
import { DerbyCard } from './src/components/DerbyCard';

// ★変更点★ CardState インターフェースに teamImage を追加
interface CardState {
  cardId: number;
  derbyGroupId: number;
  teamName: string;   // テキストのアラート用に残しておく
  teamImage: any;     // ★画像データ用
  derbyName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// ★変更点★ createShuffledBoard 関数で teamImage もセットするように変更
const createShuffledBoard = (): CardState[] => {
  const teamCards: Omit<CardState, 'cardId' | 'isFlipped' | 'isMatched'>[] = [];

  DERBY_LIST.forEach(derby => {
    teamCards.push({
      derbyGroupId: derby.id,
      teamName: derby.team1,
      teamImage: derby.team1Image, // ★画像データを追加
      derbyName: derby.name,
    });
    teamCards.push({
      derbyGroupId: derby.id,
      teamName: derby.team2,
      teamImage: derby.team2Image, // ★画像データを追加
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    if (selectedCards.length === 2) {
      setIsChecking(true);
      checkMatch();
    }
  }, [selectedCards]);

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

  const checkMatch = () => {
    const [first, second] = selectedCards;

    if (first.derbyGroupId === second.derbyGroupId) {
      const isGameComplete = board.filter(card => !card.isMatched).length === 2;

      setBoard(prevBoard =>
        prevBoard.map(card =>
          card.derbyGroupId === first.derbyGroupId
            ? { ...card, isMatched: true }
            : card
        )
      );
      
      if (isGameComplete) {
        setModalTitle("🎉コンプリート！🎉");
        setModalText(
          `「${first.teamName}」 vs 「${second.teamName}」\n\n${first.derbyName}です！\n\n全てのダービーを見つけました！`
        );
        setIsModalVisible(true);
      } else {
        setModalTitle("マッチ！");
        setModalText(
          `「${first.teamName}」 vs 「${second.teamName}」\n\n${first.derbyName}です！`
        );
        setIsModalVisible(true);
      }

    } else {
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

  const resetTurn = () => {
    setSelectedCards([]);
    setIsChecking(false);
  };

  const resetGame = () => {
    setBoard(createShuffledBoard());
    setSelectedCards([]);
    setIsChecking(false);
    setIsModalVisible(false);
  };

  const closeModal = () => {
    setIsModalVisible(false);

    const allMatched = board.every(card => card.isMatched);
    if (allMatched) {
      resetGame();
    } else {
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
              // teamName={card.teamName} // ★ teamName の代わりに teamImage を渡す
              teamImage={card.teamImage} // ★ 画像データを渡す
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onPress={() => handleCardPress(card)}
            />
          ))}
        </View>
        <Button title="リセット" onPress={resetGame} color="#CC0000" />
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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