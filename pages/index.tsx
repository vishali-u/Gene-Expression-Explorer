import FileUpload from "@/components/Input/FileUpload";
import DEGeneTable from "@/components/Tables/DEGeneTable";

export default function Home() {
    return (
      <div className="container mx-auto p-8">
          <h1 className="text-xl font-bold">Gene Expression Explorer</h1>
          <FileUpload />
          <DEGeneTable />
      </div>
    );
}