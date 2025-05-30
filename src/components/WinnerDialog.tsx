import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Trophy } from 'lucide-react';
import Confetti from './Confetti';
import { useEffect } from 'react';

interface WinnerDialogProps {
  isOpen: boolean;
  winner: string;
  onNewGame: () => void;
  onClose: () => void;
}

const WinnerDialog = ({ isOpen, winner, onNewGame, onClose }: WinnerDialogProps) => {
  useEffect(() => {
    if (isOpen && winner) {
      const message = `${winner} wins Perfect 20!`;
      
      // Use Web Speech API to announce the winner with an Indian male voice
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Try to find an Indian male voice
        const voices = speechSynthesis.getVoices();
        const indianMaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('indian') ||
          voice.name.toLowerCase().includes('hindi') ||
          voice.name.toLowerCase().includes('ravi') ||
          voice.name.toLowerCase().includes('raj') ||
          voice.name.toLowerCase().includes('male') ||
          (voice.lang.includes('en-IN') && voice.name.toLowerCase().includes('male')) ||
          voice.lang.includes('en-IN') ||
          (voice.name.toLowerCase().includes('en') && voice.name.toLowerCase().includes('male'))
        );
        
        if (indianMaleVoice) {
          utterance.voice = indianMaleVoice;
        }
        
        // Small delay to ensure the dialog is visible
        setTimeout(() => {
          speechSynthesis.speak(utterance);
        }, 500);
      }
    }
  }, [isOpen, winner]);

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
            
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {winner} wins Perfect 20!
            </h2>
            
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={onNewGame}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 shadow-lg"
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
