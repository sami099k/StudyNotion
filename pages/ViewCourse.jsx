import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CourseDetailsCont } from '../services/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import CourseReviewModal from '../components/content/CourseReviewModal';
import VideoSideBar from '../components/content/VideoSideBar';
import VideoPlayer from '../components/content/VideoPlayer';

const ViewCourse = () => {
  const [reviewModal, setReviewModal] = useState(false);
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      try {
        if (!courseId) {
          console.error("No courseId provided");
          navigate('/dashboard/enrolled-courses');
          return;
        }

        console.log("ViewCourse - Fetching course data for courseId:", courseId);
        console.log("ViewCourse - Using token:", token);

        const courseDataResult = await CourseDetailsCont({ courseId }, token);
        console.log("Course Data from API for ViewCourse:", courseDataResult);

        if (!courseDataResult) {
          console.error("Course data not found for ViewCourse:", courseId);
          navigate('/dashboard/enrolled-courses');
          return;
        }

        // Validate the course data structure
        if (!courseDataResult.courseContent) {
          console.error("Course has no content structure:", courseDataResult);
        }

        // courseDataResult is the direct course object from the API
        const courseDetails = courseDataResult;

        console.log("ViewCourse - Course details:", courseDetails);
        console.log("ViewCourse - Course content:", courseDetails.courseContent);

        dispatch(setEntireCourseData(courseDetails));
        dispatch(setCourseSectionData(courseDetails.courseContent || []));

        let lectures = 0;
        if (courseDetails.courseContent && courseDetails.courseContent.length > 0) {
          courseDetails.courseContent.forEach(sec => {
            lectures += sec.subSection?.length || 0;
          });
        }
        dispatch(setTotalNoOfLectures(lectures));

        // Set completed lectures from the API response
        dispatch(setCompletedLectures(courseDetails.completedVideos || []));

        console.log("ViewCourse - Total lectures:", lectures);
        console.log("ViewCourse - Completed videos:", courseDetails.completedVideos);

        // If no content, show a message but don't navigate away
        if (!courseDetails.courseContent || courseDetails.courseContent.length === 0) {
          console.log("ViewCourse - No course content available");
        }

      } catch (error) {
        console.error("Error setting course specific details in ViewCourse:", error);
        // Don't navigate away on error, just show the error state
      }
    };
    setCourseSpecificDetails();
  }, [courseId, dispatch, navigate, token]);

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] bg-[#000814]">
      {/* Video Side Bar */}
      <VideoSideBar setReviewModal={setReviewModal} />

      {/* Main Video Content Area */}
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto bg-[#000814] text-[#F1F2F3] relative">
        <div className="mx-auto w-11/12 max-w-maxContent py-10">
          <VideoPlayer />
        </div>
      </div>

      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </div>
  );
};

export default ViewCourse;