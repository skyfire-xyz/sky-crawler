export const USER_AGENT = "sky-crawler"

export interface RobotsTxtData {
  paymentUrl: String
  disallowedPaths: Set<string>
  paidContentPaths: Set<string>
}
