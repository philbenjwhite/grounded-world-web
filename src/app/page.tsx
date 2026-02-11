import fs from "fs";
import path from "path";
import client from "../../tina/__generated__/client";
import ServiceHeroNav from "@/components/components/ServiceHeroNav";
import type { Service } from "../../tina/__generated__/types";

function loadServicesFromFiles(): Service[] {
  const dir = path.join(process.cwd(), "content/services");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")));
  } catch {
    return [];
  }
}

export default async function Home() {
  let services: Service[] = [];

  try {
    const res = await client.queries.serviceConnection();
    services = (res.data.serviceConnection.edges
      ?.map((e) => e?.node)
      .filter(Boolean) ?? []) as Service[];
  } catch {
    // TinaCMS not running — fall back to reading content files directly
    services = loadServicesFromFiles() as Service[];
  }

  return (
    <div className="h-[calc(100dvh-56px)]">
      <ServiceHeroNav services={services} />
    </div>
  );
}
