import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail } from "lucide-react";
import type { Club } from "@db/schema";

export function ClubCard({ club }: { club: Club }) {
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
        </div>
      </CardContent>
    </Card>
  );
}
