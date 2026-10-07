import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!apiKey) {
    return new NextResponse("Google Drive API key is missing.", {
      status: 500,
    });
  }

  const paramsUrl = new URLSearchParams({
    key: apiKey,
    fields: "id,name,mimeType,thumbnailLink,resourceKey",
  });

  try {
    const metadataResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${id}?${paramsUrl.toString()}`,
      {
        next: {
          revalidate: 3600,
        },
      },
    );

    if (!metadataResponse.ok) {
      return new NextResponse("Unable to retrieve file metadata.", {
        status: metadataResponse.status,
      });
    }

    const file = await metadataResponse.json();

    if (!file.thumbnailLink) {
      return new NextResponse("Thumbnail not available.", {
        status: 404,
      });
    }

    const thumbnailResponse = await fetch(file.thumbnailLink);

    if (!thumbnailResponse.ok) {
      return new NextResponse("Unable to retrieve thumbnail.", {
        status: thumbnailResponse.status,
      });
    }

    const contentType =
      thumbnailResponse.headers.get("content-type") ?? "image/jpeg";

    const imageBuffer = await thumbnailResponse.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Google Drive thumbnail error:", error);

    return new NextResponse("Thumbnail request failed.", {
      status: 500,
    });
  }
}
