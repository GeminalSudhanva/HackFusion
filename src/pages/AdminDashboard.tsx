import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Navigate } from "react-router-dom";
import { Users, ShieldCheck, Mail, Phone, School, ClipboardList, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  const { data: teams, isLoading, error } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: () => API.adminFetchTeams(),
    enabled: !!user && user.role === "admin",
  });

  if (loading) return <div className="pt-24 text-center">Checking authorization...</div>;
  if (!user || user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all registered teams and registrations</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading teams data...</div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">Error loading data. Make sure you are an admin.</div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden border border-border/50">
          <Table>
            <TableCaption>A list of all teams in the hackathon.</TableCaption>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[200px]">Team Name</TableHead>
                <TableHead>Leader</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead className="text-right">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams?.map((team: any) => (
                <TableRow key={team.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{team.teamName}</span>
                      <span className="text-xs text-muted-foreground">Code: {team.teamCode}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {team.leader.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {team.leader.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {team.leader.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {team.members.length} / {team.maxSize}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {team.registration ? (
                      <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1 capitalize">
                        <CheckCircle2 className="h-3 w-3" />
                        {team.registration.status}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground gap-1">
                        <Clock className="h-3 w-3" />
                        Not Started
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {team.registration?.domain || <span className="text-muted-foreground text-sm">—</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    {team.registration ? (
                      <div className="flex flex-col items-end">
                        <Badge 
                          className={`gap-1 capitalize ${
                            team.registration.paymentStatus === 'verified' 
                              ? 'bg-green-500/10 text-green-500' 
                              : team.registration.paymentStatus === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {team.registration.paymentStatus}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground mt-1">UTR: {team.registration.utrNumber}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {teams?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No teams have been created yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
