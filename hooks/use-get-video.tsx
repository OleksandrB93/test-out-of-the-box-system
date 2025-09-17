import { useState } from "react";

interface Video {
  id: number;
  name: string;
  key: string;
  site: string;
  type: string;
  official: boolean;
}

export const useGetVideo = () => {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trailer, setTrailer] = useState<Video | null>(null);

  const getVideo = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${id}/videos`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_ACCESS}`,
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();

      const trailer = data.results.find(
        (item: Video) => item.official === true && item.type === "Trailer"
      );

      setVideo(data);
      setTrailer(trailer);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  return {
    video,
    loading,
    error,
    getVideo,
    trailer,
  };
};
