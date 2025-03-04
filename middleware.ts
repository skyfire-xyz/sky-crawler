import { NextResponse, type NextRequest } from "next/server"

import { clientConfigs } from "@/lib/client-config"

export function middleware(request: NextRequest) {
  // Get domain
  const hostname = request.headers.get("host") || ""
  const domain = hostname.split(".")[0]

  // Check if it's a valid client domain
  if (domain && clientConfigs[domain]) {
    // Apply client-specific auth if needed
    const [AUTH_USER, AUTH_PASS] = (
      process.env[
        `BASIC_AUTH_CREDENTIALS_${domain.toUpperCase().replace("-", "_")}`
      ] ||
      process.env.BASIC_AUTH_CREDENTIALS ||
      ":"
    ).split(":")

    if (!AUTH_USER || !AUTH_PASS) {
      return NextResponse.next()
    }

    const authHeader =
      request.headers.get("authorization") ||
      request.headers.get("Authorization")

    if (!authHeader) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Protected Site"',
        },
      })
    }

    try {
      const encodedCredentials = authHeader.split(" ")[1]
      const decodedCredentials = Buffer.from(
        encodedCredentials,
        "base64"
      ).toString()
      const [username, password] = decodedCredentials.split(":")

      if (username === AUTH_USER && password === AUTH_PASS) {
        return NextResponse.next()
      }
    } catch (error) {
      console.error("Auth error:", error)
    }

    return new NextResponse("Authentication failed", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Protected Site"',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
