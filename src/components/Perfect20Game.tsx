
import { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
  gameNumber: number;
}

const Perfect20Game = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [targetPlayer, setTargetPlayer] = useState('');
  const [actionType, setActionType] = useState<'Add to Target' | 'Deduct' | 'Swap' | 'Steal'>('Add to Target');
  const [actionPoints, setActionPoints] = useState(1);
  const [gameLog, setGameLog] = useState<GameAction[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [wins, setWins] = useState<Record<string, number>>({});
  const [showSetup, setShowSetup] = useState(true);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'txt'>('txt');
  const [currentGameNumber, setCurrentGameNumber] = useState(1);

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
      setCurrentGameNumber(gameState.currentGameNumber || 1);
    }
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    if (players.length > 0) {
      const gameState = {
        players,
        gameLog,
        wins,
        currentGameNumber
      };
      localStorage.setItem('perfect20_game', JSON.stringify(gameState));
    }
  }, [players, gameLog, wins, currentGameNumber]);

  // Check for winner whenever scores change
  useEffect(() => {
    const winningPlayer = players.find(player => player.score >= 20);
    if (winningPlayer && !winner) {
      setWinner(winningPlayer.name);
      setShowWinnerDialog(true);
      
      // Log the win automatically
      addLogEntry(`${winningPlayer.name} wins Game ${currentGameNumber}.`);
      
      // Update wins count
      setWins(prev => ({
        ...prev,
        [winningPlayer.name]: (prev[winningPlayer.name] || 0) + 1
      }));
    }
  }, [players, winner, currentGameNumber]);

  const handlePlayersSetup = (playerNames: string[]) => {
    const newPlayers = playerNames.map(name => ({ name, score: 0 }));
    setPlayers(newPlayers);
    setCurrentPlayer(newPlayers[0].name);
    setTargetPlayer(newPlayers.length > 1 ? newPlayers[1].name : newPlayers[0].name);
    setActionPoints(1);
    setShowSetup(false);
    addLogEntry('Game started with players: ' + playerNames.join(', '));
  };

  const addLogEntry = (description: string) => {
    const newAction: GameAction = {
      id: Date.now().toString(),
      timestamp: new Date(),
      description,
      gameNumber: currentGameNumber
    };
    setGameLog(prev => [newAction, ...prev]);
  };

  const updatePlayerScore = (playerName: string, newScore: number) => {
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
    return stealer && target && stealer.score < target.score;
  };

  const applyAction = () => {
    if (winner) return;

    const currentPlayerObj = players.find(p => p.name === currentPlayer);
    const targetPlayerObj = players.find(p => p.name === targetPlayer);

    if (!currentPlayerObj || !targetPlayerObj) return;

    switch (actionType) {
      case 'Add to Target':
        if (currentPlayerObj.score < targetPlayerObj.score) {
          updatePlayerScore(targetPlayer, targetPlayerObj.score + actionPoints);
          addLogEntry(`${currentPlayer} added ${actionPoints} point${actionPoints === 1 ? '' : 's'} to ${targetPlayer}.`);
        }
        break;
      
      case 'Deduct':
        if (currentPlayerObj.score < targetPlayerObj.score && targetPlayerObj.score >= actionPoints) {
          updatePlayerScore(targetPlayer, targetPlayerObj.score - actionPoints);
          addLogEntry(`${currentPlayer} deducted ${actionPoints} point${actionPoints === 1 ? '' : 's'} from ${targetPlayer}.`);
        }
        break;
      
      case 'Swap':
        if (currentPlayerObj.score < targetPlayerObj.score) {
          updatePlayerScore(currentPlayer, targetPlayerObj.score);
          updatePlayerScore(targetPlayer, currentPlayerObj.score);
          addLogEntry(`${currentPlayer} swapped scores with ${targetPlayer}.`);
        }
        break;

      case 'Steal':
        if (canStealFrom(currentPlayer, targetPlayer) && targetPlayerObj.score >= actionPoints) {
          updatePlayerScore(currentPlayer, currentPlayerObj.score + actionPoints);
          updatePlayerScore(targetPlayer, targetPlayerObj.score - actionPoints);
          addLogEntry(`${currentPlayer} stole ${actionPoints} point${actionPoints === 1 ? '' : 's'} from ${targetPlayer}.`);
        }
        break;
    }
  };

  const quickAction = (playerName: string, action: 'add' | 'deduct', points: number = 1) => {
    if (winner) return;

    const playerObj = players.find(p => p.name === playerName);
    if (!playerObj) return;

    switch (action) {
      case 'add':
        updatePlayerScore(playerName, playerObj.score + points);
        addLogEntry(`${playerName} added ${points} point${points === 1 ? '' : 's'} to self.`);
        break;
      
      case 'deduct':
        if (playerObj.score >= points) {
          updatePlayerScore(playerName, playerObj.score - points);
          addLogEntry(`${playerName} deducted ${points} point${points === 1 ? '' : 's'} from self.`);
        }
        break;
    }
  };

  const generateDownload = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    let content = `Perfect 20 Game Log\nGenerated on: ${currentDate} at ${currentTime}\n\n`;
    
    content += 'WINS TRACKER:\n';
    content += '=================\n';
    players.forEach(player => {
      content += `${player.name}: ${wins[player.name] || 0} wins\n`;
    });
    
    content += '\nGAME LOG:\n';
    content += '==========\n';
    if (gameLog.length === 0) {
      content += 'No actions recorded yet.\n';
    } else {
      gameLog.slice().reverse().forEach((action, index) => {
        const time = action.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        content += `${index + 1}. [Game ${action.gameNumber}] [${time}] ${action.description}\n`;
      });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perfect-20-game-log-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startNewGame = () => {
    // If there's no winner yet, erase logs from current game
    if (!winner) {
      setGameLog(prev => prev.filter(action => action.gameNumber !== currentGameNumber));
    } else {
      // If there was a winner, increment game number for next game
      setCurrentGameNumber(prev => prev + 1);
    }
    
    setPlayers(prev => prev.map(player => ({ ...player, score: 0 })));
    setWinner(null);
    setShowWinnerDialog(false);
    setActionPoints(1);
    
    // Add log entry for new game with correct game number
    const nextGameNumber = winner ? currentGameNumber + 1 : currentGameNumber;
    const newAction: GameAction = {
      id: Date.now().toString(),
      timestamp: new Date(),
      description: 'New game started. All scores reset to 0.',
      gameNumber: nextGameNumber
    };
    setGameLog(prev => [newAction, ...prev]);
    
    if (!winner) {
      // If no winner, stay on same game number
      // Game number already set correctly above
    } else {
      // Game number will be incremented above
    }
  };

  const resetEverything = () => {
    setPlayers([]);
    setGameLog([]);
    setWinner(null);
    setWins({});
    setShowSetup(true);
    setShowWinnerDialog(false);
    setActionPoints(1);
    setCurrentGameNumber(1);
    localStorage.removeItem('perfect20_game');
  };

  const closeWinnerDialog = () => {
    setShowWinnerDialog(false);
  };

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <PlayerSetupDialog 
          isOpen={showSetup} 
          onPlayersSetup={handlePlayersSetup}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full mb-4 shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Perfect 20</h1>
          <p className="text-slate-600 mb-4">First player to reach exactly 20 points wins!</p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              onClick={startNewGame}
              variant="outline"
              className="flex items-center gap-2 border-slate-300 hover:bg-slate-50"
            >
              <RefreshCw className="w-4 h-4" />
              New Game
            </Button>
            
            <Button 
              onClick={generateDownload}
              variant="outline"
              className="flex items-center gap-2 border-slate-300 hover:bg-slate-50"
            >
              <Download className="w-4 h-4" />
              Download Log (.txt)
            </Button>
            
            <Button 
              onClick={resetEverything}
              variant="destructive"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
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
        onClose={closeWinnerDialog}
      />
    </div>
  );
};

export default Perfect20Game;
