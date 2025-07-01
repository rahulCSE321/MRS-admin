import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
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
import { useGetUsersIncomeMutation } from "../features/api/adminApi";
import {
  Button,
  CircularProgress,
  Pagination,
  styled,
  TableContainer,
  Typography,
} from "@mui/material";

const UsersIncome = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const authToken = localStorage.getItem("authToken");
  const location = useLocation();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [formattedFromDate, setFormattedFromDate] = useState("");
  const [formattedToDate, setFormattedToDate] = useState("");

  const [getUsersIncome, { data, isLoading, isError, error, isSuccess }] =
    useGetUsersIncomeMutation();

  const handleFromDateChange = (e) => {
    const inputDate = e.target.value;
    const [year, month, day] = inputDate.split("-");
    const formatted = `${day}-${month}-${year}`;
    setFromDate(inputDate);
    setFormattedFromDate(formatted);
  };

  const handleToDateChange = (e) => {
    const inputDate = e.target.value;
    const [year, month, day] = inputDate.split("-");
    const formatted = `${day}-${month}-${year}`;
    setToDate(inputDate);
    setFormattedToDate(formatted);
  };

  const handleSubmit = async () => {
    try {
      await getUsersIncome({
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        token: authToken,
        page,
        search: searchTerm,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const formatINRCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const resultPerPage = data?.limit || 0;
  const totalUsers = data?.total || 0;
  const currentPage = page;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    if (isError && error?.data?.message) {
      toast.error(error.data.message);
    }
  }, [error, isError]);
useEffect(() => {
  if (formattedFromDate && formattedToDate) {
    getUsersIncome({
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      token: authToken,
      page,
      search: searchTerm,
    });
  }
}, [page, searchTerm]);


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
                <div
                  style={{
                    height: "60px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <CardTitle className="">Reward Income</CardTitle>
                  <CardDescription>
                    View users and their reward income for selected date range
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "23px",
                  }}
                  className="h-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CalendarMonthOutlinedIcon className="h-5 w-5 mr-2" />
                    Select Date Range
                  </h2>

                  <div className="flex flex-row items-center justify-between  ">
                    {/* From Date */}
                    <div style={{ width: "230px" }}>
                      <label
                        htmlFor="fromDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        From Date
                      </label>
                      <input
                        type="date"
                        name="fromDate"
                        required
                        value={fromDate}
                        onChange={handleFromDateChange}
                        id="fromDate"
                        className="w-full cursor-pointer px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* To Date */}
                    <div style={{ width: "230px" }}>
                      <label
                        htmlFor="toDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        To Date
                      </label>
                      <input
                        type="date"
                        id="toDate"
                        required
                        value={toDate}
                        onChange={handleToDateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Search Input */}
                    <div>
                      <label
                        htmlFor="search"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Search User
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          id="search"
                          name="search"
                          onChange={handleSearchChange}
                          value={searchTerm}
                          placeholder="Search by user name..."
                          className="w-full px-5 py-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <SearchOutlinedIcon
                          sx={{
                            position: "absolute",
                            right: "4px",
                            top: "10px",
                          }}
                        />
                      </div>
                    </div>

                    <ButtonContainer
                      disabled={isLoading}
                      onClick={handleSubmit}
                      endIcon={<SearchOutlinedIcon className="h-4 w-4 mr-2" />}
                    >
                      {isLoading ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "20px",
                            alignItems: "center",
                          }}
                        >
                          <CircularProgress size={20} />{" "}
                          <p style={{ color: "white" }}>Fetching ...</p>
                        </div>
                      ) : (
                        "Search"
                      )}
                    </ButtonContainer>
                  </div>
                </div>
              </CardContent>

              {isSuccess && (
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      padding: "15px",
                    }}
                  >
                    <Typography sx={{ fontSize: "18px" }} variant="body1">
                      Users and Their Reward Income
                    </Typography>
                    <Typography
                      sx={{ fontSize: "15px", color: "gray" }}
                      variant="body2"
                    >
                      From {formattedFromDate} to {formattedToDate}
                    </Typography>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S.No</TableHead>
                        <TableHead>User Name</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Date & Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6">
                            <div className="flex items-center justify-center gap-2">
                              <CircularProgress size={20} />
                              <span>Loading users...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : data?.data?.length > 0 ? (
                        data.data.map((user, i) => (
                          <TableRow key={user._id || i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{user.userName || "N/A"}</TableCell>
                            <TableCell>
                              {" "}
                              {formatINRCurrency(user.balance) || "N/A"}
                            </TableCell>
                            <TableCell>{user.dateTime || "N/A"}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6">
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
                    {resultPerPage < totalUsers && (
                      <>
                        <Typography>
                          <p>
                            Showing {data?.data.length} of
                            {totalUsers} users
                          </p>
                        </Typography>
                        <Pagination
                          count={Math.ceil(totalUsers / resultPerPage)}
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                          shape="rounded"
                          size="large"
                        />
                      </>
                    )}
                  </div>
                </CardContent>
              )}
              {!isSuccess && (
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                    className="h-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
                  >
                    <PeopleAltOutlinedIcon
                      sx={{ fontSize: "100px", color: "gray" }}
                    />
                    <Typography sx={{ fontSize: "18px" }} variant="body1">
                      Ready to View Reward Income
                    </Typography>
                    <Typography
                      sx={{ fontSize: "15px", color: "gray" }}
                      variant="body2"
                    >
                      Select your date range and click the search button to view
                      users and their reward income.
                    </Typography>
                  </div>
                </CardContent>
              )}
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
              <SidebarMenuButton asChild i tooltip="Dashboard">
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
              <SidebarMenuButton asChild  tooltip="User Plan History">
                <Link to="/user-plan-history">
                  <History className="h-5 w-5" />
                  <span>User Plan History</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive tooltip="User Plan History">
                <Link to="/users-income">
                  <History className="h-5 w-5" />
                  <span>User's Income </span>
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

export default UsersIncome;

const ButtonContainer = styled(Button)`
  width: 200px;
  background-color: #000000;
  margin-top: 20px;
  padding: 8px;
  text-transform: capitalize;
  color: #ffffff;
`;
