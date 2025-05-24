
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { GameAction } from './Perfect20Game';

interface GameLogProps {
  gameLog: GameAction[];
}

const GameLog = ({ gameLog }: GameLogProps) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📝 Game Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {gameLog.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No actions yet. Start playing!</p>
          ) : (
            gameLog.map((action) => (
              <div 
                key={action.id}
                className="flex items-start gap-2 p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="text-green-600 font-bold">✓</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 break-words">{action.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(action.timestamp)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameLog;
