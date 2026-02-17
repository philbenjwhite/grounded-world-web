"use client";

import { useTina } from "tinacms/dist/react";
import type { PageQuery, PageSections } from "../../../tina/__generated__/types";
import { renderSection } from "@/lib/tina-renderers";

interface ClientPageProps {
  query: string;
  variables: { relativePath: string };
  data: { page: PageQuery["page"] };
}

export default function ClientPage(props: ClientPageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const sections = data.page.sections?.filter(Boolean) as
    | PageSections[]
    | undefined;

  return (
    <main>
      {sections?.map((section, index) => renderSection(section, index))}
    </main>
  );
}
