
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Player } from './Perfect20Game';

interface ActionPanelProps {
  players: Player[];
  currentPlayer: string;
  setCurrentPlayer: (player: string) => void;
  targetPlayer: string;
  setTargetPlayer: (player: string) => void;
  actionType: 'Add to Target' | 'Deduct' | 'Swap' | 'Steal';
  setActionType: (type: 'Add to Target' | 'Deduct' | 'Swap' | 'Steal') => void;
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
  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
      setActionPoints(numValue);
    }
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
    const currentPlayerObj = players.find(p => p.name === currentPlayer);
    const availablePlayers = players.filter(player => player.name !== currentPlayer);
    
    if (actionType === 'Add to Target') {
      return availablePlayers.filter(player => 
        currentPlayerObj && currentPlayerObj.score < player.score
      );
    }
    
    if (actionType === 'Steal') {
      return availablePlayers.filter(player => 
        currentPlayerObj && currentPlayerObj.score < player.score && player.score >= actionPoints
      );
    }
    
    if (actionType === 'Deduct') {
      return availablePlayers.filter(player => 
        currentPlayerObj && currentPlayerObj.score < player.score && player.score >= actionPoints
      );
    }
    
    if (actionType === 'Swap') {
      return availablePlayers.filter(player => 
        currentPlayerObj && currentPlayerObj.score < player.score
      );
    }
    
    return availablePlayers;
  };

  const isActionDisabled = () => {
    if (gameEnded) return true;
    
    const currentPlayerObj = players.find(p => p.name === currentPlayer);
    const targetPlayerObj = players.find(p => p.name === targetPlayer);
    
    if (!currentPlayerObj || !targetPlayerObj) return true;
    
    if (actionType === 'Add to Target') {
      return currentPlayerObj.score >= targetPlayerObj.score;
    }
    
    if (actionType === 'Steal') {
      return !canStealFrom(currentPlayer, targetPlayer) || targetPlayerObj.score < actionPoints;
    }
    
    if (actionType === 'Deduct') {
      return currentPlayerObj.score >= targetPlayerObj.score || targetPlayerObj.score < actionPoints;
    }
    
    if (actionType === 'Swap') {
      return currentPlayerObj.score >= targetPlayerObj.score;
    }
    
    return false;
  };

  const getActionMessage = () => {
    const currentPlayerObj = players.find(p => p.name === currentPlayer);
    const targetPlayerObj = players.find(p => p.name === targetPlayer);
    
    if (!currentPlayerObj || !targetPlayerObj) return '';
    
    if (actionType === 'Add to Target') {
      if (currentPlayerObj.score >= targetPlayerObj.score) {
        return `${currentPlayer} cannot add points to ${targetPlayer} (your score must be lower than target)`;
      }
      return `${currentPlayer} will add ${actionPoints} point${actionPoints === 1 ? '' : 's'} to ${targetPlayer}`;
    }
    
    if (actionType === 'Deduct') {
      if (currentPlayerObj.score >= targetPlayerObj.score) {
        return `${currentPlayer} cannot deduct points from ${targetPlayer} (your score must be lower than target)`;
      }
      if (targetPlayerObj.score < actionPoints) {
        return `${targetPlayer} doesn't have enough points to deduct ${actionPoints}`;
      }
      return `${actionPoints} point${actionPoints === 1 ? '' : 's'} will be deducted from ${targetPlayer}`;
    }
    
    if (actionType === 'Swap') {
      if (currentPlayerObj.score >= targetPlayerObj.score) {
        return `${currentPlayer} cannot swap score with ${targetPlayer} (your score must be lower than target)`;
      }
      return `${currentPlayer} and ${targetPlayer} will swap their scores`;
    }

    if (actionType === 'Steal') {
      if (!canStealFrom(currentPlayer, targetPlayer)) {
        return `${currentPlayer} cannot steal points from ${targetPlayer} (your score must be lower than target)`;
      }
      if (targetPlayerObj.score < actionPoints) {
        return `${targetPlayer} doesn't have enough points for ${currentPlayer} to steal ${actionPoints}`;
      }
      return `${currentPlayer} will steal ${actionPoints} point${actionPoints === 1 ? '' : 's'} from ${targetPlayer}`;
    }
    
    return '';
  };

  return (
    <Card className="shadow-xl border-slate-300 bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          🎮 Action Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Current Player</label>
            <Select value={currentPlayer} onValueChange={handleCurrentPlayerChange} disabled={gameEnded}>
              <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
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
            <label className="text-sm font-semibold text-slate-700">Target Player</label>
            <Select value={targetPlayer} onValueChange={handleTargetPlayerChange} disabled={gameEnded}>
              <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
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
            <label className="text-sm font-semibold text-slate-700">Action Type</label>
            <Select value={actionType} onValueChange={(value: 'Add to Target' | 'Deduct' | 'Swap' | 'Steal') => setActionType(value)} disabled={gameEnded}>
              <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Add to Target">🎁 Add to Target</SelectItem>
                <SelectItem value="Deduct">⚡ Deduct from Target</SelectItem>
                <SelectItem value="Swap">🔄 Swap Scores</SelectItem>
                <SelectItem value="Steal">🎯 Steal Points</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="space-y-2 flex-1 w-full">
            <label className="text-sm font-semibold text-slate-700">
              Points (1-10) {(actionType === 'Swap') && '(ignored for swap)'}
            </label>
            <Select
              value={actionPoints.toString()}
              onValueChange={handlePointsChange}
              disabled={gameEnded || actionType === 'Swap'}
            >
              <SelectTrigger className="w-full border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-center font-bold text-lg h-12">
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
          </div>

          <Button 
            onClick={onApplyAction}
            disabled={isActionDisabled()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto h-12"
          >
            Apply Action
          </Button>
        </div>

        <p className="text-sm text-slate-600 mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          {getActionMessage()}
        </p>
      </CardContent>
    </Card>
  );
};

export default ActionPanel;
