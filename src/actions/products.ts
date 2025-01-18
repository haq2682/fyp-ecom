"use server";

import { gql } from 'graphql-request';
import { client } from '@/utils/shopify';

export async function getProducts() {
  const productsQuery = gql`
    query {
  products(first: 10) {
    edges {
      node {
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              altText
              url
            }
          }
          nodes {
            url
            altText
          }
        }
        id
        title
        createdAt
        productType
        publishedAt
        tags
        updatedAt
        vendor
        variants(first: 1) {
          edges {
            node {
              sku
            }
          }
        }
        collections(first: 5) {
          edges {
            node {
              title
            }
          }
        }
      }
    }
  }
}
`;

  try {
    const response = await client.request(productsQuery);
    console.log(response);

    // Transform the data to match the frontend structure
    const transformedProducts = response.data.products.edges.map(({ node }: {node: any}) => ({
      id: node.id,
      name: node.title,
      sku: node.variants.edges[0]?.node.sku || '-',
      price: parseFloat(node.priceRange.minVariantPrice.amount),
      stock: node.variants.edges[0]?.node.inventoryQuantity > 0 ? "In Stock" : "Out of Stock",
      category: node.collections.edges.map((edge: any) => edge.node.title).join(", "),
      image: node.images.edges[0]?.node.url || ''
    }));

    return transformedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products from Shopify');
  }
}