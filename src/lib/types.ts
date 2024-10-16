export interface Player {
  player_id: string;
  org_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar_id?: string;
  games_played?: number;
  games_won?: number;
  games_lost?: number;
  total_buyin?: number;
  total_cashout?: number;
}

export interface ChipCase {
  case_id: string;
  player_id?: string;
  case_name?: string;
  chips?: any;
}

export interface Game {
  game_id: string;
  game_name?: string;
  host_id?: string;
  case_id?: string;
  join_code?: string;
  big_blind?: number;
  created?: string;
  completed?: string;
  chip_values?: any;
  messages?: any;
}

export interface Play {
  PLAYER?: Player;
  player_id: string;
  game_id: string;
  join_code?: string;
  buyin?: number;
  cashout?: number;
  is_currently_playing?: boolean;
  is_cashed_out?: boolean;
  new_buyin?: number;
  new_cashout?: number;
}

export interface Transaction {
  transaction_id: string;
  by_id?: string;
  for_id?: string;
  amount: number;
  created?: string;
  completed?: string;
  by?: { first_name: string; last_name: string };
  for?: { first_name: string; last_name: string };
}