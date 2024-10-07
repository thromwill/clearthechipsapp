import { query, upsert, remove } from '@/lib/api/supabase/database';
import { ChipCase } from '@/lib/types';

export const getChipCasesByPlayerId = async (playerId: string): Promise<ChipCase[]> => {
  return await query<ChipCase>('CHIP_CASE', { eq: ['player_id', playerId] });
};

export const getChipCaseById = async (caseId: string): Promise<ChipCase> => {
  const [chipCase] = await query<ChipCase>('CHIP_CASE', { eq: ['case_id', caseId] });
  if (!chipCase) throw new Error('Chip case not found');
  return chipCase;
};

export const createOrUpdateChipCase = async (chipCaseData: Partial<ChipCase>): Promise<ChipCase> => {
  return await upsert<ChipCase>('CHIP_CASE', chipCaseData, 'case_id');
};

export const removeChipCase = async (caseId: string): Promise<void> => {
  await remove('CHIP_CASE', 'case_id', caseId);
}