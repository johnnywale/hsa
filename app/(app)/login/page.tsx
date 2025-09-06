import {Metadata} from "next"
import Link from "next/link"
import Image from "next/image"

import {cn} from "@/lib/utils"
import {buttonVariants} from "@/registry/new-york-v4/ui/button"
import {LoginForm} from "@/app/(app)/login/components/login-form"

export const metadata: Metadata = {
    title: "Login",
    description: "Login form built using the components.",
}

export default function LoginPage() {
    return (
        <>

            <div
                className="relative container hidden flex-1 shrink-0 items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    href="/examples/authentication"
                    className={cn(
                        buttonVariants({variant: "ghost"}),
                        "absolute top-4 right-4 md:top-8 md:right-8"
                    )}
                >
                    Sign Up
                </Link>
                <div className="text-primary relative hidden h-full flex-col p-10 lg:flex dark:border-r">
                    <div className="bg-primary/5 absolute inset-0"/>
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-6 w-6"
                        >
                            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
                        </svg>
                        Accenture
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="leading-normal text-balance">
                            &ldquo;This library has saved me countless hours of work and
                            helped me deliver stunning designs to my clients faster than ever
                            before.&rdquo; - Sofia Davis
                        </blockquote>
                    </div>
                </div>
                <div className="flex items-center justify-center lg:h-[1000px] lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
                        <div className="flex flex-col gap-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Welcome back
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Enter your credentials to sign in
                            </p>
                        </div>
                        <LoginForm/>

                          {/*<p className="text-muted-foreground px-8 text-center text-sm">*/}
                          {/*    Don&apos;t have an account?{" "}*/}
                          {/*    <Link*/}
                          {/*        href="/examples/authentication"*/}
                          {/*        className="hover:text-primary underline underline-offset-4"*/}
                          {/*    >*/}
                          {/*        Sign up*/}
                          {/*    </Link>*/}
                          {/*</p>*/}

                    </div>
                </div>
            </div>
        </>
    )
}
