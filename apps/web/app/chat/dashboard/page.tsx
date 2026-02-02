import { DashAnalytics } from "./dash-analytics";
import DashCards from "./dash-cards";

export default function DashboardPage() {
  return (
    <div className="mt-10 space-y-8 md:space-y-16">
      {/* Cards section */}
      <DashCards />
      {/* analytics section */}
      <DashAnalytics />
    </div>
  );
}
