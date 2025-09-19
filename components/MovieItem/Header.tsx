import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface HeaderProps {
  toggleSound: () => void;
  isMuted: boolean;
}

const Header = ({ toggleSound, isMuted }: HeaderProps) => {
  const router = useRouter();
  const [isScrollY, setIsScrollY] = useState(0);

  const OFFSET_SCROLL = 40;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed z-50 flex justify-between items-center p-4 transition-all duration-300",
        isScrollY > OFFSET_SCROLL
          ? "top-4 left-2 bg-black/50 w-[calc(100%-16px)] shadow-lg shadow-white/20 rounded-full"
          : "top-0 left-0 w-full"
      )}
    >
      <Button
        onClick={() => router.back()}
        className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 backdrop-blur-sm transition-all duration-200"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </Button>

      {isScrollY > OFFSET_SCROLL && (
        <div
          style={{
            fontFamily: "Star Wars",
            letterSpacing: "0.1em",
            textShadow: "0 0 5px #fbbf24, 0 0 5px #fbbf24, 0 0 7px #fbbf24",
          }}
          className="text-2xl font-bold text-center animate-pulse text-shadow-lg text-black"
        >
          **May the Force be with you!**
        </div>
      )}

      <Button
        onClick={toggleSound}
        className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 backdrop-blur-sm transition-all duration-200"
        variant="ghost"
        size="icon"
      >
        <div className="relative flex items-center justify-center">
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 text-white" />
          )}
        </div>
      </Button>
    </div>
  );
};

export default Header;
