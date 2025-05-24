
import { useEffect, useState } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';

interface PointsDisplayProps {
  points: number;
}

const PointsDisplay = ({ points }: PointsDisplayProps) => {
  const [animatedPoints, setAnimatedPoints] = useState(points);

  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 60;
    const stepValue = (points - animatedPoints) / steps;
    
    if (Math.abs(stepValue) < 0.1) {
      setAnimatedPoints(points);
      return;
    }

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedPoints(points);
        clearInterval(timer);
      } else {
        setAnimatedPoints(prev => prev + stepValue);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [points]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-lg font-medium text-gray-600 mb-2">Current Points</h2>
        
        <div className="relative">
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            {Math.round(animatedPoints).toLocaleString()}
          </div>
          
          {points > 0 && (
            <div className="inline-flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              Keep it up!
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Total points accumulated
          </p>
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay;
