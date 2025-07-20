import React from 'react'
import BannerImage1 from "../Images/aboutus1.webp"
import BannerImage2 from "../Images/aboutus2.webp"
import BannerImage3 from "../Images/aboutus3.webp"
import Quote from '../components/core/AboutPage/Quote'
import FoundingStory from "../Images/FoundingStory.png"
import StatsComponent from '../components/core/AboutPage/Stats'
import LearningGrid from '../components/core/AboutPage/LearningGrid'
import ContactFormSection from '../components/core/AboutPage/ContactFormSection'
import Footer from '../components/common/Footer'
import HighlightText from '../components/homepage/HighlightText'

const About = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
    <div className='text-white w-11/12'>
      {/* Section 1 - Hero Section */}
      <section className='bg-[#2C333F]'>
        <div className='relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white'>
            <header className='mx-auto py-20 text-4xl font-semibold lg:w-[70%]'>
                Driving Innovation in Online Education for a 
                <HighlightText text={"Brighter Future"} />
                <p className='mx-auto mt-3 text-center text-base font-medium text-[#838894] lg:w-[95%]'>
                    Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
                </p>
            </header>
            <div className='sm:h-[70px] lg:h-[150px]'></div>
            <div className='absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5'>
                <img src={BannerImage1} alt="About us banner 1" />
                <img src={BannerImage2} alt="About us banner 2" />
                <img src={BannerImage3} alt="About us banner 3" />
            </div>
        </div>
      </section>

      {/* Section 2 - Quote */}
      <section className='border-b border-[#2C333F]'>
        <div className='mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-[#F1F2FF]00'>
           <div className='h-[100px]'></div>
           <Quote/>
        </div>
      </section>


      {/* Section 3 - Founding Story and Vision/Mission */}
      <section>
        <div className='mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-[#F1F2FF]00'>
            {/* Founding Story */}
            <div className='flex flex-col items-center justify-between gap-10 lg:flex-row'>
                {/* Left Box */}
                <div className='my-24 flex flex-col gap-10 lg:w-[50%]'>
                    <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">
                        Our Founding Story
                    </h1>
                    <p className='text-base font-medium text-[#838894] lg:w-[95%]'>
                        Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
                    </p>
                    <p className='text-base font-medium text-[#838894] lg:w-[95%]'>
                        As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
                    </p>
                </div>
                {/* Right Box - Image */}
                <div className='shadow-[0_0_20px_0] shadow-[#FC6767]'>
                    <img src={FoundingStory} alt="Founding Story" className='shadow-[20px_20px_0px_0px] shadow-white' />
                </div>
            </div>

            {/* Vision and Mission */}
            <div className='flex flex-col items-center justify-between lg:flex-row lg:gap-10'>
                {/* Left Box - Vision */}
                <div className='my-24 flex flex-col gap-10 lg:w-[40%]'>
                    <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">
                        Our Vision
                    </h1>
                    <p className='text-base font-medium text-[#838894] lg:w-[95%]'>
                        With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.
                    </p>
                </div>
                {/* Right Box - Mission */}
                <div className='my-24 flex flex-col gap-10 lg:w-[40%]'>
                    <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                        Our Mission
                    </h1>
                    <p className='text-base font-medium text-[#838894] lg:w-[95%]'>
                        Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                    </p>
                </div>
            </div>
        </div>
      </section>  

      {/* Section 4 - Stats */}
      <StatsComponent/>  
      
      {/* Section 5 - Learning Grid and Contact Form */}
      <section className='mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-10 text-white'>
        <LearningGrid />
        <ContactFormSection />
      </section>

      <section className='relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-[#000814] text-white'>
          <h2 className='text-center text-4xl font-semibold mt-8'>Reviews from other learners</h2>
          {/* <ReviewSlider /> */}
      </section>
    </div>
      <div className='w-[100%]'><Footer/></div>
    </div>
  )
}

export default About;