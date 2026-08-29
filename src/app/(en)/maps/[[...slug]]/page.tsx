import { ContentPage, getContentPageMetadata } from "@/app/_shared/content-page";
import { getAllContent } from "@/lib/content";

const contentType = "maps";
export const dynamicParams = false;

export async function generateStaticParams() {
  // Optional catch-all [[...slug]]: must include all paths for static export
  // Include empty slug for the listing page
  const params: { slug: string[] }[] = [{ slug: [] }];
  try {
    const items = await getAllContent(contentType, "en");
    for (const item of items) {
      const segments = item.segments.filter(Boolean);
      if (segments.length > 1) {
        // Remove the contentType prefix since the route already includes it
        params.push({ slug: segments.slice(1) });
      }
    }
  } catch {
    // skip
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) { 
  const { slug = [] } = await params; 
  return getContentPageMetadata("en", [contentType, ...slug]); 
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) { 
  const { slug = [] } = await params; 
  return <ContentPage locale="en" segments={[contentType, ...slug]} />; 
}
