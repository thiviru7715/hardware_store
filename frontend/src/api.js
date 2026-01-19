import axios from "axios";

// Use deployed Fly.io backend in production
const API = axios.create({
  baseURL: "https://hardware-store-api.fly.dev"
});

export default API;
