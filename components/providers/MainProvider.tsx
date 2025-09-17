"use client";

import { useEffect } from "react";

const MainProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_AUTH_THE_MOVIE_DB;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_ACCESS}`,
      },
    };

    if (!url) return;

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.error(err));
  }, []);

  return <div>{children}</div>;
};

export default MainProvider;
