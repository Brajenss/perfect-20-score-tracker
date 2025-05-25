
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Trophy } from 'lucide-react';
import Confetti from './Confetti';

interface WinnerDialogProps {
  isOpen: boolean;
  winner: string;
  onNewGame: () => void;
  onClose: () => void;
}

const WinnerDialog = ({ isOpen, winner, onNewGame, onClose }: WinnerDialogProps) => {
  return (
    <>
      {isOpen && <Confetti />}
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="text-center text-slate-800">
              🎉 Game Over! 🎉
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {winner} wins Perfect 20!
            </h2>
            
            <p className="text-slate-600 mb-6">
              Congratulations on reaching exactly 20 points!
            </p>
            
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={onNewGame}
                className="bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 text-white px-6 shadow-lg"
              >
                New Game
              </Button>
              
              <Button 
                onClick={onClose}
                variant="outline"
                className="px-6 border-slate-300 hover:bg-slate-50"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WinnerDialog;
