import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
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
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

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
  CircularProgress,
  Dialog,
  IconButton,
  Pagination,
  styled,
  Typography,
} from "@mui/material";
import {
  useGetAllUsersQuery,
  useGetUserWalletRechargeQuery,
  useRechargeWalletMutation,
} from "../features/api/adminApi";

// Mock user plan history data

const RechargeWallet = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [userId, setuserId] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [openAnotherDialogBox, setOpenAnotherDialogBox] = useState(false);

  const handleCloseAnotherDialogBox = () => {
    setOpenAnotherDialogBox(!openAnotherDialogBox);
  };

  const authToken = localStorage.getItem("authToken");

  const { data, isLoading, refetch } = useGetUserWalletRechargeQuery({
    token: authToken,
    page,
  });

  const [
    rechargeWallet,
    {
      data: rechargeWalletData,
      isLoading: rechargeWalletLoading,
      isError: rechargeWalletIsError,
      error: rechargeWalletError,
      isSuccess: rechargeWalletSuccess,
    },
  ] = useRechargeWalletMutation();

  const { data: usersData } = useGetAllUsersQuery({ token: authToken,forWallet:true });

  const handlePageChange = (e, value) => {
    setPage(value);
  };

  const handleOpenAnotherDialogBox = () => {
    setOpenAnotherDialogBox(true);
  };

const handleAmountChange = (e) => {
  const value = e.target.value;


  if (!/^\d*$/.test(value)) {
    toast.error("Only positive numbers are allowed");
    return;
  }


  if (Number(value) < 0) {
    toast.error("Negative values are not allowed");

  }

  setAmount(value);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await rechargeWallet({
        token: authToken,
        userId,
        amount,
        transactionType,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const resultPerPage = data?.limit || 0;
  const totalUsers = data?.total || 0;
  const currentPage = page;

  useEffect(() => {
    if (rechargeWalletIsError && rechargeWalletError) {
      toast.error(rechargeWalletError?.data?.message);
    }
    if (rechargeWalletSuccess && rechargeWalletData) {
      toast.success(rechargeWalletData?.message);
      setAmount("");
      setuserId("");
      setTransactionType("");
      setOpenAnotherDialogBox(false);
      refetch();
    }
  }, [
    rechargeWalletIsError,
    rechargeWalletError,
    rechargeWalletData,
    rechargeWalletSuccess,
  ]);

  return (
    <>
      <SidebarProvider>
        <div className="flex min-h-svh w-full">
          {/* Sidebar */}
          <RecharchWalletSidebar />

          {/* Main Content */}
          <SidebarInset>
            {/* Header */}
            <header className="flex h-16 items-center border-b px-6 justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Recharge Users Wallet</h1>
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

            {/* User Plan History Content */}
            <div className="p-6 space-y-6">
              {/* User Plan History Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "13px",
                    }}
                  >
                    <CardTitle>Recharge Users Wallet</CardTitle>
                    <CardDescription>
                      Manage and view all user wallet transactions
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleOpenAnotherDialogBox}
                    variant="outline"
                  >
                    Recharge Wallet
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S.No</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>

                        <TableHead>Date & Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableCell colSpan={7} className="text-center py-6 ">
                          Loading Users ...
                        </TableCell>
                      ) : data?.data.length > 0 ? (
                        data?.data.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <UserField>
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {record.fullName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5px",
                                  }}
                                >
                                  <Typography className="font-medium">
                                    {record.fullName || "N/A"}
                                  </Typography>
                                </div>
                              </UserField>
                            </TableCell>
                            <TableCell
                              style={{ color: "black" }}
                              className="text-muted-foreground"
                            >
                              ₹ {record.amount || "N/A"}
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                              {record.dateTime || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-6">
                            No history found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <PaginationContainer>
                    {resultPerPage < totalUsers && (
                      <>
                        <Typography>
                          <p>
                            Showing {data?.users?.length} of {totalUsers} users
                          </p>
                        </Typography>
                        <Pagination
                          count={Math.ceil(totalUsers / resultPerPage)}
                          page={currentPage}
                          onChange={handlePageChange}
                          shape="rounded"
                          color="secondary"
                          size="large"
                        />
                      </>
                    )}
                  </PaginationContainer>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Dialog
        PaperProps={{
          sx: {
            width: "700px",
            maxWidth: "90%",

            borderRadius: "30px",
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        }}
        fullWidth
        open={openAnotherDialogBox}
        onClose={handleCloseAnotherDialogBox}
      >
        <DialogContentContainer>
          <FirstContainer>
            <NewUserTypography>Recharge User Wallet</NewUserTypography>
            <IconButton onClick={handleCloseAnotherDialogBox}>
              <CloseOutlinedIcon />
            </IconButton>
          </FirstContainer>
          <Form onSubmit={handleSubmit}>
            <Field style={{ width: "100%" }}>
              <Label htmlFor="referralCode">Select User</Label>
              <SelectField
                name="userId"
                id="userId"
                onChange={(e) => setuserId(e.target.value)}
                value={userId}
              >
                <option value="">Select User</option>
                {usersData?.users.length > 0 ? (
                  usersData?.users.map((curData, i) => {
                    return (
                      <Options key={i} value={curData?.userId}>
                        {curData?.fullName} ({curData?.userId}){" "}
                      </Options>
                    );
                  })
                ) : (
                  <div>No Users Found</div>
                )}
              </SelectField>
            </Field>
            <Field style={{ width: "100%" }}>
              <Label htmlFor="amount">Amount</Label>
              <InputField
                type="number"
                value={amount}
                required
                onChange={handleAmountChange}
                name="amount"
                id="amount"
                placeholder="Enter Amount "
              />
            </Field>
            <Field style={{ width: "100%" }}>
              <Label htmlFor="referralCode">Transaction Type</Label>
              <SelectField
                name="transactionType"
                id="transactionType"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="">Select Transaction Type</option>
                <option value="Wallet Recharge">Wallet Recharge</option>
              </SelectField>
            </Field>

            <div
              style={{ display: "flex", gap: "12px", justifyContent: "right" }}
            >
              <Button
                onClick={handleCloseAnotherDialogBox}
                variant="outlined"
                color="error"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={rechargeWalletLoading}
                variant="contained"
                style={{ backgroundColor: "#00A693", color: "white" }}
              >
                {rechargeWalletLoading ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress size={20} /> Recharging ....
                  </div>
                ) : (
                  "Recharge"
                )}
              </Button>
            </div>
          </Form>
        </DialogContentContainer>
      </Dialog>
    </>
  );
};

// Sidebar Component for User Plan History page
const RecharchWalletSidebar = () => (
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
              <SidebarMenuButton tooltip="User Plan History">
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
              <SidebarMenuButton asChild isActive tooltip="Recharge Wallet">
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

export default RechargeWallet;

const UserField = styled("div")`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const PaginationContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DialogContentContainer = styled("div")`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;

  @media (max-width: 100vw) {
    width: 100%;
  }
`;
const FirstContainer = styled("div")`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 100vw) {
  }
`;
const Form = styled("form")`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media (max-width: 100vw) {
  }
`;
const Fields = styled("div")`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;

  @media (max-width: 100vw) {
  }
`;
const Field = styled("div")`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 100vw) {
  }
`;

const NewUserTypography = styled(Typography)`
  font: 600 24px Montserrat;
  color: #00a693;
`;
const Label = styled("label")`
  font: 500 16px Montserrat;
  color: #00000;
`;

const InputField = styled("input")`
  width: 100%;
  border: 1px solid #000000;
  height: 50px;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 10px;
  font: 500 16px Montserrat;
  color: #000000;

  &:focus {
    outline: none;
    border: 2px solid #00a693;
  }
`;
const SelectField = styled("select")`
  width: 100%;
  border: 1px solid #000000;
  height: 50px;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 10px;
  font: 500 16px Montserrat;
  color: #000000;
  cursor: pointer;

  

  &:focus {
    outline: none;
    border: 2px solid #00a693;
  }
`;


const Options=styled('option')`
width:60px;
height:100px;
`