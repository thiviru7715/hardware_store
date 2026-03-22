import axios from "axios";

// Use deployed Fly.io backend in production
const API = axios.create({
  baseURL: "http://localhost:5000"
});

export default API;
