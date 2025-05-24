
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

  const handlePlayerCountSubmit = () => {
    const count = parseInt(playerCount);
    if (count && count >= 2 && count <= 10) {
      setPlayerNames(Array(count).fill(''));
      setStep('names');
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleNamesSubmit = () => {
    if (playerNames.every(name => name.trim() !== '')) {
      onPlayersSetup(playerNames);
      setStep('count');
      setPlayerCount('');
      setPlayerNames([]);
    }
  };

  const canProceed = step === 'count' 
    ? playerCount && parseInt(playerCount) >= 2 && parseInt(playerCount) <= 10
    : playerNames.every(name => name.trim() !== '');

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 'count' ? 'How many players?' : 'Enter player names'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'count' ? (
          <Card>
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
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {playerNames.map((name, index) => (
                  <div key={index}>
                    <label className="text-sm font-medium text-gray-700">
                      Player {index + 1} name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                      placeholder={`Enter name for player ${index + 1}`}
                      className="mt-1"
                    />
                  </div>
                ))}
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
