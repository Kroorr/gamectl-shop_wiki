import type React from "react";
import { BookOpen, Code2, Map, Newspaper, Users } from "lucide-react";

type NavItem = {
  readonly key: string;
  readonly path: string;
  readonly icon?: React.ComponentType<{ className?: string }>;
  readonly isContentType: boolean;
};

export const NAVIGATION_CONFIG: readonly NavItem[] = [
  { key: "guide", path: "/guide", icon: BookOpen, isContentType: true },
  { key: "codes", path: "/codes", icon: Code2, isContentType: true },
  { key: "updates", path: "/updates", icon: Newspaper, isContentType: true },
  { key: "community", path: "/community", icon: Users, isContentType: false },
  { key: "maps", path: "/maps", icon: Map, isContentType: true },
];

export const CONTENT_TYPES: string[] = NAVIGATION_CONFIG.filter(
  (item) => item.isContentType
).map((item) => item.path.replace(/^\//, ""));
