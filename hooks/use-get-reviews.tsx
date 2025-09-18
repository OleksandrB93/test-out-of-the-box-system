import { useState, useCallback } from "react";

export const useGetReviews = () => {
  const [reviews, setReviews] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const getReviews = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${id}/reviews`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_ACCESS}`,
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();

      setReviews(data.results);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reviews,
    loading,
    error,
    getReviews,
  };
};
