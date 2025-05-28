
import { Player } from '../Perfect20Game';

interface UseActionPanelLogicProps {
  players: Player[];
  currentPlayer: string;
  targetPlayer: string;
  actionType: 'Add to Target' | 'Deduct' | 'Swap' | 'Steal';
  actionPoints: number;
  gameEnded: boolean;
  canStealFrom: (stealer: string, target: string) => boolean;
  setCurrentPlayer: (player: string) => void;
  setTargetPlayer: (player: string) => void;
}

export const useActionPanelLogic = ({
  players,
  currentPlayer,
  targetPlayer,
  actionType,
  actionPoints,
  gameEnded,
  canStealFrom,
  setCurrentPlayer,
  setTargetPlayer
}: UseActionPanelLogicProps) => {
  const handleCurrentPlayerChange = (player: string) => {
    setCurrentPlayer(player);
    // If target player is same as current player, change target to a different player
    if (player === targetPlayer) {
      const otherPlayer = players.find(p => p.name !== player);
      if (otherPlayer) {
        setTargetPlayer(otherPlayer.name);
      }
    }
  };

  const handleTargetPlayerChange = (player: string) => {
    // Don't allow same player selection
    if (player !== currentPlayer) {
      setTargetPlayer(player);
    }
  };

  const getAvailableTargetPlayers = () => {
    const currentPlayerObj = players.find(p => p.name === currentPlayer);
    const availablePlayers = players.filter(player => player.name !== currentPlayer);
    
    if (actionType === 'Add to Target') {
      return availablePlayers.filter(player => 
        currentPlayerObj && currentPlayerObj.score < player.score
      );
    }
    
    if (actionType === 'Steal') {
      return availablePlayers.filter(player => 
        currentPlayerObj && currentPlayerObj.score < player.score && player.score >= actionPoints
      );
    }
    
    if (actionType === 'Deduct') {
      return availablePlayers.filter(player => 
        currentPlayerObj && currentPlayerObj.score < player.score && player.score >= actionPoints
      );
    }
    
    if (actionType === 'Swap') {
      return availablePlayers.filter(player => 
        currentPlayerObj && currentPlayerObj.score < player.score
      );
    }
    
    return availablePlayers;
  };

  const isActionDisabled = () => {
    if (gameEnded) return true;
    
    const currentPlayerObj = players.find(p => p.name === currentPlayer);
    const targetPlayerObj = players.find(p => p.name === targetPlayer);
    
    if (!currentPlayerObj || !targetPlayerObj) return true;
    
    if (actionType === 'Add to Target') {
      return currentPlayerObj.score >= targetPlayerObj.score;
    }
    
    if (actionType === 'Steal') {
      return !canStealFrom(currentPlayer, targetPlayer) || targetPlayerObj.score < actionPoints;
    }
    
    if (actionType === 'Deduct') {
      return currentPlayerObj.score >= targetPlayerObj.score || targetPlayerObj.score < actionPoints;
    }
    
    if (actionType === 'Swap') {
      return currentPlayerObj.score >= targetPlayerObj.score;
    }
    
    return false;
  };

  const getActionMessage = () => {
    const currentPlayerObj = players.find(p => p.name === currentPlayer);
    const targetPlayerObj = players.find(p => p.name === targetPlayer);
    
    if (!currentPlayerObj || !targetPlayerObj) return '';
    
    if (actionType === 'Add to Target') {
      if (currentPlayerObj.score >= targetPlayerObj.score) {
        return `${currentPlayer} cannot add points to ${targetPlayer} (your score must be lower than target)`;
      }
      return `${currentPlayer} will add ${actionPoints} point${actionPoints === 1 ? '' : 's'} to ${targetPlayer}`;
    }
    
    if (actionType === 'Deduct') {
      if (currentPlayerObj.score >= targetPlayerObj.score) {
        return `${currentPlayer} cannot deduct points from ${targetPlayer} (your score must be lower than target)`;
      }
      if (targetPlayerObj.score < actionPoints) {
        return `${targetPlayer} doesn't have enough points to deduct ${actionPoints}`;
      }
      return `${actionPoints} point${actionPoints === 1 ? '' : 's'} will be deducted from ${targetPlayer}`;
    }
    
    if (actionType === 'Swap') {
      if (currentPlayerObj.score >= targetPlayerObj.score) {
        return `${currentPlayer} cannot swap score with ${targetPlayer} (your score must be lower than target)`;
      }
      return `${currentPlayer} and ${targetPlayer} will swap their scores`;
    }

    if (actionType === 'Steal') {
      if (!canStealFrom(currentPlayer, targetPlayer)) {
        return `${currentPlayer} cannot steal points from ${targetPlayer} (your score must be lower than target)`;
      }
      if (targetPlayerObj.score < actionPoints) {
        return `${targetPlayer} doesn't have enough points for ${currentPlayer} to steal ${actionPoints}`;
      }
      return `${currentPlayer} will steal ${actionPoints} point${actionPoints === 1 ? '' : 's'} from ${targetPlayer}`;
    }
    
    return '';
  };

  return {
    handleCurrentPlayerChange,
    handleTargetPlayerChange,
    getAvailableTargetPlayers,
    isActionDisabled,
    getActionMessage
  };
};
