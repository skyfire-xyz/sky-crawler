export const USER_AGENT = "sky-crawler"

export interface PaidContentData {
  claimId: string
  price: number
}

export interface RobotsTxtData {
  paymentUrl: string
  siteUsername: string
  disallowedPaths: Set<string>
  paidContentPaths: {
    [path: string]: PaidContentData
  }
}
