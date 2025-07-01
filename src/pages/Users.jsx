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

import {
  useChangeStatusMutation,
  useGetAllUsersQuery,
  useGetUserUplineMutation,
} from "../features/api/adminApi";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Pagination,
  styled,
  Switch,
  Typography,
} from "@mui/material";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";

const Users = () => {
  const authToken = localStorage.getItem("authToken");
  const location = useLocation();
  const [page, setPage] = useState(1);
const [uplinePage, setUplinePage] = useState(1)
const [selectedUserId, setSelectedUserId] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [userStatusMap, setUserStatusMap] = useState({});

  const handleCloseDialogBox = () => {
    setOpenDrawer(!openDrawer);
  };

const { data, isLoading, isError, error, refetch } = useGetAllUsersQuery(
  { token: authToken, page },
  { refetchOnMountOrArgChange: true } 
);

  const [
    getUserUpline,
    {
      data: uplineData,
      isError: uplineIsError,
      isLoading: uplineLoading,
      error: uplineError,
    },
  ] = useGetUserUplineMutation();

  console.log("uplineData", uplineData);
const handleDialogBoxOpen = async (userId) => {
  setSelectedUserId(userId);
  setOpenDrawer(true);
  setUplinePage(1); 
  await getUserUpline({ token: authToken, userId, uplinePage: 1 });
};

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
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleUplinePageChange = (event, value) => {
    setUplinePage(value);
  };

  const usersPerPage = data?.limit || 0;
  const totalUsers = data?.total || 0;
  const curUserPage = page;

  const uplinePerPage = uplineData?.data?.limit || 0;
  const totalUplines = uplineData?.data?.totalUplines || 0;
  const curUplinePage = uplinePage;

  useEffect(() => {
    if (isError && error) {
      toast.error(error?.data.message || 'Something went wrong');
    }
  }, [error, isError]);
  useEffect(() => {
    if (uplineIsError && uplineError) {
      toast.error(uplineError?.data?.message);
    }
  }, [uplineIsError, uplineError]);

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
  useEffect(() => {
  if (openDrawer && selectedUserId) {
    getUserUpline({ token: authToken, userId: selectedUserId, uplinePage });
  }
}, [uplinePage]);

  return (
    <>
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
                            <TableCell>
                              <TableCell>{user.fullName || "N/A"}</TableCell>
                              <Button
                                style={{
                                  textTransform: "capitalize",
                                  backgroundColor: "#95b89b",
                                }}
                                variant="contained"
                                onClick={() =>
                                  handleDialogBoxOpen(user?.userId)
                                }
                                startIcon={<PublishedWithChangesOutlinedIcon />}
                              >
                                My uplined Users
                              </Button>
                            </TableCell>
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {usersPerPage < totalUsers && (
                      <>
                        <Typography>
                          <p>
                            Showing {data?.users.length} of {totalUsers} users
                          </p>
                        </Typography>
                        <Pagination
                          count={Math.ceil(totalUsers / usersPerPage)}
                          page={curUserPage}
                          onChange={handlePageChange}
                          color="primary"
                          shape="rounded"
                          size="large"
                        />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <Dialog
        open={openDrawer}
        onClose={handleCloseDialogBox}
        PaperProps={{
          sx: {
            width: "1600px",
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                fontSize: "20px",
                fontFamily: "Montserrat",
                fontWeight: "600",
              }}
            >
              Uplines of {uplineData?.data?.fullName || "N/A"} ( user Id :{" "}
              {uplineData?.data?.userId})
            </Typography>
            <IconButton onClick={handleCloseDialogBox}>
              <CloseOutlinedIcon sx={{ color: "#ffffff" }} />
            </IconButton>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <p>Uplined members of this user</p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ color: "#ffffff" }}>S.NO</TableHead>
                  <TableHead style={{ color: "#ffffff" }}>Full Name</TableHead>
                  <TableHead style={{ color: "#ffffff" }}>
                    Phone Number
                  </TableHead>
                  <TableHead style={{ color: "#ffffff" }}>Email</TableHead>
                  <TableHead style={{ color: "#ffffff" }}>User Id</TableHead>
                  <TableHead style={{ color: "#ffffff" }}>Label</TableHead>
                  <TableHead style={{ color: "#ffffff" }}>Status</TableHead>
                  <TableHead style={{ color: "#ffffff" }}>
                    Joining Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uplineLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      <div className="flex items-center justify-center gap-2">
                        <CircularProgress size={20} />
                        <span>Loading uplined users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : uplineData?.data?.uplines?.length > 0 ? (
                  uplineData?.data?.uplines.map((user, i) => (
                    <TableRow key={user._id || i}>
                      <TableCell>{i + 1}</TableCell>

                      <TableCell>{user.fullName || "N/A"}</TableCell>

                      <TableCell>{user.phone || "N/A"}</TableCell>
                      <TableCell>{user.email || "N/A"}</TableCell>

                      <TableCell>{user.userId || "N/A"}</TableCell>
                      <TableCell>{user.level || "N/A"}</TableCell>
                      <TableCell>
                        {user.status === true ? (
                          "Active"
                        ) : (
                          <span style={{ color: "gray" }}>Inactive</span>
                        )}
                      </TableCell>
                      <TableCell>{user.dateTime || "N/A"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      No uplined users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {uplinePerPage < totalUplines && (
                <>
                  <Typography>
                    <p>
                      Showing {uplineData?.data?.uplines.length} of  {totalUplines} uplined users
                    </p>
                  </Typography>
                  <Pagination
                    count={Math.ceil(totalUplines / uplinePerPage)}
                    page={curUplinePage}
                    onChange={handleUplinePageChange}
                    shape="rounded"
                    color="primary"
                    size="large"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "green",
                        borderColor: "green",
                      },
                      "& .Mui-selected": {
                        backgroundColor: "green",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#228B22",
                        },
                      },
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </DialogContentContainer>
      </Dialog>
    </>
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
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Bank">
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

export default Users;

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
