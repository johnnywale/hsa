"use client"

import {DataTable} from "@/app/(app)/admin/components/data-table"
import {schemas, schemaToColumns} from "@/lib/schema";
import {z} from "zod";

export default function ChunksPage() {
    const baseUrl = "/s3/v1/user"
    const UserWithPassword = schemas.User.omit({passwordHash: true}).extend({
        password: z.string().optional(),
    })

    const config = schemaToColumns(UserWithPassword)
    return (
        <div className="flex flex-1 flex-col mt-12">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

                    <DataTable data={[]}
                               config={config}
                               schema={schemas.User}
                               baseUrl={baseUrl}
                    />
                </div>
            </div>
        </div>
    )
}
