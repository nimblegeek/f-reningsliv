import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClubCard } from "./ClubCard";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { Club } from "@db/schema";

export function ClubGrid() {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clubs, isLoading } = useQuery<Club[]>({
    queryKey: ['/api/clubs'],
  });

  const { data: municipalities } = useQuery<string[]>({
    queryKey: ['/api/municipalities'],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const filteredClubs = clubs?.filter(club => {
    const matchesMunicipality = selectedMunicipality === "all" || club.municipality === selectedMunicipality;
    const matchesSearch = !searchTerm || 
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMunicipality && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={selectedMunicipality}
          onValueChange={setSelectedMunicipality}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select municipality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All municipalities</SelectItem>
            {municipalities?.map(municipality => (
              <SelectItem key={municipality} value={municipality}>
                {municipality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-[300px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs?.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
}