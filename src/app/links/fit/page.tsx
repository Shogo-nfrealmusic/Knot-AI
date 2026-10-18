import { LinksRoute, linksMetadata, linksViewport } from "../render";

export const dynamic = "force-static";
export const metadata = linksMetadata("fit");
export const viewport = linksViewport("fit");

export default function Page() {
  return <LinksRoute mode="fit" />;
}
