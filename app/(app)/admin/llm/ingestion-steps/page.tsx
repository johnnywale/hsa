"use client"

import {DataTable} from "@/app/(app)/admin/components/data-table"
import {schemas, schemaToColumns} from "@/lib/schema";

export default function ChunksPage() {
    const baseUrl = "/s3/v1/ingestion-job"
    const config = schemaToColumns(schemas.IngestionStep)
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">


                    <DataTable data={[]}
                               config={config}
                               schema={schemas.IngestionStep}
                               baseUrl={baseUrl}
                    />
                </div>
            </div>
        </div>
    )
}
