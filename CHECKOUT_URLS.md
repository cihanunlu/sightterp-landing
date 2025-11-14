# Checkout URLs Reference

This document lists all available checkout URLs that can be used from any domain to directly open the Paddle checkout for specific plans or credit packs.

## How It Works

When a user visits a URL with the `?checkout=` parameter, the pricing page automatically opens the Paddle checkout modal for the specified product after a short delay (to ensure Paddle is initialized).

## Available Checkout URLs

### Credit Packs

- **Credit Pack 1** ($2.50)
  ```
  https://sightterp.com/pricing.html?checkout=creditpack1
  ```

- **Credit Pack 2** ($3.90)
  ```
  https://sightterp.com/pricing.html?checkout=creditpack2
  ```

- **Credit Pack 3** ($9.90)
  ```
  https://sightterp.com/pricing.html?checkout=creditpack3
  ```

- **Credit Pack 4** ($18.90)
  ```
  https://sightterp.com/pricing.html?checkout=creditpack4
  ```

### Subscription Plans

- **Plus Plan** ($5.90/month)
  ```
  https://sightterp.com/pricing.html?checkout=plus
  ```

- **Pro Plan** ($13.90/month)
  ```
  https://sightterp.com/pricing.html?checkout=pro
  ```

- **Elite Plan** ($25.90/month)
  ```
  https://sightterp.com/pricing.html?checkout=elite
  ```

## Usage Examples

### From Other Domains

You can use these URLs from any website, email, or social media:

```html
<!-- In HTML -->
<a href="https://sightterp.com/pricing.html?checkout=creditpack1">
  Buy Credit Pack 1
</a>

<!-- In Markdown -->
[Buy Credit Pack 1](https://sightterp.com/pricing.html?checkout=creditpack1)
```

### In Emails

```
Check out our Credit Pack 1: 
https://sightterp.com/pricing.html?checkout=creditpack1
```

### In Social Media Posts

```
Upgrade to Pro Plan: https://sightterp.com/pricing.html?checkout=pro
```

## Technical Details

- **Parameter Name**: `checkout`
- **Parameter Values**: `creditpack1`, `creditpack2`, `creditpack3`, `creditpack4`, `plus`, `pro`, `elite`
- **Case Insensitive**: `creditpack1` and `CREDITPACK1` both work
- **Auto-trigger**: Checkout opens automatically after ~800ms
- **Source Tracking**: Purchases from URL parameters are tagged with `source: 'url_parameter'` in Paddle customData

## Error Handling

- If an invalid parameter is provided, a warning is logged to the console
- If Paddle fails to load, an alert is shown to the user
- If the price ID is not configured, an error message is displayed

## Testing

To test a checkout URL:

1. Open the URL in a browser (e.g., `https://sightterp.com/pricing.html?checkout=creditpack1`)
2. Wait ~1 second for the page to load
3. The Paddle checkout modal should automatically open
4. Complete a test purchase (use Paddle sandbox mode for testing)

## Notes

- The checkout opens automatically, so users don't need to click any buttons
- The pricing page still loads normally - users can see all plans before checkout opens
- If users close the checkout modal, they can still browse the pricing page normally
- All checkout URLs work from any domain (no CORS restrictions)

