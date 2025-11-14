# Fix: Customer Email Not Found Error

## Problem

Error: `Customer email not found` at line 251 in `processCreditPurchase`

This happens when:
1. Customer API call fails
2. Customer object doesn't have email field
3. Customer email is in transaction data, not customer object

## Solution

The transaction webhook payload might already contain customer email. Let's check the transaction data first before making an API call.

## Improved Code

Update your webhook handler with better error handling and multiple ways to get customer email:

```javascript
/**
 * Get customer email from transaction or customer API
 */
async function getCustomerEmail(customerId, transactionData) {
  // First, try to get email from transaction data (if available)
  if (transactionData?.customer_email) {
    return transactionData.customer_email;
  }
  
  // Try customer object in transaction
  if (transactionData?.customer?.email) {
    return transactionData.customer.email;
  }
  
  // Fallback: Fetch from Paddle API
  try {
    const customerResponse = await axios.get(
      `https://api.paddle.com/customers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${PADDLE_API_KEY}`
        }
      }
    );
    
    if (customerResponse.data?.email) {
      return customerResponse.data.email;
    }
    
    throw new Error(`Customer ${customerId} has no email field`);
  } catch (error) {
    console.error(`Error fetching customer ${customerId}:`, error.response?.data || error.message);
    throw new Error(`Failed to get customer email: ${error.message}`);
  }
}
```

Then update `processCreditPurchase`:

```javascript
async function processCreditPurchase(eventData) {
  const { customer_id, items, custom_data } = eventData;
  
  // Get customer email (try multiple sources)
  let customerEmail;
  try {
    customerEmail = await getCustomerEmail(customerId, eventData);
  } catch (error) {
    console.error('Failed to get customer email:', error);
    throw error; // Re-throw to be caught by main handler
  }

  if (!customerEmail) {
    throw new Error(`Customer email not found for customer_id: ${customer_id}`);
  }

  // Rest of the function...
}
```

## Quick Fix (Simpler)

If you want a quick fix, add better logging first to see what's in the webhook:

```javascript
async function processCreditPurchase(eventData) {
  const { customer_id, items, custom_data } = eventData;
  
  // Log the full event data for debugging
  console.log('processCreditPurchase - eventData:', JSON.stringify(eventData, null, 2));
  
  // Try to get email from transaction data first
  let customerEmail = eventData.customer_email || eventData.customer?.email;
  
  // If not in transaction, fetch from API
  if (!customerEmail) {
    try {
      const customerResponse = await axios.get(
        `https://api.paddle.com/customers/${customer_id}`,
        {
          headers: {
            Authorization: `Bearer ${PADDLE_API_KEY}`
          }
        }
      );
      
      customerEmail = customerResponse.data?.email;
      
      if (!customerEmail) {
        console.error('Customer object:', JSON.stringify(customerResponse.data, null, 2));
        throw new Error(`Customer ${customer_id} has no email field`);
      }
    } catch (error) {
      console.error('Error fetching customer:', {
        customer_id,
        error: error.response?.data || error.message,
        status: error.response?.status
      });
      throw new Error(`Failed to get customer email: ${error.message}`);
    }
  }

  // Rest of function...
}
```

## Debug Steps

1. **Check Railway logs** for the full webhook payload
2. **Look for** `customer_email` or `customer.email` in transaction data
3. **Verify** Paddle API key has permission to read customers
4. **Check** if customer exists in Paddle Dashboard

## Most Likely Causes

1. **Email in transaction data** - Check if `eventData.customer_email` exists
2. **API permissions** - Verify API key can read customers
3. **Customer doesn't exist** - Check if customer_id is valid
4. **Rate limiting** - Too many API calls

Try the quick fix first and check the logs to see what data is actually in the webhook!

