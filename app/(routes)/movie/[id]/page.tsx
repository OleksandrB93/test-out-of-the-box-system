"use client";

import { useGetItem } from "@/hooks/use-get-item";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { useGetVideo } from "@/hooks/use-get-video";
import MovieItem from "@/components/MovieItem";

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

  const [isMuted, setIsMuted] = useState(true);
  const [canAutoplay, setCanAutoplay] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (id) {
      getItem(id as string);
      getVideo(id as string);
    }
  }, [id]);

  const sendYouTubeCommand = (command: string) => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        `{"event":"command","func":"${command}","args":""}`,
        "*"
      );
    }
  };

  const toggleSound = () => {
    if (isMuted) {
      sendYouTubeCommand("unMute");
      setIsMuted(false);
    } else {
      sendYouTubeCommand("mute");
      setIsMuted(true);
    }
  };

  // Check if autoplay with sound is possible
  useEffect(() => {
    const checkAutoplayCapability = async () => {
      try {
        // Create a test audio element to check autoplay policy
        const audio = new Audio();
        audio.muted = false;
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          await playPromise;
          setCanAutoplay(true);
          audio.pause();
        }
      } catch (error) {
        // Autoplay with sound is blocked
        setCanAutoplay(false);
      }
    };

    checkAutoplayCapability();
  }, []);

  useEffect(() => {
    if (trailer) {
      // Delay to ensure iframe is fully loaded
      const timer = setTimeout(() => {
        if (canAutoplay) {
          // Try to unmute automatically if autoplay is allowed
          sendYouTubeCommand("unMute");
          setIsMuted(false);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [trailer, canAutoplay]);

  if (loading || videoLoading) return <div>Loading...</div>;
  if (error || videoError) return <div>Error: {error.message}</div>;
  if (!item || !video) return <div>Movie not found</div>;

  return (
    <MovieItem
      item={item}
      trailer={trailer}
      isMuted={isMuted}
      toggleSound={toggleSound}
      iframeRef={iframeRef}
    />
  );
};

export default MoviePage;
