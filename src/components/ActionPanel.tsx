
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
  actionType: 'Add' | 'Deduct' | 'Swap' | 'Steal';
  setActionType: (type: 'Add' | 'Deduct' | 'Swap' | 'Steal') => void;
  actionPoints: number;
  setActionPoints: (points: number) => void;
  onApplyAction: () => void;
  gameEnded: boolean;
  canStealFrom: (stealer: string, target: string) => boolean;
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
  gameEnded,
  canStealFrom
}: ActionPanelProps) => {
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setActionPoints(Math.max(1, Math.min(10, value)));
  };

  const handleCurrentPlayerChange = (player: string) => {
    setCurrentPlayer(player);
    // If target player is same as current player, change target to a different player
    if (player === targetPlayer) {
      const otherPlayer = players.find(p => p.name !== player);
      if (otherPlayer) {
        setTargetPlayer(otherPlayer.name);
      }
    }
  };

  const handleTargetPlayerChange = (player: string) => {
    // Don't allow same player selection
    if (player !== currentPlayer) {
      setTargetPlayer(player);
    }
  };

  const getAvailableTargetPlayers = () => {
    if (actionType === 'Steal') {
      return players.filter(player => 
        player.name !== currentPlayer && canStealFrom(currentPlayer, player.name)
      );
    }
    return players.filter(player => player.name !== currentPlayer);
  };

  const isActionDisabled = () => {
    if (gameEnded) return true;
    if (actionType === 'Steal') {
      return !canStealFrom(currentPlayer, targetPlayer);
    }
    return false;
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
            <Select value={currentPlayer} onValueChange={handleCurrentPlayerChange} disabled={gameEnded}>
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
            <Select value={targetPlayer} onValueChange={handleTargetPlayerChange} disabled={gameEnded}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAvailableTargetPlayers().map((player) => (
                  <SelectItem key={player.name} value={player.name}>
                    {player.name} ({player.score})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Action Type</label>
            <Select value={actionType} onValueChange={(value: 'Add' | 'Deduct' | 'Swap' | 'Steal') => setActionType(value)} disabled={gameEnded}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Add">➕ Add Points</SelectItem>
                <SelectItem value="Deduct">➖ Deduct Points</SelectItem>
                <SelectItem value="Swap">🔄 Swap Scores</SelectItem>
                <SelectItem value="Steal">🎯 Steal Points</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-end gap-4">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700">
              Points (1-10) {(actionType === 'Swap') && '(ignored for swap)'}
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
            disabled={isActionDisabled()}
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

        {actionType === 'Steal' && (
          <p className="text-sm text-gray-600 mt-2">
            {canStealFrom(currentPlayer, targetPlayer) 
              ? `${currentPlayer} will steal ${actionPoints} point${actionPoints === 1 ? '' : 's'} from ${targetPlayer}`
              : `${currentPlayer} cannot steal from ${targetPlayer} (target score must be lower)`
            }
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionPanel;
