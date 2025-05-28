
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Player } from '../Perfect20Game';

interface PlayerSelectorsProps {
  players: Player[];
  currentPlayer: string;
  targetPlayer: string;
  onCurrentPlayerChange: (player: string) => void;
  onTargetPlayerChange: (player: string) => void;
  getAvailableTargetPlayers: () => Player[];
  gameEnded: boolean;
}

const PlayerSelectors = ({
  players,
  currentPlayer,
  targetPlayer,
  onCurrentPlayerChange,
  onTargetPlayerChange,
  getAvailableTargetPlayers,
  gameEnded
}: PlayerSelectorsProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Current Player</label>
        <Select value={currentPlayer} onValueChange={onCurrentPlayerChange} disabled={gameEnded}>
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
        <Select value={targetPlayer} onValueChange={onTargetPlayerChange} disabled={gameEnded}>
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
    </>
  );
};

export default PlayerSelectors;
