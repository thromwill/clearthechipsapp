import { query, upsert, remove, subscribeToTable } from './supabase/database';
import { Play, Player } from '@/lib/types';
import { createGameMessage, addMessageToGame } from './game';

export const getPlaysByPlayerId = async (playerId: string): Promise<Play[]> => {
  return await query<Play>('PLAYS', {
    select: '*',
    eq: ['player_id', playerId]
  });
};

export const getPlaysByGameId = async (gameId: string): Promise<Play[]> => {
  return await query<Play>('PLAYS', {
    select: '*, PLAYER(*)',
    eq: ['game_id', gameId]
  });
};

export const createOrUpdatePlay = async (playData: Partial<Play>, newAmount?: number): Promise<Play> => {
  const play = await upsert<Play>('PLAYS', playData, 'player_id,game_id');

  if (newAmount !== undefined) {
    const [player] = await query<Player>('PLAYER', { eq: ['player_id', playData.player_id] });
    if (playData.buyin !== undefined) {
      await addMessageToGame(playData.game_id!, createGameMessage(player, `purchased $${newAmount.toFixed(2)} in chips`));
    }
    if (playData.cashout !== undefined) {
      await addMessageToGame(playData.game_id!, createGameMessage(player, `cashed out for $${newAmount.toFixed(2)}`));
    }
  }

  return play;
};

export const removePlay = async (playerId: string, gameId: string): Promise<void> => {
  await remove('PLAYS', 'player_id', playerId);
  await remove('PLAYS', 'game_id', gameId);
};

export const subscribeToPlays = (gameId: string, callback: (payload: any) => void) => {
  return subscribeToTable('PLAYS', (payload) => {
    if (payload.new.game_id === gameId) {
      callback(payload);
    }
  });
};