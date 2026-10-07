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
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: `'${folderId}' in parents and trashed = false and mimeType contains 'video/'`,
    fields:
      "files(id,name,mimeType,thumbnailLink,webViewLink,createdTime,modifiedTime,size,resourceKey)",
    orderBy: "name",
    pageSize: "100",
  });

  try {
    const response = await fetch(`${DRIVE_API_URL}?${params.toString()}`, {
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: "Failed to fetch Google Drive files.",
          details: errorText,
        },
        { status: response.status },
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
        createdTime?: string;
        modifiedTime?: string;
        size?: string;
        resourceKey?: string;
      }) => {
        const cleanName = file.name.replace(/\.[^/.]+$/, "");

        const yearSource =
          file.modifiedTime ?? file.createdTime ?? new Date().toISOString();

        return {
          id: file.id,
          slug: file.id,
          title: cleanName,
          category: "Video Project",
          year: new Date(yearSource).getFullYear(),
          video: `https://drive.google.com/file/d/${file.id}/preview`,
          thumbnail: `/api/projects/${file.id}/thumbnail`,
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
      { status: 500 },
    );
  }
}
