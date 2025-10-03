# Colorado Legislative Data

This directory contains scraped Colorado legislative data from the OpenStates scraper.

## Structure

- `co/bills/` - Individual bill JSON files from the scraper
- `co/people/` - Individual legislator JSON files from the scraper
- `co/combined-bills.json` - Combined bills data (created by GitHub Actions)
- `co/combined-legislators.json` - Combined legislators data (created by GitHub Actions)

## Data Source

Data is automatically scraped daily using GitHub Actions from:
- [OpenStates Colorado Bills Scraper](https://github.com/openstates/openstates-scrapers/tree/main/scrapers_next/co)
- [OpenStates Colorado People Scraper](https://github.com/openstates/openstates-scrapers/tree/main/scrapers_next/co)

## Automation

The scraping is automated via GitHub Actions workflow (`.github/workflows/colorado-scraper.yml`) that:
1. Runs daily at 6 AM UTC
2. Scrapes fresh data from Colorado's official legislative website
3. Processes and combines the data
4. Triggers the Supabase sync API
5. Commits the data to the repository

## Manual Trigger

You can manually trigger the scraper by:
1. Going to the "Actions" tab in GitHub
2. Selecting "Colorado Legislative Data Scraper"
3. Clicking "Run workflow"
