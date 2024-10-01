import { useState, useEffect } from 'react';

interface DatabaseQueryProps {
  queryFunction: () => Promise<any>;
  render: (data: any, loading: boolean, error: Error | null) => JSX.Element;
}

const DatabaseQuery = ({ queryFunction, render }: DatabaseQueryProps) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await queryFunction();
        setData(result);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryFunction]);

  return render(data, loading, error);
};

export default DatabaseQuery;
