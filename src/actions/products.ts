// @/actions/products.ts
"use server";

import { gql } from 'graphql-request';
import storefront from '@/utils/shopify';
import { HomeProduct, ShopifyProduct } from '@/types';

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
  catch (error) {
    console.error('Error fetching categories', error);
    throw new Error('Failed to fetch categories');
  }
}
export async function getProductTypes() {
  const query = gql`
    query {
      productTypes(first: 250) {
        nodes
      }
    }
  `;

  try {
    const response = await storefront(query);
    return new Set(
      response.data.productTypes.nodes.filter((type: string) => type !== "")
    );
  } catch (error) {
    console.error('Error fetching product types:', error);
    throw new Error('Failed to fetch product types');
  }
}

export async function searchProducts(searchParams: {
  query?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  limit?: number;
  sortBy?: string;
  after?: string | null
}): Promise<{ products: HomeProduct[]; hasNextPage: boolean; endCursor: string | null }> {
  const { query, type, minPrice, maxPrice, size, limit = 12, sortBy } = searchParams;
  const filters: string[] = [];
  let sortKey = 'TITLE';
  let reverse = false;

  if (query) {
    filters.push(`title:*${query}*`);
  }

  if (type) {
    filters.push(`(product_type:${type})`);
  }

  if (minPrice || maxPrice) {
    const priceFilter = [
      minPrice ? `variants.price:>=${minPrice}` : null,
      maxPrice ? `variants.price:<=${maxPrice}` : null,
    ]
      .filter(Boolean)
      .join(" AND ");
    if (priceFilter) {
      filters.push(`(${priceFilter})`);
    }
  }

  if (size) {
    filters.push(`variants.option1:${size}`);
  }

  switch (sortBy) {
    case 'name':
      sortKey = 'TITLE';
      break;
    case 'priceLowHigh':
      sortKey = 'PRICE';
      break;
    case 'priceHighLow':
      sortKey = 'PRICE';
      reverse = true;
      break;
    default:
      sortKey = 'RELEVANCE';
  }

  const searchQuery = gql`
    query ($filters: String!, $first: Int!, $after: String, $sortKey: ProductSortKeys!, $reverse: Boolean!) {
      products(
        first: $first,
        after: $after,
        query: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            id
            title
            availableForSale
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              altText
              url(transform: {maxHeight: 450, maxWidth: 300, crop: CENTER})
            }
            priceRange {
              minVariantPrice {
                currencyCode
                amount
              }
            }
            variants(first: 1) {
              nodes {
                selectedOptions {
                  name
                  value
                }
              }
            }
            productType
          }
        }
      }
    }
  `;

  try {
    const variables = {
      filters: filters.join(" AND "),
      first: limit,
      after: null,
      sortKey,
      reverse
    };

    const response = await storefront(searchQuery, variables);
    const {
      products: {
        edges,
        pageInfo: { hasNextPage, endCursor }
      }
    } = response.data;

    const processedProducts = processResponse(edges.map((edge: EdgeType) => edge.node));

    return {
      products: processedProducts,
      hasNextPage,
      endCursor
    };
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Failed to search products");
  }
}
export async function getHomeBestSellingProducts(): Promise<HomeProduct[]> {
  const query = gql`
    query {
  products(first: 4, sortKey: BEST_SELLING) {
    nodes {
      id
      title
      availableForSale
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        altText
        url(transform: {maxHeight: 600, maxWidth: 300, crop: CENTER})
      }
      priceRange {
        minVariantPrice {
          currencyCode
          amount
        }
      }
    }
  }
    }
  `;

  try {
    const response = await storefront(query);
    const products: HomeProduct[] = homeProcessResponse(response);
    return products;
  }
  catch (error) {
    console.error('Error fetching Best Selling Products', error);
    throw new Error('Failed to fetch Best Selling Products');
  }
}

export async function getHomeLatestProducts(): Promise<HomeProduct[]> {
  const query = gql`
    query {
  products(first: 4, sortKey: CREATED_AT, reverse: true) {
    nodes {
      id
      availableForSale
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        altText
        url(transform: {maxHeight: 600, maxWidth: 300, crop: CENTER})
      }
      priceRange {
        minVariantPrice {
          currencyCode
          amount
        }
      }
      title
    }
  }
}
  `;
  try {
    const response = await storefront(query);
    const products: HomeProduct[] = homeProcessResponse(response);
    return products;
  }
  catch (error) {
    console.error('Error fetching Latest Products', error);
    throw new Error('Failed to fetch Latest Products');
  }
}

export async function getIndividualProduct(id: string): Promise<IndividualProductResponseType> {
  const gid = `gid://shopify/Product/${id}`;
  const newId = btoa(gid);

  const query = gql`
    query($id: ID!) {
      product(id: $id) {
        id
        title
        availableForSale
        description
        images(first: 10) {
          nodes {
            url(transform: {maxHeight: 600, maxWidth: 600, crop: CENTER})
            altText
          }
        }
        variants(first: 20) {
          nodes {
            id
            title
            availableForSale
            currentlyNotInStock
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  `;

  try {
    const response = await storefront(query, { id: newId });
    const product = response.data.product;
    const idParts = product.id.split("/");
    const productId = idParts[idParts.length - 1];
    return {
      data: {
        id: productId,
        title: product.title,
        inStock: product.availableForSale,
        description: product.description,
        images: product.images.nodes.map((image: IndividualProductImageType) => ({
          src: image.url,
          alt: image.altText || product.title
        })),
        variants: product.variants.nodes.map((variant: IndividualProductVariantType) => {
          const hasDiscount = variant.compareAtPrice && Number(variant.compareAtPrice.amount) > 0;
          return {
            id: variant.id,
            title: variant.title,
            inStock: variant.availableForSale,
            currentlyNotInStock: variant.currentlyNotInStock,
            price: hasDiscount ? Number(variant.compareAtPrice.amount) : Number(variant.price.amount),
            currency: variant.price.currencyCode,
            discountedPrice: hasDiscount ? Number(variant.price.amount) : null,
            size: variant.selectedOptions.find((opt: IndividualProductVariantType["selectedOptions"][0]) => opt.name === "Size")?.value || null
          };
        })
      }
    };
  } catch (error) {
    console.error('Error fetching Individual Product', error);
    throw new Error('Failed to fetch Individual Product');
  }
}

//Local Helper Functions
const processResponse = (nodes: ShopifyProduct[]): HomeProduct[] => {
  return nodes.map(product => {
    const idParts = product.id.split("/");
    const productId = idParts[idParts.length - 1];

    const sizeOption = product.variants.nodes[0]?.selectedOptions
      .find(opt => opt.name === "Size");
    const sizes = sizeOption ? [sizeOption.value] : [];

    const hasDiscount = product.compareAtPriceRange?.minVariantPrice?.amount
      && Number(product.compareAtPriceRange.minVariantPrice.amount) > 0;

    const price = hasDiscount
      ? Number(product.compareAtPriceRange.minVariantPrice.amount)
      : Number(product.priceRange.minVariantPrice.amount);

    const discountedPrice = hasDiscount
      ? Number(product.priceRange.minVariantPrice.amount)
      : 0;

    return {
      id: productId,
      title: product.title,
      inStock: product.availableForSale,
      price,
      currency: product.priceRange.minVariantPrice.currencyCode,
      imageSrc: product.featuredImage?.url ?? '',
      imageAlt: product.featuredImage?.altText ?? product.title,
      discountedPrice,
      type: product.productType,
      sizes
    };
  });
};

const homeProcessResponse = (response: { data: { products: { nodes: BestOrLatestProduct[] } } }): HomeProduct[] => {
  const products: HomeProduct[] = response.data.products.nodes.map((product: BestOrLatestProduct) => {
    const idParts = product.id.split("/");
    const productId = idParts[idParts.length - 1];

    // Check if there's a valid compareAtPrice
    const hasDiscount = product.compareAtPriceRange?.minVariantPrice?.amount
      && Number(product.compareAtPriceRange.minVariantPrice.amount) > 0;

    // Swap prices if discount exists
    const price = hasDiscount
      ? Number(product.compareAtPriceRange.minVariantPrice.amount)
      : Number(product.priceRange.minVariantPrice.amount);

    const discountedPrice = hasDiscount
      ? Number(product.priceRange.minVariantPrice.amount)
      : 0;

    return {
      id: productId,
      title: product.title,
      inStock: product.availableForSale,
      price,
      currency: product.priceRange.minVariantPrice.currencyCode,
      imageSrc: product.featuredImage.url,
      imageAlt: product.featuredImage.altText,
      discountedPrice,
    }
  });
  return products;
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
type BestOrLatestProduct = {
  id: string,
  availableForSale: boolean;
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string,
      currencyCode: string
    }
  }
  featuredImage: {
    altText: string,
    url: string
  }
  priceRange: {
    minVariantPrice: {
      currencyCode: string,
      amount: string,
    }
  }
  title: string
}

type EdgeType = {
  node: {
    id: string,
    title: string,
    availableForSale: boolean,
    compareAtPriceRange: {
      minVariantPrice: {
        amount: string,
        currencyCode: string
      }
    },
    featuredImage: {
      url: string,
      altText: string,
    },
    priceRange: {
      minVariantPrice: {
        amount: string,
        currencyCode: string
      }
    },
    variants: [
      {
        nodes: {
          selectedOptions: {
            name: string,
            value: string,
          }
        }
      }
    ],
    productType: string
  }
}

type IndividualProductResponseType = {
  data: {
    id: string,
    title: string,
    inStock: boolean,
    description: string,
    images: [
      {
        src: string,
        alt: string
      }
    ],
    variants: [
      {
        id: string,
        title: string,
        currentlyNotInStock: boolean,
        inStock: boolean,
        price: number,
        currency: string,
        discountedPrice: number | null,
        size: string | null
      }
    ]
  }
}

type IndividualProductImageType = {
  url: string,
  altText: string
}

type IndividualProductVariantType = {
  id: string,
  title: string,
  availableForSale: boolean,
  currentlyNotInStock: boolean,
  price: {
    amount: string,
    currencyCode: string,
  },
  compareAtPrice: {
    amount: string,
    currencyCode: string
  },
  selectedOptions: [
    {
      name: string,
      value: string
    }
  ]
}