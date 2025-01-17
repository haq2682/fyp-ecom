import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const client = createStorefrontApiClient({
  storeDomain: 'https://university-fyp.myshopify.com',
  apiVersion: '2025-01',
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  // privateAccessToken: process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
});