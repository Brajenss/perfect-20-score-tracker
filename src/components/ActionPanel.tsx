
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Player } from './Perfect20Game';
import PlayerSelectors from './action-panel/PlayerSelectors';
import ActionTypeSelector from './action-panel/ActionTypeSelector';
import ActionControls from './action-panel/ActionControls';
import ActionMessage from './action-panel/ActionMessage';
import { useActionPanelLogic } from './action-panel/useActionPanelLogic';

interface ActionPanelProps {
  players: Player[];
  currentPlayer: string;
  setCurrentPlayer: (player: string) => void;
  targetPlayer: string;
  setTargetPlayer: (player: string) => void;
  actionType: 'Add to Target' | 'Deduct' | 'Swap' | 'Steal';
  setActionType: (type: 'Add to Target' | 'Deduct' | 'Swap' | 'Steal') => void;
  actionPoints: number;
  setActionPoints: (points: number) => void;
  onApplyAction: () => void;
  gameEnded: boolean;
  canStealFrom: (stealer: string, target: string) => boolean;
}

const ActionPanel = ({
  players,
  currentPlayer,
  setCurrentPlayer,
  targetPlayer,
  setTargetPlayer,
  actionType,
  setActionType,
  actionPoints,
  setActionPoints,
  onApplyAction,
  gameEnded,
  canStealFrom
}: ActionPanelProps) => {
  const {
    handleCurrentPlayerChange,
    handleTargetPlayerChange,
    getAvailableTargetPlayers,
    isActionDisabled,
    getActionMessage
  } = useActionPanelLogic({
    players,
    currentPlayer,
    targetPlayer,
    actionType,
    actionPoints,
    gameEnded,
    canStealFrom,
    setCurrentPlayer,
    setTargetPlayer
  });

  return (
    <Card className="shadow-xl border-slate-300 bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          🎮 Action Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <PlayerSelectors
            players={players}
            currentPlayer={currentPlayer}
            targetPlayer={targetPlayer}
            onCurrentPlayerChange={handleCurrentPlayerChange}
            onTargetPlayerChange={handleTargetPlayerChange}
            getAvailableTargetPlayers={getAvailableTargetPlayers}
            gameEnded={gameEnded}
          />
          
          <ActionTypeSelector
            actionType={actionType}
            onActionTypeChange={setActionType}
            gameEnded={gameEnded}
          />
        </div>

        <ActionControls
          actionType={actionType}
          actionPoints={actionPoints}
          onActionPointsChange={setActionPoints}
          onApplyAction={onApplyAction}
          isActionDisabled={isActionDisabled()}
          gameEnded={gameEnded}
        />

        <ActionMessage message={getActionMessage()} />
      </CardContent>
    </Card>
  );
};

export default ActionPanel;
