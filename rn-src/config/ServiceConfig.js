// services/config.js
// Get you goole places api key from DB from config table.
export const getConfig = async () => {
    const response = await fetch('https://your-config-server.com/config');
    return response.json();
};


// Usage:
// const config = await getConfig();
// const API_URL = config.API_URL;
