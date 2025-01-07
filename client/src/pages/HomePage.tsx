import { useState } from "react";
import { ClubGrid } from "@/components/ClubGrid";
import { SubmissionForm } from "@/components/SubmissionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function HomePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const heroImages = [
    "https://images.unsplash.com/photo-1510364771322-50dbd1441861",
    "https://images.unsplash.com/photo-1509473730112-1cb48705018f",
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368",
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Discover Sports Clubs in Your Municipality
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find and connect with local sports clubs and organizations in your area
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">Register Your Club</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Register Your Sports Club</DialogTitle>
                </DialogHeader>
                <SubmissionForm />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-12">
            {heroImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="Sports club activity"
                className="rounded-lg object-cover h-48 w-full"
              />
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <ClubGrid />
      </main>
    </div>
  );
}
