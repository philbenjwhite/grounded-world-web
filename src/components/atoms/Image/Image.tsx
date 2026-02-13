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
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  src,
  alt = "",
  caption,
  rounded = false,
}) => {
  return (
    <figure className="m-0">
      <div
        className={cn("relative w-full overflow-hidden", {
          "rounded-xl": rounded,
        })}
      >
        <NextImage
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="h-auto w-full object-cover"
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
