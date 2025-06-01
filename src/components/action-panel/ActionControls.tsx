
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ActionControlsProps {
  actionType: 'Add to Target' | 'Deduct' | 'Swap' | 'Steal';
  actionPoints: number;
  onActionPointsChange: (points: number) => void;
  onApplyAction: () => void;
  isActionDisabled: boolean;
  gameEnded: boolean;
}

const ActionControls = ({
  actionType,
  actionPoints,
  onActionPointsChange,
  onApplyAction,
  isActionDisabled,
  gameEnded
}: ActionControlsProps) => {
  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
      onActionPointsChange(numValue);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-end gap-4">
      <div className="space-y-2 flex-1 w-full">
        <label className="text-sm font-semibold text-slate-700">
          Points (1-10)
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
        disabled={isActionDisabled}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto h-12"
      >
        Apply Action
      </Button>
    </div>
  );
};

export default ActionControls;
