"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

export default function RoleUploadForm() {
  const router = useRouter()
  const params = useParams()
  const roleId = params?.id as string

  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  // Fetch existing role data when component mounts
  React.useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch(`/api/roles/${roleId}`)
        if (!res.ok) throw new Error("Failed to fetch role")

        const data = await res.json()
        setName(data.name || "")
        setDescription(data.description || "")
      } catch (err) {
        console.error(err)
        alert("Error fetching role data")
      } finally {
        setLoading(false)
      }
    }

    if (roleId) {
      fetchRole()
    }
  }, [roleId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/roles/${roleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      })

      if (!res.ok) throw new Error("Failed to update role")

      router.back()
    } catch (err) {
      console.error(err)
      alert("Error updating role")
    }
  }

  if (loading) {
    return <div className="mt-10 ml-20">Loading...</div>
  }

  return (
    <div className="mt-10 ml-20 w-full">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Edit Role</CardTitle>
          <CardDescription>
            Update role name and description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  placeholder="Enter role name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter role description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <CardFooter className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
