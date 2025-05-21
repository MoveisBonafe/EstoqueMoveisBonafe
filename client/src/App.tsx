import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { InventoryProvider } from "./contexts/inventory-context";
import LoadingOverlay from "./components/loading-overlay";
import TopNavbar from "./components/layout/top-navbar";
import Sidebar from "./components/layout/sidebar";
import Home from "./pages/home";
import Suppliers from "./pages/suppliers";
import Orders from "./pages/orders";
import Outputs from "./pages/outputs";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/orders" component={Orders} />
      <Route path="/outputs" component={Outputs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <InventoryProvider>
            <div className="h-screen flex flex-col bg-gray-50">
              <LoadingOverlay />
              <Toaster />
              <TopNavbar />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <Router />
              </div>
            </div>
          </InventoryProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
