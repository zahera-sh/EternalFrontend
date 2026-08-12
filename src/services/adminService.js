import api from "./api";

async function getUsers() {
  const response = await api.get(`/admin/all-users`);
  return response.data;
}

async function deleteUser(userId) {
  const response = await api.put(`/admin/delete/${userId}`);
  return response.data;
}

async function verifyUser(userId) {
  const response = await api.put(`/admin/verify/${userId}`);
  return response.data;
}

export { getUsers, deleteUser, verifyUser };
