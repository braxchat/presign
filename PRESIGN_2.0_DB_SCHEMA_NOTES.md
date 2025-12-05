# PreSign 2.0 Database Schema Notes

## Overview
This document outlines database schema adjustments for the PreSign 2.0 business model transition (B2B merchant subscription, no buyer payments).

## ✅ Keep These Tables (No Changes Needed)

### `merchants`
- **Status**: Keep as-is
- **Reason**: Core merchant data structure remains the same

### `authorizations` (or `shipments` if that's your table name)
- **Status**: Keep structure, but ignore certain columns
- **Required columns to keep**:
  - `buyer info` (name, email, etc.)
  - `signature`
  - `pdf_url`
  - `merchant_id`
  - `tracking_number`
  - `status`
  - `created_at`, `updated_at`

## ⚠️ Columns to KEEP but IGNORE in MVP

These columns should remain in the database schema but should NOT be:
- Referenced in UI/dashboards
- Used in business logic
- Displayed to users
- Queried in new code

### In `authorizations` or `shipments` table:

#### `charge_id`
- **Status**: Keep column, ignore in code
- **Reason**: Legacy buyer payment Stripe charge ID
- **Action**: Do not query or display this field

#### `refund_status`
- **Status**: Keep column, ignore in code
- **Reason**: Legacy refund tracking (`'none' | 'requested' | 'approved' | 'denied'`)
- **Action**: Do not query or display this field

#### `refund_reason`
- **Status**: Keep column, ignore in code
- **Reason**: Legacy refund reason text
- **Action**: Do not query or display this field

#### `payment_status`
- **Status**: Keep column, ignore in code
- **Reason**: Legacy buyer payment status
- **Action**: Do not query or display this field

#### `stripe_payment_status`
- **Status**: Keep column, ignore in code
- **Reason**: Legacy Stripe payment tracking
- **Action**: Do not query or display this field

#### `merchant_earnings_cents`
- **Status**: Keep column, ignore in code
- **Reason**: Legacy per-authorization earnings model
- **Action**: Do not query or display this field

## 🗑️ Tables to IGNORE (Do Not Delete Yet)

### `refund_requests`
- **Status**: Keep table structure, hide from admin UI
- **Reason**: Entire refund concept is deprecated in new model
- **Action**:
  - Remove all references in backend logic
  - Hide from admin dashboard UI
  - Do NOT delete the table yet (safety measure)
  - Can be deleted after full migration is complete

## 📝 Migration Notes

### Phase 1 (Current - MVP)
- Keep all columns and tables
- Simply ignore deprecated columns in new code
- Hide refund-related UI elements
- Remove refund logic from email templates

### Phase 2 (Future - After Full Migration)
- After confirming no legacy data dependencies
- Consider dropping unused columns
- Consider dropping `refund_requests` table
- Document any data migration if needed

## ✅ What to Use Instead

### For Authorization Status
- Use `status` field (e.g., `'pending' | 'authorized' | 'completed'`)
- Do NOT use `payment_status` or `stripe_payment_status`

### For Merchant Billing
- Track subscription status in `merchants` table (add if needed)
- Do NOT track per-authorization earnings

### For Buyer Experience
- No payment tracking needed
- No refund tracking needed
- Focus on authorization status only

## 🔍 Code Audit Checklist

When reviewing code, ensure:
- [ ] No queries filter by `refund_status`
- [ ] No UI displays `merchant_earnings_cents`
- [ ] No logic checks `payment_status` or `stripe_payment_status`
- [ ] No references to `refund_requests` table
- [ ] Email templates don't mention refunds or buyer payments
- [ ] Dashboard doesn't show earnings or refund sections

