import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!apiKey) {
    return new NextResponse("Google Drive API key is missing.", {
      status: 500,
    });
  }

  const range = request.headers.get("range");

  const url = new URL(`https://www.googleapis.com/drive/v3/files/${id}`);

  url.searchParams.set("alt", "media");
  url.searchParams.set("key", apiKey);

  try {
    const response = await fetch(url.toString(), {
      headers: range
        ? {
            Range: range,
          }
        : undefined,
    });

    if (!response.ok || !response.body) {
      return new NextResponse("Unable to retrieve video.", {
        status: response.status,
      });
    }

    const headers = new Headers();

    headers.set(
      "Content-Type",
      response.headers.get("content-type") ?? "video/mp4",
    );

    headers.set(
      "Accept-Ranges",
      response.headers.get("accept-ranges") ?? "bytes",
    );

    const contentLength = response.headers.get("content-length");

    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    const contentRange = response.headers.get("content-range");

    if (contentRange) {
      headers.set("Content-Range", contentRange);
    }

    headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("Google Drive video error:", error);

    return new NextResponse("Video request failed.", {
      status: 500,
    });
  }
}
