import { query, update, upsert } from './supabase/database';
import { Player } from '@/lib/types';

export const getPlayerById = async (playerId: string): Promise<Player> => {
  const [player] = await query<Player>('PLAYER', { eq: ['org_id', playerId] });
  if (!player) throw new Error('Player not found');
  return player;
};

export const createOrUpdatePlayer = async (playerData: Partial<Player>): Promise<Player> => {
  return await upsert<Player>('PLAYER', playerData, 'player_id');
};

export const updatePlayerStats = async (playerId: string, stats: Partial<Player>): Promise<Player> => {
  return await update<Player>('PLAYER', 'player_id', playerId, stats);
};