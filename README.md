# France PagesJaunes Business Scraper

**Extract verified French businesses, real estate agencies, and local services from PagesJaunes.fr.**

The France PagesJaunes Scraper is an elite data extraction tool tailored for the European market. Secure high-value B2B leads, targeting France's vast network of professionals, artisans, and commercial enterprises.

## What can France PagesJaunes Scraper do?

- ✅ **Extract EU B2B Leads** - Get business names, physical French addresses, and direct contact numbers.
- ✅ **Target specific Industries** - Focus your search on real estate agencies (agence immobilière), restaurants, plumbers (plombier), or any professional category.
- ✅ **Identify Local Footprint** - Target major economic hubs like Paris, Lyon, Marseille, or specific departments.
- ✅ **Export formats** - Download data in JSON, CSV, Excel, or HTML formats.
- ✅ **Integrations** - Connect seamlessly with API, webhooks, Make, or Zapier.
- ✅ **No coding required** - Use our simple interface to start scraping immediately.

## Why scrape French Business Data?

France is the second-largest economy in the EU. Sourcing B2B leads from PagesJaunes provides access to a highly developed market:

- 🎯 **High-Ticket B2B Sales** - Connect with established French companies for SaaS, logistics, marketing, and consulting services.
- 📊 **Real Estate Sourcing** - Extract contact information for hundreds of local real estate agencies for prop-tech sales.
- 📍 **Targeted Local Services** - Find contact info for specific professionals like artisans, lawyers, or medical practices in any French city.

## What data can you extract?

| Data Field | Description | Example |
|------------|-------------|---------|
| **businessName** | The name of the company | "Agence Immobilière Parisienne" |
| **industry** | Business Category | "Agence immobilière" |
| **address** | The full FR address | "12 Rue de la Paix, 75002 Paris" |
| **phone** | Direct contact number | "+33 1 23 45 67 89" |
| **website** | Company website | "https://www.example.fr" |
| **listingUrl** | Link to the PagesJaunes listing | "https://www.pagesjaunes.fr/..." |

## How to scrape PagesJaunes data

1. **Click "Try for free"** to start using the actor.
2. **Enter your input** - Provide a search term (e.g., "agence immobilière") and a location (e.g., "Paris").
3. **Configure options** - Set the maximum number of leads you want to extract.
4. **Start the scraper** - Click Start and let the actor do the work.
5. **Download results** - Export your leads as JSON, CSV, or Excel.

## Input

Configure the scraper with these key settings:
- **Search Query** - The specific business category or name (e.g., 'restaurant', 'plombier').
- **Location** - City, department, or region in France (e.g., 'Paris', 'Lyon').
- **Maximum Leads** - The total number of records to extract.
- **Proxy Configuration** - Apify Residential Proxy (France targeted) is highly required to bypass European IP restrictions and Cloudflare protections.

## Output

You can download data in multiple formats:
- **JSON** - For developers and programmatic access
- **CSV** - For easy import into Excel or CRM systems
- **Excel** - Ready-to-use spreadsheet

### Output example

```json
{
    "businessName": "Agence Immobilière Parisienne",
    "industry": "Agence immobilière",
    "address": "12 Rue de la Paix, 75002 Paris",
    "phone": "+33123456789",
    "website": "https://www.example.fr",
    "listingUrl": "https://www.pagesjaunes.fr/...",
    "scrapedAt": "2026-07-02T15:00:00Z"
}
```

## How much does it cost?

This actor uses a Pay-Per-Event (PPE) pricing model tailored for premium European B2B leads:
- **Base Fee**: $0.25 per start
- **Lead Fee**: $4.00 per 1,000 business leads extracted ($0.004 per lead)

**Free tier**: Apify provides $5 in free monthly credits, allowing you to extract over 1,100 premium French business leads for free!

## Is it legal to scrape?

Yes, scraping publicly available data is generally legal. This Actor only extracts public information.

**Best practices**:
- Use the data ethically for B2B outreach in compliance with EU GDPR regulations and French CNIL guidelines.
- Respect the target site's Terms of Service.
- Ensure compliance with data privacy regulations when handling contact information.

## Integrations

Connect with 1000+ apps:
- **Google Sheets** - Auto-update spreadsheets with new leads.
- **Slack** - Get notifications when scraping finishes.
- **Webhooks** - Send data directly to your CRM.
- **API** - Programmatic access for developers.

---

**License**: Apache-2.0 | **Version**: 1.0.0
