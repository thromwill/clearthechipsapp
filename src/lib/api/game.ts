import { query, insert, update, subscribeToTable } from '@/lib/api/supabase/database';
import { Game, Play, Player } from '@/lib/types';
import { generateUUID, generateJoinCode, getCurrentTimestamp } from '@/lib/utils';

interface GameMessage {
  user_id: string;
  first_name: string;
  last_name: string;
  timestamp: number;
  content: string;
}

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
    join_code: generateJoinCode(),
    created: getCurrentTimestamp(),
    messages: JSON.stringify([]),
  };
  return await insert<Game>('GAME', newGame);
};

export const updateGame = async (gameId: string, gameData: Partial<Game>): Promise<Game> => {
  return await update<Game>('GAME', 'game_id', gameId, gameData);
};

export const createGameMessage = (player: Player, action: string): GameMessage => {
  return {
    user_id: player.player_id,
    first_name: player.first_name || '',
    last_name: player.last_name || '',
    timestamp: Date.now(),
    content: `${player.first_name} ${action}`
  };
};

export const addMessageToGame = async (gameId: string, message: GameMessage): Promise<void> => {
  const game = await getGameById(gameId);
  const messages = JSON.parse(game.messages || '[]');
  messages.push(message);
  await updateGame(gameId, { messages: JSON.stringify(messages) });
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
    is_currently_playing: true,
  };
  await insert<Play>('PLAYS', newPlay);
  await addMessageToGame(gameId, createGameMessage(player, "joined the game!"));
};

export const removePlayerFromGame = async (gameId: string, playerId: string): Promise<void> => {
  await update<Play>('PLAYS', 'player_id', playerId, { 
    is_currently_playing: false,
    game_id: gameId
  });
  const [player] = await query<Player>('PLAYER', { eq: ['player_id', playerId] });
  await addMessageToGame(gameId, createGameMessage(player, "left the game."));
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