
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ActionTypeSelectorProps {
  actionType: 'Add to Target' | 'Deduct' | 'Swap' | 'Steal';
  onActionTypeChange: (type: 'Add to Target' | 'Deduct' | 'Swap' | 'Steal') => void;
  gameEnded: boolean;
}

const ActionTypeSelector = ({ actionType, onActionTypeChange, gameEnded }: ActionTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">Action Type</label>
      <Select value={actionType} onValueChange={onActionTypeChange} disabled={gameEnded}>
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
  );
};

export default ActionTypeSelector;
