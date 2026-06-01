import API from './axiosInstance';

// Execute standard Buy or Sell transaction options orders
export const executeTransaction = async (transactionData) => {
    const response = await API.post('/Transactions/execute', transactionData);
    return response.data;
};

// Get complete global ledger history configuration array by userId
export const getUserTransactionHistory = async (userId) => {
    const response = await API.get(`/Transactions/user/${userId}`);
    return response.data;
};

// Get specific isolated snapshot stream by portfolioId
export const getPortfolioTransactionHistory = async (portfolioId) => {
    const response = await API.get(`/Transactions/portfolio/${portfolioId}`);
    return response.data;
};
