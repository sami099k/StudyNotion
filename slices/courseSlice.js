import { createSlice } from "@reduxjs/toolkit"


const initState = {
    step : localStorage.getItem('step') ?? 1,
    course:localStorage.getItem('course') ? JSON.parse(localStorage.getItem('course')) :  null,
    editCourse: localStorage.getItem('editCourse') || false ,   
}

const courseSlice = createSlice({
    name:'course',
    initialState:initState,
    reducers:{
        setStep(state,value){
                state.step = value.payload;
                localStorage.setItem('step',JSON.stringify(state.step));
        },
        setCourse(state,value){
                state.course = value.payload;
                if(!state.course){
                    localStorage.clear('editCourse');
                    localStorage.clear('step');
                }
                else localStorage.setItem('course',JSON.stringify(state.course));

        },
        setEditCourse(state,value){
            state.editCourse = value.payload;
            localStorage.setItem('editCourse',state.editCourse);

        },
        resetCourseState(state){
            state.step = 1;
            state.course = null;
            state.editCourse = false;
            // Remove from localStorage
            localStorage.removeItem('step');
            localStorage.removeItem('course');
            localStorage.removeItem('editCourse');
        }
    }
})

export const {setStep,setCourse,setEditCourse,resetCourseState} = courseSlice.actions;
export default courseSlice.reducer;