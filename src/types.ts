export const USER_AGENT = "sky-crawler";

export interface RobotsTxtData {
  disallowedPaths: Set<string>;
  paidContentPaths: string[];
}
