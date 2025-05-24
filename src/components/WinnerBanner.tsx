
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Trophy, RotateCcw } from 'lucide-react';

interface WinnerBannerProps {
  winner: string;
  onReset: () => void;
}

const WinnerBanner = ({ winner, onReset }: WinnerBannerProps) => {
  return (
    <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            🎉 {winner} wins with 20 points!
          </h2>
          
          <p className="text-gray-600 mb-4">
            Congratulations on reaching the perfect score!
          </p>
          
          <Button 
            onClick={onReset}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WinnerBanner;
