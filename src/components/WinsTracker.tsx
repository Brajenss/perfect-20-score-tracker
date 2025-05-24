
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface WinsTrackerProps {
  players: string[];
  wins: Record<string, number>;
}

const WinsTracker = ({ players, wins }: WinsTrackerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Wins Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((playerName) => (
            <div 
              key={playerName}
              className="flex items-center justify-between p-3 rounded-lg border bg-white"
            >
              <span className="font-medium text-gray-700">{playerName}</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple-600">
                  {wins[playerName] || 0}
                </span>
                <span className="text-sm text-gray-500">wins</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WinsTracker;
