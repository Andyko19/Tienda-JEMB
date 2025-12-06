import axios from "axios";

// Creamos una "instancia" de axios con la dirección de tu backend
const api = axios.create({
  baseURL: "http://localhost:3001/api", // Esta es la base de todas tus rutas
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
