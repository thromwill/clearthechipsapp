import { query, upsert, remove } from './supabase/database';
import { Play } from '@/lib/types';

export const getPlaysByGameId = async (gameId: string): Promise<Play[]> => {
  return await query<Play>('PLAYS', {
    select: '*, PLAYER(*)',
    eq: ['game_id', gameId]
  });
};

export const createOrUpdatePlay = async (playData: Partial<Play>): Promise<Play> => {
  return await upsert<Play>('PLAYS', playData, 'player_id,game_id');
};

export const removePlay = async (playerId: string, gameId: string): Promise<void> => {
  await remove('PLAYS', 'player_id', playerId);
  await remove('PLAYS', 'game_id', gameId);
};