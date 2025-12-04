# URL Configuration Checklist for https://presign.vercel.app

## ✅ Code Verification

All code files are correctly using environment variables. No hardcoded URLs found.

### Files Using Environment Variables:
- ✅ `/app/api/shopify/fulfillment-created/route.ts` - Uses `process.env.APP_BASE_URL`
- ✅ `/app/api/shopify/auth/callback/route.ts` - Uses `process.env.APP_BASE_URL` and `process.env.SHOPIFY_APP_URL`
- ✅ `/app/api/buyer/start/route.ts` - Uses `process.env.APP_BASE_URL`
- ✅ `/lib/email.ts` - Uses `process.env.APP_BASE_URL`
- ✅ `/lib/shopify.ts` - Uses `process.env.SHOPIFY_APP_URL`
- ✅ `/env.example` - Updated to show `https://presign.vercel.app`

---

## 🔧 Required Configuration Steps

### 1. Local `.env.local` File

Create or update `.env.local` in your project root:

```env
SHOPIFY_APP_URL=https://presign.vercel.app
APP_BASE_URL=https://presign.vercel.app
```

### 2. Vercel Environment Variables ⚠️ CRITICAL

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add/Update:
- `SHOPIFY_APP_URL` = `https://presign.vercel.app`
- `APP_BASE_URL` = `https://presign.vercel.app`

**Then click "Redeploy" to apply changes.**

### 3. Shopify Partner Dashboard

Go to: **Shopify Partners → Your App → App Setup**

Update:
- **App URL**: `https://presign.vercel.app`
- **Allowed Redirect URLs**: `https://presign.vercel.app/api/shopify/auth/callback`

### 4. Shopify Webhooks

Webhooks are automatically registered via code in `/app/api/shopify/auth/callback/route.ts`:
- `https://presign.vercel.app/api/shopify/fulfillment-created`
- `https://presign.vercel.app/api/shopify/fulfillment-updated`

These use `process.env.APP_BASE_URL`, so ensure Vercel env vars are set correctly.

### 5. Stripe Configuration

#### a) Checkout URLs (in code)
Already configured in `/app/api/buyer/start/route.ts`:
- Success: `${process.env.APP_BASE_URL}/status/${token}?success=true`
- Cancel: `${process.env.APP_BASE_URL}/status/${token}?canceled=true`

#### b) Stripe Dashboard Webhook
Go to: **Stripe Dashboard → Developers → Webhooks**

Add/Update webhook endpoint:
- URL: `https://presign.vercel.app/api/stripe/webhook`
- Events: `checkout.session.completed`

### 6. Resend Email Service

Email links are generated in `/lib/email.ts` using:
```typescript
const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || '';
return `${baseUrl}/status/${buyerToken}`;
```

Ensure `APP_BASE_URL` is set in Vercel.

### 7. Buyer Status Page

Status page routes are:
- `https://presign.vercel.app/status/{buyer_status_token}`

This is automatically correct if `APP_BASE_URL` is set.

---

## ✅ Final Verification Checklist

- [ ] `.env.local` has `SHOPIFY_APP_URL=https://presign.vercel.app`
- [ ] `.env.local` has `APP_BASE_URL=https://presign.vercel.app`
- [ ] Vercel Environment Variables updated with both URLs
- [ ] Vercel project redeployed after env var changes
- [ ] Shopify App URL set to `https://presign.vercel.app`
- [ ] Shopify Redirect URL set to `https://presign.vercel.app/api/shopify/auth/callback`
- [ ] Stripe webhook endpoint set to `https://presign.vercel.app/api/stripe/webhook`
- [ ] Resend domain verified (if using custom domain)

---

## 🎯 All Code Uses Environment Variables

✅ **No hardcoded URLs found** - All URLs are constructed from environment variables:
- `process.env.APP_BASE_URL`
- `process.env.SHOPIFY_APP_URL`
- `process.env.NEXT_PUBLIC_APP_URL` (fallback)

Once you set the environment variables in Vercel and redeploy, everything will work correctly.

