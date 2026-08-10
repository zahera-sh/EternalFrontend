import api from "./api";

async function createBid(itemId, body) {
  console.log("Creating bid:", {
    itemId,
    body,
  });

  try {
    const response = await api.post(`/bid/${itemId}/bids`, body);
    return response.data;
  } catch (error) {
    console.error("CREATE BID ERROR:", error.response?.data);
    throw error;
  }
}
async function getBidsByItem(itemId) {
  const response = await api.get(`/bid/${itemId}/bids`);
  return response.data;
}

export { createBid, getBidsByItem };
