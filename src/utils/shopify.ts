import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['X-Shopify-Storefront-Access-Token'] = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export default async function storefront(query: string, variables = {}) {
  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_SHOPIFY_SHOP_URL as string, {
      query,
      variables
    });
    if (response.data.errors?.length > 0) {
      console.error("Shopify Query", response.data.errors[0]);
      throw new Error(response.data.errors[0]);
    }
    return response.data;
  }

  catch (error) {
    console.error("Shopify Catch", error);
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error);
      throw new Error('API request failed');
    }
    throw error;
  }
}