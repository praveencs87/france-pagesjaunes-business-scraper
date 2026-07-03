import { armKillSwitch, disarmKillSwitch, shouldStop } from './utils/timeoutManager.js';
import { Actor, log } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

await Actor.init();

try {
    const input = await Actor.getInput();
    const { 
        keyword = 'plombier', 
        location = 'paris', 
        maxLeads = 100,
        proxyConfiguration 
    } = input || {};

    const proxyConfig = await Actor.createProxyConfiguration(proxyConfiguration || { 
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL'],
        apifyProxyCountry: 'FR'
    });

    log.info(`Searching PagesJaunes (France) for "${keyword}" in "${location}"`);
    
    await Actor.charge({ eventName: 'apify-actor-start', count: 1 });

    let extractedCount = 0;

    const crawler = new PlaywrightCrawler({
        proxyConfiguration: proxyConfig,
        maxConcurrency: 1,          // Cost reduction: 1 browser tab at a time
        maxRequestRetries: 1,
        navigationTimeoutSecs: 45,
        requestHandlerTimeoutSecs: 60,
        browserPoolOptions: {
            useFingerprints: true,
            maxOpenPagesPerBrowser: 1, // Cost reduction: don't share browser sessions
        },
        preNavigationHooks: [
            async ({ page }) => {
                // Block expensive assets to reduce bandwidth & memory
                await page.route('**/*.{png,jpg,jpeg,gif,svg,woff,woff2,mp4,webp}', route => route.abort());
                await page.route('**/{analytics,doubleclick,googletag,facebook,hotjar}**', route => route.abort());
            }
        ],
        async requestHandler({ page, request, log, enqueueLinks }) {
            if (shouldStop() || extractedCount >= maxLeads) return;
            log.info(`Parsing directory page: ${request.url}`);
            
            // Accept cookies (Didomi or TrustArc)
            await page.locator('#didomi-notice-agree-button, button:has-text("Accepter"), button:has-text("Tout accepter")').click({ timeout: 5000 }).catch(() => {});
            
            const title = await page.title();
            if (title.includes('Just a moment') || title.includes('Access Denied') || title.includes('Attention Required')) {
                throw new Error('Blocked by WAF. Retrying with residential proxy...');
            }

            await page.waitForSelector('.bi-bloc, .bi, .zone-bi, .list-results > li', { timeout: 30000 }).catch(() => log.warning('Timeout waiting for DOM.'));

            // Minimal scroll to trigger lazy loading
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(1500);

            const items = await page.$$('.bi-bloc, .bi, .zone-bi, .list-results > li');
            
            for (const item of items) {
                if (shouldStop() || extractedCount >= maxLeads) break;

                const nameElement = await item.$('.bi-header-title, .denomination-links, .bi-denomination');
                if (!nameElement) continue;
                const businessName = (await nameElement.innerText()).replace(/Ouvrir la tooltip/g, '').trim().split('\n')[0].trim();
                if (!businessName || businessName.length < 2) continue;

                const addressElement = await item.$('.bi-address, .adresse, .bi-contact-zone .adresse');
                const address = addressElement ? (await addressElement.innerText()).replace(/Voir le plan/g, '').replace(/\s+/g, ' ').trim() : '';

                const catElement = await item.$('.bi-category, .activite, .bi-activite');
                const industry = catElement ? (await catElement.innerText()).trim() : keyword;

                const phoneElement = await item.$('a[href^="tel:"], .bi-contact-tel, .number-contact');
                let phone = '';
                if (phoneElement) {
                    const href = await phoneElement.getAttribute('href');
                    phone = href?.startsWith('tel:') ? href.replace('tel:', '').trim() : (await phoneElement.innerText()).trim();
                }
                
                const websiteElement = await item.$('a.bi-site-internet, a.site-internet, a[title*="Site"]');
                const website = websiteElement ? await websiteElement.getAttribute('href') : '';
                
                const urlElement = await item.$('.bi-header-title a, .denomination-links a');
                const listingUrl = urlElement ? await urlElement.getAttribute('href') : '';
                const fullListingUrl = listingUrl && !listingUrl.startsWith('http') ? new URL(listingUrl, 'https://www.pagesjaunes.fr').toString() : listingUrl;

                const record = {
                    businessName,
                    industry,
                    address,
                    phone,
                    website,
                    listingUrl: fullListingUrl || request.url,
                    country: 'France',
                    scrapedAt: new Date().toISOString()
                };

                await Actor.pushData(record);
                await Actor.charge({ eventName: 'lead-extracted', count: 1 });
                extractedCount++;
                log.info(`✅ Extracted: ${businessName} (${extractedCount}/${maxLeads})`);
            }

            // Pagination — only if still running and under limit
            if (!shouldStop() && extractedCount < maxLeads) {
                const hasNextPage = await page.$('#pagination-next, a.next, a.pagination-next, a[rel="next"]');
                if (hasNextPage) {
                    const nextUrl = await hasNextPage.getAttribute('href');
                    if (nextUrl) {
                        const absoluteUrl = new URL(nextUrl, 'https://www.pagesjaunes.fr').toString();
                        log.info(`Enqueuing next page: ${absoluteUrl}`);
                        await enqueueLinks({ urls: [absoluteUrl] });
                    }
                }
            }
        },
        async failedRequestHandler({ request, log }) {
            log.error(`Failed request: ${request.url}`);
        }
    });

    const formatKeyword = encodeURIComponent(keyword.replace(/\s+/g, '-').toLowerCase());
    const formatLocation = encodeURIComponent(location.replace(/\s+/g, '-').toLowerCase());
    const startUrl = `https://www.pagesjaunes.fr/recherche/${formatLocation}/${formatKeyword}`;
    
    await crawler.addRequests([{ url: startUrl }]);

    armKillSwitch(crawler);
    await crawler.run();
    disarmKillSwitch();

    log.info(`🎉 Done! Extracted ${extractedCount} French Business leads.`);

} catch (error) {
    console.error('CRASH:', error);
    throw error;
} finally {
    await Actor.exit();
}
