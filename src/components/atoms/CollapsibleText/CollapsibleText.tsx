"use client";

import React, { useState } from "react";
import cn from "classnames";
import { CaretDown } from "@phosphor-icons/react";

interface CollapsibleTextProps {
  children: React.ReactNode;
  /** Character limit before truncating. Default 280 */
  charLimit?: number;
}

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (typeof node === "object" && "props" in node) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getTextContent((node as any).props?.children);
  }
  return "";
}

const CollapsibleText: React.FC<CollapsibleTextProps> = ({
  children,
  charLimit = 280,
}) => {
  const [expanded, setExpanded] = useState(false);
  const textLength = getTextContent(children).length;
  const needsCollapse = textLength > charLimit;

  return (
    <div>
      <div
        className={cn(
          "overflow-hidden transition-[max-height] duration-500 ease-in-out relative",
        )}
        style={{
          maxHeight: !expanded && needsCollapse ? "10em" : "200em",
        }}
      >
        {children}
        {!expanded && needsCollapse && (
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--background, #0B0A0A))",
            }}
            aria-hidden="true"
          />
        )}
      </div>
      {needsCollapse && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "mt-2 inline-flex items-center gap-1",
            "text-[length:var(--font-size-body-sm)] font-medium",
            "text-[color:var(--color-cyan)] hover:text-[color:var(--color-azure-1)]",
            "transition-colors cursor-pointer",
            "border-none bg-transparent p-0",
          )}
        >
          <span>{expanded ? "Show less" : "Read more"}</span>
          <CaretDown
            size={14}
            weight="bold"
            className={cn(
              "transition-transform duration-300",
              expanded && "rotate-180",
            )}
          />
        </button>
      )}
    </div>
  );
};

export default CollapsibleText;
