import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent } from './ui/card';

interface PlayerSetupDialogProps {
  isOpen: boolean;
  onPlayersSetup: (playerNames: string[]) => void;
}

const PlayerSetupDialog = ({ isOpen, onPlayersSetup }: PlayerSetupDialogProps) => {
  const [step, setStep] = useState<'count' | 'names'>('count');
  const [playerCount, setPlayerCount] = useState('');
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [nameErrors, setNameErrors] = useState<string[]>([]);

  const handlePlayerCountSubmit = () => {
    const count = parseInt(playerCount);
    if (count && count >= 2 && count <= 10) {
      setPlayerNames(Array(count).fill(''));
      setNameErrors(Array(count).fill(''));
      setStep('names');
    }
  };

  const formatName = (name: string) => {
    // Remove all non-alphabetic characters and limit to 10 characters
    const alphabetsOnly = name.replace(/[^a-zA-Z]/g, '').slice(0, 10);
    
    // Capitalize first letter and make rest lowercase
    if (alphabetsOnly.length > 0) {
      return alphabetsOnly.charAt(0).toUpperCase() + alphabetsOnly.slice(1).toLowerCase();
    }
    return alphabetsOnly;
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const formattedName = formatName(name);
    
    const newNames = [...playerNames];
    newNames[index] = formattedName;
    setPlayerNames(newNames);

    const newErrors = [...nameErrors];
    const trimmedName = formattedName.trim().toLowerCase();
    
    if (trimmedName === '') {
      newErrors[index] = '';
    } else {
      const isDuplicate = newNames.some((otherName, otherIndex) => 
        otherIndex !== index && 
        otherName.trim().toLowerCase() === trimmedName
      );
      newErrors[index] = isDuplicate ? 'This name is already taken' : '';
    }
    
    setNameErrors(newErrors);
  };

  const handleNamesSubmit = () => {
    const hasEmptyNames = playerNames.some(name => name.trim() === '');
    const hasErrors = nameErrors.some(error => error !== '');
    
    if (!hasEmptyNames && !hasErrors) {
      onPlayersSetup(playerNames.map(name => name.trim()));
      setStep('count');
      setPlayerCount('');
      setPlayerNames([]);
      setNameErrors([]);
    }
  };

  const canProceed = step === 'count' 
    ? playerCount && parseInt(playerCount) >= 2 && parseInt(playerCount) <= 10
    : playerNames.every(name => name.trim() !== '') && nameErrors.every(error => error === '');

  // Calculate dynamic height based on number of players
  const getDialogHeight = () => {
    if (step === 'count') return 'h-auto';
    const baseHeight = 200; // Header + button area
    const playerInputHeight = 80; // Each player input with spacing
    const calculatedHeight = baseHeight + (playerNames.length * playerInputHeight);
    const maxHeight = Math.min(calculatedHeight, window.innerHeight * 0.9);
    return `max-h-[${maxHeight}px]`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className={`sm:max-w-md w-[95vw] ${step === 'count' ? 'h-auto' : 'h-[85vh]'} flex flex-col`}>
        <DialogHeader className="flex-shrink-0 pb-3">
          <DialogTitle className="text-center text-lg">
            {step === 'count' ? 'How many players?' : 'Enter player names'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'count' ? (
          <Card className="flex-shrink-0">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Number of players (2-10)
                  </label>
                  <Input
                    type="number"
                    min="2"
                    max="10"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(e.target.value)}
                    placeholder="Enter number"
                    className="text-center"
                  />
                </div>
                <Button 
                  onClick={handlePlayerCountSubmit}
                  disabled={!canProceed}
                  className="w-full"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-2 py-1">
              <div className="space-y-3 pb-4">
                {playerNames.map((name, index) => (
                  <div key={index} className="space-y-1">
                    <label className="text-xs font-medium text-gray-700 block">
                      Player {index + 1}
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                      placeholder={`Enter name`}
                      className={`${nameErrors[index] ? 'border-red-500' : ''} text-sm`}
                      maxLength={10}
                      style={{ fontSize: '14px' }}
                    />
                    {nameErrors[index] && (
                      <p className="text-xs text-red-500">{nameErrors[index]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-shrink-0 p-3 border-t bg-white">
              <Button 
                onClick={handleNamesSubmit}
                disabled={!canProceed}
                className="w-full text-sm"
              >
                Start Game
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSetupDialog;
