import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'
import errorHandler from "./db/helpers/errorHandler";
import { CustomError } from "./db/helpers/CustomError";

export async function middleware(req: NextRequest) {
    try {
        const { pathname } = req.nextUrl;

        if (
            pathname.includes("/api/login") ||
            pathname.includes("/api/register") ||
            pathname.includes("/api/handle-payment") ||
            pathname.includes("/_next") ||
            pathname.includes("/favicon.ico") ||
            !pathname.includes("/api")
        ) {
            return NextResponse.next();
        }

        if (pathname.includes("/api")) {
            const authHeader = req.headers.get("Authorization");
            
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new CustomError("Unauthorized - No token provided", 401);
            }

            const token = authHeader.substring(7);

            if (!token) {
                throw new CustomError("Unauthorized - Invalid token format", 401);
            }

            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jose.jwtVerify(token, secret);

            const requestHeaders = new Headers(req.headers);
            requestHeaders.set("x-user-id", payload.id as string);
            requestHeaders.set("x-user-email", payload.email as string);
            requestHeaders.set("x-user-username", payload.username as string);

            const response = NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });

            return response;
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Middleware error:", error);
        
        if (error instanceof jose.errors.JWTExpired) {
            throw new CustomError("Token expired", 401);
        }
        
        if (error instanceof jose.errors.JWTInvalid) {
            throw new CustomError("Invalid token", 401);
        }

        const { message, status } = errorHandler(error);
        return Response.json({ message }, { status });
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};