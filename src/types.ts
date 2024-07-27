export const USER_AGENT = "sky-crawler"

export interface RobotsTxtData {
    paymentUrl: string
    disallowedPaths: Set<string>
    paidContentPaths: {
      [path: string]: string
    }
  }
