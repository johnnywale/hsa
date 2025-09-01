import Link from "next/link"
import { cn } from "@/lib/utils"
import fs from "fs"
import path from "path"

export const metadata = {
  title: "Components Showcase",
  description: "A catalog of all registry/new-york-v4 component admin.",
}

// Generate the list of example files at build time
const admin_DIR = path.join(process.cwd(), "registry/new-york-v4/examples")
let exampleFiles: string[] = []

try {
  exampleFiles = fs
    .readdirSync(admin_DIR)
    .filter((file) => file.endsWith(".tsx"))
    .sort()
} catch (e) {
  console.warn("Could not read admin directory:", e)
}

export default function adminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Components Showcase</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {exampleFiles.map((file) => {
          // remove extension
          const name = file.replace(".tsx", "")
          // generate URL
          const url = `/registry/new-york-v4/examples/${name}`
          return (
            <li key={file}>
              <Link
                href={url}
                className={cn(
                  "block p-4 border rounded hover:shadow-md transition",
                  "bg-background text-foreground",
                )}
              >
                {name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
