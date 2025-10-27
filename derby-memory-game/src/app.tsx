import { DerbyCard } from './components/DerbyCard';
import { DERBY_LIST, Derby } from './data/derbies';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Button, Alert } from 'react-native';

interface CardState {
  id: number;
  derby: Derby;
  isFlipped: boolean;
  isMatched: boolean;
}

const createShuffledBoard = (): CardState[] => {
  const pairedDerbies = [...DERBY_LIST, ...DERBY_LIST];
  
  const shuffled = pairedDerbies
    .map((derby, index) => ({
      id: index,
      derby: derby,
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5);
    
  return shuffled;
};

export default function App() {
  const [board, setBoard] = useState<CardState[]>(createShuffledBoard());
  const [selectedCards, setSelectedCards] = useState<CardState[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (selectedCards.length === 2) {
      setIsChecking(true);
      checkMatch();
    }
  }, [selectedCards]);

  useEffect(() => {
    const allMatched = board.every(card => card.isMatched);
    if (allMatched && board.length > 0) {
      Alert.alert("コンプリート！", "全てのダービーを見つけました！", [
        { text: "リセット", onPress: resetGame }
      ]);
    }
  }, [board]);

  const handleCardPress = (pressedCard: CardState) => {
    if (isChecking || pressedCard.isFlipped || pressedCard.isMatched) {
      return;
    }

    const newBoard = board.map(card =>
      card.id === pressedCard.id ? { ...card, isFlipped: true } : card
    );
    setBoard(newBoard);
    setSelectedCards([...selectedCards, { ...pressedCard, isFlipped: true }]);
  };

  const checkMatch = () => {
    const [first, second] = selectedCards;

    if (first.derby.id === second.derby.id) {
      setBoard(prevBoard =>
        prevBoard.map(card =>
          card.derby.id === first.derby.id
            ? { ...card, isMatched: true }
            : card
        )
      );
    } else {
      setTimeout(() => {
        setBoard(prevBoard =>
          prevBoard.map(card =>
            card.id === first.id || card.id === second.id
              ? { ...card, isFlipped: false }
              : card
          )
        );
      }, 1000);
    }
    
    setTimeout(() => {
        setSelectedCards([]);
        setIsChecking(false);
    }, 1000);
  };

  const resetGame = () => {
    setBoard(createShuffledBoard());
    setSelectedCards([]);
    setIsChecking(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.board}>
        {board.map(card => (
          <DerbyCard
            key={card.id}
            name={card.derby.name}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onPress={() => handleCardPress(card)}
          />
        ))}
      </View>
      <Button title="リセット" onPress={resetGame} color="#CC0000" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF', // 背景色
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    maxWidth: 500,
    paddingVertical: 20,
  },
});