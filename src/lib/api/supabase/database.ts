import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function query<T>(
  table: string,
  query: {
    select?: string;
    eq?: [string, any];
    order?: [string, 'asc' | 'desc'];
    limit?: number;
    is?: [string, any];
  }
): Promise<T[]> {
  let dbQuery = supabase.from(table).select(query.select || '*');

  if (query.eq) {
    dbQuery = dbQuery.eq(query.eq[0], query.eq[1]);
  }

  if (query.is) {
    dbQuery = dbQuery.is(query.is[0], query.is[1]);
  }

  if (query.order) {
    dbQuery = dbQuery.order(query.order[0], { ascending: query.order[1] === 'asc' });
  }

  if (query.limit) {
    dbQuery = dbQuery.limit(query.limit);
  }

  const { data, error } = await dbQuery;

  if (error) {
    throw new Error(`Database query error: ${error.message}`);
  }

  return data as T[];
}

export async function insert<T>(
  table: string,
  data: Partial<T>
): Promise<T> {
  const { data: insertedData, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Database insert error: ${error.message}`);
  }

  return insertedData as T;
}

export async function update<T>(
  table: string,
  column: string,
  value: any,
  data: Partial<T>
): Promise<T> {
  const { data: updatedData, error } = await supabase
    .from(table)
    .update(data)
    .eq(column, value)
    .select()
    .single();

  if (error) {
    throw new Error(`Database update error: ${error.message}`);
  }

  return updatedData as T;
}

export async function remove(
  table: string,
  column: string,
  value: any
): Promise<void> {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq(column, value);

  if (error) {
    throw new Error(`Database delete error: ${error.message}`);
  }
}

export async function upsert<T>(
  table: string,
  data: Partial<T>,
  onConflict: string
): Promise<T> {
  const { data: upsertedData, error } = await supabase
    .from(table)
    .upsert(data, { onConflict })
    .select()
    .single();

  if (error) {
    throw new Error(`Database upsert error: ${error.message}`);
  }

  return upsertedData as T;
}

export function subscribeToTable(
  table: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`${table}_channel`)
    .on('postgres_changes', { event: '*', schema: 'public', table: table }, callback)
    .subscribe();
}