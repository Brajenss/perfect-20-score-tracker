
import { Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
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
              <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                {/* Player Name - Fixed width to prevent sliding */}
                <div className="col-span-3">
                  <h3 className="font-medium text-slate-700 text-sm truncate" title={player.name}>
                    {player.name}
                  </h3>
                </div>
                
                {/* Score Display - Fixed width */}
                <div className="col-span-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xl font-bold ${getScoreColor(player.score)}`}>
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

                {/* Controls - Fixed width and positioned */}
                <div className="col-span-5 flex items-center justify-end space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAdd(player.name)}
                    disabled={gameEnded || player.score >= 20}
                    className="w-9 h-9 p-0 hover:bg-emerald-50 hover:border-emerald-300 border-slate-300"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  
                  <Select
                    value={playerInputs[player.name]?.toString() || '1'}
                    onValueChange={(value) => handleInputChange(player.name, value)}
                    disabled={gameEnded}
                  >
                    <SelectTrigger className="w-16 h-9 text-center text-sm border-slate-300 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeduct(player.name)}
                    disabled={gameEnded || !canDeduct(player, playerInputs[player.name] || 1)}
                    className="w-9 h-9 p-0 hover:bg-red-50 hover:border-red-300 border-slate-300"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="sm:hidden">
                {/* Player Name Row - Higher height and smaller font */}
                <div className="mb-4 h-8 flex items-center">
                  <h3 className="font-medium text-slate-700 text-base truncate" title={player.name}>
                    {player.name}
                  </h3>
                </div>
                
                {/* Score and Controls Row - Positioned lower */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <span className={`text-2xl font-bold ${getScoreColor(player.score)}`}>
                      {player.score}/20
                    </span>
                    <div className="w-full bg-slate-200 rounded-full h-3 mt-2">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(player.score)}`}
                        style={{ width: `${(player.score / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAdd(player.name)}
                      disabled={gameEnded || player.score >= 20}
                      className="w-10 h-10 p-0 hover:bg-emerald-50 hover:border-emerald-300 border-slate-300"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    
                    <Select
                      value={playerInputs[player.name]?.toString() || '1'}
                      onValueChange={(value) => handleInputChange(player.name, value)}
                      disabled={gameEnded}
                    >
                      <SelectTrigger className="w-14 h-10 text-center text-sm border-slate-300 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeduct(player.name)}
                      disabled={gameEnded || !canDeduct(player, playerInputs[player.name] || 1)}
                      className="w-10 h-10 p-0 hover:bg-red-50 hover:border-red-300 border-slate-300"
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
