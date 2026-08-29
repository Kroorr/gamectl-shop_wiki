import NextLink from "next/link";
import React from "react";

export function isExternalUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}

export type LinkProps = React.ComponentPropsWithoutRef<typeof NextLink>;

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...props }, ref) => {
    const urlStr = typeof href === "string" ? href : href.pathname || "";
    if (isExternalUrl(urlStr)) {
      // For external URLs, use normal anchor tag with target="_blank"
      // We also clean up props that are next/link specific and shouldn't go onto <a> if they exist
      const {
        replace,
        scroll,
        prefetch,
        locale,
        passHref,
        legacyBehavior,
        shallow,
        ...restProps
      } = props;

      return (
        <a
          ref={ref}
          href={urlStr}
          target="_blank"
          rel="noopener noreferrer"
          {...restProps}
        >
          {children}
        </a>
      );
    }

    return (
      <NextLink href={href} ref={ref} {...props}>
        {children}
      </NextLink>
    );
  }
);

Link.displayName = "Link";
