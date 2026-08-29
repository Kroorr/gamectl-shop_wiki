import { ContentPage, getContentPageMetadata } from "@/app/_shared/content-page";
import { getAllContent } from "@/lib/content";

const contentType = "codes";
export const dynamicParams = false;

export async function generateStaticParams() {
  // Optional catch-all [[...slug]]: must include all paths for static export
  // Include empty slug for the listing page
  const params: { slug: string[] }[] = [{ slug: [] }];
  try {
    const items = await getAllContent(contentType, "en");
    for (const item of items) {
      // segments are relative to the contentType directory
      // e.g., for content/en/codes/active-codes.mdx, segments = ["active-codes"]
      if (item.segments.length > 0) {
        params.push({ slug: item.segments });
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
