import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['X-Shopify-Storefront-Access-Token'] = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export default async function storefront(query: string, variables = {}) {
  try {
    const response = await axios.post(process.env.SHOPIFY_SHOP_URL as string, {
      query,
      variables
    });
    if (response.data.errors) {
      throw new Error(response.data.errors);
    }
    return response.data;
  }
  
  catch(error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data);
      throw new Error('API request failed');
    }
    throw error;
  }
}