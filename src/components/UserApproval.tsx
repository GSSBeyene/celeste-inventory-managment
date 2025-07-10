import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Shield,
  CheckCircle,
  XCircle
} from "lucide-react";

interface PendingUser {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  role: string | null;
  approved: boolean;
  created_at: string;
  user_email?: string;
}

export const UserApproval = () => {
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = async () => {
    try {
      // Get pending users with their email from auth.users
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_email:user_id
        `)
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // For each profile, get the email from auth metadata if available
      const usersWithEmails = await Promise.all(
        (profiles || []).map(async (profile) => {
          try {
            // Try to get user details - this might not work due to RLS
            const { data: authUser } = await supabase.auth.admin.getUserById(profile.user_id);
            return {
              ...profile,
              user_email: authUser?.user?.email || 'Email not accessible'
            };
          } catch {
            return {
              ...profile,
              user_email: 'Email not accessible'
            };
          }
        })
      );

      setPendingUsers(usersWithEmails);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: string, approve: boolean) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      // Get current user's profile to use as approver
      const { data: approverProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', currentUser.user.id)
        .single();

      if (!approverProfile) throw new Error('Approver profile not found');

      const updateData: any = {
        approved: approve,
        approved_at: approve ? new Date().toISOString() : null,
        approved_by: approve ? approverProfile.id : null
      };

      // If rejecting, we might want to delete the profile or mark it differently
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: approve ? "User Approved" : "User Rejected",
        description: approve 
          ? "User has been approved and can now access the system."
          : "User has been rejected.",
      });

      // Refresh the list
      fetchPendingUsers();
    } catch (error) {
      console.error('Error updating user approval:', error);
      toast({
        title: "Error",
        description: `Failed to ${approve ? 'approve' : 'reject'} user.`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Approval</h1>
          <p className="text-gray-600 mt-2">Review and approve pending user registrations</p>
        </div>
        <Button onClick={fetchPendingUsers} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">High</div>
            <p className="text-xs text-muted-foreground">Admin approval required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Access Control</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Centralized approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending User Registrations</CardTitle>
          <CardDescription>
            Review new user accounts and approve access to the inventory system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
              <p className="text-gray-600">All registered users have been processed.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Requested Role</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.display_name || 
                       (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'No name provided')}
                    </TableCell>
                    <TableCell>{user.user_email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.role || 'staff'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproval(user.user_id, true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproval(user.user_id, false)}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};