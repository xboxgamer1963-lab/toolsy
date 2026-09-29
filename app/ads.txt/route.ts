import { adsense } from "@/lib/site";

// AdSense requires /ads.txt to list your publisher ID.
// Generated from NEXT_PUBLIC_ADSENSE_CLIENT so there's nothing to edit by hand.
export const dynamic = "force-static";

export function GET() {
  const pub = adsense.client.replace(/^ca-/, "");
  const body = pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : "";
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
