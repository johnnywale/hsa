import {createMDX} from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    typescript: {
        ignoreBuildErrors: true,
    },
    output: "export", // ✅ enable static export
    images: {
        unoptimized: true, // ✅ disable server image optimization
    }
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
