import { auth } from "@clerk/nextjs/server";
import UploadArea from "./upload-area";
import ReportsTable from "./reports-table";

export default async function ReportsPage() {
  const { userId } = await auth();
  return (
    <div className="mt-10">
      {/* Upload area */}
      <UploadArea userId={userId as string} />
      {/* Reports list in table  */}
      <ReportsTable />
    </div>
  );
}
