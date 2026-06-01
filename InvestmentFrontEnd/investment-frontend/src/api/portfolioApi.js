import API from './axiosInstance';

// 1. GET: User ke saare portfolios (List response)
export const getPortfoliosByUser = async (userId) => {
    const response = await API.get(`/Portfolios/user/${userId}`);
    return response.data;
};

// 2. GET: Kisi ek particular portfolio ka dynamic summary calculation object
export const getPortfolioSummary = async (portfolioId) => {
    const response = await API.get(`/Portfolios/${portfolioId}/summary`);
    return response.data;
};

// 3. POST: Naya portfolio bag create karne ke liye
export const createPortfolio = async (portfolioData) => {
    const response = await API.post('/Portfolios', portfolioData);
    return response.data;
};

// 4. PUT: Portfolio ka name aur description edit karne ke liye
export const updatePortfolio = async (portfolioId, portfolioData) => {
    const response = await API.put(`/Portfolios/${portfolioId}`, portfolioData);
    return response.data;
};

// 5. DELETE: Pure portfolio bag ko DB aur system se terminate karne ke liye
export const deletePortfolio = async (portfolioId) => {
    const response = await API.delete(`/Portfolios/${portfolioId}`);
    return response.data;
};


