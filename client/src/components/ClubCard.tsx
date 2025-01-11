import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import type { Club } from "@db/schema";
import { ReviewList } from "./ReviewList";
import { ReviewForm } from "./ReviewForm";

export function ClubCard({ club }: { club: Club }) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{club.name}</h3>
          <Badge variant="outline">{club.municipality}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{club.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{club.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{club.email}</span>
          </div>
          <p className="mt-4 text-foreground">{club.description}</p>

          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto font-medium hover:bg-transparent"
                  onClick={() => setIsReviewDialogOpen(prevState => !prevState)}
                >
                  Reviews {club.reviewCount > 0 && `(${club.reviewCount})`}
                  {club.averageRating > 0 && (
                    <div className="flex items-center ml-2">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="ml-1">{club.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </Button>
              </div>
              <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                  </DialogHeader>
                  <ReviewForm
                    clubId={club.id}
                    onSuccess={() => setIsReviewDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            {isReviewDialogOpen && <div className="mt-4"><ReviewList clubId={club.id} /></div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}