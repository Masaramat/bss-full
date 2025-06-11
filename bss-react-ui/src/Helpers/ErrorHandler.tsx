import axios from "axios";
import { toast } from "react-toastify";
import { NavigateFunction } from "react-router-dom";

export const handleError = (error: any, navigate: NavigateFunction) => {
    if (!axios.isAxiosError(error)) {
        console.error("An unknown error occurred", error);
        toast.error("An unknown error occurred. Please try again.");
        return;
    }

    const response = error.response;

    if (response) {
        const { status, data } = response;

        // Log the error for debugging
        console.error(`Error ${status}:`, data);

        // Handle different error status codes
        switch (status) {
            case 401:
                toast.warning("Please login");
                navigate("/login");
                break;
            case 403:
                toast.warning("Session expired. Please login again.");
                navigate("/login");
                break;
            case 400:
                toast.warning("Please check your input");
                break;
            case 404:
                toast.warning(data?.message || "Resource not found.");
                break;
            default:
                toast.error(data?.message || "An unexpected error occurred. Please try again.");
        }

        // Handle different error data structures
        if (Array.isArray(data?.errors)) {
            data.errors.forEach((err: any) => toast.warning(err.message));
        } else if (typeof data?.errors === "object") {
            Object.values(data.errors).forEach((msgArray: any) => {
                if (Array.isArray(msgArray)) {
                    msgArray.forEach((msg: string) => toast.warning(msg));
                }
            });
        } else if (data) {
            toast.warning(data);
        }
    } else {
        // If no response, log a generic error message
        console.error("No response received from the server", error);
        toast.error("No response received from the server. Please check your internet connection and try again.");
    }
};
