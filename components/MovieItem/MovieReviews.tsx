import { useGetReviews } from "@/hooks/use-get-reviews";
import { useEffect } from "react";
import { Star, User, Calendar, MessageSquare } from "lucide-react";
import { formatDate, truncateContent } from "@/lib/utils";
import RenderStars from "../ui/RenderStars";

interface Review {
  id: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string;
    rating: number;
  };
  content: string;
  created_at: string;
}

const MovieReviews = ({ id }: { id: string }) => {
  const { reviews, loading, error, getReviews } = useGetReviews();

  useEffect(() => {
    getReviews(id);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6 text-white" />
        <h2 className="text-2xl font-bold text-white">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 text-lg">
            No reviews available for this movie.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {reviews.map((review: Review) => (
            <div
              key={review.id}
              className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all duration-200 hover:bg-black/50"
            >
              {/* Author Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  {review.author_details.avatar_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w64${review.author_details.avatar_path}`}
                      alt={
                        review.author_details.name ||
                        review.author_details.username
                      }
                      className="h-12 w-12 rounded-full object-cover border-2 border-white/20"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className={`flex h-12 w-12 rounded-full bg-gradient-to-br from-primary/60 to-primary items-center justify-center border-2 border-white/20`}
                  >
                    <User className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-lg leading-tight">
                      {review.author_details.name ||
                        review.author_details.username}
                    </h3>
                    {review.author_details.name &&
                      review.author_details.username && (
                        <span className="text-white/60 text-sm">
                          @{review.author_details.username}
                        </span>
                      )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-white/60">
                    {review.author_details.rating && (
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5">
                          <RenderStars rating={review.author_details.rating} />
                        </div>
                        <span className="ml-1 font-medium">
                          {(review.author_details.rating / 2).toFixed(1)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="text-white/90 leading-relaxed">
                <p className="whitespace-pre-wrap">
                  {truncateContent(review.content)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieReviews;
