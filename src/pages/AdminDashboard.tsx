import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Navigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Users, ShieldCheck, Mail, Phone, CheckCircle2, Clock, Package, Search, Filter, X, School } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [kitFilter, setKitFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");

  const { data: teams, isLoading, error } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: () => API.adminFetchTeams(),
    enabled: !!user && user.role === "admin",
  });

  const verifyMutation = useMutation({
    mutationFn: (registrationId: string) => API.adminVerifyPayment(registrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      toast({ title: "Payment Verified", description: "The team's payment status has been updated." });
    },
    onError: (err: any) => {
      toast({ title: "Verification Failed", description: err.message, variant: "destructive" });
    }
  });

  const kitMutation = useMutation({
    mutationFn: (userId: string) => API.adminToggleKit(userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      toast({ title: data.kitReceived ? "Kit Marked as Received ✅" : "Kit Marked as Not Received", description: data.message });
    },
    onError: (err: any) => {
      toast({ title: "Kit Toggle Failed", description: err.message, variant: "destructive" });
    }
  });
  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    
    return teams.filter((team: any) => {
      // 1. Requirement: Only registered and pending teams must be viewed
      // This means teams without a registration object are hidden.
      if (!team.registration) return false;
      
      const regStatus = team.registration.status?.toLowerCase();
      const isAllowedStatus = regStatus === 'registered' || regStatus === 'pending';
      if (!isAllowedStatus) return false;

      // 2. Search by team name, leader name, or UTR number
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        team.teamName.toLowerCase().includes(query) ||
        team.leader.name.toLowerCase().includes(query) ||
        team.leader.college.toLowerCase().includes(query) ||
        (team.registration?.utrNumber && team.registration.utrNumber.toLowerCase().includes(query));
      
      // 3. Payment Filter
      const status = team.registration?.paymentStatus || 'pending';
      const matchesPayment = paymentFilter === "all" || status === paymentFilter;
      
      // 4. Kit Filter
      const allKitsReceived = team.members.length > 0 && team.members.every((m: any) => m.kitReceived === true);
      const matchesKit = kitFilter === "all" || 
        (kitFilter === "received" && allKitsReceived) ||
        (kitFilter === "pending" && !allKitsReceived);
        
      // 5. Domain Filter
      const domain = team.registration?.domain;
      const matchesDomain = domainFilter === "all" || 
        (domainFilter === "fullstack" && domain === "Full Stack Development") ||
        (domainFilter === "aiml" && domain === "AI/ML");

      return matchesSearch && matchesPayment && matchesKit && matchesDomain;
    });
  }, [teams, searchQuery, paymentFilter, kitFilter, domainFilter]);

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
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search team, leader, college or UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-xl"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full text-muted-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Payment Filter */}
            <div className="flex flex-col gap-1.5">
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Payment Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10">
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="pending">Pending Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Kit Filter */}
            <div className="flex flex-col gap-1.5">
              <Select value={kitFilter} onValueChange={setKitFilter}>
                <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50">
                  <div className="flex items-center gap-2">
                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Kit Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10">
                  <SelectItem value="all">All Kit Status</SelectItem>
                  <SelectItem value="received">All Kits Received</SelectItem>
                  <SelectItem value="pending">Pending Kits</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Domain Filter */}
            <div className="flex flex-col gap-1.5">
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Domain" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10">
                  <SelectItem value="all">All Domains</SelectItem>
                  <SelectItem value="fullstack">Fullstack</SelectItem>
                  <SelectItem value="aiml">AI/ML</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-white/5 border border-white/10 p-1 h-12 rounded-xl">
                <TabsTrigger value="overview" className="gap-2 rounded-lg px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
                  <Users className="h-4 w-4" /> Basic Details
                </TabsTrigger>
                <TabsTrigger value="logistics" className="gap-2 rounded-lg px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
                  <Package className="h-4 w-4" /> Logistics
                </TabsTrigger>
                <TabsTrigger value="full" className="gap-2 rounded-lg px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
                  <ShieldCheck className="h-4 w-4" /> Full View
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                 <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    Showing {filteredTeams.length} {filteredTeams.length === 1 ? 'Team' : 'Teams'}
                 </p>
                 {(searchQuery || paymentFilter !== "all" || kitFilter !== "all" || domainFilter !== "all") && (
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSearchQuery("");
                      setPaymentFilter("all");
                      setKitFilter("all");
                      setDomainFilter("all");
                    }}
                    className="h-7 text-[10px] text-primary hover:text-primary hover:bg-primary/10"
                   >
                     Clear Filters
                   </Button>
                 )}
              </div>
            </div>

            {/* TAB 1: BASIC DETAILS */}
            <TabsContent value="overview">
              <div className="glass-card rounded-xl overflow-hidden border border-border/50">
                <Table>
                  <TableCaption>Essential team information for quick verification.</TableCaption>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[200px]">Team Name</TableHead>
                      <TableHead>Leader</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeams.map((team: any) => (
                      <TableRow key={team.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{team.teamName}</span>
                            <span className="text-[10px] text-muted-foreground uppercase mt-1">ID: {team.id.substring(0,8)}...</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            {team.leader.name}
                          </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2 text-sm">
                             <School className="h-3 w-3 text-muted-foreground" />
                             <span className="truncate max-w-[150px]">{team.leader.college}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                          <a 
                            href={`tel:${team.leader.phone}`}
                            className="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
                            title={`Call ${team.leader.name}`}
                          >
                            <Phone className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                            {team.leader.phone}
                          </a>
                        </TableCell>
                        <TableCell>
                          {team.registration ? (
                            <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1 capitalize text-[10px]">
                              <CheckCircle2 className="h-3 w-3" />
                              {team.registration.status}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground gap-1 text-[10px]">
                              <Clock className="h-3 w-3" />
                              Not Reg.
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {team.registration ? (
                            <div className="flex flex-col items-end gap-1">
                              <Badge className={`text-[10px] gap-1 capitalize ${team.registration.paymentStatus === 'verified' ? 'bg-green-500/10 text-green-500' : team.registration.paymentStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-destructive/10 text-destructive'}`}>
                                {team.registration.paymentStatus}
                              </Badge>
                              {team.registration.paymentStatus === 'pending' && (
                                <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 w-full max-w-[80px]" onClick={() => verifyMutation.mutate(team.registration.id)} disabled={verifyMutation.isPending}>
                                  Verify
                                </Button>
                              )}
                              {team.registration.utrNumber && (
                                <span className="text-[9px] text-muted-foreground">UTR: {team.registration.utrNumber}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* TAB 2: LOGISTICS */}
            <TabsContent value="logistics">
              <div className="glass-card rounded-xl overflow-hidden border border-border/50">
                <Table>
                  <TableCaption>Manage food distribution and event kits.</TableCaption>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[200px]">Team Name</TableHead>
                      <TableHead>Leader</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Food Scans</TableHead>
                      <TableHead>Kit Received</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeams.map((team: any) => (
                      <TableRow key={team.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">
                          <span>{team.teamName}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{team.leader.name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal text-[10px]">
                            {team.members.length} / {team.maxSize}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            {team.members.map((m: any) => (
                              <div key={m.id} className="flex flex-col gap-0.5 border-b border-white/5 pb-1 last:border-0">
                                <div className="flex items-center justify-between gap-4 text-[10px]">
                                  <span className="truncate max-w-[100px] font-medium text-white">{m.name}</span>
                                  <span className={`font-bold px-1.5 py-0.5 rounded ${m.mealsTaken?.length >= 4 ? 'bg-destructive/20 text-destructive' : m.mealsTaken?.length > 0 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    {m.mealsTaken?.length || 0}/4
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            {team.members.map((m: any) => (
                              <div key={m.id} className="flex items-center justify-between gap-4 text-[10px]">
                                <span className="truncate max-w-[100px]">{m.name}</span>
                                <button
                                  onClick={() => kitMutation.mutate(m.id)}
                                  disabled={kitMutation.isPending}
                                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition-colors ${m.kitReceived === true ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-muted border-border text-muted-foreground'}`}
                                >
                                  <Package className="h-2.5 w-2.5" />
                                  {m.kitReceived === true ? 'Yes' : 'No'}
                                </button>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* TAB 3: FULL VIEW */}
            <TabsContent value="full">
              <div className="glass-card rounded-xl overflow-hidden border border-border/50">
                <Table>
                  <TableCaption>Comprehensive list of all team data.</TableCaption>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[200px]">Team Name</TableHead>
                      <TableHead>Leader</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Problem</TableHead>
                      <TableHead>Food Scans</TableHead>
                      <TableHead>Kit Received</TableHead>
                      <TableHead className="text-right">Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeams.map((team: any) => (
                      <TableRow key={team.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{team.teamName}</span>
                          <span className="text-[10px] text-muted-foreground uppercase mt-1">ID: {team.id.substring(0,8)}...</span>
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
                         </div>
                       </TableCell>
                       <TableCell>
                         <div className="flex items-center gap-2 text-sm">
                           <School className="h-3 w-3 text-muted-foreground" />
                           <span className="truncate max-w-[150px]" title={team.leader.college}>
                             {team.leader.college}
                           </span>
                         </div>
                       </TableCell>
                      <TableCell>
                        <a 
                          href={`tel:${team.leader.phone}`}
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
                          title={`Call ${team.leader.name}`}
                        >
                          <Phone className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                          {team.leader.phone}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal text-[10px]">
                          {team.members.length} / {team.maxSize}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {team.registration ? (
                          <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1 capitalize text-[10px]">
                            <CheckCircle2 className="h-3 w-3" />
                            {team.registration.status}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground gap-1 text-[10px]">
                            <Clock className="h-3 w-3" />
                            Not Reg.
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {team.registration?.domain === 'AI/ML' ? (
                          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">AI/ML</Badge>
                        ) : team.registration?.domain ? (
                          <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">Fullstack</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {team.problemStatement ? (
                          <div className="flex items-center gap-2">
                             <span className="text-white font-bold bg-primary/20 px-2 py-0.5 rounded border border-primary/30 text-xs">#{team.problemStatement}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">Not Rolled</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          {team.members.map((m: any) => (
                            <div key={m.id} className="flex flex-col gap-0.5 border-b border-white/5 pb-1 last:border-0">
                              <div className="flex items-center justify-between gap-2 text-[10px]">
                                <span className="truncate max-w-[80px] font-medium text-white">{m.name.split(' ')[0]}</span>
                                <span className={`font-bold px-1.5 py-0.5 rounded ${m.mealsTaken?.length >= 4 ? 'bg-destructive/20 text-destructive' : m.mealsTaken?.length > 0 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                  {m.mealsTaken?.length || 0}/4
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          {team.members.map((m: any) => (
                            <div key={m.id} className="flex items-center justify-between gap-2 text-[10px]">
                              <span className="truncate max-w-[60px]">{m.name.split(' ')[0]}</span>
                              <button
                                onClick={() => kitMutation.mutate(m.id)}
                                disabled={kitMutation.isPending}
                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition-colors ${
                                  m.kitReceived === true
                                    ? 'bg-green-500/20 border-green-500/40 text-green-400'
                                    : 'bg-muted border-border text-muted-foreground'
                                }`}
                              >
                                <Package className="h-2.5 w-2.5" />
                                {m.kitReceived === true ? 'Yes' : 'No'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {team.registration ? (
                          <div className="flex flex-col items-end gap-1">
                            <Badge 
                              className={`text-[10px] gap-1 capitalize ${
                                team.registration.paymentStatus === 'verified' 
                                  ? 'bg-green-500/10 text-green-500' 
                                  : team.registration.paymentStatus === 'pending'
                                  ? 'bg-yellow-500/10 text-yellow-500'
                                  : 'bg-destructive/10 text-destructive'
                              }`}
                            >
                              {team.registration.paymentStatus}
                            </Badge>
                            {team.registration.paymentStatus === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-6 text-[10px] px-2 w-full max-w-[80px]"
                                onClick={() => verifyMutation.mutate(team.registration.id)}
                                disabled={verifyMutation.isPending}
                              >
                                Verify
                              </Button>
                            )}
                            {team.registration.utrNumber && (
                              <span className="text-[9px] text-muted-foreground">UTR: {team.registration.utrNumber}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          {filteredTeams.length === 0 && (
            <div className="text-center py-24 glass-card rounded-xl border border-dashed border-white/10">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No teams found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchQuery("");
                  setPaymentFilter("all");
                  setKitFilter("all");
                  setDomainFilter("all");
                }}
                className="mt-6 font-bold"
              >
                Reset all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
