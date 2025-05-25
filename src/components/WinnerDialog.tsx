
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
      const message = `${winner} wins Perfect 20! Congratulations on reaching exactly 20 points!`;
      
      // Use Web Speech API to announce the winner with a realistic female voice
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        // Try to find a female voice that sounds natural
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('susan') ||
          voice.name.toLowerCase().includes('alex') ||
          voice.name.toLowerCase().includes('aria') ||
          voice.name.toLowerCase().includes('sarah') ||
          voice.name.toLowerCase().includes('natural') ||
          (voice.name.toLowerCase().includes('en') && voice.gender === 'female')
        );
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
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
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {winner} wins Perfect 20!
            </h2>
            
            <p className="text-slate-600 mb-6">
              Congratulations on reaching exactly 20 points!
            </p>
            
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
