import { PlayAnalytics } from "./component/play-analytics";
import PlayCards from "./component/play-cards";
import PlayHeader from "./component/play-header";

export default function PlaygroundPage() {
  return (
    <div className="space-y-6 md:space-y-14">
      {/* Welcome header */}
      <PlayHeader />
      {/* cards */}
      <PlayCards />
      {/* charts of 2 different types */}
      <PlayAnalytics />
    </div>
  );
}
