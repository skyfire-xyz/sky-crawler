import { PuppeteerCrawler } from 'crawlee';

const crawler = new PuppeteerCrawler({
    requestHandler: async ({ request, page, enqueueLinks, log }) => {
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
        })
        console.log("LOGGING LINKS")
        console.log(links)
    },
    failedRequestHandler: ({ request, log }) => {
        log.error(`Request ${request.url} failed too many times.`);
    },
});

// Add initial requests
const startUrls = ['http://127.0.0.1:5500/example-website/'];
await crawler.addRequests(startUrls);

// Run the crawler
await crawler.run();

console.log('Crawler finished.');
