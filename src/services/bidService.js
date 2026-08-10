import api from "./api";

async function createBid(itemId, body) {
  const response = await api.post(`/items/${itemId}/bids`, body);
  return response.data;
}

async function getBidsByItem(itemId) {
  const response = await api.get(`/items/${itemId}/bids`);
  return response.data;
}

export { createBid, getBidsByItem };
