import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
import { RiVideoFill } from "react-icons/ri";
import { markVideoAsCompleted } from '../../services/operations/studentFeautersAPI';
import { setCompletedLectures } from '../../slices/viewCourseSlice';

const VideoSideBar = ({ setReviewModal }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sectionId, subSectionId } = useParams();
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state) => state.viewCourse);
    const { token } = useSelector((state) => state.auth);
    const [activeSections, setActiveSections] = useState([]);

    useEffect(() => {
        if (courseSectionData && courseSectionData.length > 0 && sectionId && sectionId !== 'no-content') {
            const currentSectionIndex = courseSectionData.findIndex(
                (section) => section._id === sectionId
            );
            if (currentSectionIndex !== -1) {
                setActiveSections(prev => {
                    if (!prev.includes(currentSectionIndex)) {
                        return [...prev, currentSectionIndex];
                    }
                    return prev;
                });
            }
        }
    }, [courseSectionData, sectionId]);

    const toggleSection = (index) => {
        setActiveSections(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const isSubsectionCompleted = (id) => completedLectures.includes(id);

    const handleVideoCompletion = async (subSectionId) => {
        try {
            if (!courseEntireData?._id) return;
            const result = await markVideoAsCompleted(token, courseEntireData._id, subSectionId);
            if (result?.success) {
                const newCompletedLectures = isSubsectionCompleted(subSectionId)
                    ? completedLectures.filter(id => id !== subSectionId)
                    : [...completedLectures, subSectionId];
                dispatch(setCompletedLectures(newCompletedLectures));
            }
        } catch (error) {
            console.error('Error toggling video completion:', error);
        }
    };

    return (
        <div className="flex h-[calc(100vh-3.5rem)] w-[340px] flex-col bg-[#181C23] border-r border-[#23293a] shadow-lg">
            {/* Top Bar: Back to Course Details & Add Review */}
            <div className="flex items-center justify-between border-b border-[#23293a] p-4 sticky top-0 z-10 bg-[#181C23]">
                <div
                    onClick={() => navigate('/dashboard/enrolled-courses')}
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#23293a] p-1 text-[#F1F2F3] hover:scale-95 hover:bg-[#FFD60A] hover:text-[#000814] transition-all duration-200 cursor-pointer shadow"
                    title="Back to Enrolled Courses"
                >
                    <IoIosArrowBack size={22} />
                </div>
                <button
                    onClick={() => setReviewModal(true)}
                    className="rounded-lg bg-[#FFD60A] px-5 py-2 text-base font-bold text-[#181C23] shadow hover:bg-[#FFC800] transition-all border-2 border-[#FFD60A]"
                >
                    Add Review
                </button>
            </div>

            {/* Course Title & Progress */}
            <div className="px-5 py-4 border-b border-[#23293a] bg-[#181C23]">
                <p className="text-2xl font-bold text-[#FFD60A] mb-1 truncate">{courseEntireData?.courseName}</p>
                <div className="flex items-center gap-2 text-xs text-[#999DAA]">
                    <span className="font-semibold text-[#06D6A0]">{completedLectures.length}</span>
                    <span>/</span>
                    <span>{totalNoOfLectures} lectures completed</span>
                </div>
                <div className="w-full bg-[#23293a] rounded-full h-2 mt-2">
                    <div
                        className="bg-[#FFD60A] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(completedLectures.length / totalNoOfLectures) * 100 || 0}%` }}
                    ></div>
                </div>
            </div>

            {/* Sections & Subsections (Scrollable Area) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-3">
                {courseSectionData && courseSectionData.length > 0 ? (
                    courseSectionData.map((section, index) => (
                        <div key={section._id} className="mb-4">
                            {/* Section Header */}
                            <div
                                className={`flex items-center justify-between px-4 py-3 rounded-t-lg cursor-pointer bg-[#23293a] shadow-sm border-b-2 ${
                                    activeSections.includes(index)
                                        ? 'border-[#FFD60A] font-bold text-[#FFD60A]'
                                        : 'border-transparent text-[#dedfec]'
                                }`}
                                onClick={() => toggleSection(index)}
                            >
                                <div className="flex items-center gap-2">
                                    <IoIosArrowDown
                                        className={`transition-transform duration-300 ${
                                            activeSections.includes(index) ? 'rotate-0' : '-rotate-90'
                                        }`}
                                    />
                                    <span className="text-lg">{section.sectionName}</span>
                                </div>
                                <span className="text-xs text-[#05A77B] font-semibold">
                                    {section.subSection?.length || 0} lectures
                                </span>
                            </div>

                            {/* Subsections (Collapsible Content) */}
                            {activeSections.includes(index) && (
                                <div className="flex flex-col rounded-b-lg bg-[#20232B] shadow-inner">
                                    {section.subSection?.map((subSection) => (
                                        <div
                                            key={subSection._id}
                                            onClick={() =>
                                                navigate(
                                                    `/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${subSection._id}`
                                                )
                                            }
                                            className={`flex items-center gap-3 px-6 py-3 rounded-lg my-1 cursor-pointer transition-all duration-200 border-l-4 ${
                                                subSectionId === subSection._id
                                                    ? 'bg-[#FFD60A]/10 border-[#FFD60A] text-[#FFD60A] font-bold shadow-lg'
                                                    : 'bg-transparent border-transparent text-[#dedfec] hover:bg-[#23293a] hover:text-[#FFD60A]'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSubsectionCompleted(subSection._id)}
                                                onChange={() => handleVideoCompletion(subSection._id)}
                                                onClick={e => e.stopPropagation()}
                                                className="form-checkbox h-4 w-4 rounded border-[#FFD60A] text-[#FFD60A] focus:ring-[#FFD60A] bg-[#161D29] checked:bg-[#FFD60A] checked:border-transparent appearance-none shadow"
                                            />
                                            <RiVideoFill className="text-lg" />
                                            <span className="truncate">{subSection.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-lg font-semibold text-[#F1F2F3] mb-2">No Course Content</h3>
                        <p className="text-sm text-[#999DAA] mb-4">
                            This course doesn't have any content yet.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard/enrolled-courses')}
                            className="px-4 py-2 bg-[#FFD60A] text-black rounded-lg hover:bg-[#FFC800] transition-colors"
                        >
                            Back to Enrolled Courses
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoSideBar;