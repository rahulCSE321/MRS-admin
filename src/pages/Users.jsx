import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SidebarProvider,
  SidebarInset,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Bell,
  Menu,
  UserCircle,
  Home,
  Activity,
  CreditCard,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useChangeStatusMutation,
  useGetAllUsersQuery,
} from "../features/api/adminApi";
import { CircularProgress, Switch } from "@mui/material";

const Users = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const location = useLocation();
  const [userStatusMap, setUserStatusMap] = useState({});

  const { data, isLoading, isError, error, refetch } = useGetAllUsersQuery(
    authToken ?? "",
    {
      skip: !authToken,
    }
  );

  const [
    changeStatus,
    {
      data: statusChangeData,
      isLoading: tatusChangeLoading,
      isError: tatusChangesIsError,
      error: tatusChangeError,
      isSuccess: tatusChangeIsSuccess,
    },
  ] = useChangeStatusMutation();

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await changeStatus({
        userId: id,
        token: localStorage.getItem("authToken"),
        status: newStatus,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isError && error?.data?.message) {
      toast.error(error.data.message);
    }
  }, [error, isError]);

  useEffect(() => {
    if (tatusChangeIsSuccess && statusChangeData?.message) {
      toast.success(statusChangeData.message);
      refetch();
    } else if (tatusChangesIsError && tatusChangeError?.data?.message) {
      toast.error(tatusChangeError.data.message);
    }
  }, [tatusChangeIsSuccess, tatusChangesIsError]);

  useEffect(() => {
    if (data?.users?.length) {
      const map = {};
      data.users.forEach((user) => {
        map[user._id] = user.status;
      });
      setUserStatusMap(map);
    }
  }, [data]);

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <UsersSidebar currentPath={location.pathname} />

        <SidebarInset>
          <header className="flex h-16 items-center border-b px-6 justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Users</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="Admin User"
                />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <div className="p-6 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>
                    Manage and view all users in the system
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link to="/add-user">Add User</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S.NO</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Referred by</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6">
                          <div className="flex items-center justify-center gap-2">
                            <CircularProgress size={20} />
                            <span>Loading users...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : data?.users?.length > 0 ? (
                      data.users.map((user, i) => (
                        <TableRow key={user._id || i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{user.fullName || "N/A"}</TableCell>
                          <TableCell>{user.email || "N/A"}</TableCell>
                          <TableCell>{user.phone || "N/A"}</TableCell>
                          <TableCell>{user.referrerName || "N/A"}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.status === true ? "Active" : "Inactive"}
                          </TableCell>
                          <TableCell>{user.rank || "N/A"}</TableCell>
                          <TableCell>{user.level || "N/A"}</TableCell>
                          <TableCell>
                            <Switch
                              checked={userStatusMap[user._id] || false}
                              onChange={(e) => {
                                const newStatus = e.target.checked;
                                setUserStatusMap((prev) => ({
                                  ...prev,
                                  [user._id]: newStatus,
                                }));
                                handleChangeStatus(user.userId, newStatus);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const UsersSidebar = ({ currentPath }) => (
  <Sidebar variant="inset">
    <SidebarHeader>
      <div className="flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
          <Activity className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold">AdminPanel</h2>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Overview</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link to="/dashboard">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Management</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Users">
                <Link
                  to="/users"
                  className={
                    currentPath === "/users" ? "font-semibold text-primary" : ""
                  }
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Master Plan">
                <Link to="/master-plan">
                  <CreditCard className="h-5 w-5" />
                  <span>Master Plan</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="User Plan History">
                <Link to="/user-plan-history">
                  <History className="h-5 w-5" />
                  <span>User Plan History</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="User's Income">
                <Link to="/users-income">
                  <History className="h-5 w-5" />
                  <span>User's Income</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <div className="flex items-center gap-2 p-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="Admin User" />
          <AvatarFallback>AU</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">Admin User</div>
          <div className="text-xs text-muted-foreground">admin@example.com</div>
        </div>
      </div>
    </SidebarFooter>
  </Sidebar>
);

export default Users;
