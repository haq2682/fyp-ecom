"use server";

import { gql } from 'graphql-request';
import storefront from '@/utils/shopify';
import { HomeProduct } from '@/types';

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

export async function getProductTypes() {
  const productTypesQuery = gql`
    query {
      productTypes(first: 250) {
        nodes
      }
    }
  `;

  try {
    const response = await storefront(productTypesQuery);
    
    const productTypes = new Set(
      response.data.productTypes.nodes.filter((type: string) => type !== "")
    );
    
    return productTypes;
  } catch (error) {
    console.error('Error fetching product types', error);
    throw new Error('Failed to fetch product types');
  }
}

export async function searchProducts(searchParams: {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  size?: string
  type?: string
}): Promise<HomeProduct[]> {
  const { query, category, minPrice, maxPrice, size, type } = searchParams
  const filters: string[] = []

  if (query) {
    filters.push(`title:${query}`) 
  }

  if (category) {
    filters.push(` (category:${category}) `)
  }
  if (type) {
    filters.push(` (product_type:${type}) `)
  }
  console.log(type)
  console.log(category)
  if (minPrice || maxPrice) {
    const priceFilter = [
      minPrice ? `variants.price:>=${minPrice}` : null,
      maxPrice ? `variants.price:<=${maxPrice}` : null,
    ]
      .filter(Boolean)
      .join(" AND ")
    if (priceFilter) {
      filters.push(`(${priceFilter})`)
    }
  }

  if (size) {
    filters.push(`variants.option1:${size}`)
  }
  console.log(filters)
  const quer = gql`
    query ($filters: String!) {
      products(first: 250, query: $filters) {
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
            url(transform: {maxHeight: 230, maxWidth: 200, crop: CENTER})
          }
          priceRange {
            minVariantPrice {
              currencyCode
              amount
            }
          }
         
        }
      }
    }`
  try {
    const response = await storefront(quer, { filters: filters.join(" AND ") })
    const products: HomeProduct[] = processResponse(response)
    return products
  } catch (error) {
    console.error("Error searching products", error)
    throw new Error("Failed to search products")
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
    const products: HomeProduct[] = processResponse(response);
    return products;
  }
  catch(error) {
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
    const products: HomeProduct[] = processResponse(response);
    return products;
  }
  catch (error) {
    console.error('Error fetching Latest Products', error);
    throw new Error('Failed to fetch Latest Products');
  }
}

export async function getIndividualProduct(id: string): Promise<any> {
  // Note the change from 'gid:/shopify' to 'gid://shopify'
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

    // Process the response
    const product = response.data.product;
    const idParts = product.id.split("/");
    const productId = idParts[idParts.length - 1];
    return {
      data: {
        id: productId,
        title: product.title,
        inStock: product.availableForSale,
        description: product.description,
        images: product.images.nodes.map((image: any) => ({
          src: image.url,
          alt: image.altText || product.title
        })),
        variants: product.variants.nodes.map((variant: any) => ({
          id: variant.id,
          title: variant.title,
          inStock: variant.availableForSale,
          price: Number(variant.price.amount),
          currency: variant.price.currencyCode,
          discountedPrice: variant.compareAtPrice ? Number(variant.compareAtPrice.amount) : null,
          size: variant.selectedOptions.find((opt: any) => opt.name === "Size")?.value || null
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching Individual Product', error);
    throw new Error('Failed to fetch Individual Product');
  }
}

//Local Helper Functions
const processResponse = (response: {data: {products: {nodes: BestOrLatestProduct[]}}}): HomeProduct[] => {
  const products: HomeProduct[] = response.data.products.nodes.map((product: BestOrLatestProduct) => {
    const idParts = product.id.split("/");
    const productId = idParts[idParts.length - 1];
    return {
      id: productId,
      title: product.title,
      inStock: product.availableForSale,
      price: Number(product.priceRange.minVariantPrice.amount),
      currency: product.priceRange.minVariantPrice.currencyCode,
      imageSrc: product.featuredImage.url,
      imageAlt: product.featuredImage.altText,
      discountedPrice: Number(product.compareAtPriceRange.minVariantPrice.amount),
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
