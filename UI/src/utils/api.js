import axios from "axios";
import { encryptData } from "./encryption";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getChatUsers = async () => {
  const response = await api.get("/chat/users");
  return response.data;
};

export const getChatMessages = async (receiverId) => {
  const response = await api.get(`/chat/${receiverId}`);
  return response.data;
};

export const sendChatMessage = async (receiverId, message) => {
  const encryptedData = encryptData({ receiverId, message });
  const response = await api.post("/chat", { encryptedData });
  return response.data;
};

export default api;
