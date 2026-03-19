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
  /** Use object-contain instead of object-cover (better for logos/diagrams) */
  contain?: boolean;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  src,
  alt = "",
  caption,
  rounded = false,
  maxWidth,
  contain = false,
}) => {
  return (
    <figure className={cn("my-0", maxWidth ? "mx-auto" : "mx-0")}>
      <div
        className={cn("relative w-full overflow-hidden", {
          "rounded-xl": rounded,
        })}
        style={maxWidth ? { maxWidth } : undefined}
      >
        <NextImage
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className={cn(
            "h-auto w-full",
            contain ? "object-contain" : "object-cover",
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
