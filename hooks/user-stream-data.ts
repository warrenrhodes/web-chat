// hooks/useStreamData.ts
import { useState, useEffect } from "react";

interface StreamOptions {
  onError?: (error: any) => void;
  initialData?: any;
}

export function useStreamData<T>(url: string, options: StreamOptions = {}) {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        options.onError?.(err);
      }
    };

    eventSource.onerror = (err) => {
      setError(err as any);
      setLoading(false);
      options.onError?.(err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return { data, error, loading };
}
