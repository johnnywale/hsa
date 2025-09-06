import {createMDX} from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    typescript: {
        ignoreBuildErrors: true,
    },
    output: "export", // ✅ enable static export
    basePath: "/s3",
    images: {
        unoptimized: true, // ✅ disable server image optimization
    },
    async rewrites() {
        return [
            {
                source: "/v1/:path*",      // Match anything starting with /v1
                destination: "https://yjfb8r8vuh.execute-api.ap-southeast-1.amazonaws.com/s3/v1/:path*", // Forward to remote
            },
        ];
    },

}

const withMDX = createMDX({})

export default withMDX(nextConfig)
