
import { useState, useEffect } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import Scoreboard from './Scoreboard';
import ActionPanel from './ActionPanel';
import GameLog from './GameLog';
import WinsTracker from './WinsTracker';
import PlayerSetupDialog from './PlayerSetupDialog';
import WinnerDialog from './WinnerDialog';

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
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [targetPlayer, setTargetPlayer] = useState('');
  const [actionType, setActionType] = useState<'Add' | 'Deduct' | 'Swap' | 'Steal'>('Add');
  const [actionPoints, setActionPoints] = useState(1);
  const [gameLog, setGameLog] = useState<GameAction[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [wins, setWins] = useState<Record<string, number>>({});
  const [showSetup, setShowSetup] = useState(true);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);

  // Load game state from localStorage
  useEffect(() => {
    const savedGame = localStorage.getItem('perfect20_game');
    if (savedGame) {
      const gameState = JSON.parse(savedGame);
      if (gameState.players && gameState.players.length > 0) {
        setPlayers(gameState.players);
        setCurrentPlayer(gameState.players[0].name);
        setTargetPlayer(gameState.players[0].name);
        setShowSetup(false);
      }
      setGameLog(gameState.gameLog?.map((action: any) => ({
        ...action,
        timestamp: new Date(action.timestamp)
      })) || []);
      setWins(gameState.wins || {});
    }
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    if (players.length > 0) {
      const gameState = {
        players,
        gameLog,
        wins
      };
      localStorage.setItem('perfect20_game', JSON.stringify(gameState));
    }
  }, [players, gameLog, wins]);

  // Check for winner whenever scores change
  useEffect(() => {
    const winningPlayer = players.find(player => player.score >= 20);
    if (winningPlayer && !winner) {
      setWinner(winningPlayer.name);
      setShowWinnerDialog(true);
      
      // Update wins count
      setWins(prev => ({
        ...prev,
        [winningPlayer.name]: (prev[winningPlayer.name] || 0) + 1
      }));
    }
  }, [players, winner]);

  const handlePlayersSetup = (playerNames: string[]) => {
    const newPlayers = playerNames.map(name => ({ name, score: 0 }));
    setPlayers(newPlayers);
    setCurrentPlayer(newPlayers[0].name);
    setTargetPlayer(newPlayers[0].name);
    setShowSetup(false);
    addLogEntry('Game started with players: ' + playerNames.join(', '));
  };

  const addLogEntry = (description: string) => {
    const newAction: GameAction = {
      id: Date.now().toString(),
      timestamp: new Date(),
      description
    };
    setGameLog(prev => [newAction, ...prev]);
  };

  const updatePlayerScore = (playerName: string, newScore: number) => {
    // If score goes above 20, reset to 15
    const adjustedScore = newScore > 20 ? 15 : Math.max(0, newScore);
    
    setPlayers(prev => prev.map(player => 
      player.name === playerName 
        ? { ...player, score: adjustedScore }
        : player
    ));

    if (newScore > 20) {
      addLogEntry(`${playerName}'s score went above 20 and was reset to 15.`);
    }
  };

  const canStealFrom = (stealerName: string, targetName: string) => {
    const stealer = players.find(p => p.name === stealerName);
    const target = players.find(p => p.name === targetName);
    return stealer && target && stealer.score > target.score;
  };

  const applyAction = () => {
    if (winner) return;

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

      case 'Steal':
        if (canStealFrom(currentPlayer, targetPlayer)) {
          updatePlayerScore(currentPlayer, currentPlayerObj.score + actionPoints);
          updatePlayerScore(targetPlayer, targetPlayerObj.score - actionPoints);
          addLogEntry(`${currentPlayer} stole ${actionPoints} point${actionPoints === 1 ? '' : 's'} from ${targetPlayer}.`);
        }
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
        const currentIndex = players.findIndex(p => p.name === playerName);
        const nextIndex = (currentIndex + 1) % players.length;
        const nextPlayer = players[nextIndex];
        
        updatePlayerScore(playerName, nextPlayer.score);
        updatePlayerScore(nextPlayer.name, playerObj.score);
        addLogEntry(`${playerName} swapped scores with ${nextPlayer.name}.`);
        break;
    }
  };

  const startNewGame = () => {
    setPlayers(prev => prev.map(player => ({ ...player, score: 0 })));
    setWinner(null);
    setShowWinnerDialog(false);
    addLogEntry('New game started. All scores reset to 0.');
  };

  const resetEverything = () => {
    setPlayers([]);
    setGameLog([]);
    setWinner(null);
    setWins({});
    setShowSetup(true);
    setShowWinnerDialog(false);
    localStorage.removeItem('perfect20_game');
  };

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <PlayerSetupDialog 
          isOpen={showSetup} 
          onPlayersSetup={handlePlayersSetup}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Perfect 20</h1>
          <p className="text-gray-600 mb-4">First player to reach exactly 20 points wins!</p>
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={startNewGame}
              disabled={!winner}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Game
            </Button>
            
            <Button 
              onClick={resetEverything}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Everything
            </Button>
          </div>
        </div>

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
              canStealFrom={canStealFrom}
            />
          </div>
          
          <div className="space-y-6">
            <GameLog gameLog={gameLog} />
            <WinsTracker 
              players={players.map(p => p.name)} 
              wins={wins} 
            />
          </div>
        </div>
      </div>

      <WinnerDialog 
        isOpen={showWinnerDialog}
        winner={winner || ''}
        onNewGame={startNewGame}
      />
    </div>
  );
};

export default Perfect20Game;
