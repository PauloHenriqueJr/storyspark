# Analytics Setup

This project uses Google Analytics 4 for tracking and reporting.

## Configuration
1. Create a GA4 property and obtain the **Measurement ID**.
2. Add the following variable to your `.env` file:
   ```bash
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. Deploy the application; the analytics script will load automatically when the ID is present.

## Waitlist Signup Event
The landing page form sends a `waitlist_signup` event containing the visitor's email address when submitted. Use this event to track conversions.

## Conversion Goal
In Google Analytics:
1. Navigate to **Admin → Events** and ensure `waitlist_signup` appears in the list.
2. Toggle the event as a **conversion**.

## Dashboards
Use GA's **Explore** or **Reports** features to create dashboards showing:
- Total waitlist signups (conversion count)
- Traffic source/medium for each signup
- Trends over time

These dashboards help monitor campaign performance and optimize acquisition channels.
