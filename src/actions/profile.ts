"use server";
import storefront from "@/utils/shopify";
import { gql } from "graphql-request";
import { cookies } from "next/headers";
import { ProfileResponse, ProfileUpdateData, OrdersResponse, PasswordUpdateData, PasswordUpdateResponse, AddressResponse, AddressData, CustomerAddress } from "@/types";

export async function getProfile(): Promise<ProfileUpdateData | null> {
  const customerAccessToken = (await cookies()).get('shopifyCustomerAccessToken')?.value;

  if (!customerAccessToken) {
    return null;
  }

  const query = gql`
        query getCustomerProfile($customerAccessToken: String!) {
            customer(customerAccessToken: $customerAccessToken) {
                firstName
                lastName
                email
            }
        }
    `;

  try {
    const response = await storefront(query, { customerAccessToken });
    const customer = response.data.customer;

    if (!customer) {
      return null;
    }

    return {
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      email: customer.email || "",
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function updateProfile(data: ProfileUpdateData): Promise<ProfileResponse> {
  const customerAccessToken = (await cookies()).get('shopifyCustomerAccessToken')?.value;

  if (!customerAccessToken) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      success: false,
      message: "Invalid email format",
    };
  }

  const mutation = gql`
        mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
            customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
                customer {
                    firstName
                    lastName
                    email
                }
                customerAccessToken {
                    accessToken
                    expiresAt
                }
                customerUserErrors {
                    code
                    field
                    message
                }
            }
        }
    `;

  try {
    const response = await storefront(mutation, {
      customerAccessToken,
      customer: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
    });

    const { customerUpdate } = response.data;

    if (customerUpdate.customerUserErrors.length > 0) {
      const error = customerUpdate.customerUserErrors[0];
      return {
        success: false,
        message: error.message,
      };
    }

    // If email was updated, we might get a new access token
    if (customerUpdate.customerAccessToken) {
      (await cookies()).set('shopifyCustomerAccessToken',
        customerUpdate.customerAccessToken.accessToken, {
        expires: new Date(customerUpdate.customerAccessToken.expiresAt),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }

    return {
      success: true,
      message: "Profile updated successfully",
      user: {
        firstName: customerUpdate.customer.firstName || "",
        lastName: customerUpdate.customer.lastName || "",
        email: customerUpdate.customer.email,
      },
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: "Failed to update profile",
    };
  }
}

export async function updatePassword(data: PasswordUpdateData): Promise<PasswordUpdateResponse> {
  const customerAccessToken = (await cookies()).get('shopifyCustomerAccessToken')?.value;

  if (!customerAccessToken) {
    return {
      success: false,
      message: "Not authenticated"
    };
  }

  // Password validation
  if (data.newPassword.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters long"
    };
  }

  const mutation = gql`
        mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
            customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
                customer {
                    id
                }
                customerUserErrors {
                    code
                    field
                    message
                }
                customerAccessToken {
                    accessToken
                    expiresAt
                }
            }
        }
    `;

  try {
    const response = await storefront(mutation, {
      customerAccessToken,
      customer: {
        password: data.newPassword,
      }
    });

    const { customerUpdate } = response.data;

    if (customerUpdate.customerUserErrors.length > 0) {
      const error = customerUpdate.customerUserErrors[0];
      return {
        success: false,
        message: error.message,
        errors: customerUpdate.customerUserErrors
      };
    }

    // Update access token if provided
    if (customerUpdate.customerAccessToken) {
      (await cookies()).set('shopifyCustomerAccessToken',
        customerUpdate.customerAccessToken.accessToken, {
        expires: new Date(customerUpdate.customerAccessToken.expiresAt),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }

    return {
      success: true,
      message: "Password updated successfully"
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      message: "Failed to update password"
    };
  }
}

export async function getDefaultAddress(): Promise<CustomerAddress | null> {
  const customerAccessToken = (await cookies()).get('shopifyCustomerAccessToken')?.value;

  if (!customerAccessToken) {
    return null;
  }

  const query = gql`
        query getCustomerDefaultAddress($customerAccessToken: String!) {
            customer(customerAccessToken: $customerAccessToken) {
                defaultAddress {
                    id
                    address1
                    city
                    province
                    zip
                    country
                }
            }
        }
    `;

  try {
    const response = await storefront(query, { customerAccessToken });
    const defaultAddress = response.data.customer?.defaultAddress;

    if (!defaultAddress) {
      return null;
    }

    return {
      id: defaultAddress.id,
      address1: defaultAddress.address1 || "",
      city: defaultAddress.city || "",
      province: defaultAddress.province || "",
      zip: defaultAddress.zip || "",
      country: defaultAddress.country || "",
      isDefaultAddress: true
    };
  } catch (error) {
    console.error("Error fetching default address:", error);
    return null;
  }
}

export async function updateAddress(data: AddressData): Promise<AddressResponse> {
  const customerAccessToken = (await cookies()).get('shopifyCustomerAccessToken')?.value;

  if (!customerAccessToken) {
    return {
      success: false,
      message: "Not authenticated"
    };
  }

  // Get existing default address ID first
  const defaultAddress = await getDefaultAddress();
  const mutation = defaultAddress ? gql`
        mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
            customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
                customerAddress {
                    id
                    address1
                    city
                    province
                    zip
                    country
                }
                customerUserErrors {
                    code
                    field
                    message
                }
            }
        }
    ` : gql`
        mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
            customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
                customerAddress {
                    id
                    address1
                    city
                    province
                    zip
                    country
                }
                customerUserErrors {
                    code
                    field
                    message
                }
            }
        }
    `;

  try {
    const variables = defaultAddress ? {
      customerAccessToken,
      id: defaultAddress.id,
      address: {
        address1: data.address1,
        city: data.city,
        province: data.province,
        zip: data.zip,
        country: data.country
      }
    } : {
      customerAccessToken,
      address: {
        address1: data.address1,
        city: data.city,
        province: data.province,
        zip: data.zip,
        country: data.country
      }
    };

    const response = await storefront(mutation, variables);
    const result = defaultAddress ?
      response.data.customerAddressUpdate :
      response.data.customerAddressCreate;

    if (result.customerUserErrors?.length > 0) {
      return {
        success: false,
        message: result.customerUserErrors[0].message,
        errors: result.customerUserErrors
      };
    }

    // If this is a new address, set it as default
    if (!defaultAddress && result.customerAddress) {
      await setDefaultAddress(result.customerAddress.id);
    }

    return {
      success: true,
      message: "Address updated successfully",
      address: {
        address1: result.customerAddress.address1,
        city: result.customerAddress.city,
        province: result.customerAddress.province,
        zip: result.customerAddress.zip,
        country: result.customerAddress.country
      }
    };
  } catch (error) {
    console.error("Error updating address:", error);
    return {
      success: false,
      message: "Failed to update address"
    };
  }
}

async function setDefaultAddress(addressId: string): Promise<void> {
  const customerAccessToken = (await cookies()).get('shopifyCustomerAccessToken')?.value;

  if (!customerAccessToken) return;

  const mutation = gql`
        mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
            customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
                customer {
                    id
                }
                customerUserErrors {
                    code
                    field
                    message
                }
            }
        }
    `;

  try {
    await storefront(mutation, {
      customerAccessToken,
      addressId
    });
  } catch (error) {
    console.error("Error setting default address:", error);
  }
}

export async function getOrders(cursor?: string): Promise<OrdersResponse> {
  const customerAccessToken: string = (await cookies()).get('shopifyCustomerAccessToken')?.value || '';

  const query = gql`
    query fetchOrders($customerAccessToken: String!, $cursor: String) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: 5, after: $cursor) {
          edges {
            node {
              totalPrice {
                amount
                currencyCode
              }
              orderNumber
              name
              id
              processedAt
              financialStatus
              lineItems(first: 10) {
                edges {
                  node {
                    quantity
                    variant {
                      id
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      price {
                        amount
                        currencyCode
                      }
                      title
                      unitPrice {
                        amount
                        currencyCode
                      }
                      image {
                        transformedSrc(crop: CENTER, maxHeight: 150, maxWidth: 150)
                        altText
                      }
                      product {
                        createdAt
                        featuredImage {
                          url(transform: {crop: CENTER, maxHeight: 150, maxWidth: 150})
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
          totalCount
        }
      }
    }
    `;

  try {
    const response = await storefront(query, {
      customerAccessToken,
      cursor: cursor || null
    });
    return response;
  }
  catch (error) {
    console.error('Failed to fetch orders', error);
    throw new Error('Failed to fetch orders');
  }
}