"use client"

import * as React from "react"
import {useRouter} from "next/navigation"
import {toast} from "sonner"
import {cn} from "@/lib/utils"
import {Icons} from "@/components/icons"
import {Button} from "@/registry/new-york-v4/ui/button"
import {Input} from "@/registry/new-york-v4/ui/input"
import {Label} from "@/registry/new-york-v4/ui/label"
import {Checkbox} from "@/registry/new-york-v4/ui/checkbox"

import {LoginApi} from "@/lib/api";
import {Configuration} from "@/lib/api/runtime";


export function LoginForm({className, ...props}: React.ComponentProps<"div">) {
    const [isLoading, setIsLoading] = React.useState(false)
    const [email, setEmail] = React.useState("johndoe")
    const [password, setPassword] = React.useState("P@ssw0rd123")
    const [remember, setRemember] = React.useState(false)
    const router = useRouter()

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)


        const apiConfig = new Configuration({
            basePath: "/s3/v1", // ✅ correct key
            accessToken: async () => {
                if (typeof window !== "undefined") {
                    return localStorage.getItem("token") || ""
                }
                return ""
            },
        })
        try {
            const loginApi = new LoginApi(apiConfig)

            // ✅ send real form data
            const res = await loginApi.loginPost({
                loginRequest: {
                    username: email,
                    password: password,
                },
            })

            // depending on OpenAPI generator, res may have `.data` or be directly the response
            const token = res?.accessToken
            if (!token) throw new Error("No token returned from API")

            localStorage.setItem("token", token)
            toast.success("Welcome back!")
            router.replace("/admin/dashboard")
        } catch
            (err: any) {
            toast.error(err.message || "Login failed")
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            checked={remember}
                            onCheckedChange={(val) => setRemember(!!val)}
                        />
                        <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                            Remember me
                        </Label>
                    </div>
                    <a href="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                    </a>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>}
                    Sign In
                </Button>
            </form>
        </div>
    )
}
