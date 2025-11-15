import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Retrieve the token from the request if passed
  const { accessToken, refreshToken } = await req.json();

  const response = NextResponse.json(
    { message: "Cookies removed." },
    { status: 200 }
  );

  // ✅ Delete token cookie via response
  response.cookies.delete(accessToken);
  response.cookies.delete(refreshToken);

  return response;
}
