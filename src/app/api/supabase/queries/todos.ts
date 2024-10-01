import { supabase } from '../client';
import { useState } from 'react';

export const Todos = () => {
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*');

    if (error) {
      setError(new Error('Error fetching todos: ' + error.message));
    } else {
      console.log("Hello from the API");
      console.log(data);
      setTodos(data);
    }

    setLoading(false);
  };

  // Return fetchTodos function so it can be triggered manually, along with the state
  return { todos, loading, error, fetchTodos };
};
