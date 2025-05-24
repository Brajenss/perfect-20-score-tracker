
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Trophy } from 'lucide-react';
import Confetti from './Confetti';

interface WinnerDialogProps {
  isOpen: boolean;
  winner: string;
  onNewGame: () => void;
}

const WinnerDialog = ({ isOpen, winner, onNewGame }: WinnerDialogProps) => {
  return (
    <>
      {isOpen && <Confetti />}
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              🎉 Game Over! 🎉
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {winner} wins Perfect 20!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Congratulations on reaching exactly 20 points!
            </p>
            
            <Button 
              onClick={onNewGame}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8"
            >
              Start New Game
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WinnerDialog;
