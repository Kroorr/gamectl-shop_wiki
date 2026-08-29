import { ContentPage, getContentPageMetadata, getContentStaticParams } from "@/app/_shared/content-page";

const contentType = "maps";
export const dynamicParams = false;

export function generateStaticParams() { return getContentStaticParams("en", contentType); }
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) { const { slug = [] } = await params; return getContentPageMetadata("en", [contentType, ...slug]); }
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) { const { slug = [] } = await params; return <ContentPage locale="en" segments={[contentType, ...slug]} />; }
