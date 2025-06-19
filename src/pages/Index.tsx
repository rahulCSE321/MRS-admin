
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to Admin Dashboard</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A powerful admin dashboard built with React, Vite, and Shadcn UI
      </p>
      <Button asChild>
        <Link to="/dashboard">
          Go to Dashboard
        </Link>
      </Button>
    </div>
  );
};

export default Index;
