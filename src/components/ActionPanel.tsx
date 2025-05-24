
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Player } from './Perfect20Game';

interface ActionPanelProps {
  players: Player[];
  currentPlayer: string;
  setCurrentPlayer: (player: string) => void;
  targetPlayer: string;
  setTargetPlayer: (player: string) => void;
  actionType: 'Add' | 'Deduct' | 'Swap';
  setActionType: (type: 'Add' | 'Deduct' | 'Swap') => void;
  actionPoints: number;
  setActionPoints: (points: number) => void;
  onApplyAction: () => void;
  gameEnded: boolean;
}

const ActionPanel = ({
  players,
  currentPlayer,
  setCurrentPlayer,
  targetPlayer,
  setTargetPlayer,
  actionType,
  setActionType,
  actionPoints,
  setActionPoints,
  onApplyAction,
  gameEnded
}: ActionPanelProps) => {
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setActionPoints(Math.max(1, Math.min(10, value)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎮 Action Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Current Player</label>
            <Select value={currentPlayer} onValueChange={setCurrentPlayer} disabled={gameEnded}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.name} value={player.name}>
                    {player.name} ({player.score})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Target Player</label>
            <Select value={targetPlayer} onValueChange={setTargetPlayer} disabled={gameEnded}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.name} value={player.name}>
                    {player.name} ({player.score})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Action Type</label>
            <Select value={actionType} onValueChange={(value: 'Add' | 'Deduct' | 'Swap') => setActionType(value)} disabled={gameEnded}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Add">➕ Add Points</SelectItem>
                <SelectItem value="Deduct">➖ Deduct Points</SelectItem>
                <SelectItem value="Swap">🔄 Swap Scores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-end gap-4">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700">
              Points (1-10) {actionType === 'Swap' && '(ignored for swap)'}
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              value={actionPoints}
              onChange={handlePointsChange}
              disabled={gameEnded || actionType === 'Swap'}
              className="w-full"
            />
          </div>

          <Button 
            onClick={onApplyAction}
            disabled={gameEnded}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8"
          >
            Apply Action
          </Button>
        </div>

        {actionType === 'Add' && (
          <p className="text-sm text-gray-600 mt-2">
            {actionPoints} point{actionPoints === 1 ? '' : 's'} will be added to {currentPlayer}
          </p>
        )}
        
        {actionType === 'Deduct' && (
          <p className="text-sm text-gray-600 mt-2">
            {actionPoints} point{actionPoints === 1 ? '' : 's'} will be deducted from {targetPlayer}
          </p>
        )}
        
        {actionType === 'Swap' && (
          <p className="text-sm text-gray-600 mt-2">
            {currentPlayer} and {targetPlayer} will swap their scores
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionPanel;
