"use client";

import { useGetItem } from "@/hooks/use-get-item";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useGetVideo } from "@/hooks/use-get-video";

const MoviePage = () => {
  const { id } = useParams();
  const { item, loading, error, getItem } = useGetItem();
  const {
    video,
    loading: videoLoading,
    error: videoError,
    getVideo,
    trailer,
  } = useGetVideo();

  useEffect(() => {
    if (id) {
      getItem(id as string);
      getVideo(id as string);
    }
  }, [id]);

  const unmuteIframe = () => {
    const iframe = document.getElementById("yt-bg") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        '{"event":"command","func":"unMute","args":""}',
        "*"
      );
    }
  };

  useEffect(() => {
    if (item && video && trailer) {
      // Delay to ensure iframe is fully loaded
      const timer = setTimeout(() => {
        unmuteIframe();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [item, video, trailer]);

  if (loading || videoLoading) return <div>Loading...</div>;
  if (error || videoError) return <div>Error: {error.message}</div>;
  if (!item || !video) return <div>Movie not found</div>;

  return (
    <div>
      <div className="fixed scale-[1.35] top-0 left-0 w-screen h-screen overflow-hidden -z-10">
        <iframe
          className="absolute top-1/2 left-1/2 w-[177.77vh] h-[100vh] -translate-x-1/2 -translate-y-1/2"
          src={`https://www.youtube-nocookie.com/embed/${trailer?.key}?autoplay=1&mute=1&loop=1&playlist=${trailer?.key}&enablejsapi=1&controls=0&rel=0&modestbranding=1&disablekb=1`}
          allow="autoplay; fullscreen"
          title="Trailer Background"
          id="yt-bg"
        />
      </div>
    </div>
  );
};

export default MoviePage;
