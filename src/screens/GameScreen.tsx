import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, SafeAreaView, Button, ScrollView, Modal, Text, TouchableOpacity
} from 'react-native';

// 必要なデータとコンポーネントをインポート
import { DERBY_LIST, Derby, Coordinate } from '../data/derbies';
import { DerbyCard } from '../components/DerbyCard';
// ★追加: マップコンポーネント
import { EnglandMap } from '../components/EnglandMap';

// カードの状態型 (座標情報を追加)
interface CardState {
  cardId: number;
  derbyGroupId: number;
  teamName: string;
  teamImage: any;
  // ★追加: 座標とスタジアム名
  teamCoord: Coordinate;
  stadiumName: string;
  derbyName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// ボード作成関数 (座標情報を含めるように修正)
const createShuffledBoard = (): CardState[] => {
  const teamCards: Omit<CardState, 'cardId' | 'isFlipped' | 'isMatched'>[] = [];
  DERBY_LIST.forEach(derby => {
    // チーム1のカード
    teamCards.push({
      derbyGroupId: derby.id,
      teamName: derby.team1,
      teamImage: derby.team1Image,
      // ★追加
      teamCoord: derby.team1Coord,
      stadiumName: derby.team1Stadium,
      derbyName: derby.name,
    });
    // チーム2のカード
    teamCards.push({
      derbyGroupId: derby.id,
      teamName: derby.team2,
      teamImage: derby.team2Image,
      // ★追加
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

  // 結果表示モーダル用
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");

  // ★追加: マップモーダル用State
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  // ★追加: 直近でマッチしたダービー情報（マップ線引用）
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
    // ★カードをめくったらマップの線引情報をリセット（新しいターンのため）
    setLastMatchedDerby(null);
  };

  const checkMatch = () => {
    const [first, second] = selectedCards;
    if (first.derbyGroupId === second.derbyGroupId) {
      // --- マッチング成功 ---
      const playerKey = currentPlayer === 1 ? 'player1' : 'player2';
      const newScores = { ...scores, [playerKey]: scores[playerKey] + 1 };
      const isGameComplete = board.filter(card => !card.isMatched).length === 2;

      setBoard(prevBoard => prevBoard.map(card =>
          card.derbyGroupId === first.derbyGroupId ? { ...card, isMatched: true } : card
        ));
      setScores(newScores);

      // ★追加: マッチしたダービー情報を特定してStateに保存（マップ用）
      const matchedDerbyData = DERBY_LIST.find(d => d.id === first.derbyGroupId) || null;
      setLastMatchedDerby(matchedDerbyData);

      // モーダル表示設定
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
      // --- マッチング失敗 ---
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
    setLastMatchedDerby(null); // マップ情報もリセット
  };

  const closeResultModal = () => {
    setIsResultModalVisible(false);
    const allMatched = board.every(card => card.isMatched);
    if (allMatched) { resetGame(); } else { resetTurn(); }
  };

  // ★追加: 現在めくられているカードの座標リストを作成
  const activeCoords = selectedCards.map(card => card.teamCoord);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* スコアボード */}
        <View style={styles.statusBar}>
          <View style={[styles.scoreBox, currentPlayer === 1 && styles.activePlayer]}><Text style={styles.scoreText}>Player 1</Text><Text style={styles.scoreNumber}>{scores.player1}</Text></View>
          <View style={[styles.scoreBox, currentPlayer === 2 && styles.activePlayer]}><Text style={styles.scoreText}>Player 2</Text><Text style={styles.scoreNumber}>{scores.player2}</Text></View>
        </View>

        {/* ★追加: マップを開くボタン */}
        <TouchableOpacity style={styles.mapButton} onPress={() => setIsMapModalVisible(true)}>
          <Text style={styles.mapButtonText}>🗺️ マップで位置を確認</Text>
        </TouchableOpacity>

        {/* ゲームボード */}
        <View style={styles.board}>
          {board.map(card => (
            <DerbyCard key={card.cardId} teamImage={card.teamImage} isFlipped={card.isFlipped} isMatched={card.isMatched} onPress={() => handleCardPress(card)} />
          ))}
        </View>
        <Button title="リセット" onPress={resetGame} color="#CC0000" />
      </ScrollView>

      {/* 結果表示モーダル (既存) */}
      <Modal visible={isResultModalVisible} transparent={true} animationType="fade" onRequestClose={closeResultModal}>
        <View style={styles.modalOverlay}><View style={styles.modalContent}><Text style={styles.modalTitle}>{modalTitle}</Text><Text style={styles.modalBody}>{modalText}</Text>
{/* ★修正: 結果画面を閉じてからマップを開くように変更 */}
<Button 
          title="🗺️ マップを見る" 
          onPress={() => {
            setIsResultModalVisible(false); // 先に結果画面を閉じる
            setTimeout(() => setIsMapModalVisible(true), 300); // 0.3秒後にマップを開く
          }} 
          color="#003366"
        />
        <View style={{marginTop:10}}><Button title="閉じる" onPress={closeResultModal} /></View>
        </View></View>
      </Modal>

      {/* ★追加: マップ表示モーダル (新しいウィンドウの代わり) */}
      <Modal visible={isMapModalVisible} animationType="slide" onRequestClose={() => setIsMapModalVisible(false)}>
        <SafeAreaView style={styles.mapModalContainer}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>イングランド・フットボールマップ</Text>
            <Button title="閉じる" onPress={() => setIsMapModalVisible(false)} />
          </View>
          <View style={styles.mapBody}>
            {/* マップコンポーネントに情報を渡す */}
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
  // ★追加スタイル
  mapButton: { backgroundColor: '#003366', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginBottom: 15 },
  mapButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  mapModalContainer: { flex: 1, backgroundColor: '#fff' },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
  mapTitle: { fontSize: 18, fontWeight: 'bold', color: '#003366' },
  mapBody: { flex: 1, padding: 10 },
  mapFooter: { padding: 15, borderTopWidth: 1, borderColor: '#ccc', alignItems: 'center' },
  mapDescription: { fontSize: 16, color: '#333' },
});