import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import type { Review } from "@db/schema";

interface ReviewListProps {
  clubId: number;
}

export function ReviewList({ clubId }: ReviewListProps) {
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: [`/api/clubs/${clubId}/reviews`],
  });

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  if (!reviews?.length) {
    return <div className="text-muted-foreground">No reviews yet</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">{review.authorName}</div>
            <div className="flex items-center">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
              {Array.from({ length: 5 - review.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-muted-foreground" />
              ))}
            </div>
          </div>
          {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
          <div className="text-xs text-muted-foreground mt-2">
            {new Date(review.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
