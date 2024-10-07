import { query, insert, update, remove, upsert, subscribeToTable } from '@/lib/api/supabase/database';
import { Game, Play, Player } from '@/lib/types';
import { generateUUID, getCurrentTimestamp } from '@/lib/utils';

export const getGameById = async (gameId: string): Promise<Game> => {
  const [game] = await query<Game>('GAME', { eq: ['game_id', gameId] });
  if (!game) throw new Error('Game not found');
  return game;
};

export const getGameByJoinCode = async (joinCode: string): Promise<Game> => {
  const [game] = await query<Game>('GAME', { 
    eq: ['join_code', joinCode],
    is: ['completed', null]
  });
  if (!game) throw new Error('Game not found');
  return game;
};

export const createGame = async (gameData: Partial<Game>): Promise<Game> => {
  const newGame: Partial<Game> = {
    ...gameData,
    game_id: generateUUID(),
    join_code: generateUUID().substring(0, 6).toUpperCase(),
    created: getCurrentTimestamp(),
    completed: undefined
  };
  return await insert<Game>('GAME', newGame);
};

export const updateGame = async (gameId: string, gameData: Partial<Game>): Promise<Game> => {
  return await update<Game>('GAME', 'game_id', gameId, gameData);
};

export const getPlayersInGame = async (gameId: string): Promise<Play[]> => {
  return await query<Play>('PLAYS', { eq: ['game_id', gameId] });
};

export const addPlayerToGame = async (gameId: string, player: Player): Promise<void> => {
  const newPlay: Partial<Play> = {
    player_id: player.player_id,
    game_id: gameId,
    buyin: 0,
    cashout: 0,
    currently_playing: true,
    is_cashed_out: false
  };
  await insert<Play>('PLAYS', newPlay);
};

export const removePlayerFromGame = async (gameId: string, playerId: string): Promise<void> => {
  await remove('PLAYS', 'player_id', playerId);
};

export const updatePlayerInGame = async (gameId: string, playerId: string, playData: Partial<Play>): Promise<void> => {
  await update<Play>('PLAYS', 'player_id', playerId, playData);
};

export const completeGame = async (gameId: string): Promise<void> => {
  await updateGame(gameId, { completed: getCurrentTimestamp() });
};

export const subscribeToGame = (gameId: string, callback: (payload: any) => void) => {
  return subscribeToTable('GAME', (payload) => {
    if (payload.new.game_id === gameId) {
      callback(payload);
    }
  });
};

export const subscribeToPlays = (gameId: string, callback: (payload: any) => void) => {
  return subscribeToTable('PLAYS', (payload) => {
    if (payload.new.game_id === gameId) {
      callback(payload);
    }
  });
};