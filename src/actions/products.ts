"use server";

import { gql } from 'graphql-request';
import storefront from '@/utils/shopify';

export async function getCategories() {
  const categoriesQuery = gql`
      query {
      products(first: 10) {
        nodes {
          id
          title
          category {
            id
            name
          }
        }
      }
    }
  `;
  try {
    const response = await storefront(categoriesQuery);
    const categories = new Set();
    response.data.products.nodes.forEach((node: CategoryProductNode) => node.category ? categories.add(node.category.name) : null);
    return categories;
  }
  catch(error) {
    console.error('Error fetching categories', error);
    throw new Error('Failed to fetch categories');
  }
}

// Local Types
type CategoryProductNode = {
  id: string;
  title: string;
  category: {
    id: string,
    name: string
  };
}