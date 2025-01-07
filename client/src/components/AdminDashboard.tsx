import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Club } from "@db/schema";

export function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingClubs, isLoading } = useQuery<Club[]>({
    queryKey: ['/api/clubs/pending'],
  });

  const validateMutation = useMutation({
    mutationFn: async (clubId: number) => {
      const response = await fetch(`/api/clubs/${clubId}/validate`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clubs/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clubs'] });
      toast({
        title: "Success",
        description: "Club has been validated and published.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (clubId: number) => {
      const response = await fetch(`/api/clubs/${clubId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clubs/pending'] });
      toast({
        title: "Success",
        description: "Club has been rejected.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pending Clubs</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Municipality</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingClubs?.map((club) => (
            <TableRow key={club.id}>
              <TableCell>{club.name}</TableCell>
              <TableCell>{club.municipality}</TableCell>
              <TableCell>
                {club.email}<br />
                {club.phone}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => validateMutation.mutate(club.id)}
                  >
                    Validate
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => rejectMutation.mutate(club.id)}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pendingClubs?.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No pending clubs to review
        </div>
      )}
    </div>
  );
}
