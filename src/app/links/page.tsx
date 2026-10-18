import { LinksRoute, linksMetadata, linksViewport } from "./render";

export const dynamic = "force-static";
export const metadata = linksMetadata("ai");
export const viewport = linksViewport("ai");

export default function Page() {
  return <LinksRoute mode="ai" />;
}
