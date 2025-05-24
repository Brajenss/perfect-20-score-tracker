
import { Plus, Minus, RotateCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Player } from './Perfect20Game';

interface ScoreboardProps {
  players: Player[];
  onQuickAction: (playerName: string, action: 'add' | 'deduct' | 'swap') => void;
  gameEnded: boolean;
}

const Scoreboard = ({ players, onQuickAction, gameEnded }: ScoreboardProps) => {
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
                <div className="w-16">
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
                  onClick={() => onQuickAction(player.name, 'add')}
                  disabled={gameEnded || player.score >= 20}
                  className="hover:bg-green-50 hover:border-green-300"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onQuickAction(player.name, 'deduct')}
                  disabled={gameEnded || player.score <= 0}
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
