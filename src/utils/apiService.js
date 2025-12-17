import axios from 'axios';
const BASE_URL = 'https://staging-api.nexordr.com/api/';

/**
 * Makes an API request to the specified endpoint with the given method and data.
 * @param {string} endpoint - The API endpoint (e.g., '/users').
 * @param {string} method - HTTP method ('get', 'post', 'put', 'delete').
 * @param {object} [data] - Request payload for POST/PUT.
 * @param {object} [headers] - Optional headers.
 * @returns {Promise<object>} - The API response.
 */
export async function apiRequest(endpoint, method = 'get', data = {}, headers = {}) {
  console.log(data, 'api service data....');
  try {
    const response = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    // You can customize error handling here
    throw error.response ? error.response.data : error;
  }
}

