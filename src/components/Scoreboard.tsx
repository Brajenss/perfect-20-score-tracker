
import { Plus, Minus, RotateCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Player } from './Perfect20Game';
import { useState } from 'react';

interface ScoreboardProps {
  players: Player[];
  onQuickAction: (playerName: string, action: 'add' | 'deduct' | 'swap', points?: number) => void;
  gameEnded: boolean;
}

const Scoreboard = ({ players, onQuickAction, gameEnded }: ScoreboardProps) => {
  const [playerInputs, setPlayerInputs] = useState<Record<string, number>>(
    players.reduce((acc, player) => ({ ...acc, [player.name]: 1 }), {})
  );

  const getScoreColor = (score: number) => {
    if (score >= 20) return 'text-green-600 font-bold';
    if (score >= 15) return 'text-orange-600 font-semibold';
    return 'text-gray-800';
  };

  const getProgressColor = (score: number) => {
    if (score >= 20) return 'bg-green-500';
    if (score >= 15) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const handleInputChange = (playerName: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setPlayerInputs(prev => ({
        ...prev,
        [playerName]: Math.max(1, Math.min(5, numValue))
      }));
    }
  };

  const handleAdd = (playerName: string) => {
    onQuickAction(playerName, 'add', playerInputs[playerName]);
  };

  const handleDeduct = (playerName: string) => {
    onQuickAction(playerName, 'deduct', playerInputs[playerName]);
  };

  const canDeduct = (player: Player, points: number) => {
    return player.score >= points;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Scoreboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {players.map((player) => (
            <div 
              key={player.name}
              className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-20">
                  <h3 className="font-semibold text-gray-700">{player.name}</h3>
                </div>
                
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-2xl font-bold ${getScoreColor(player.score)}`}>
                      {player.score}
                    </span>
                    <span className="text-sm text-gray-500">/ 20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(player.score)}`}
                      style={{ width: `${(player.score / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAdd(player.name)}
                  disabled={gameEnded || player.score >= 20}
                  className="hover:bg-green-50 hover:border-green-300"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={playerInputs[player.name] || 1}
                  onChange={(e) => handleInputChange(player.name, e.target.value)}
                  disabled={gameEnded}
                  className="w-16 h-8 text-center text-sm"
                />
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeduct(player.name)}
                  disabled={gameEnded || !canDeduct(player, playerInputs[player.name] || 1)}
                  className="hover:bg-red-50 hover:border-red-300"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onQuickAction(player.name, 'swap')}
                  disabled={gameEnded}
                  className="hover:bg-blue-50 hover:border-blue-300"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Scoreboard;
