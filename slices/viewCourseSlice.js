import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    courseSectionData : [], // Holds sections with subsections (e.g., from courseData.courseContent)
    courseEntireData : null, // Holds the entire course object
    completedLectures : [], // Array of IDs of completed subsections for the current user
    totalNoOfLectures : 0, // Total count of all subsections in the course
}

const viewCourseSlice = createSlice({
    name: 'viewCourse', // Name for your slice in the Redux store
    initialState,
    reducers:{
        setCourseSectionData(state,action){
            state.courseSectionData = action.payload;
        },
        setEntireCourseData(state,action){
            state.courseEntireData = action.payload;
        },
        setCompletedLectures(state,action){
            state.completedLectures = action.payload;
        },
        setTotalNoOfLectures(state,action){
            state.totalNoOfLectures = action.payload;
        },
        // Optional: Reducer to toggle a single lecture's completion status
        toggleLectureCompletion(state, action) {
            const lectureId = action.payload;
            if (state.completedLectures.includes(lectureId)) {
                state.completedLectures = state.completedLectures.filter(id => id !== lectureId);
            } else {
                state.completedLectures.push(lectureId);
            }
        }
    }
})

export const {setEntireCourseData, setTotalNoOfLectures, setCompletedLectures, setCourseSectionData, toggleLectureCompletion} = viewCourseSlice.actions
export default viewCourseSlice.reducer;