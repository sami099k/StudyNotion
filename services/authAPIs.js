import { useDispatch } from "react-redux" // useDispatch is typically used inside components
import { setLoading, setToken } from "../slices/authSlice";
import { apiConnector } from "./apiConnector";
import { loginApi, profileAPIS, resetPasswordToken, signup } from "./apis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // useNavigate is a hook
import { setUser } from "../slices/profileSlics";

// Function to get the current path (since location.pathname isn't directly available here)
// This will either need to be passed as a parameter or if called from a component,
// location.pathname would be used there. For simplicity, if not passed, it can default or be handled.
const getCurrentPath = () => window.location.pathname; // This is a client-side solution


export const sendOTP = (email, navigate) => { // navigate should be passed
    return async (dispatch) => {
        dispatch(setLoading(true)); // Corrected dispatch usage
        try {
            // location.pathname is not available here directly. If needed, pass it as a parameter or get it via `window.location.pathname` if running in browser.
            const response = await apiConnector('POST', signup.SEND_OTP_API, { email: email }); // Removed location.pathname from apiConnector args
            if (!response) {
                throw new Error('Response not found');
            }
            if (!response.data || !response.data.success) { // Corrected logic to check response.data.success
                throw new Error(response.data?.message || 'Failed to send OTP'); // Access message safely
            }

            toast.success('Otp sent successfully');
            navigate('/verify-email');
        } catch (err) {
            console.log("SEND_OTP_API ERROR:", err); // Log full error
            const message = err.response?.data?.message || err.message; // Access message safely
            toast.error(`Failed to send OTP: ${message}`); // More user-friendly message
        }
        dispatch(setLoading(false)); // Corrected dispatch usage
    }
}

export const signUP = (firstName, lastName, password, confirmPassword, email, accountType, phNo, otp, navigate) => {
    return async (dispatch) => { // dispatch needs to be passed to use setLoading inside
        dispatch(setLoading(true)); // Corrected dispatch usage
        try {
            const response = await apiConnector('POST', signup.SIGNUP_API,
                {
                    firstName,
                    lastName,
                    password,
                    confirmPassword,
                    email,
                    accountType,
                    otp,
                    phNo
                }
            ); // Removed location.pathname from apiConnector args
            if (!response) {
                throw new Error('Response not found ');
            }

            if (!response.data.success) {
                console.log("SIGNUP_API ERROR RESPONSE:", response.data); // Log response data
                throw new Error(response.data.message || 'Signup failed'); // Access message safely
            }

            toast.success('Account Created successfully');
            navigate('/login'); // navigate after success

        } catch (err) {
            console.log("SIGNUP_API ERROR:", err); // Log full error
            const message = err.response?.data?.message || err.message; // Access message safely
            toast.error(`Failed to complete sign up: ${message}`);
        }
        dispatch(setLoading(false)); // Corrected dispatch usage
    }
}


export const resetPassword = (newPassword, confirmNewPassword, token) => {
    return async (dispatch) => {
        dispatch(setLoading(true)); // Corrected dispatch usage
        try {
            console.log(resetPasswordToken.UPDATE_PASSWORD_API);
            const response = await apiConnector('POST', resetPasswordToken.UPDATE_PASSWORD_API, { newPassword, confirmNewPassword, token });
            console.log(response)
            if (!response.data) {
                throw new Error('Response not found');
            }
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success('Password updated successfully');

        } catch (err) {
            console.log("RESET_PASSWORD_API ERROR:", err); // Log full error
            const message = err.response?.data?.message || err.message; // Access message safely
            toast.error(`Failed to update password: ${message}`);
        }
        dispatch(setLoading(false)); // Corrected dispatch usage
    }
}

export const login = (email, password, navigate) => {
    return async (dispatch) => { // dispatch needs to be passed
        dispatch(setLoading(true)); // Corrected dispatch usage
        try {
            console.log('Login - calling API with:', { email, password });
            console.log('Login - API URL:', loginApi.LOGIN_API);
            
            // location.pathname is not available here directly.
            const response = await apiConnector('POST', loginApi.LOGIN_API, { email, password }); // Removed location.pathname
            
            console.log('Login - response:', response);
            
            if (!response) {
                throw new Error('Response not found ');
            }

            if (!response.data.success) {
                console.log("LOGIN_API ERROR RESPONSE:", response.data); // Log response data
                throw new Error(response.data.message || 'Login failed'); // Access message safely
            }
            dispatch(setToken(response.data.token));
            // Assuming `response.data.user` is returned with login
            if (response.data.user) {
                dispatch(setUser(response.data.user));
                localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
            }
            localStorage.setItem('token', response.data.token);
            toast.success('Login Successful');
            navigate('/'); // Navigate on success

        } catch (err) {
            console.error("LOGIN_API ERROR:", err); // Log full error
            const message = err.response?.data?.message || err.message; // Access message safely
            toast.error(`${message}`);
            // navigate('/login') // This might cause an infinite loop if already on login page
        }
        dispatch(setLoading(false)); // Corrected dispatch usage
    }
}

export const profilePicture = (token) => { // This function name should probably be `fetchUserProfile` or similar
    return async (dispatch) => {
        try {
            console.log('profilePicture - calling API with token:', token);
            console.log('profilePicture - API URL:', profileAPIS.GET_USER_DETAILS_API);
            
            const response = await apiConnector('GET', profileAPIS.GET_USER_DETAILS_API, null,
                {
                    Authorization: `Bearer ${token}`
                }
            );
            
            console.log('profilePicture - response:', response);
            
            if (!response?.data?.user) {
                throw new Error("User data not found in response.");
            }
            const user = response.data.user;
            console.log('profilePicture - dispatching user:', user);
            dispatch(setUser(user));

        } catch (err) {
            console.error("profilePicture (GET_USER_DETAILS_API) ERROR:", err);
            // If token is invalid, clear user data
            if (err.response?.status === 401) {
                dispatch(setUser(null));
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }
}