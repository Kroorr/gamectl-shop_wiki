import identity from "../../site-identity.json";

export const SITE_CONFIG = {
  gameName: identity.game_name,
  displayName: `${identity.game_name} Wiki`,
  domain: identity.domain,
  ui: {
    theme: "editorial-wiki",
    accent: "blue",
  },
} as const;
