import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // 1. Type ko Promise banao
) {
  const SITE_URL = process.env.NODE_ENV === "development" 
    ? "http://localhost:3000" 
    : "https://astikan.com";

  // 2. Params ko await karo (Ye sabse zaroori hai)
  const resolvedParams = await params; 
  const rawId = resolvedParams.id; 

  if (!rawId) {
    return new Response("ID not found", { status: 400 });
  }

  // 3. Ab replace aur parseInt sahi se chalega
  const idString = rawId.replace(".xml", ""); 
  const pageNum = parseInt(idString);
  
  console.log("Processing Sitemap ID:", pageNum);

  if (isNaN(pageNum)) {
    return new Response(`Invalid Sitemap ID: ${rawId}`, { status: 400 });
  }

  const limit = 50000;
  const skip = (pageNum - 1) * limit;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages?skip=${skip}&limit=${limit}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) throw new Error("Backend connection failed");

    const data = await res.json();
    const pages = data.pages || [];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages.map((p: any) => `
        <url>
          <loc>${SITE_URL}${p.url}</loc>
          <lastmod>${new Date(p.updatedAt || Date.now()).toISOString()}</lastmod>
        </url>
      `).join("")}
    </urlset>`.trim();

    return new Response(xml, {
      headers: { 
        "Content-Type": "application/xml",
        "Cache-Control": "no-store, max-age=0" 
      },
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return new Response("Backend Fetch Error", { status: 500 });
  }
}