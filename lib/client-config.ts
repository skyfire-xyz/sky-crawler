interface ClientConfig {
  name: string
  logo?: string
  logoSize?: { width: number; height: number }
  skyfireLogo: string
  mode: "akamai" | "cequence" | "default" // Custom theme modes
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
  },
  "cequence-crawler": {
    name: "Cequence Bot Defense",
    logo: "/cequence-logo.svg",
    logoSize: { width: 120, height: 52 },
    skyfireLogo: "/skyfire-logo-black.svg",
    mode: "cequence",
  },
  default: {
    name: "Skyfire Crawler (Combined)",
    skyfireLogo: "/skyfire-logo.svg",
    mode: "default",
  },
}

export function getClientConfig(hostname: string): ClientConfig {
  const domain = hostname.split(".")[0]
  return clientConfigs[domain] || clientConfigs.default
}
