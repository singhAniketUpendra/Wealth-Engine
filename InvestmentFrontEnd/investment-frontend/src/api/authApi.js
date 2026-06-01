import API from './axiosInstance';

export const loginUser = async (loginData) => {
    // loginData mein email aur password pass hoga
    const response = await API.post('/Auth/login', loginData);
    return response.data; // Isme Token, RefreshToken, Username, Role sab aayega
};

export const refreshUserToken = async (tokenData) => {
    // tokenData mein accessToken aur refreshToken jaayega
    const response = await API.post('/Auth/refresh', tokenData);
    return response.data;
};

// Register hit karega backend par (UserRequestDto pass hoga)
export const registerUser = async (userData) => {
    // userData mein Username, Email, Password jaayega
    const response = await API.post('/Users/register', userData);
    return response.data;
};
