"use client";

import Image from "next/image";

export interface ItemProps {
  item: {
    id?: number;
    poster_path?: string;
    title?: string;
    tagline?: string;
    vote_average?: number;
    vote_count?: number;
    release_date?: string;
    runtime?: number;
    genres?: any[];
    budget?: number;
    overview?: string;
  };
}

const MoviePoster = ({ item }: ItemProps) => {
  return (
    <div className="flex justify-center lg:justify-start">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
        <div className="relative backdrop-blur-sm bg-white/10 p-4 rounded-2xl border border-white/20 shadow-2xl">
          <Image
            src={`${process.env.NEXT_PUBLIC_URL_POSTER}${item.poster_path}`}
            alt={item.title || ""}
            width={400}
            height={600}
            className="rounded-xl shadow-2xl w-full max-w-sm mx-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default MoviePoster;
