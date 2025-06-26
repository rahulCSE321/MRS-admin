import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Menu, UserCircle, Home, Activity, CreditCard, History } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

// Mock user plan history data
const userPlanHistoryData = [
  {
    userId: "USR001",
    fullName: "Alex Johnson",
    planId: "PLAN_001",
    planName: "Premium",
    status: "Active",
    expiredAt: "2024-12-31",
    createdAt: "2024-01-15"
  },
  {
    userId: "USR001",
    fullName: "Alex Johnson",
    planId: "PLAN_002",
    planName: "Basic",
    status: "Expired",
    expiredAt: "2024-01-14",
    createdAt: "2023-10-01"
  },
  {
    userId: "USR002",
    fullName: "Samantha Miller",
    planId: "PLAN_002",
    planName: "Basic",
    status: "Active",
    expiredAt: "2024-11-30",
    createdAt: "2024-02-20"
  },
  {
    userId: "USR003",
    fullName: "Robert Davis",
    planId: "PLAN_001",
    planName: "Premium",
    status: "Expired",
    expiredAt: "2024-03-15",
    createdAt: "2023-12-10"
  },
  {
    userId: "USR003",
    fullName: "Robert Davis",
    planId: "PLAN_003",
    planName: "Enterprise",
    status: "Active",
    expiredAt: "2025-03-15",
    createdAt: "2024-03-16"
  },
  {
    userId: "USR004",
    fullName: "Emma Wilson",
    planId: "PLAN_003",
    planName: "Enterprise",
    status: "Active",
    expiredAt: "2025-01-31",
    createdAt: "2024-01-05"
  },
  {
    userId: "USR005",
    fullName: "Michael Brown",
    planId: "PLAN_002",
    planName: "Basic",
    status: "Inactive",
    expiredAt: "2024-06-15",
    createdAt: "2024-03-12"
  },
  {
    userId: "USR006",
    fullName: "Sarah Davis",
    planId: "PLAN_001",
    planName: "Premium",
    status: "Active",
    expiredAt: "2024-12-20",
    createdAt: "2024-03-20"
  }
];

const UserPlanHistory = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        {/* Sidebar */}
        <UserPlanHistorySidebar />
        
        {/* Main Content */}
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 items-center border-b px-6 justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">User Plan History</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="Admin User" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* User Plan History Content */}
          <div className="p-6 space-y-6">
            {/* User Plan History Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Plan History</CardTitle>
                  <CardDescription>Complete history of user plan subscriptions and changes</CardDescription>
                </div>
                <Button variant="outline">Export History</Button>
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
                      <TableHead>Expired At</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userPlanHistoryData.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {record.userId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{record.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{record.fullName}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {record.planId}
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                            record.planName === "Enterprise" 
                              ? "bg-purple-100 text-purple-800" 
                              : record.planName === "Premium" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {record.planName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                            record.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : record.status === "Expired" 
                              ? "bg-red-100 text-red-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {record.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {record.expiredAt}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {record.createdAt}
                        </TableCell>
                      </TableRow>
                    ))}
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

// Sidebar Component for User Plan History page
const UserPlanHistorySidebar = () => (
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
                <Link to="/users">
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
              <SidebarMenuButton isActive tooltip="User Plan History">
                <History className="h-5 w-5" />
                <span>User Plan History</span>
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

export default UserPlanHistory; 