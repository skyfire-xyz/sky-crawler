import axios from 'axios';
import { PuppeteerCrawler } from 'crawlee';


// Function to fetch and return the content of robots.txt
async function fetchRobotsTxt(url: string): Promise<string> {
    try {
        const response = await axios.get(`${url}/robots.txt`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching robots.txt from ${url}:`, error);
        return '';
    }
}

// Function to parse robots.txt and check if a URL is allowed to be crawled
function isAllowedByRobotsTxt(robotsTxt: string, userAgent: string, url: string): boolean {
    const lines = robotsTxt.split('\n');
    let isDisallowed = false;
    let appliesToUserAgent = false;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('User-agent:')) {
            const agent = trimmedLine.split(':')[1].trim();
            appliesToUserAgent = agent === '*' || agent === userAgent;
        } else if (appliesToUserAgent && trimmedLine.startsWith('Disallow:')) {
            const path = trimmedLine.split(':')[1].trim();
            if (url.includes(path)) {
                isDisallowed = true;
                break;
            }
        }
    }
    return !isDisallowed;
}

// Function to filter URLs based on robots.txt rules
async function filterUrlsWithRobotsTxt(urls: string[], baseUrl: string, userAgent: string): Promise<string[]> {
    const robotsTxt = await fetchRobotsTxt(baseUrl);
    return urls.filter(url => isAllowedByRobotsTxt(robotsTxt, userAgent, url));
}

const crawler = new PuppeteerCrawler({
    async requestHandler({ request, page, enqueueLinks, log }) {
        log.info(`Processing ${request.url}...`);

        // Extract data from the page
        const data = await page.$$eval('body', (body) => ({
            title: document.title,
            url: location.href,
        }));

        // Log or save the data
        console.log(data);

        // Enqueue links for crawling
        const links = await enqueueLinks({
            selector: 'a',
        });

        // Filter links based on robots.txt rules
        const filteredLinks = await filterUrlsWithRobotsTxt(links, request.url, 'your-crawler-user-agent');
        for (const url of filteredLinks) {
            await crawler.addRequests([url]);
        }
    },
    failedRequestHandler({ request, log }) {
        log.error(`Request ${request.url} failed too many times.`);
    },
});

// Add initial requests
const startUrls = ['http://127.0.0.1:5500/example-website/'];
await crawler.addRequests(startUrls);

// Run the crawler
await crawler.run();

console.log('Crawler finished.');
