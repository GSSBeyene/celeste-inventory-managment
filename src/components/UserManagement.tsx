import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Users,
  Shield,
  UserCheck,
  UserX,
  Settings
} from "lucide-react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff" | "viewer";
  status: "active" | "inactive";
  permissions: {
    canEditMenu: boolean;
    canDeleteMenu: boolean;
    canUpdateMenu: boolean;
    canViewReports: boolean;
    canManageOrders: boolean;
  };
  createdAt: string;
  lastLogin: string;
}

interface UserManagementProps {
  currentUser?: User;
  onUserUpdate?: (users: User[]) => void;
}

export const UserManagement = ({ currentUser, onUserUpdate }: UserManagementProps) => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch profiles from Supabase
        const { data: profilesData, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform profiles data to match User interface
        const formattedUsers: User[] = profilesData?.map(profile => ({
          id: profile.id,
          name: profile.display_name || `${profile.first_name} ${profile.last_name}` || 'Unknown User',
          email: profile.user_id, // We'll use user_id as a placeholder since we don't have email in profiles
          role: (profile.role as "admin" | "manager" | "staff" | "viewer") || "staff",
          status: profile.approved ? "active" : "inactive",
          permissions: getRolePermissions((profile.role as User['role']) || "staff"),
          createdAt: new Date(profile.created_at).toISOString().split('T')[0],
          lastLogin: profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "Never"
        })) || [];

        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role === "admin") {
      fetchUsers();
    }
  }, [profile, toast]);

  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "staff",
    status: "active",
    permissions: {
      canEditMenu: false,
      canDeleteMenu: false,
      canUpdateMenu: false,
      canViewReports: false,
      canManageOrders: false
    }
  });

  const getRolePermissions = (role: User['role']) => {
    switch (role) {
      case "admin":
        return {
          canEditMenu: true,
          canDeleteMenu: true,
          canUpdateMenu: true,
          canViewReports: true,
          canManageOrders: true
        };
      case "manager":
        return {
          canEditMenu: true,
          canDeleteMenu: false,
          canUpdateMenu: true,
          canViewReports: true,
          canManageOrders: true
        };
      case "staff":
        return {
          canEditMenu: false,
          canDeleteMenu: false,
          canUpdateMenu: false,
          canViewReports: false,
          canManageOrders: true
        };
      case "viewer":
        return {
          canEditMenu: false,
          canDeleteMenu: false,
          canUpdateMenu: false,
          canViewReports: false,
          canManageOrders: false
        };
      default:
        return {
          canEditMenu: false,
          canDeleteMenu: false,
          canUpdateMenu: false,
          canViewReports: false,
          canManageOrders: false
        };
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name!,
      email: newUser.email!,
      role: newUser.role as User['role'],
      status: newUser.status as User['status'],
      permissions: getRolePermissions(newUser.role as User['role']),
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: "Never"
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    onUserUpdate?.(updatedUsers);
    
    setNewUser({
      name: "",
      email: "",
      role: "staff",
      status: "active",
      permissions: {
        canEditMenu: false,
        canDeleteMenu: false,
        canUpdateMenu: false,
        canViewReports: false,
        canManageOrders: false
      }
    });
    setIsAddUserDialogOpen(false);

    toast({
      title: "Success",
      description: "User added successfully.",
    });
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      // Update the user's role in the database
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: selectedUser.role,
          display_name: selectedUser.name 
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Update local state
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      );
      setUsers(updatedUsers);
      onUserUpdate?.(updatedUsers);
      setIsEditUserDialogOpen(false);
      setSelectedUser(null);

      toast({
        title: "Success",
        description: "User role updated successfully.",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    onUserUpdate?.(updatedUsers);
    
    toast({
      title: "Success",
      description: "User deleted successfully.",
    });
  };

  const getRoleBadge = (role: User['role']) => {
    const variants = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-blue-100 text-blue-800",
      staff: "bg-green-100 text-green-800",
      viewer: "bg-gray-100 text-gray-800"
    };
    return <Badge className={variants[role]}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>;
  };

  const getStatusBadge = (status: User['status']) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    return <Badge className={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const activeUsers = users.filter(user => user.status === "active").length;
  const adminUsers = users.filter(user => user.role === "admin").length;
  const managerUsers = users.filter(user => user.role === "manager").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage user access and permissions for menu operations</p>
        </div>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">Full access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerUsers}</div>
            <p className="text-xs text-muted-foreground">Menu managers</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.canEditMenu && (
                        <Badge variant="outline" className="text-xs">Edit</Badge>
                      )}
                      {user.permissions.canDeleteMenu && (
                        <Badge variant="outline" className="text-xs">Delete</Badge>
                      )}
                      {user.permissions.canUpdateMenu && (
                        <Badge variant="outline" className="text-xs">Update</Badge>
                      )}
                      {user.permissions.canManageOrders && (
                        <Badge variant="outline" className="text-xs">Orders</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditUserDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with specific permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: User['role']) => 
                    setNewUser({ 
                      ...newUser, 
                      role: value,
                      permissions: getRolePermissions(value)
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newUser.status}
                  onValueChange={(value: User['status']) => 
                    setNewUser({ ...newUser, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value: User['role']) => 
                      setSelectedUser({ 
                        ...selectedUser, 
                        role: value,
                        permissions: getRolePermissions(value)
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={selectedUser.status}
                    onValueChange={(value: User['status']) => 
                      setSelectedUser({ ...selectedUser, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};