import API from './axiosInstance';

// Profile management parameters fetch using identity token code
export const getUserProfile = async (userId) => {
    const response = await API.get(`/Users/${userId}`);
    return response.data;
};

// Account properties patch config metadata
export const updateUserProfile = async (userId, updateData) => {
    const response = await API.put(`/Users/${userId}`, updateData);
    return response.data;
};

// Account soft-termination validation pipeline
export const deleteUserAccount = async (userId) => {
    const response = await API.delete(`/Users/${userId}`);
    return response.data;
};
