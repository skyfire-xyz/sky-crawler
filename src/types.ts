export const USER_AGENT = "sky-crawler"

export interface PaidContent {
  claimId: string 
  price: string 
}

export interface RobotsTxtData {
  paymentUrl: string
  siteUsername: string
  disallowedPaths: Set<string>
  paidContentPaths: {
      [path: string]: PaidContent
  }
}
