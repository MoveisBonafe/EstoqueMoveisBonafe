import StatsOverview from "@/components/stats-overview";
import InventoryTabs from "@/components/inventory/inventory-tabs";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <StatsOverview />
      <InventoryTabs />
    </div>
  );
}
