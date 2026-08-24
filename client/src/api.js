import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const getCampaign = () => api.get("/campaign").then((r) => r.data);
export const getHubs = (params) => api.get("/hubs", { params }).then((r) => r.data);
export const getHub = (hubId) => api.get(`/hubs/${hubId}`).then((r) => r.data);
export const getReports = () => api.get("/reports").then((r) => r.data);
export const getReport = (index) => api.get(`/reports/${index}`).then((r) => r.data);
export const getTickets = () => api.get("/tickets").then((r) => r.data);
export const createTicket = (payload) => api.post("/tickets", payload).then((r) => r.data);
export const clearTickets = () => api.delete("/tickets");

export default api;
