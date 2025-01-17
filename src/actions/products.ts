"use server";

import { gql } from 'graphql-request';

import { client } from '@/utils/shopify';

export async function getProducts() {
    const productQuery = gql`
  query ProductQuery($handle: String) {
    product(handle: $handle) {
      id
      title
      handle
    }
  }
`;

    const { data, errors, extensions } = await client.request(productQuery, {
        variables: {
            handle: 'sample-product',
        },
    });
    return data;
}