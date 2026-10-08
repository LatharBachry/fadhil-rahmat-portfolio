import { NextResponse } from "next/server";

const DRIVE_API_URL = "https://www.googleapis.com/drive/v3/files";

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

  if (!id) {
    return new NextResponse("Project ID is missing.", {
      status: 400,
    });
  }

  const requestUrl = new URL(request.url);
  const resourceKey = requestUrl.searchParams.get("resourceKey");

  const metadataUrl = new URL(`${DRIVE_API_URL}/${id}`);

  metadataUrl.searchParams.set("key", apiKey);

  metadataUrl.searchParams.set(
    "fields",
    "id,name,mimeType,thumbnailLink,resourceKey",
  );

  try {
    const metadataHeaders: HeadersInit = {};

    if (resourceKey) {
      metadataHeaders["X-Goog-Drive-Resource-Keys"] = `${id}/${resourceKey}`;
    }

    const metadataResponse = await fetch(metadataUrl.toString(), {
      method: "GET",
      headers: metadataHeaders,
      cache: "no-store",
    });

    if (!metadataResponse.ok) {
      console.error(
        "Google Drive metadata error:",
        metadataResponse.status,
        await metadataResponse.text(),
      );

      return new NextResponse("Unable to retrieve project metadata.", {
        status: metadataResponse.status,
      });
    }

    const metadata = await metadataResponse.json();

    /*
     * Google Drive only provides thumbnailLink
     * when the requesting application can access
     * the thumbnail.
     */
    if (!metadata.thumbnailLink) {
      return new NextResponse("Thumbnail is not available for this file.", {
        status: 404,
      });
    }

    const thumbnailResponse = await fetch(metadata.thumbnailLink, {
      cache: "no-store",
    });

    if (!thumbnailResponse.ok || !thumbnailResponse.body) {
      return new NextResponse("Unable to retrieve project thumbnail.", {
        status: thumbnailResponse.status || 404,
      });
    }

    const headers = new Headers();

    headers.set(
      "Content-Type",
      thumbnailResponse.headers.get("content-type") ?? "image/jpeg",
    );

    headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");

    return new NextResponse(thumbnailResponse.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Google Drive thumbnail error:", error);

    return new NextResponse("Thumbnail request failed.", {
      status: 500,
    });
  }
}
