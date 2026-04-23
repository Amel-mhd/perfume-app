import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://aura-backend-qrhu.onrender.com'
  : 'http://localhost:3001';

const api = async ({ route, method = 'GET', data = null, token = null }) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await axios({
    method,
    url: `${BASE_URL}${route}`,
    data,
    headers,
  });

  return res.data;
};

export default api;