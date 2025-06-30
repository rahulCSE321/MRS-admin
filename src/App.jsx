import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import MasterPlan from "./pages/MasterPlan";
import UserPlanHistory from "./pages/UserPlanHistory";
import UsersIncome from "./pages/UsersIncome";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/master-plan" element={<MasterPlan />} />
        <Route path="/user-plan-history" element={<UserPlanHistory />} />
        <Route path="/users-income" element={<UsersIncome />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
