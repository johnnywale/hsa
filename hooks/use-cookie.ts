"use client"

import { useEffect, useState } from "react"

export function useCookie(name: string) {
    const [value, setValue] = useState<string | null>(null)

    useEffect(() => {
        const getCookie = () => {
            const cookie = document.cookie
                .split("; ")
                .find((row) => row.startsWith(name + "="))
            return cookie ? decodeURIComponent(cookie.split("=")[1]) : null
        }

        setValue(getCookie())
    }, [name])

    return value
}
