
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarInset } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowUpRight, Users, DollarSign, CreditCard, Activity, Search, Bell, MoreHorizontal, Home, PieChart, UserCircle, Settings, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Mock data for charts
const salesData = [
  { name: "Jan", value: 1000 },
  { name: "Feb", value: 1500 },
  { name: "Mar", value: 1200 },
  { name: "Apr", value: 1800 },
  { name: "May", value: 2000 },
  { name: "Jun", value: 2400 },
];

const visitorsData = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 150 },
  { name: "Wed", value: 180 },
  { name: "Thu", value: 220 },
  { name: "Fri", value: 190 },
  { name: "Sat", value: 90 },
  { name: "Sun", value: 70 },
];

// Mock transactions data
const recentTransactions = [
  { 
    id: 1, 
    customer: "Alex Johnson", 
    email: "alex@example.com", 
    amount: "$240.00", 
    status: "Completed", 
    date: "Today, 2:30 PM" 
  },
  { 
    id: 2, 
    customer: "Samantha Miller", 
    email: "sam@example.com", 
    amount: "$150.00", 
    status: "Processing", 
    date: "Today, 11:20 AM" 
  },
  { 
    id: 3, 
    customer: "Robert Davis", 
    email: "robert@example.com", 
    amount: "$350.00", 
    status: "Completed", 
    date: "Yesterday, 3:45 PM" 
  },
  { 
    id: 4, 
    customer: "Emma Wilson", 
    email: "emma@example.com", 
    amount: "$120.00", 
    status: "Failed", 
    date: "Yesterday, 1:30 PM" 
  },
];

const Dashboard = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        {/* Sidebar */}
        <DashboardSidebar />
        
        {/* Main Content */}
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 items-center border-b px-6 justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Dashboard</h1>
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

          {/* Dashboard Content */}
          <div className="p-6 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Revenue" 
                value="$45,231.89" 
                change="+20.1%" 
                icon={<DollarSign className="h-5 w-5" />}
              />
              <StatCard 
                title="Subscriptions" 
                value="2,350" 
                change="+12.5%" 
                icon={<Users className="h-5 w-5" />}
              />
              <StatCard 
                title="Sales" 
                value="12,234" 
                change="+15.3%" 
                icon={<CreditCard className="h-5 w-5" />}
              />
              <StatCard 
                title="Active Users" 
                value="573" 
                change="+8.2%" 
                icon={<Activity className="h-5 w-5" />}
              />
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Visitors Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Visitors</CardTitle>
                  <CardDescription>Number of daily visitors</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={visitorsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Transactions Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Recent customer transactions</CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{transaction.customer.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{transaction.customer}</div>
                              <div className="text-sm text-muted-foreground">{transaction.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                            transaction.status === "Completed" 
                              ? "bg-green-100 text-green-800" 
                              : transaction.status === "Processing" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {transaction.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {transaction.date}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {transaction.amount}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
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

// Stat Card Component
const StatCard = ({ title, value, change, icon }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-center">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="flex items-center gap-1 text-sm text-green-600">
          <span>{change}</span>
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
    </CardContent>
  </Card>
);

// Sidebar Component
const DashboardSidebar = () => (
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
              <SidebarMenuButton isActive tooltip="Dashboard">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Analytics">
                <PieChart className="h-5 w-5" />
                <span>Analytics</span>
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
              <SidebarMenuButton tooltip="Users">
                <UserCircle className="h-5 w-5" />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
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

export default Dashboard;
