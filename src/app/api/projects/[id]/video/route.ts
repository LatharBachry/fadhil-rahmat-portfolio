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

  const range = request.headers.get("range");

  try {
    /*
     * ------------------------------------------------
     * 1. Prepare Google Drive headers
     * ------------------------------------------------
     */

    const driveHeaders: HeadersInit = {};

    /*
     * Link-shared Drive files may require
     * a resource key.
     */
    if (resourceKey) {
      driveHeaders["X-Goog-Drive-Resource-Keys"] = `${id}/${resourceKey}`;
    }

    /*
     * ------------------------------------------------
     * 2. Get file metadata
     * ------------------------------------------------
     */

    const metadataUrl = new URL(`${DRIVE_API_URL}/${id}`);

    metadataUrl.searchParams.set("key", apiKey);

    metadataUrl.searchParams.set(
      "fields",
      ["id", "name", "mimeType", "size", "resourceKey", "capabilities"].join(
        ",",
      ),
    );

    const metadataResponse = await fetch(metadataUrl.toString(), {
      method: "GET",
      headers: driveHeaders,
      cache: "no-store",
    });

    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();

      console.error("Google Drive metadata error:", {
        status: metadataResponse.status,
        body: errorText,
        fileId: id,
        resourceKey,
      });

      return new NextResponse("Unable to retrieve video metadata.", {
        status: metadataResponse.status,
      });
    }

    const metadata = await metadataResponse.json();

    /*
     * ------------------------------------------------
     * 3. Resolve resource key
     * ------------------------------------------------
     *
     * If the request did not include a resource key
     * but Google returned one in metadata, use it.
     */

    if (metadata.resourceKey && !resourceKey) {
      driveHeaders["X-Goog-Drive-Resource-Keys"] =
        `${id}/${metadata.resourceKey}`;
    }

    /*
     * ------------------------------------------------
     * 4. Check download capability
     * ------------------------------------------------
     */

    if (metadata.capabilities && metadata.capabilities.canDownload === false) {
      console.error("Google Drive file cannot be downloaded:", {
        fileId: id,
        name: metadata.name,
      });

      return new NextResponse("This video cannot be downloaded.", {
        status: 403,
      });
    }

    /*
     * ------------------------------------------------
     * 5. Request actual video content
     * ------------------------------------------------
     */

    const videoUrl = new URL(`${DRIVE_API_URL}/${id}`);

    videoUrl.searchParams.set("alt", "media");

    videoUrl.searchParams.set("key", apiKey);

    /*
     * Important:
     *
     * HTML <video> sends Range requests
     * for seeking and progressive playback.
     */
    if (range) {
      driveHeaders["Range"] = range;
    }

    const videoResponse = await fetch(videoUrl.toString(), {
      method: "GET",
      headers: driveHeaders,
      cache: "no-store",
    });

    if (!videoResponse.ok || !videoResponse.body) {
      const errorText = await videoResponse.text();

      console.error("Google Drive video error:", {
        status: videoResponse.status,
        body: errorText,
        fileId: id,
        resourceKey,
        range,
      });

      return new NextResponse("Unable to retrieve video.", {
        status: videoResponse.status,
      });
    }

    /*
     * ------------------------------------------------
     * 6. Forward video response to browser
     * ------------------------------------------------
     */

    const headers = new Headers();

    headers.set(
      "Content-Type",
      metadata.mimeType ??
        videoResponse.headers.get("content-type") ??
        "video/mp4",
    );

    /*
     * Required for browser video seeking.
     */
    headers.set("Accept-Ranges", "bytes");

    const contentLength = videoResponse.headers.get("content-length");

    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    const contentRange = videoResponse.headers.get("content-range");

    if (contentRange) {
      headers.set("Content-Range", contentRange);
    }

    /*
     * Keep the proxy cacheable after the
     * Google Drive request has succeeded.
     */
    headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");

    /*
     * ------------------------------------------------
     * 7. Return stream
     * ------------------------------------------------
     */

    return new NextResponse(videoResponse.body, {
      status: videoResponse.status,
      headers,
    });
  } catch (error) {
    console.error("Google Drive video error:", error);

    return new NextResponse("Video request failed.", {
      status: 500,
    });
  }
}
