import { useState } from "react";

export const useGetItem = () => {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const getItem = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${id}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_ACCESS}`,
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();
      setItem(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    item,
    loading,
    error,
    getItem,
  };
};
