import { Id } from "@/convex/_generated/dataModel";
import Details from "./details";

type DetailedReportPageParams = {
  params: Promise<{
    id: Id<"reports">;
  }>;
};
export default async function DetailedReportPage({
  params,
}: DetailedReportPageParams) {
  const { id } = await params;

  return (
    <div>
      <Details id={id} />
    </div>
  );
}
