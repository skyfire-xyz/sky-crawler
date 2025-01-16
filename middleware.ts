import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if auth credentials are configured
  const [AUTH_USER, AUTH_PASS] = (
    process.env.BASIC_AUTH_CREDENTIALS || ":"
  ).split(":")

  if (!AUTH_USER || !AUTH_PASS) {
    console.warn("Basic auth credentials not configured")
    return NextResponse.next()
  }

  const authHeader =
    request.headers.get("authorization") || request.headers.get("Authorization")

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
