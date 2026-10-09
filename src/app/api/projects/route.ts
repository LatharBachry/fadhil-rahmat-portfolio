import { NextResponse } from "next/server";

const DRIVE_API_URL = "https://www.googleapis.com/drive/v3/files";

export async function GET() {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!apiKey || !folderId) {
    return NextResponse.json(
      {
        error: "Google Drive environment variables are missing.",
      },
      {
        status: 500,
      },
    );
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: `'${folderId}' in parents and trashed = false and mimeType contains 'video/'`,
    fields: "files(id,name,mimeType,thumbnailLink,webViewLink,resourceKey)",
    orderBy: "name",
    pageSize: "100",
  });

  try {
    const response = await fetch(`${DRIVE_API_URL}?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Google Drive files error:", response.status, errorText);

      return NextResponse.json(
        {
          error: "Failed to fetch Google Drive files.",
          details: errorText,
        },
        {
          status: response.status,
        },
      );
    }

    const data = await response.json();

    const projects = (data.files ?? []).map(
      (file: {
        id: string;
        name: string;
        mimeType: string;
        thumbnailLink?: string;
        webViewLink?: string;
        resourceKey?: string;
      }) => {
        const cleanName = file.name.replace(/\.[^/.]+$/, "");

        // Underscore pertama memisahkan kategori dan judul.
        const separatorIndex = cleanName.indexOf("_");

        let category = "OTHER";
        let title = cleanName.trim();

        if (separatorIndex !== -1) {
          category = cleanName.slice(0, separatorIndex).trim().toUpperCase();

          title = cleanName.slice(separatorIndex + 1).trim();
        }

        // Thumbnail endpoint.
        const thumbnailUrl = new URL(
          `/api/projects/${file.id}/thumbnail`,
          "http://localhost",
        );

        if (file.resourceKey) {
          thumbnailUrl.searchParams.set("resourceKey", file.resourceKey);
        }

        // Video endpoint.
        const videoUrl = new URL(
          `/api/projects/${file.id}/video`,
          "http://localhost",
        );

        if (file.resourceKey) {
          videoUrl.searchParams.set("resourceKey", file.resourceKey);
        }

        return {
          id: file.id,
          slug: file.id,
          title,
          category,
          video: `${videoUrl.pathname}${videoUrl.search}`,
          thumbnail: `${thumbnailUrl.pathname}${thumbnailUrl.search}`,
        };
      },
    );

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Google Drive API error:", error);

    return NextResponse.json(
      {
        error: "Unable to connect to Google Drive.",
      },
      {
        status: 500,
      },
    );
  }
}
