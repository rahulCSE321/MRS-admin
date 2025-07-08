import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
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
  useGetAllRanksQuery,
} from "../features/api/adminApi";
import toast from "react-hot-toast";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";

const Rank = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
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

  const {
    data,
    refetch,
    isLoading: dataLoading,
  } = useGetAllRanksQuery({ token: authToken });

  console.log("data", data);

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
        <RankSidebar />

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
                  <CardTitle>Ranks Management</CardTitle>
                </div>
                <Dialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Rank</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Rank</DialogTitle>
                      <DialogDescription>
                        Create a new rank with the details below.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="planName" className="text-right">
                            Rank Name *
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
                      <TableHead>S.NO</TableHead>
                      <TableHead>Rank Name</TableHead>
                      <TableHead>Rank Status</TableHead>
                      <TableHead>Refferal</TableHead>
                      <TableHead>Action</TableHead>
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
                      data?.data?.map((rank, i) => (
                        <TableRow key={rank.id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell
                            style={{
                              color:
                                rank?.name === "Diamond"
                                  ? "#b9f2ff"
                                  : rank?.name === "Gold"
                                  ? "#FFD700"
                                  : rank?.name === "Platinum"
                                  ? "#E5E4E2"
                                  : rank?.name === "Peral"
                                  ? "#EAE0C8"
                                  : rank?.name === "Silver"
                                  ? "#C0C0C0"
                                  : "",
                           
                            }}
                          >
                            {rank?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            {rank?.status === true ? (
                              <div
                                style={{
                                  width: "60px",
                                  backgroundColor: "green",
                                  padding: "5px",
                                  borderRadius: "12px",
                                  textAlign: "center",
                                  color: "white",
                                }}
                              >
                                Active
                              </div>
                            ) : (
                              <div
                                style={{
                                  width: "60px",
                                  backgroundColor: "red",
                                  padding: "5px",
                                  borderRadius: "12px",
                                  textAlign: "center",
                                  color: "white",
                                }}
                              >
                                Inactive
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {rank?.referral || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Edit rank">
                              <IconButton>
                                <EditOutlinedIcon />
                              </IconButton>
                            </Tooltip>
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
const RankSidebar = () => (
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
              <SidebarMenuButton tooltip="Master Plan">
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
              <SidebarMenuButton asChild isActive tooltip="Rank">
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

export default Rank;
