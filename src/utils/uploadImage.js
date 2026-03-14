import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    // Validate file exists
    if (!imageFile) {
        throw new Error("No image file provided");
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(
            API_PATHS.IMAGE.UPLOAD_IMAGE, // → "/api/image/upload"
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        
        return response.data; // ✅ return image URL or data
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error; // re-throw so caller can handle it
    }
};

export default uploadImage;
