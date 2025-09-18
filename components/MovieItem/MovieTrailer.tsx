interface MovieTrailerProps {
  trailer: {
    key: string;
    id?: number;
    name?: string;
    site?: string;
    type?: string;
    official?: boolean;
  } | null;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

const MovieTrailer = ({ trailer, iframeRef }: MovieTrailerProps) => {
  return (
    <div className="fixed scale-[1.35] top-0 left-0 w-screen h-screen overflow-hidden -z-10">
      <iframe
        ref={iframeRef}
        className="absolute top-1/2 left-1/2 w-[177.77vh] h-[100vh] -translate-x-1/2 -translate-y-1/2"
        src={`https://www.youtube-nocookie.com/embed/${trailer?.key}?autoplay=1&mute=1&loop=1&playlist=${trailer?.key}&enablejsapi=1&controls=0&rel=0&modestbranding=0&disablekb=1`}
        allow="autoplay; fullscreen"
        title="Trailer Background"
        id="yt-bg"
      />
    </div>
  );
};

export default MovieTrailer;
