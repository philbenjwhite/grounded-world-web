"use client";

import { useTina, tinaField } from "tinacms/dist/react";
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

  return (
    <main>
      {data.page.sections?.map((section, index) => {
        if (!section) return null;
        return (
          <div key={index} data-tina-field={tinaField(data.page, "sections", index)}>
            {renderSection(section as PageSections, index)}
          </div>
        );
      })}
    </main>
  );
}
