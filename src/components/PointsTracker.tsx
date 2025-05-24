
import { useState, useEffect } from 'react';
import PointsDisplay from './PointsDisplay';
import AddPointsForm from './AddPointsForm';
import PointsHistory from './PointsHistory';

export interface Transaction {
  id: string;
  type: 'add' | 'subtract';
  amount: number;
  description: string;
  timestamp: Date;
}

const PointsTracker = () => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPoints = localStorage.getItem('pointsTracker_points');
    const savedTransactions = localStorage.getItem('pointsTracker_transactions');
    
    if (savedPoints) {
      setCurrentPoints(parseInt(savedPoints));
    }
    
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        timestamp: new Date(t.timestamp)
      }));
      setTransactions(parsedTransactions);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('pointsTracker_points', currentPoints.toString());
  }, [currentPoints]);

  useEffect(() => {
    localStorage.setItem('pointsTracker_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (type: 'add' | 'subtract', amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      description: description || (type === 'add' ? 'Points added' : 'Points subtracted'),
      timestamp: new Date()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    if (type === 'add') {
      setCurrentPoints(prev => prev + amount);
    } else {
      setCurrentPoints(prev => Math.max(0, prev - amount));
    }
  };

  const clearHistory = () => {
    setTransactions([]);
    setCurrentPoints(0);
    localStorage.removeItem('pointsTracker_points');
    localStorage.removeItem('pointsTracker_transactions');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Points Tracker</h1>
        <p className="text-gray-600">Track your achievements and progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <PointsDisplay points={currentPoints} />
          <AddPointsForm onAddTransaction={addTransaction} />
        </div>
        
        <div>
          <PointsHistory 
            transactions={transactions} 
            onClearHistory={clearHistory}
          />
        </div>
      </div>
    </div>
  );
};

export default PointsTracker;
