import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import {
  useCreateMasterPlanMutation,
  useGetMasterPlanQuery,
} from "../features/api/adminApi";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

// Mock master plan data
const masterPlanData = [
  {
    id: 1,
    planName: "Basic Plan",
    amount: "$9.99",
    validity: "1 Month",
  },
  {
    id: 2,
    planName: "Premium Plan",
    amount: "$19.99",
    validity: "3 Months",
  },
  {
    id: 3,
    planName: "Enterprise Plan",
    amount: "$49.99",
    validity: "6 Months",
  },
  {
    id: 4,
    planName: "Pro Plan",
    amount: "$29.99",
    validity: "1 Year",
  },
  {
    id: 5,
    planName: "Starter Plan",
    amount: "$4.99",
    validity: "2 Weeks",
  },
];

const MasterPlan = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [plans, setPlans] = useState(masterPlanData);
  const [formData, setFormData] = useState({
    planName: "",
    amount: "",
    validity: "",
  });

  const authToken = localStorage.getItem("authToken");

  const [
    createMasterPlan,
    { data: masterPlan, isLoading, isSuccess, isError, error },
  ] = useCreateMasterPlanMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createMasterPlan({ values: formData, token: authToken });
  };

  const { data, refetch ,isLoading:dataLoading} = useGetMasterPlanQuery(authToken ?? "", {
    skip: !authToken,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Plan created successfully!");
      setFormData({ planName: "", amount: "", validity: "" });
      setIsAddPlanOpen(false);
      refetch();
    }

    if (isError && error?.data?.message) {
      toast.error(error.data.message);
    }
  }, [isSuccess, isError, error]);

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        {/* Sidebar */}
        <MasterPlanSidebar />

        {/* Main Content */}
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 items-center border-b px-6 justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Master Plan</h1>
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

          {/* Master Plan Content */}
          <div className="p-6 space-y-6">
            {/* Master Plan Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Plans</CardTitle>
                  <CardDescription>
                    Manage and view all subscription plans
                  </CardDescription>
                </div>
                <Dialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Plan</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Plan</DialogTitle>
                      <DialogDescription>
                        Create a new subscription plan with the details below.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="planName" className="text-right">
                            Plan Name
                          </Label>
                          <Input
                            id="planName"
                            name="planName"
                            value={formData.planName}
                            onChange={handleInputChange}
                            placeholder="Enter plan name"
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount
                          </Label>
                          <Input
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="e.g., $9.99"
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="validity" className="text-right">
                            Validity
                          </Label>
                          <Input
                            id="validity"
                            name="validity"
                            value={formData.validity}
                            onChange={handleInputChange}
                            placeholder="e.g., 1 Month"
                            className="col-span-3"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddPlanOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Add Plan</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Validity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6">
                          <div className="flex items-center justify-center gap-2">
                            <CircularProgress size={20} />
                            <span>Loading users...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.plans.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                                <CreditCard className="h-4 w-4 text-primary" />
                              </div>
                              <div className="font-medium">{plan.planName}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {plan.amount}
                          </TableCell>
                          <TableCell>
                            <div className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {plan.validity}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
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

// Sidebar Component for Master Plan page
const MasterPlanSidebar = () => (
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
              <SidebarMenuButton isActive tooltip="Master Plan">
                <CreditCard className="h-5 w-5" />
                <span>Master Plan</span>
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
            <SidebarMenuButton asChild tooltip="User Plan History">
              <Link to="/users-income">
                <History className="h-5 w-5" />
                <span>User's Income</span>
              </Link>
            </SidebarMenuButton>
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

export default MasterPlan;
