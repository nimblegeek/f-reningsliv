import { Switch, Route } from "wouter";
import { Loader2 } from "lucide-react";
import { HomePage } from "./pages/HomePage";
import { AdminDashboard } from "./components/AdminDashboard";
import AuthPage from "./pages/AuthPage";
import { useUser } from "./hooks/use-user";
import { Button } from "./components/ui/button";

function App() {
  const { user, isLoading, logout } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen">
        <header className="border-b bg-background">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <Button variant="ghost" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <AdminDashboard />
        </main>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/admin" component={AuthPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  );
}

export default App;
