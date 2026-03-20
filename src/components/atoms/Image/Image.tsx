import NextImage from "next/image";
import cn from "classnames";

export interface ImageBlockProps {
  /** Image source URL or path */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Optional caption displayed below the image */
  caption?: string;
  /** Apply rounded corners */
  rounded?: boolean;
  /** Constrain the max width (e.g. "320px", "24rem"). Defaults to full column width. */
  maxWidth?: string;
  /** Constrain the max height (e.g. "400px"). Defaults to "560px" for fill layout. */
  maxHeight?: string;
  /** Use object-contain instead of object-cover (better for logos/diagrams) */
  contain?: boolean;
  /**
   * Layout mode:
   * - "fill" (default): image spans full column width, capped at maxHeight
   * - "centered": image renders at natural size, centered with padding — good for book covers, product shots
   */
  layout?: "fill" | "centered";
  /** Optional entrance/idle animation: "float" gently bobs the image up and down */
  animate?: "float";
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  src,
  alt = "",
  caption,
  rounded = false,
  maxWidth,
  maxHeight = "560px",
  contain = false,
  layout = "fill",
  animate,
}) => {
  const isCentered = layout === "centered";

  return (
    <figure className={cn("my-0", isCentered ? "flex flex-col items-center" : "mx-0", animate === "float" && "animate-float")}>
      <div
        className={cn(
          "relative overflow-hidden",
          isCentered
            ? cn("inline-flex items-center justify-center p-8 rounded-2xl bg-white/[0.03]", { "rounded-xl": rounded })
            : cn("w-full", { "rounded-xl": rounded }),
        )}
        style={
          isCentered
            ? { maxWidth: maxWidth ?? "340px" }
            : { ...(maxWidth ? { maxWidth } : {}), ...(!contain ? { maxHeight } : {}) }
        }
      >
        <NextImage
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className={cn(
            "h-auto",
            isCentered ? "w-full object-contain drop-shadow-xl" : cn("w-full", contain ? "object-contain" : "object-cover"),
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-[var(--text-secondary)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageBlock;
