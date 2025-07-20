const BASE_URL = 'http://localhost:3000/api/v1'

export const categories = {
    CATEGORIES_API : BASE_URL + '/course/showAllCategories',
};

export const catalogData = {
    CATALOG_PAGE_DETAILS_API : BASE_URL + '/course/getCategoryPageDetails',
}


export const resetPasswordToken = {
    RESET_TOKEN_API : BASE_URL + '/auth/reset-password-token',
    UPDATE_PASSWORD_API: BASE_URL + '/auth/reset-password'
}

export const signup = {
    SIGNUP_API : BASE_URL + '/auth/signup',
    SEND_OTP_API : BASE_URL + '/auth/sendotp'
}

export const loginApi = {
    LOGIN_API : BASE_URL + '/auth/login',
}

export const profileAPIS = {
    GET_USER_DETAILS_API : BASE_URL + '/profile/getUserDetails',
    UPDATE_PROFILE_API : BASE_URL + '/profile/updateProfile',
    UPDATE_DISPLAY_PICTURE_API : BASE_URL + '/profile/updateDisplayPicture'
}

export const courseAPIS = {
    COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
    COURSE_DETAILS_API : BASE_URL + '/course/getCourseDetails',
    COURSE_ADD_API: BASE_URL + '/course/createCourse',
    UPDATE_STATUS_API : BASE_URL + '/course/updateStatus',
    FETCH_ALL_COURSES_API : BASE_URL + "/course/getAllCourses",
    DELETE_COURSE_API : BASE_URL + "/course/deleteCourse",
    UPDATE_COURSE_API : BASE_URL + '/course/updateCourse',
    CREATE_RATING_API : BASE_URL + '/course/createRating',
    GET_AVERAGE_RATING_API : BASE_URL + '/course/getAverageRating',
    GET_ALL_REVIEWS_API : BASE_URL + '/course/getReviews',
    UPDATE_PROGRESS_API : BASE_URL + '/course/updateProgress',
    GET_PROGRESS_API : BASE_URL + '/course/getProgress',
    MARK_LECTURE_COMPLETE_API : BASE_URL + '/course/markLectureComplete',
}

export const sectionAPIS = {
    ADD_SECTION_API : BASE_URL + '/course/addSection',
    EDIT_SECTION_API : BASE_URL + '/course/updateSection',
    DELETE_SECTION_API : BASE_URL + '/course/deleteSection',
}


export const subSectionAPIS = {
    ADD_SUBSECTION_API : BASE_URL + '/course/addSubSection',
    EDIT_SUBSECTION_API : BASE_URL + "/course/updateSubSection",
    DELETE_SUBSECTION_API : BASE_URL + "/course/deleteSubSection"
}

export const studentEndPoints = {
    COURSE_PAYMENT_API : BASE_URL + '/payment/capturePayment',
    COURSE_VERIFY_API : BASE_URL + '/payment/verifySignature',
    MARK_VIDEO_COMPLETED_API : BASE_URL + '/course/markVideoCompleted',
    GET_COURSE_PROGRESS_API : BASE_URL + '/course/getCourseProgress',
}