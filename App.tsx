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

// (CardState, createShuffledBoard 関数は変更なし)
interface CardState {
  cardId: number;
  derbyGroupId: number;
  teamName: string;
  teamImage: any;
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
      teamImage: derby.team1Image,
      derbyName: derby.name,
    });
    teamCards.push({
      derbyGroupId: derby.id,
      teamName: derby.team2,
      teamImage: derby.team2Image,
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
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");

  // ★★★ ターン制とスコア用のStateを追加 ★★★
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1); // Player 1 からスタート
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

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

  // ★ マッチ判定 (スコアとターン交代ロジック追加)
  const checkMatch = () => {
    const [first, second] = selectedCards;

    if (first.derbyGroupId === second.derbyGroupId) {
      // --- マッチした ---
      
      // ★ スコアを加算
      const playerKey = currentPlayer === 1 ? 'player1' : 'player2';
      // スコアを先に計算 (最終スコア判定のため)
      const newScores = { ...scores, [playerKey]: scores[playerKey] + 1 };
      
      // これが最後のペアかどうかを、ボード更新「前」にチェック
      const isGameComplete = board.filter(card => !card.isMatched).length === 2;

      // ボードの状態を更新 (マッチ済みにする)
      setBoard(prevBoard =>
        prevBoard.map(card =>
          card.derbyGroupId === first.derbyGroupId
            ? { ...card, isMatched: true }
            : card
        )
      );
      
      // ★ スコアのStateを更新
      setScores(newScores);

      if (isGameComplete) {
        // --- 最後のペアだった場合 ---
        
        // ★ 勝者判定
        let winnerMessage = "";
        if (newScores.player1 > newScores.player2) {
          winnerMessage = "🏆 Player 1 の勝利！ 🏆";
        } else if (newScores.player1 < newScores.player2) {
          winnerMessage = "🏆 Player 2 の勝利！ 🏆";
        } else {
          winnerMessage = "引き分け！";
        }

        setModalTitle("🎉コンプリート！🎉");
        setModalText(
          `「${first.teamName}」 vs 「${second.teamName}」\n${first.derbyName}です！\n\n` + // 最後のダービー名
          `最終スコア:\nPlayer 1: ${newScores.player1}\nPlayer 2: ${newScores.player2}\n\n` + // 最終スコア
          `${winnerMessage}` // 勝者
        );
        setIsModalVisible(true);
      } else {
        // --- まだ途中のペアの場合 ---
        setModalTitle("マッチ！");
        setModalText(
          `「${first.teamName}」 vs 「${second.teamName}」\n\n${first.derbyName}です！\n\n` +
          `Player ${currentPlayer} は続けてプレイします。` // ★ 連続ターン
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
        // ★ ターン交代
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        resetTurn(); // 選択をリセット
      }, 1000);
    }
  };

  // ターンをリセット (選択カードを空にし、チェック中を解除)
  const resetTurn = () => {
    setSelectedCards([]);
    setIsChecking(false);
  };

  const resetGame = () => {
    setBoard(createShuffledBoard());
    setSelectedCards([]);
    setIsChecking(false);
    setIsModalVisible(false);
    // ★ プレイヤーとスコアもリセット
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
  };

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalVisible(false); 

    const allMatched = board.every(card => card.isMatched);
    if (allMatched) {
      // クリア後ならリセット
      resetGame();
    } else {
      // 途中ならターンだけリセット (プレイヤーは交代しない)
      resetTurn();
    }
  };

  // --- 画面表示 (JSX) ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* ★★★ スコアボードとターン表示を追加 ★★★ */}
        <View style={styles.statusBar}>
          <View style={[
            styles.scoreBox, 
            currentPlayer === 1 && styles.activePlayer // P1がアクティブならハイライト
          ]}>
            <Text style={styles.scoreText}>Player 1</Text>
            <Text style={styles.scoreNumber}>{scores.player1}</Text>
          </View>
          <View style={[
            styles.scoreBox, 
            currentPlayer === 2 && styles.activePlayer // P2がアクティブならハイライト
          ]}>
            <Text style={styles.scoreText}>Player 2</Text>
            <Text style={styles.scoreNumber}>{scores.player2}</Text>
          </View>
        </View>

        {/* ゲームボード */}
        <View style={styles.board}>
          {board.map(card => (
            <DerbyCard
              key={card.cardId}
              teamImage={card.teamImage}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onPress={() => handleCardPress(card)}
            />
          ))}
        </View>
        <Button title="リセット" onPress={resetGame} color="#CC0000" />
      </ScrollView>

      {/* モーダル (変更なし) */}
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

// --- スタイル (StatusBar用スタイルを追加) ---
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
  
  // ★★★ スコアボード用スタイル ★★★
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around', // 左右に振り分け
    width: '95%',
    maxWidth: 500,
    marginBottom: 10,
  },
  scoreBox: {
    width: '45%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CCCCCC', // 通常時の枠線
    alignItems: 'center',
  },
  activePlayer: {
    borderColor: '#003366', // アクティブなプレイヤーの枠線 (濃い青)
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
  },
  // ★★★★★★★★★★★★★★★★★★★

  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '95%',
    maxWidth: 500,
    marginBottom: 20,
  },
  
  // (モーダル用スタイルは変更なし)
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