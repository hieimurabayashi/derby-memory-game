import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, SafeAreaView, Button, ScrollView, Modal, Text, TouchableOpacity
} from 'react-native';

import { DERBY_LIST, Derby, Coordinate } from '../data/derbies';
import { DerbyCard } from '../components/DerbyCard';
import { EnglandMap } from '../components/EnglandMap';

interface CardState {
  cardId: number;
  derbyGroupId: number;
  teamName: string;
  teamImage: any;
  teamCoord: Coordinate;
  stadiumName: string;
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
      teamCoord: derby.team1Coord,
      stadiumName: derby.team1Stadium,
      derbyName: derby.name,
    });
    teamCards.push({
      derbyGroupId: derby.id,
      teamName: derby.team2,
      teamImage: derby.team2Image,
      teamCoord: derby.team2Coord,
      stadiumName: derby.team2Stadium,
      derbyName: derby.name,
    });
  });
  return teamCards.sort(() => Math.random() - 0.5).map((card, index) => ({
      ...card, cardId: index, isFlipped: false, isMatched: false,
    }));
};

export const GameScreen = () => {
  const [board, setBoard] = useState<CardState[]>(createShuffledBoard());
  const [selectedCards, setSelectedCards] = useState<CardState[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");

  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [lastMatchedDerby, setLastMatchedDerby] = useState<Derby | null>(null);

  useEffect(() => {
    if (selectedCards.length === 2) {
      setIsChecking(true);
      checkMatch();
    }
  }, [selectedCards]);

  const handleCardPress = (pressedCard: CardState) => {
    if (isChecking || pressedCard.isFlipped || pressedCard.isMatched) return;
    setBoard(prevBoard => prevBoard.map(card =>
        card.cardId === pressedCard.cardId ? { ...card, isFlipped: true } : card
      ));
    setSelectedCards([...selectedCards, pressedCard]);
    setLastMatchedDerby(null);
  };

  const checkMatch = () => {
    const [first, second] = selectedCards;
    if (first.derbyGroupId === second.derbyGroupId) {
      // --- マッチ成功 ---
      const playerKey = currentPlayer === 1 ? 'player1' : 'player2';
      const newScores = { ...scores, [playerKey]: scores[playerKey] + 1 };
      const isGameComplete = board.filter(card => !card.isMatched).length === 2;

      setBoard(prevBoard => prevBoard.map(card =>
          card.derbyGroupId === first.derbyGroupId ? { ...card, isMatched: true } : card
        ));
      setScores(newScores);

      const matchedDerbyData = DERBY_LIST.find(d => d.id === first.derbyGroupId) || null;
      setLastMatchedDerby(matchedDerbyData);

      if (isGameComplete) {
        let winnerMessage = newScores.player1 > newScores.player2 ? "🏆 Player 1 の勝利！ 🏆" : newScores.player1 < newScores.player2 ? "🏆 Player 2 の勝利！ 🏆" : "引き分け！";
        setModalTitle("🎉コンプリート！🎉");
        setModalText(`「${first.teamName}」 vs 「${second.teamName}」\n${first.derbyName}です！\n\n最終スコア:\nPlayer 1: ${newScores.player1}\nPlayer 2: ${newScores.player2}\n\n${winnerMessage}`);
      } else {
        setModalTitle("マッチ！");
        setModalText(`「${first.teamName}」 vs 「${second.teamName}」\n\n${first.derbyName}です！\n\nPlayer ${currentPlayer} は続けてプレイします。`);
      }
      setIsResultModalVisible(true);

    } else {
      // --- マッチ失敗 ---
      setTimeout(() => {
        setBoard(prevBoard => prevBoard.map(card =>
            card.cardId === first.cardId || card.cardId === second.cardId ? { ...card, isFlipped: false } : card
          ));
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
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
    setIsResultModalVisible(false);
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
    setLastMatchedDerby(null);
  };

  // 結果モーダルを閉じる時の処理
  const closeResultModal = () => {
    setIsResultModalVisible(false);
    const allMatched = board.every(card => card.isMatched);
    if (allMatched) { resetGame(); } else { resetTurn(); }
  };

  // ★追加: マップモーダルを閉じる時の処理 (ここが重要！)
  const closeMapModal = () => {
    setIsMapModalVisible(false);
    
    // もしマッチ成立後にマップを見ていた場合、マップを閉じたらターンをリセットして操作可能にする
    if (selectedCards.length === 2) {
      const allMatched = board.every(card => card.isMatched);
      if (allMatched) { 
        resetGame(); 
      } else { 
        resetTurn(); 
      }
    }
  };

  const activeCoords = selectedCards.map(card => card.teamCoord);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.statusBar}>
          <View style={[styles.scoreBox, currentPlayer === 1 && styles.activePlayer]}><Text style={styles.scoreText}>Player 1</Text><Text style={styles.scoreNumber}>{scores.player1}</Text></View>
          <View style={[styles.scoreBox, currentPlayer === 2 && styles.activePlayer]}><Text style={styles.scoreText}>Player 2</Text><Text style={styles.scoreNumber}>{scores.player2}</Text></View>
        </View>

        <TouchableOpacity style={styles.mapButton} onPress={() => setIsMapModalVisible(true)}>
          <Text style={styles.mapButtonText}>🗺️ マップで位置を確認</Text>
        </TouchableOpacity>

        <View style={styles.board}>
          {board.map(card => (
            <DerbyCard key={card.cardId} teamImage={card.teamImage} isFlipped={card.isFlipped} isMatched={card.isMatched} onPress={() => handleCardPress(card)} />
          ))}
        </View>
        <Button title="リセット" onPress={resetGame} color="#CC0000" />
      </ScrollView>

      {/* 結果モーダル */}
      <Modal visible={isResultModalVisible} transparent={true} animationType="fade" onRequestClose={closeResultModal}>
        <View style={styles.modalOverlay}><View style={styles.modalContent}><Text style={styles.modalTitle}>{modalTitle}</Text><Text style={styles.modalBody}>{modalText}</Text>
        
        {/* マップを見るボタン: 結果モーダルを閉じてからマップを開く */}
        <Button 
          title="🗺️ マップを見る" 
          onPress={() => {
            setIsResultModalVisible(false); 
            setTimeout(() => setIsMapModalVisible(true), 300);
          }} 
          color="#003366"
        />
        
        <View style={{marginTop:10}}><Button title="閉じる" onPress={closeResultModal} /></View>
        </View></View>
      </Modal>

      {/* マップモーダル */}
      {/* ★修正: onRequestClose に closeMapModal を指定 */}
      <Modal visible={isMapModalVisible} animationType="slide" onRequestClose={closeMapModal}>
        <SafeAreaView style={styles.mapModalContainer}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>イングランド・フットボールマップ</Text>
            {/* ★修正: onPress に closeMapModal を指定 */}
            <Button title="閉じる" onPress={closeMapModal} />
          </View>
          <View style={styles.mapBody}>
            <EnglandMap activeCoords={activeCoords} matchedDerby={lastMatchedDerby} />
          </View>
          <View style={styles.mapFooter}>
            <Text style={styles.mapDescription}>
              {lastMatchedDerby 
                ? `✨MATCH! ${lastMatchedDerby.team1Stadium} と ${lastMatchedDerby.team2Stadium} の距離` 
                : (selectedCards.length > 0 ? "カードをめくると位置が光ります" : "カードをめくってペアを探そう！")}
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFEFEF' },
  scrollContainer: { alignItems: 'center', paddingVertical: 20 },
  statusBar: { flexDirection: 'row', justifyContent: 'space-around', width: '95%', maxWidth: 500, marginBottom: 10 },
  scoreBox: { width: '45%', paddingVertical: 8, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 2, borderColor: '#CCCCCC', alignItems: 'center' },
  activePlayer: { borderColor: '#003366', elevation: 5 },
  scoreText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  scoreNumber: { fontSize: 24, fontWeight: 'bold', color: '#003366' },
  board: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '95%', maxWidth: 500, marginBottom: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', maxWidth: 400, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalBody: { fontSize: 16, textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  mapButton: { backgroundColor: '#003366', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginBottom: 15 },
  mapButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  mapModalContainer: { flex: 1, backgroundColor: '#fff' },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
  mapTitle: { fontSize: 18, fontWeight: 'bold', color: '#003366' },
  mapBody: { flex: 1, padding: 10 },
  mapFooter: { padding: 15, borderTopWidth: 1, borderColor: '#ccc', alignItems: 'center' },
  mapDescription: { fontSize: 16, color: '#333' },
});