import {
  Card,
  CardContent,

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
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
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
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import toast from "react-hot-toast";
import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Pagination,
  styled,
  Typography,
} from "@mui/material";
import {
  useGetAllUsersQuery,
  useGetBankDetailsByIdMutation,
} from "../features/api/adminApi";
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

const Bank = () => {
  const authToken = localStorage.getItem("authToken");
  const [page, setPage] = useState(1);
  const [openDrawer, setOpenDrawer] = useState(false);

  const { data, isLoading, isSuccess, isError, error } = useGetAllUsersQuery({
    token: authToken,
    page,
  });

  const [
    getBankDetailsById,
    {
      data: bankDetailsData,
      isLoading: bankDetailsLoading,
      isError: bankDetailsIsError,
      error: bankDetailsError,
    },
  ] = useGetBankDetailsByIdMutation();

  console.log("bankDetailsData", bankDetailsData);

  const handlePageChange = (e, value) => {
    setPage(value);
  };

  const handleCloseDialogBox = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleDialogBoxOpen = async (userId, name) => {
    // setSelectedUserId(userId);
    localStorage.setItem("userName", name);
    setOpenDrawer(true);
    // setUplinePage(1);
    await getBankDetailsById({ token: authToken, userId });
  };

  useEffect(() => {
    if (isError && error?.data?.message) {
      toast.error(error?.data.message || "Something went wrong");
    }
  }, [isError, error]);
  useEffect(() => {
    if (bankDetailsIsError && bankDetailsError) {
      toast.error(bankDetailsError?.data?.message || "Something went wrong");
    }
  }, [bankDetailsIsError, bankDetailsError]);

  const resultPerPage = data?.limit || 0;
  const totalUsers = data?.total || 0;
  const currentPage = page;

  return (
    <>
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
                <h1 className="text-xl font-semibold">Bank</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
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
                    <CardTitle>Bank Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S.No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Actions</TableHead>
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
                      ) : data?.users.length > 0 ? (
                        data?.users.map((user, i) => (
                          <TableRow key={user._id}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell style={{ width: "300px" }}>
                              {user?.fullName || "N/A"}
                            </TableCell>
                            <TableCell style={{ width: "280px" }}>
                              {user?.email || "N/A"}
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              {" "}
                              +91 {user?.phone || "N/A"}
                            </TableCell>
                            <TableCell>
                              <Button
                                sx={{ backgroundColor: "#008080" }}
                                variant="contained"
                                onClick={() =>
                                  handleDialogBoxOpen(
                                    user?.userId,
                                    user?.fullName
                                  )
                                }
                                startIcon={<RemoveRedEyeOutlinedIcon />}
                              >
                                View Bank Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-6">
                            No Users Found
                          </TableCell>
                          <TableCell></TableCell>
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
        fullWidth
        onClose={handleCloseDialogBox}
        open={openDrawer}
        PaperProps={{
          sx: {
            width: "1000px",
            maxWidth: "90%",
            backgroundColor: "#000000",
            opacity: 0.6,
            borderRadius: "30px",
            color: "#ffffff",
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <DialogContentContainer>
          <PaginationContainer>
            <BankDetailsTypography>
              Bank Account Details ({localStorage.getItem("userName") || "N/A"})
            </BankDetailsTypography>
            <IconButton onClick={handleCloseDialogBox}>
              <CloseOutlinedIcon sx={{ color: "#ffffff" }} />
            </IconButton>
          </PaginationContainer>
          {bankDetailsLoading && (
            <BankDetailsLoading>
              <CircularProgress sx={{ color: "white" }} /> <p>Please Wait</p>{" "}
            </BankDetailsLoading>
          )}

          {bankDetailsData?.banks?.length > 0 ? (
            bankDetailsData?.banks?.map((curBank, i) => {
              return (
                <BankDetailsContainer>
                  <BankDetailsSectionOne>
                    <p
                      style={{
                        fontSize: "23px",
                        fontWeight: "800",
                        fontStyle: "Montserrat",
                      }}
                    >
                      Account #{i + 1}
                    </p>
                    <div>
                      {curBank?.isPrimary === true ? (
                        <Button sx={{display:"flex",justifyContent:"center",alignItems:"center",textTransform:"capitalize"}} variant="contained" color="success" startIcon={<VerifiedUserOutlinedIcon/>} >Primary Account</Button>
                      ) : (
                        ""
                      )}
                    </div>
                  </BankDetailsSectionOne>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <BankDetail>
                      <BankDetails>
                        <Paragraph>Account Holder Name</Paragraph>
                        <CurPara>{curBank?.accountHolderName || "N/A"}</CurPara>
                      </BankDetails>
                      <BankDetails>
                        <Paragraph>Bank Name</Paragraph>
                        <CurPara>{curBank?.bank || "N/A"}</CurPara>
                      </BankDetails>
                    </BankDetail>
                    <BankDetail>
                      <BankDetails>
                        <Paragraph>Account Number</Paragraph>
                        <CurPara>{curBank?.accountNumber || "N/A"}</CurPara>
                      </BankDetails>
                      <BankDetails>
                        <Paragraph>Branch</Paragraph>
                        <CurPara>{curBank?.branch || "N/A"}</CurPara>
                      </BankDetails>
                    </BankDetail>
                    <BankDetail>
                      <BankDetails style={{marginRight:"200px"}}>
                        <Paragraph>IFSC Code</Paragraph>
                        <CurPara>{curBank?.ifsc || "N/A"}</CurPara>
                      </BankDetails>
                      <BankDetails>
                        <Paragraph>Bank Id</Paragraph>
                        <CurPara>{curBank?.bankId || "N/A"}</CurPara>
                      </BankDetails>
                    </BankDetail>
                  </div>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCloseDialogBox}
                    sx={{
                      backgroundColor: "green",
                      color: "white",
                      textTransform: "capitalize",
                      height: "50px",
                    }}
                  >
                    Close
                  </Button>
                </BankDetailsContainer>
              );
            })
          ) : (
            <BankDetailsLoading>
              <p>No any bank details found for this user</p>
            </BankDetailsLoading>
          )}
        </DialogContentContainer>
      </Dialog>
    </>
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
              <SidebarMenuButton asChild isActive tooltip="Bank">
                <Link to="/banks">
                  <History className="h-5 w-5" />
                  <span>Bank</span>
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

export default Bank;

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
const PaginationContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const BankDetailsLoading = styled("div")`
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;
const BankDetailsContainer = styled("div")`
  width: 100%;
  height: auto;
  border: 2px solid green;
  background-color: #d0f0c0;
  border-radius: 10px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #000000;
`;
const BankDetailsSectionOne = styled("div")`
  width: 100%;
  height: 40px;

  display: flex;

  justify-content: space-between;
  color: #000000;
`;
const BankDetail = styled("div")`
  display: flex;

  flex-direction: column;
  gap: 30px;
`;
const BankDetails = styled("div")`
  display: flex;

  flex-direction: column;
  gap: 4px;
`;

const BankDetailsTypography = styled(Typography)`
  font: 600 20px Montserrat;
`;
const Paragraph = styled("p")`
  font: 600 18px Montserrat;
`;
const CurPara = styled("p")`
  font: 400 16px Montserrat;
`;
