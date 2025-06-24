import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { Search, Bell, Menu, UserCircle, Home, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllUsersWithPlanQuery } from "../features/api/adminApi";
import { CircularProgress } from "@mui/material";

const Users = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const authToken = localStorage.getItem("authToken");

  const { data, isLoading, isError, error } = useGetAllUsersWithPlanQuery(
    authToken ?? "",
    {
      skip: !authToken,
    }
  );

  useEffect(() => {
    if (isError && error?.data?.message) {
      toast.error(error.data.message);
    }
  }, [error, isError]);

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        {/* Sidebar */}
        <UsersSidebar />

        {/* Main Content */}
        <SidebarInset>
          {/* Header */}
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

          {/* Users Content */}
          <div className="p-6 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>
                    Manage and view all users in the system
                  </CardDescription>
                </div>
                <Button>Add User</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Plan ID</TableHead>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires At</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 ">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : data?.data?.length > 0 ? (
                      data.data.map((user, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            {user.userId}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {user.fullName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{user.fullName}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.planId}
                          </TableCell>
                          <TableCell>
                            <div
                              className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                user.planName === "Enterprise"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.planName === "Premium"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.planName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                user.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "Expired"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {user.status}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.expireAt}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.createdAt}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
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

const UsersSidebar = () => (
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
              <SidebarMenuButton isActive tooltip="Users">
                <UserCircle className="h-5 w-5" />
                <span>Users</span>
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
