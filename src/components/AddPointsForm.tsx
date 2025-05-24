
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddPointsFormProps {
  onAddTransaction: (type: 'add' | 'subtract', amount: number, description: string) => void;
}

const AddPointsForm = ({ onAddTransaction }: AddPointsFormProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (type: 'add' | 'subtract') => {
    const pointAmount = parseInt(amount);
    if (isNaN(pointAmount) || pointAmount <= 0) {
      return;
    }

    onAddTransaction(type, pointAmount, description);
    setAmount('');
    setDescription('');
  };

  const quickActions = [
    { label: '+1', value: 1, type: 'add' as const },
    { label: '+5', value: 5, type: 'add' as const },
    { label: '+10', value: 10, type: 'add' as const },
    { label: '-1', value: 1, type: 'subtract' as const },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Update Points</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter points amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1"
            min="1"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description (optional)
          </Label>
          <Input
            id="description"
            type="text"
            placeholder="What did you earn points for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => handleSubmit('add')}
            disabled={!amount || parseInt(amount) <= 0}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Points
          </Button>
          
          <Button
            onClick={() => handleSubmit('subtract')}
            disabled={!amount || parseInt(amount) <= 0}
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Minus className="w-4 h-4 mr-2" />
            Subtract
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-3">Quick Actions</p>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                onClick={() => onAddTransaction(action.type, action.value, `Quick ${action.label}`)}
                variant="outline"
                size="sm"
                className={`text-xs ${
                  action.type === 'add' 
                    ? 'border-green-200 text-green-600 hover:bg-green-50' 
                    : 'border-red-200 text-red-600 hover:bg-red-50'
                }`}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPointsForm;
