
import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import Scoreboard from './Scoreboard';
import ActionPanel from './ActionPanel';
import GameLog from './GameLog';
import WinnerBanner from './WinnerBanner';

export interface Player {
  name: string;
  score: number;
}

export interface GameAction {
  id: string;
  timestamp: Date;
  description: string;
}

const Perfect20Game = () => {
  const [players, setPlayers] = useState<Player[]>([
    { name: 'Alice', score: 0 },
    { name: 'Bob', score: 0 },
    { name: 'Charlie', score: 0 },
    { name: 'Diana', score: 0 },
    { name: 'Evan', score: 0 }
  ]);

  const [currentPlayer, setCurrentPlayer] = useState('Alice');
  const [targetPlayer, setTargetPlayer] = useState('Alice');
  const [actionType, setActionType] = useState<'Add' | 'Deduct' | 'Swap'>('Add');
  const [actionPoints, setActionPoints] = useState(1);
  const [gameLog, setGameLog] = useState<GameAction[]>([]);
  const [winner, setWinner] = useState<string | null>(null);

  // Load game state from localStorage
  useEffect(() => {
    const savedGame = localStorage.getItem('perfect20_game');
    if (savedGame) {
      const gameState = JSON.parse(savedGame);
      setPlayers(gameState.players || players);
      setGameLog(gameState.gameLog?.map((action: any) => ({
        ...action,
        timestamp: new Date(action.timestamp)
      })) || []);
      setWinner(gameState.winner || null);
    }
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    const gameState = {
      players,
      gameLog,
      winner
    };
    localStorage.setItem('perfect20_game', JSON.stringify(gameState));
  }, [players, gameLog, winner]);

  // Check for winner whenever scores change
  useEffect(() => {
    const winningPlayer = players.find(player => player.score >= 20);
    if (winningPlayer && !winner) {
      setWinner(winningPlayer.name);
    }
  }, [players, winner]);

  const addLogEntry = (description: string) => {
    const newAction: GameAction = {
      id: Date.now().toString(),
      timestamp: new Date(),
      description
    };
    setGameLog(prev => [newAction, ...prev]);
  };

  const updatePlayerScore = (playerName: string, newScore: number) => {
    // Prevent scores from going below 0 or above 20
    const clampedScore = Math.max(0, Math.min(20, newScore));
    
    setPlayers(prev => prev.map(player => 
      player.name === playerName 
        ? { ...player, score: clampedScore }
        : player
    ));
  };

  const applyAction = () => {
    if (winner) return; // Don't allow actions after someone has won

    const currentPlayerObj = players.find(p => p.name === currentPlayer);
    const targetPlayerObj = players.find(p => p.name === targetPlayer);

    if (!currentPlayerObj || !targetPlayerObj) return;

    switch (actionType) {
      case 'Add':
        updatePlayerScore(currentPlayer, currentPlayerObj.score + actionPoints);
        addLogEntry(`${currentPlayer} added ${actionPoints} point${actionPoints === 1 ? '' : 's'} to self.`);
        break;
      
      case 'Deduct':
        updatePlayerScore(targetPlayer, targetPlayerObj.score - actionPoints);
        addLogEntry(`${currentPlayer} deducted ${actionPoints} point${actionPoints === 1 ? '' : 's'} from ${targetPlayer}.`);
        break;
      
      case 'Swap':
        updatePlayerScore(currentPlayer, targetPlayerObj.score);
        updatePlayerScore(targetPlayer, currentPlayerObj.score);
        addLogEntry(`${currentPlayer} swapped scores with ${targetPlayer}.`);
        break;
    }
  };

  const quickAction = (playerName: string, action: 'add' | 'deduct' | 'swap') => {
    if (winner) return;

    const playerObj = players.find(p => p.name === playerName);
    if (!playerObj) return;

    switch (action) {
      case 'add':
        updatePlayerScore(playerName, playerObj.score + 1);
        addLogEntry(`${playerName} added 1 point to self.`);
        break;
      
      case 'deduct':
        updatePlayerScore(playerName, playerObj.score - 1);
        addLogEntry(`${playerName} deducted 1 point from self.`);
        break;
      
      case 'swap':
        // For quick swap, we'll need to implement a modal or simple swap with next player
        const currentIndex = players.findIndex(p => p.name === playerName);
        const nextIndex = (currentIndex + 1) % players.length;
        const nextPlayer = players[nextIndex];
        
        updatePlayerScore(playerName, nextPlayer.score);
        updatePlayerScore(nextPlayer.name, playerObj.score);
        addLogEntry(`${playerName} swapped scores with ${nextPlayer.name}.`);
        break;
    }
  };

  const resetGame = () => {
    setPlayers(prev => prev.map(player => ({ ...player, score: 0 })));
    setGameLog([]);
    setWinner(null);
    addLogEntry('Game reset. All scores set to 0.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Perfect 20</h1>
          <p className="text-gray-600">First player to reach exactly 20 points wins!</p>
        </div>

        {winner && <WinnerBanner winner={winner} onReset={resetGame} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Scoreboard 
              players={players} 
              onQuickAction={quickAction}
              gameEnded={!!winner}
            />
            <ActionPanel
              players={players}
              currentPlayer={currentPlayer}
              setCurrentPlayer={setCurrentPlayer}
              targetPlayer={targetPlayer}
              setTargetPlayer={setTargetPlayer}
              actionType={actionType}
              setActionType={setActionType}
              actionPoints={actionPoints}
              setActionPoints={setActionPoints}
              onApplyAction={applyAction}
              gameEnded={!!winner}
            />
          </div>
          
          <div>
            <GameLog gameLog={gameLog} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfect20Game;
