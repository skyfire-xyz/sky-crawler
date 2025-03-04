interface ClientConfig {
  name: string
  logo?: string
  logoSize?: { width: number; height: number }
  skyfireLogo: string
  mode: "akamai" | "cequence" | "default" // Custom theme modes
}

interface ClientConfigs {
  [subdomain: string]: ClientConfig
}

export const clientConfigs: ClientConfigs = {
  akamai: {
    name: "Akamai Bot Manager",
    logo: "/akamai-logo.png",
    logoSize: { width: 90, height: 36 },
    skyfireLogo: "/skyfire-logo.svg",
    mode: "akamai",
  },
  cequence: {
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
  const subdomain = hostname.split(".")[0]
  return clientConfigs[subdomain] || clientConfigs.default
}
