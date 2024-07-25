import { BatchAddRequestsResult } from '@crawlee/types';
import axios from 'axios';
import { PuppeteerCrawler } from 'crawlee';

const robotsTxtCache: { [domain: string]: string } = {};

// Fetch and return the content of robots.txt
async function fetchRobotsTxt(url: string): Promise<string> {
    // const domain = new URL(url).origin;  USE THIS WHEN NOT TESTING
    const domain = 'http://127.0.0.1:5500/example-website/'
    if (robotsTxtCache[domain]) {
        return robotsTxtCache[domain];
    }
    
    try {
        const response = await axios.get(`${domain}/robots.txt`);
        const robotsTxt = response.data;
        console.log(`FETCHED ROBOTS.TXT ${robotsTxt}`)
        robotsTxtCache[domain] = robotsTxt;
        return robotsTxt;
    } catch (error) {
        console.error(`Error fetching robots.txt from ${domain}:`, error);
        robotsTxtCache[domain] = ''; // Cache empty response to avoid repeated requests
        return '';
    }
}

// Parse robots.txt and check if a URL is allowed to be crawled
function isAllowedByRobotsTxt(robotsTxt: string, userAgent: string, url: string): boolean {
    if (!robotsTxt) {
        console.warn(`No robots.txt content, defaulting to allow all for URL: ${url}`);
        return true; // Defaulting to allow all if robots.txt could not be fetched
    }

    const lines = robotsTxt.split('\n');
    let isDisallowed = false;
    let appliesToUserAgent = false;

    // Extract path from URL
    const parsedUrl = new URL(url);
    const fullPath = parsedUrl.pathname;

    // WHEN FINISHED TESTING, DELETE AND LET relativePath = fullPath
    const basePath = '/example-website';
    const relativePath = fullPath.startsWith(basePath)
        ? fullPath.substring(basePath.length)
        : fullPath;

    // console.log(`Full Path: ${fullPath}`);
    // console.log('Relative Path:', relativePath);

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('User-agent:')) {
            const agent = trimmedLine.split(':')[1].trim();
            appliesToUserAgent = agent === '*' || agent === userAgent;
        } else if (appliesToUserAgent && trimmedLine.startsWith('Disallow:')) {
            const disallowedPath = trimmedLine.split(':')[1].trim();
            // console.log(`Disallowed Path: ${disallowedPath}`);

            // Check if the disallowed path matches the relative path
            if (disallowedPath === '' || relativePath.startsWith(disallowedPath)) {
                console.log(`DISALLOWING ${url} due to rule: Disallow: ${disallowedPath}`);
                isDisallowed = true;
                break;
            }
        }
    }
    return !isDisallowed;
}


// Function to filter URLs based on robots.txt rules
async function filterUrlsWithRobotsTxt(urls: BatchAddRequestsResult, url: string, userAgent: string): Promise<string[]> {
    const robotsTxt = await fetchRobotsTxt(url);
    const allUrls = [
        ...urls.processedRequests.map(req => req.uniqueKey),
        ...urls.unprocessedRequests.map(req => req.url),
    ];
    const filteredUrls = allUrls.filter(url => isAllowedByRobotsTxt(robotsTxt, userAgent, url));
    return filteredUrls;
}

const crawler = new PuppeteerCrawler({
    preNavigationHooks: [
        async (crawlingContext, gotoOptions) => {
            const { request } = crawlingContext;
            const robotsTxt = await fetchRobotsTxt(request.url);
            const isAllowed = isAllowedByRobotsTxt(robotsTxt, 'sky-crawler', request.url);
            if (!isAllowed) {
                console.log(`Skipping ${request.url} due to robots.txt rules.`);
                // Ensure gotoOptions is defined before modifying
                if (gotoOptions) {
                    console.log("YES GOTOOPTIONS")
                    gotoOptions.timeout = 0; // Skip navigation
                    gotoOptions.waitUntil = 'domcontentloaded'; // Make sure navigation ends quickly
                }
                throw new Error(`BLOCKED by robots.txt`);
            }
        }
    ],
    
    async requestHandler({ request, page, enqueueLinks, log }) {
        log.info(`Processing ${request.url}...`);
        const data = await page.$$eval('body', () => ({
            title: document.title,
            url: location.href,
        }));
        console.log(data);

        // Enqueue links for crawling
        await enqueueLinks({
            selector: 'a',
        });
    },

    failedRequestHandler({ request, log }) {
        log.error(`Request ${request.url} failed too many times.`);
        // Optionally handle specific failure cases
        if (request.retryCount > 2) {
            log.error(`Request ${request.url} failed repeatedly and will not be retried.`);
        }
    },
});


// Add initial requests
const startUrls = ['http://127.0.0.1:5500/example-website/'];
await crawler.addRequests(startUrls);

// Run the crawler
await crawler.run();

console.log('Crawler finished.');
