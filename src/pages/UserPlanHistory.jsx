import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Menu, UserCircle, Home, Activity, CreditCard, History } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useGetPlanHistoryQuery } from "../features/api/adminApi";



const UserPlanHistory = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const authToken=localStorage.getItem('authToken')

  const {data,isLoading}=useGetPlanHistoryQuery(authToken ?? "",
    {
      skip: !authToken,
    })

  console.log(data)
  
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
                      <TableHead>Amount</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Expired At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      isLoading ? (
                            <TableCell colSpan={7} className="text-center py-6 ">
                                                  Loading Plan History...
                                                </TableCell>
                      ):   data?.data.map((record, index) => (
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
                          {record.amount}
                        </TableCell>
                           <TableCell className="text-muted-foreground">
                          {record.startDate}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {record.expireAt}
                        </TableCell>
                     
                      </TableRow>
                    ))
                    }
                 
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
               <SidebarMenuButton asChild tooltip="User's Income">
                <Link to="/users-income">
                  <History className="h-5 w-5" />
                  <span>User's Income</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Bank">
                <Link to="/banks">
                  <History className="h-5 w-5" />
                  <span>Bank</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
              <SidebarMenuItem>
                          <SidebarMenuButton asChild tooltip="Recharge Wallet">
                            <Link to="/recharge-wallet">
                              <History className="h-5 w-5" />
                              <span>Recharge User Wallet</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                          <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Rank">
                <Link to="/ranks">
                  <History className="h-5 w-5" />
                  <span>Rank</span>
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

export default UserPlanHistory; 