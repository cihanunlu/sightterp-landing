# Webhook Handler Code Review

## ✅ What's Working Well

1. **Signature Verification** - Correctly implements Paddle's spec
   - Parses `Paddle-Signature` header correctly
   - Handles multiple `h1` values (secret rotation)
   - Uses timing-safe comparison
   - Builds signed payload as `${ts}:${rawBody}` ✅

2. **Express Setup** - Correct configuration
   - Uses `express.raw()` for signature verification ✅
   - Route is `/paddle/webhook` ✅
   - Listens on `0.0.0.0` for Railway ✅

3. **IP Allowlisting** - Good security practice
   - Has current Paddle IPs ✅
   - Currently warning-only (good for debugging) ✅

4. **Auth0 Integration** - Proper implementation
   - Uses M2M token correctly ✅
   - Finds users by email ✅
   - Updates `app_metadata` correctly ✅
   - Uses `remaining_credits` field ✅

5. **Error Handling** - Good practices
   - Returns 200 even on errors (prevents retry storms) ✅
   - Logs errors for debugging ✅
   - Handles missing users gracefully ✅

## ⚠️ Potential Issues & Improvements

### Issue 1: Subscription ID in transaction.completed

**Current Code:**
```javascript
case 'transaction.completed':
  if (data.items?.some(item => item.price?.billing_cycle?.interval === 'month')) {
    result = await processSubscription(data);
  }
```

**Problem:**
- For `transaction.completed`, `data` is a **transaction object**, not a subscription
- `eventData.id` would be the transaction ID, not subscription ID
- Subscription ID might be in `data.subscription_id` or might not exist yet

**Recommendation:**
```javascript
case 'transaction.completed':
  if (data.items?.some(item => item.price?.billing_cycle?.interval === 'month')) {
    // For subscriptions, wait for subscription.created event instead
    // OR get subscription_id from transaction if available
    if (data.subscription_id) {
      // Fetch subscription details or wait for subscription.created
      result = await processSubscription(data);
    } else {
      // This is initial payment, subscription.created will follow
      console.log('Transaction completed for subscription, waiting for subscription.created');
      result = { success: true, action: 'waiting_for_subscription_created' };
    }
  } else {
    result = await processCreditPurchase(data);
  }
  break;
```

**Better Approach:** Rely on `subscription.created` for subscriptions:
- `transaction.completed` → Process credit purchases only
- `subscription.created` → Process subscription purchases
- `subscription.updated` → Update subscription details

### Issue 2: processSubscription expects subscription object

**Current Code:**
```javascript
async function processSubscription(eventData) {
  const { customer_id, items, custom_data } = eventData;
  // ...
  paddle_subscription_id: eventData.id,  // This might be wrong for transaction.completed
```

**Fix:**
```javascript
async function processSubscription(eventData) {
  const { customer_id, items, custom_data, id } = eventData;
  
  // For subscription events, id is subscription_id
  // For transaction events, need to get subscription_id differently
  const subscriptionId = eventData.subscription_id || id;
  
  // ...
  paddle_subscription_id: subscriptionId,
```

### Issue 3: Missing subscription fields in transaction.completed

When processing `transaction.completed` for subscriptions:
- `eventData.status` might not exist (that's subscription status)
- `eventData.started_at` might not exist (that's subscription field)
- `eventData.current_billing_period` might not exist (that's subscription field)

**Fix:** Only use subscription-specific fields when event is `subscription.created` or `subscription.updated`:

```javascript
async function processSubscription(eventData, eventType) {
  // ...
  const appMetadata = {
    paddle_customer_id: customer_id,
    paddle_subscription_id: subscriptionId,
    plan_tier: planTier,
    plan_type: 'subscription',
    remaining_credits: priceCustomData.assist_credits || 0,
    evaluate_reports: priceCustomData.evaluate_reports || 0,
    practice_speeches: priceCustomData.practice_speeches || 0,
    // Only include subscription fields if event is subscription.*
    ...(eventType.startsWith('subscription.') ? {
      subscription_status: eventData.status,
      subscription_start_date: eventData.started_at,
      subscription_current_billing_period: {
        start: eventData.current_billing_period?.starts_at,
        end: eventData.current_billing_period?.ends_at
      }
    } : {}),
    last_updated: new Date().toISOString()
  };
```

## 🔧 Recommended Changes

### Option 1: Simplified (Recommended)

Process subscriptions only from `subscription.created` and `subscription.updated`:

```javascript
case 'transaction.completed':
  // Only process one-time purchases (credit packs)
  if (!data.items?.some(item => item.price?.billing_cycle?.interval === 'month')) {
    result = await processCreditPurchase(data);
  } else {
    // Subscription transaction - subscription.created will handle it
    console.log('Subscription transaction completed, waiting for subscription.created');
    result = { success: true, action: 'subscription_transaction_completed' };
  }
  break;

case 'subscription.created':
case 'subscription.updated':
  result = await processSubscription(data, event_type);
  break;
```

### Option 2: Enhanced (More Complete)

Handle both transaction and subscription events:

```javascript
case 'transaction.completed':
  if (data.items?.some(item => item.price?.billing_cycle?.interval === 'month')) {
    // Subscription purchase - get subscription_id from transaction
    if (data.subscription_id) {
      // Fetch subscription details from API
      const subResponse = await axios.get(
        `https://api.paddle.com/subscriptions/${data.subscription_id}`,
        { headers: { Authorization: `Bearer ${PADDLE_API_KEY}` } }
      );
      result = await processSubscription(subResponse.data, 'subscription.created');
    } else {
      // Wait for subscription.created event
      result = { success: true, action: 'waiting_for_subscription_created' };
    }
  } else {
    result = await processCreditPurchase(data);
  }
  break;
```

## ✅ Current Code Status

**Overall:** The code is **mostly correct** and will work, but there are edge cases to handle:

1. ✅ **Signature verification** - Perfect
2. ✅ **Credit purchases** - Will work correctly
3. ⚠️ **Subscription purchases** - Will work but might have incomplete data from `transaction.completed`
4. ✅ **Error handling** - Good
5. ✅ **Auth0 integration** - Correct

## 🎯 Recommendation

**For now, your code will work**, but I recommend:

1. **Test with a real subscription purchase** and check:
   - Does `subscription.created` fire after `transaction.completed`?
   - What data is in each event?
   - Does Auth0 get updated correctly?

2. **If subscriptions work correctly**, you're good to go!

3. **If you see missing subscription data**, implement Option 1 above (simplified approach).

## 📝 Quick Test Checklist

After a test purchase, check Railway logs for:

- [ ] `transaction.completed` received
- [ ] `subscription.created` received (for subscriptions)
- [ ] Auth0 user found by email
- [ ] `app_metadata` updated with correct plan/credits
- [ ] No errors in logs

If all checkboxes pass, your code is working correctly! 🎉

