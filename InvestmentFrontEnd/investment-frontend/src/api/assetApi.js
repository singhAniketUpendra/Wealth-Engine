import API from './axiosInstance';

// 1. GET ALL ASSETS
export const getAllAssets = async () => {
    const response = await API.get('/Assets');
    return response.data;
};

// 2. POST / CREATE ASSET (Expects AssetRequestDto)
export const createAsset = async (assetData) => {
    const response = await API.post('/Assets', assetData);
    return response.data;
};

// 3. GET ASSET BY ID
export const getAssetById = async (id) => {
    const response = await API.get(`/Assets/${id}`);
    return response.data;
};

// 4. PUT / UPDATE ASSET (Expects id and AssetRequestDto)
export const updateAsset = async (id, assetData) => {
    const response = await API.put(`/Assets/${id}`, assetData);
    return response.data;
};

// 5. DELETE ASSET
export const deleteAsset = async (id) => {
    const response = await API.delete(`/Assets/${id}`);
    return response.data;
};

// 6. GET ASSETS BY TYPE (Enum Filter: Stock/Crypto)
export const getAssetsByType = async (type) => {
    const response = await API.get(`/Assets/type/${type}`);
    return response.data;
};
