import { getGameByJoinCode, updateGame } from './game';
import { createTransaction } from './transaction';
import { getCurrentTimestamp } from '@/lib/utils';
import { createOrUpdatePlay, removePlay, getPlaysByGameId } from './plays';

export const joinGame = async (playerId: string, joinCode: string) => {
  const game = await getGameByJoinCode(joinCode);
  if (!game) throw new Error('Game not found');

  const playData = {
    player_id: playerId,
    game_id: game.game_id,
    join_code: joinCode,
    currently_playing: true,
    is_cashed_out: false,
  };

  await createOrUpdatePlay(playData);
  return game;
};

export const leaveGame = async (playerId: string, gameId: string) => {
  await removePlay(playerId, gameId);
  const remainingPlayers = await getPlaysByGameId(gameId);
  
  if (remainingPlayers.length === 0) {
    await updateGame(gameId, { completed: getCurrentTimestamp() });
  }
};

export const buyIn = async (playerId: string, gameId: string, amount: number) => {
  await createOrUpdatePlay({
    player_id: playerId,
    game_id: gameId,
    buyin: amount,
    is_cashed_out: false,
  });

  await createTransaction({
    by_id: playerId,
    for_id: gameId,
    amount: amount,
  });
};

export const cashOut = async (playerId: string, gameId: string, amount: number) => {
  await createOrUpdatePlay({
    player_id: playerId,
    game_id: gameId,
    cashout: amount,
    is_cashed_out: true,
  });

  await createTransaction({
    by_id: gameId,
    for_id: playerId,
    amount: amount,
    completed: getCurrentTimestamp(),
  });
};