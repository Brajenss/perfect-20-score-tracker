
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

  const handlePlayerNameChange = (index: number, name: string) => {
    // Limit to 5 characters
    const truncatedName = name.slice(0, 5);
    
    const newNames = [...playerNames];
    newNames[index] = truncatedName;
    setPlayerNames(newNames);

    // Check for duplicate names (case-insensitive)
    const newErrors = [...nameErrors];
    const trimmedName = truncatedName.trim().toLowerCase();
    
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

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-center">
            {step === 'count' ? 'How many players?' : 'Enter player names'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'count' ? (
          <Card className="flex-1">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Number of players (2-10)
                  </label>
                  <Input
                    type="number"
                    min="2"
                    max="10"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(e.target.value)}
                    placeholder="Enter number of players"
                    className="mt-2"
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
          <Card className="flex-1 min-h-0">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-3 pb-20 max-h-[60vh]">
                {playerNames.map((name, index) => (
                  <div key={index} className="pb-2">
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Player {index + 1} name (max 5 characters)
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                      placeholder={`Enter name for player ${index + 1}`}
                      className={`${nameErrors[index] ? 'border-red-500' : ''}`}
                      maxLength={5}
                    />
                    {nameErrors[index] && (
                      <p className="text-sm text-red-500 mt-1">{nameErrors[index]}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t bg-white sticky bottom-0">
                <Button 
                  onClick={handleNamesSubmit}
                  disabled={!canProceed}
                  className="w-full"
                >
                  Start Game
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSetupDialog;
