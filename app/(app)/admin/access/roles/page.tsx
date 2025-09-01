import { DataTable } from "@/app/(app)/admin/components/data-table"
import data from "@/app/(app)/examples/dashboard/data.json"
import { SectionCards } from "@/app/(app)/admin/dashboard/components/section-cards"

export default function chunksPage() {
  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
