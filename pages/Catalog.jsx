import React, { useEffect, useState } from 'react';
import Footer from '../components/common/Footer';
import { useParams } from 'react-router-dom';
import { categories } from '../services/apis';
import { apiConnector } from '../services/apiConnector';
import { getCatalogPageData } from '../services/operations/pageAndOperations';
import CourseSlider from '../components/CourseSlider'; // Assume this component handles its own internal layout
import CourseCard from '../components/core/catalog/CourseCard'; // Assume this component handles its own internal layout

const Catalog = () => {
    const { catalogName } = useParams();
    const [pageData, setPageData] = useState(null);
    const [categoryId, setCategoryId] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const getCategory = async () => {
            setLoading(true); // Start loading
            try {
                // Fetch all categories to find the ID matching the catalogName
                const response = await apiConnector('GET', categories.CATEGORIES_API);
                const foundCategory = response?.data?.data?.filter(
                    (ct) => ct.name.toLowerCase() === catalogName.toLowerCase() // Ensure case-insensitive match
                )[0];

                if (foundCategory) {
                    setCategoryId(foundCategory._id);
                } else {
                    // Handle case where category is not found (e.g., redirect to 404 or show error)
                    console.log('Category not found for:', catalogName);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
            // setLoading(false); // Do not set loading to false here, wait for page data
        };
        getCategory();
    }, [catalogName]);

    useEffect(() => {
        const getCategoryDetails = async () => {
            if (categoryId) { // Only fetch details if categoryId is available
                setLoading(true); // Start loading for details
                try {
                    const res = await getCatalogPageData(categoryId);
                    setPageData(res);
                } catch (err) {
                    console.error('Error fetching catalog page data:', err);
                    setPageData(null); // Clear data on error
                }
                setLoading(false); // End loading regardless of success or failure
            }
        };

        getCategoryDetails();
    }, [categoryId]);

    // This useEffect is for debugging, remove in production
    // useEffect(() => console.log('Page Data:', pageData), [pageData]);


    if (loading) {
        return (
            <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center bg-[#000814]">
                <div className="spinner"></div> {/* You'd typically have a spinner CSS class */}
            </div>
        );
    }

    // Handle case where pageData might be null if category not found or error occurred
    if (!pageData) {
        return (
            <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center text-[#F1F2F3] text-2xl bg-[#000814] p-8">
                <p>Oops! Category details could not be loaded.</p>
                <p className="text-lg text-[#999DAA]">Please try again later or check the category name.</p>
            </div>
        );
    }


    return (
        <div className='min-h-screen bg-[#000814] text-[#F1F2F3]'> {/* Overall dark background and light text */}
            {/* Hero Section */}
            <div className='bg-[#161D29] py-8 lg:py-16'> {/* Darker background for the hero section */}
                <div className='w-11/12 max-w-maxContent mx-auto flex flex-col gap-3 px-4 py-8 lg:px-0 lg:py-0'>
                    <p className='text-sm text-[#999DAA]'>
                        Home / Catalog / <span className='text-[#FFD60A]'>{pageData?.selectedCategory?.name}</span>
                    </p>
                    <p className='text-3xl lg:text-5xl font-semibold text-[#F1F2F3]'>
                        {pageData?.selectedCategory?.name}
                    </p>
                    <p className='text-base lg:text-lg text-[#999DAA]'>
                        {pageData?.selectedCategory?.description}
                    </p>
                </div>
            </div>

            {/* Section 1: Courses to get you started */}
            <div className='w-11/12 max-w-maxContent mx-auto py-12'>
                <div className='text-3xl font-semibold text-[#F1F2F3] mb-6'>
                    Courses to get you started
                </div>
                <div className='flex gap-x-3 mb-8'>
                    {/* Add styling for selected/unselected states if needed for these tabs */}
                    <p className='text-lg cursor-pointer text-[#FFD60A] border-b border-[#FFD60A]'>Most Popular</p> {/* Active tab */}
                    <p className='text-lg cursor-pointer text-[#999DAA] hover:text-[#F1F2F3] transition-colors duration-200'>New</p>
                </div>
                <div className='py-8'>
                    <CourseSlider courses={pageData?.selectedCategory?.courses} />
                </div>
            </div>

            {/* Section 2: Top Courses in Category */}
            <div className='w-11/12 max-w-maxContent mx-auto py-12 border-t border-[#2C333F]'> {/* Separator line */}
                <div className='text-3xl font-semibold text-[#F1F2F3] mb-6'>
                    Top Courses in {pageData?.selectedCategory?.name}
                </div>
                <div className='py-8'>
                    <CourseSlider courses={pageData?.selectedCategory?.courses} /> {/* Assuming this also shows courses specific to the category */}
                </div>
            </div>

            {/* Section 3: Frequently Bought */}
            <div className='w-11/12 max-w-maxContent mx-auto py-12 border-t border-[#2C333F]'> {/* Separator line */}
                <div className='text-3xl font-semibold text-[#F1F2F3] mb-6'>
                    Frequently Bought
                </div>
                <div className='p-2'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch'> {/* Responsive grid for course cards */}
                        {pageData?.differentCategories?.at(0)?.courses?.map((key, index) => (
                            <div key={index} className="flex"> {/* flex to ensure cards stretch to same height */}
                                <CourseCard course={key} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='w-full'>
                <Footer />
            </div>
        </div>
    );
};

export default Catalog;