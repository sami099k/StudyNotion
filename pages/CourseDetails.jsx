import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CourseDetailsCont } from "../services/courseDetailsAPI";
import { FaStar } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import CourseDetailsCard from "../components/core/CourseDetailsCard";
import Footer from "../components/common/Footer";
import { addToCart } from "../slices/cartSlice";
import { buyCourse } from "../services/operations/studentFeautersAPI";

const CourseDetailsPage = () => {
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSections, setActiveSections] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            setLoading(true);
            try {
                // Pass token to CourseDetailsCont if your backend's getCourseDetails requires it
                const result = await CourseDetailsCont({ courseId }, token);
                console.log("Course Details API Result:", result);
                
                // CourseDetailsCont should return `course_details` directly from backend
                setCourseData(result);

                if (result?.courseContent) {
                    setActiveSections(result.courseContent.map((_, index) => index)); // Open all sections initially
                }

            } catch (error) {
                console.error("Error fetching course details:", error);
                setCourseData(null);
            }
            setLoading(false);
        };
        fetchCourseDetails();
    }, [courseId, token]);

    const handleBuyCourse = () => {
        if (courseData) {
            const coursesToBuy = [courseData];
            buyCourse(token, coursesToBuy, user, navigate, dispatch);
        } else {
            console.warn('Course data not available to buy.');
        }
    };

    const handleAddToCart = () => {
        if (courseData) {
            dispatch(addToCart(courseData));
        } else {
            console.warn('Course data not available to add to cart.');
        }
    };

    const toggleSection = (index) => {
        setActiveSections(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const collapseAllSections = () => {
        setActiveSections([]);
    };

    const calculateContentSummary = () => {
        let totalSections = 0;
        let totalLectures = 0;
        let totalLength = 0; // Assuming duration is in seconds

        if (courseData?.courseContent) {
            totalSections = courseData.courseContent.length;
            courseData.courseContent.forEach(section => {
                // *** FIXED HERE: Changed from 'subsections' to 'subSection' ***
                if (section.subSection) {
                    totalLectures += section.subSection.length;
                    section.subSection.forEach(sub => {
                        totalLength += parseFloat(sub.duration || 0);
                    });
                }
            });
        }
        return { totalSections, totalLectures, totalLength: totalLength.toFixed(0) };
    };

    const { totalSections, totalLectures, totalLength } = calculateContentSummary();

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center bg-[#000814]">
                <div className="spinner"></div> {/* Your loading spinner CSS */}
            </div>
        );
    }

    if (!courseData) {
        return (
            <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#000814] text-[#F1F2F3] text-2xl">
                Course not found or an error occurred.
            </div>
        );
    }

    // Ensure ratingsAndReviews is used (not ratingAndReviews)
    const averageRating = courseData.ratingsAndReviews?.length > 0
        ? (courseData.ratingsAndReviews.reduce((acc, r) => acc + r.rating, 0) / courseData.ratingsAndReviews.length).toFixed(1)
        : '0.0';

    const createdAtDate = courseData.createdAt ? new Date(courseData.createdAt) : null;
    const formattedCreatedAt = createdAtDate ? createdAtDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : 'N/A';
    const formattedCreatedAtTime = createdAtDate ? createdAtDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }) : 'N/A';

    return (
        <div className="min-h-screen bg-[#000814] text-[#F1F2F3]">
            {/* Hero Section */}
            <div className="relative w-full bg-[#161D29] py-8 lg:py-16">
                <div className="w-11/12 max-w-maxContent mx-auto px-4 lg:px-0 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="lg:w-2/3 lg:pr-12">
                        {/* Breadcrumbs */}
                        <p className="text-[#999DAA] text-sm mb-2">
                            Home / Catalog /{' '}
                            <span className="text-[#FFD60A]">
                                {courseData.category?.name || 'Category'}
                            </span>{' '}
                            /{' '}
                            <span className="text-[#FFD60A]">
                                {courseData.courseName}
                            </span>
                        </p>
                        {/* Course Title */}
                        <h1 className="text-3xl lg:text-5xl font-bold text-[#F1F2F3] mb-2">
                            {courseData.courseName}
                        </h1>
                        {/* Course Description */}
                        <p className="text-base lg:text-lg text-[#999DAA] mb-4">
                            {courseData.courseDescription}
                        </p>

                        {/* Ratings, Enrolled Students */}
                        <div className="flex flex-wrap items-center gap-x-3 text-sm mb-4">
                            <span className="text-[#FFD60A] font-bold">
                                {averageRating}
                            </span>
                            <div className="flex text-[#FFD60A]">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < Math.floor(parseFloat(averageRating)) ? 'text-[#FFD60A]' : 'text-[#424855]'} />
                                ))}
                            </div>
                            <span className="text-[#999DAA]">
                                ({courseData.ratingsAndReviews?.length || 0} reviews)
                            </span>
                            <span className="text-[#999DAA]">
                                {courseData.studentsEnrolled?.length || 0} students enrolled
                            </span>
                        </div>

                        {/* Created By, Date, Language */}
                        <p className="text-[#999DAA] text-base mb-2">
                            Created By{' '}
                            <span className="text-[#FFD60A]">
                                {courseData.instructor?.firstName} {courseData.instructor?.lastName}
                            </span>
                        </p>
                        <div className="flex flex-wrap gap-x-4 text-sm text-[#999DAA]">
                            {createdAtDate && (
                                <p className="flex items-center gap-2">
                                    <span className="text-base">📅</span> Created at {formattedCreatedAt} | {formattedCreatedAtTime}
                                </p>
                            )}
                            {courseData.language && (
                                <p className="flex items-center gap-2">
                                    <span className="text-base">🌐</span> {courseData.language}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Hero Image / Decorative Element on Right (Desktop Only) */}
                    <div className="hidden lg:block lg:w-1/3 lg:pl-12">
                        <img
                            src={courseData.thumbnail}
                            alt={courseData.courseName}
                            className="w-full rounded-lg object-cover shadow-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full">
                <div className="w-11/12 max-w-maxContent mx-auto flex flex-col lg:flex-row gap-x-12 py-10">
                    {/* Left Column - Main Course Details */}
                    <div className="lg:flex-1 flex flex-col gap-10">
                        {/* What You Will Learn */}
                        {courseData.whatYouWillLearn && (
                            <div className="border border-[#2C333F] rounded-md p-6 bg-[#161D29]">
                                <h2 className="text-2xl font-semibold text-[#F1F2F3] mb-4">
                                    What you will learn
                                </h2>
                                <div className="text-[#999DAA] text-base">
                                    {courseData.whatYouWillLearn}
                                </div>
                            </div>
                        )}

                        {/* Course Content / Sections - Collapsible */}
                        {courseData.courseContent && courseData.courseContent.length > 0 && (
                            <div className="border border-[#2C333F] rounded-md p-6 bg-[#161D29]">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold text-[#F1F2F3]">
                                        Course Content
                                    </h2>
                                    <button
                                        onClick={collapseAllSections}
                                        className="text-[#FFD60A] text-sm hover:underline"
                                    >
                                        Collapse all sections
                                    </button>
                                </div>

                                <div className="text-[#999DAA] text-sm mb-4">
                                    {totalSections} section(s) • {totalLectures} lecture(s) • {totalLength}s total length
                                </div>

                                {courseData.courseContent.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="mb-2 last:mb-0 border border-[#2C333F] rounded-md overflow-hidden">
                                        {/* Section Header */}
                                        <div
                                            className="flex justify-between items-center p-4 cursor-pointer bg-[#2C333F] hover:bg-[#424855] transition-colors duration-200"
                                            onClick={() => toggleSection(sectionIndex)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <IoIosArrowDown
                                                    className={`transition-transform duration-300 ${activeSections.includes(sectionIndex) ? 'rotate-0' : '-rotate-90'}`}
                                                />
                                                <p className="font-semibold text-lg text-[#F1F2F3]">
                                                    {section.sectionName}
                                                </p>
                                            </div>
                                            <p className="text-sm text-[#999DAA]">
                                                {section.subSection?.length || 0} lecture(s)
                                            </p>
                                        </div>

                                        {/* Subsections (Collapsible Content) */}
                                        {activeSections.includes(sectionIndex) && (
                                            <div className="p-4 bg-[#161D29] border-t border-[#2C333F]">
                                                <ul className="list-disc list-inside text-sm">
                                                    {section.subSection?.map((sub, subIndex) => (
                                                        <li key={subIndex} className="mb-2 last:mb-0 flex items-center gap-2">
                                                            <span className="text-[#FFD60A]">▶</span>
                                                            {sub.title} ({sub.duration}s)
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Author Section */}
                        {courseData.instructor && (
                            <div className="border border-[#2C333F] rounded-md p-6 bg-[#161D29]">
                                <h2 className="text-2xl font-semibold text-[#F1F2F3] mb-4">
                                    Author
                                </h2>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={courseData.instructor.image || `https://api.dicebear.com/5.x/initials/svg?seed=${courseData.instructor.firstName} ${courseData.instructor.lastName}`}
                                        alt="Instructor"
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-lg font-semibold text-[#F1F2F3]">
                                            {courseData.instructor.firstName} {courseData.instructor.lastName}
                                        </p>
                                        <p className="text-sm text-[#999DAA]">
                                            {courseData.instructor.additionalDetails?.about || 'No description available.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reviews Section */}
                        {courseData.ratingsAndReviews && courseData.ratingsAndReviews.length > 0 && (
                            <div className="border border-[#2C333F] rounded-md p-6 bg-[#161D29]">
                                <h2 className="text-2xl font-semibold text-[#F1F2F3] mb-4">
                                    Reviews
                                </h2>
                                <div className="text-[#999DAA]">
                                    <p>Customer reviews will be displayed here.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Course Details Card (Fixed on Desktop, Static on Mobile) */}
                    <div className="lg:w-[380px] lg:sticky lg:top-[60px] h-fit">
                        <CourseDetailsCard
                            course={courseData}
                            handleBuyCourse={handleBuyCourse}
                            handleAddToCart={handleAddToCart}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CourseDetailsPage;