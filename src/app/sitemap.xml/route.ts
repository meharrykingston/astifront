export async function GET() {
  const SITE_URL = process.env.NODE_ENV === "development" 
    ? "http://localhost:3000" 
    : "https://astikan.com";

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages/count`);
    const { total } = await res.json(); 

    
    const limit = 50000;
    const sitemapCount = Math.ceil(total / limit) || 1; 

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (let i = 1; i <= sitemapCount; i++) {
      xml += `<sitemap><loc>${SITE_URL}/sitemaps/${i}.xml</loc></sitemap>`;
    }

    xml += `</sitemapindex>`;

    return new Response(xml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    
    return new Response(`...only 1 sitemap xml...`, { headers: { "Content-Type": "application/xml" } });
  }
}