import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY

export const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
        return response.data.data.url;
    } catch (error) {
        console.error('Image upload failed:', error);
        throw error;
    }
};
