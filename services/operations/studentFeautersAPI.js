import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { studentEndPoints } from "../apis";
// Assuming rzpLogo is an image import for your Razorpay logo
// Make sure the path to your logo image is correct here
 // <--- IMPORTANT: Adjust this path!

// Assuming setPaymentLoading is an action creator for your Redux/Context state management
// Adjust the path to your slice/context where setPaymentLoading is defined
import { setPaymentLoading } from '../../slices/paymentSlice'; // <--- IMPORTANT: Adjust this path!


// Helper function to dynamically load external scripts (like Razorpay SDK)
function loadScripts(src){
    return new Promise((resolve)=>{
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

// Function to handle the course purchase process
export const buyCourse = async (token, courses, userDetails, navigate, dispatch) => {
    const toastId = toast.loading('Loading...'); // Show loading toast
    try {
        // 1. Load Razorpay SDK script
        const res = await loadScripts('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            toast.error('Razorpay SDK failed to load. Please try again.');
            return; // Exit if SDK fails to load
        }

        // 2. Initiate the order on your backend
        const orderResponse = await apiConnector('POST', studentEndPoints.COURSE_PAYMENT_API, { courses },
            {
                Authorization: `Bearer ${token}`,
            }
        );

        // Check if the order initiation from backend was successful
        // This is crucial: Throw an error if the backend call *failed*
        if (!orderResponse?.data?.success) { // <--- Corrected Logic: ! before orderResponse
            throw new Error(orderResponse.data.message || "Failed to initiate order on server.");
        }

        // 3. Prepare Razorpay options
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY, // <--- CORRECTED: Accessing key for Vite projects
            currency: orderResponse.data.message.currency,
            amount: orderResponse.data.message.amount, // <--- CORRECTED: Typo from 'aamount' to 'amount'
            order_id: orderResponse.data.message.id,
            name: 'StudyNotion',
            description: 'Thank you for Purchasing the course',
            image: "", // <--- ENSURE THIS IS A VALID IMAGE (imported or URL string)
            prefill: {
                name: `${userDetails?.firstName || ''} ${userDetails?.lastName || ''}`, // Added lastName and fallback
                email: userDetails?.email || '', // Added fallback
            },
            // The 'handler' function is called when the payment is successful
            handler: function(response) {
                toast.dismiss(toastId); // Dismiss loading toast
                toast.success('Course Enrolled Successfully!');
                // Verify payment with your backend
                verifyPayment({...response, courses }, token, navigate, dispatch);
            },
            // You can add more options here if needed, e.g., 'modal' for custom styling
            // modal: {
            //     ondismiss: function() {
            //         console.log('Payment modal closed');
            //         toast.error('Payment cancelled.');
            //     }
            // }
        };

        // 4. Create and Open the Razorpay payment modal
        // Ensure window.Razorpay is available after loadScripts completes
        const rzp1 = new window.Razorpay(options);
        rzp1.open(); // This will open the payment popup

    } catch (err) {
        toast.dismiss(toastId); // Dismiss loading toast
        console.error("Error in buyCourse function:", err); // Use console.error for errors
        console.error("Error details:", JSON.stringify(err));
        toast.error('Could not make payment. Please try again.');
    }
};


// Function to verify the payment with your backend after successful payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading('Verifying Payment...'); // Show loading toast for verification
    dispatch(setPaymentLoading(true)); // Set a loading state in your app (e.g., Redux)

    try {
        const response = await apiConnector('POST', studentEndPoints.COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response.data.message || "Failed to verify payment on server.");
        }

        toast.success('Payment Verification Successful!');
        // Navigate to the enrolled courses page or a confirmation page
        navigate('/dashboard/enrolled-courses'); // Make sure this path is correct

    } catch (err) {
        console.error('Payment verification error:', err); // Use console.error
        toast.error('Could not verify payment. Please contact support.');
    } finally {
        toast.dismiss(toastId); // Dismiss verification loading toast
        dispatch(setPaymentLoading(false)); // Reset loading state
    }
}

// Function to mark a video as completed
export const markVideoAsCompleted = async (token, courseId, subSectionId) => {
    try {
        const response = await apiConnector('POST', studentEndPoints.MARK_VIDEO_COMPLETED_API, {
            courseId,
            subSectionId
        }, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response.data.message || "Failed to mark video as completed");
        }

        return response.data;
    } catch (error) {
        console.error('Error marking video as completed:', error);
        throw error;
    }
};

// Function to get course progress
export const getCourseProgress = async (token, courseId) => {
    try {
        const response = await apiConnector('GET', studentEndPoints.GET_COURSE_PROGRESS_API, null, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response.data.message || "Failed to get course progress");
        }

        return response.data;
    } catch (error) {
        console.error('Error getting course progress:', error);
        throw error;
    }
};