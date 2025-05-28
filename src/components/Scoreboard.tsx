
import { Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Player } from './Perfect20Game';
import { useState } from 'react';

interface ScoreboardProps {
  players: Player[];
  onQuickAction: (playerName: string, action: 'add' | 'deduct', points?: number) => void;
  gameEnded: boolean;
}

const Scoreboard = ({ players, onQuickAction, gameEnded }: ScoreboardProps) => {
  const [playerInputs, setPlayerInputs] = useState<Record<string, number>>(
    players.reduce((acc, player) => ({ ...acc, [player.name]: 1 }), {})
  );

  const getScoreColor = (score: number) => {
    if (score >= 20) return 'text-emerald-600 font-bold';
    if (score >= 15) return 'text-amber-600 font-semibold';
    return 'text-slate-700';
  };

  const getProgressColor = (score: number) => {
    if (score >= 20) return 'bg-emerald-500';
    if (score >= 15) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  const handleInputChange = (playerName: string, value: string) => {
    // Allow empty input for better UX
    if (value === '') {
      setPlayerInputs(prev => ({
        ...prev,
        [playerName]: 1
      }));
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 5) {
      setPlayerInputs(prev => ({
        ...prev,
        [playerName]: numValue
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
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          🏆 Scoreboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {players.map((player) => (
            <div 
              key={player.name}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
            >
              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-24">
                    <h3 className="font-semibold text-slate-700">{player.name}</h3>
                  </div>
                  
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-3xl font-bold ${getScoreColor(player.score)}`}>
                        {player.score}
                      </span>
                      <span className="text-sm text-slate-500">/ 20</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(player.score)}`}
                        style={{ width: `${(player.score / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAdd(player.name)}
                    disabled={gameEnded || player.score >= 20}
                    className="hover:bg-emerald-50 hover:border-emerald-300 border-slate-300"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={playerInputs[player.name] || 1}
                    onChange={(e) => handleInputChange(player.name, e.target.value)}
                    onFocus={(e) => e.target.select()}
                    disabled={gameEnded}
                    className="w-16 h-9 text-center text-sm border-slate-300 focus:border-blue-500"
                  />
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeduct(player.name)}
                    disabled={gameEnded || !canDeduct(player, playerInputs[player.name] || 1)}
                    className="hover:bg-red-50 hover:border-red-300 border-slate-300"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="sm:hidden space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-700 text-lg">{player.name}</h3>
                  <span className={`text-2xl font-bold ${getScoreColor(player.score)}`}>
                    {player.score}/20
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(player.score)}`}
                    style={{ width: `${(player.score / 20) * 100}%` }}
                  />
                </div>

                <div className="flex justify-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAdd(player.name)}
                      disabled={gameEnded || player.score >= 20}
                      className="w-12 h-12 hover:bg-emerald-50 hover:border-emerald-300 border-slate-300"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={playerInputs[player.name] || 1}
                      onChange={(e) => handleInputChange(player.name, e.target.value)}
                      onFocus={(e) => e.target.select()}
                      disabled={gameEnded}
                      className="w-16 h-10 text-center text-sm border-slate-300 focus:border-blue-500"
                    />
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeduct(player.name)}
                      disabled={gameEnded || !canDeduct(player, playerInputs[player.name] || 1)}
                      className="w-12 h-12 hover:bg-red-50 hover:border-red-300 border-slate-300"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Scoreboard;
