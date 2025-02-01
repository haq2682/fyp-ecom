"use server";
import storefront from "@/utils/shopify";
import { gql } from "graphql-request";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export async function createCart() {
  const mutation = gql`
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const response = await storefront(mutation);
    return response.data.cartCreate.cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw new Error('Failed to create cart');
  }
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const mutation = gql`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity
      }
    ]
  };

  try {
    const response = await storefront(mutation, variables);
    return response.data.cartLinesAdd.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw new Error('Failed to add item to cart');
  }
}

export async function updateCart(cartId: string, lineId: string, quantity: number) {
  const mutation = gql`
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [
      {
        id: lineId,
        quantity
      }
    ]
  };

  try {
    const response = await storefront(mutation, variables);
    return response.data.cartLinesUpdate.cart;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw new Error('Failed to update cart');
  }
}

export async function removeFromCart(cartId: string, lineId: string) {
  const mutation = gql`
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineIds: [lineId]
  };

  try {
    const response = await storefront(mutation, variables);
    return response.data.cartLinesRemove.cart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw new Error('Failed to remove item from cart');
  }
}

export async function getCart(cartId: string) {
  const query = gql`
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    cartId
  };

  try {
    const response = await storefront(query, variables);
    return response.data.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw new Error('Failed to fetch cart');
  }
}

export async function cartAuthenticate(cartId: string) {
  const token: RequestCookie = (await cookies()).get('shopifyCustomerAccessToken') as RequestCookie
  const mutation: string = gql`
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerAccessToken: String!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: {customerAccessToken: $buyerAccessToken}) {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;
  try {
    const response = await storefront(mutation, { cartId: cartId, buyerAccessToken: token.value });
    const { checkoutUrl } = response.data.cartBuyerIdentityUpdate.cart;
    return checkoutUrl;
  }
  catch (error) {
    console.error('Failed to authenticate for checkout', error);
    throw new Error('Failed to authenticate for checkout');
  }
}