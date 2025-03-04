interface ClientConfig {
  name: string
  logo?: string
  logoSize?: { width: number; height: number }
  skyfireLogo: string
  mode: "akamai" | "cequence" | "default" // Custom theme modes
  requiresAuth?: boolean
}

interface ClientConfigs {
  [domain: string]: ClientConfig
}

export const clientConfigs: ClientConfigs = {
  "akamai-crawler": {
    name: "Akamai Bot Manager",
    logo: "/akamai-logo.png",
    logoSize: { width: 90, height: 36 },
    skyfireLogo: "/skyfire-logo.svg",
    mode: "akamai",
    requiresAuth: true,
  },
  "cequence-crawler": {
    name: "Cequence Bot Defense",
    logo: "/cequence-logo.svg",
    logoSize: { width: 120, height: 52 },
    skyfireLogo: "/skyfire-logo-black.svg",
    mode: "cequence",
    requiresAuth: true,
  },
  default: {
    name: "Skyfire Crawler (Combined)",
    skyfireLogo: "/skyfire-logo.svg",
    mode: "default",
    requiresAuth: true,
  },
}

export function getClientConfig(hostname: string): ClientConfig {
  const parts = hostname.split(".")
  const subdomain = parts[0]

  if (subdomain === "crawler") {
    return clientConfigs.default
  }

  return clientConfigs[subdomain] || clientConfigs.default
}
