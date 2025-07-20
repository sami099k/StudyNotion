import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import Button1 from '../components/homepage/Button1'
import Button2 from '../components/homepage/Button2'
import Banner from '../Images/banner.mp4'
import CodeBlocks from '../components/homepage/CodeBlocks'
import TextBlock from '../components/homepage/TextBlock'
import sideImage from '../Images/TimeLineImage.png'
import TimeLine from '../components/homepage/TimeLine'
import LearningLanguage from '../components/homepage/LearningLanguage'
import BecomeInstructor from '../components/homepage/BecomeInstructor'
import Reviews from '../components/homepage/Reviews'
import PowerOfCode from '../components/homepage/PowerOfCode'
import Footer from '../components/common/Footer'
const Home = () => {
  return (
    <div>
          <div className='flex flex-col items-center justify-center flex-wrap m-5'>
      <div className='flex flex-col items-center justify-center w-8/9'>
        {/*section 1*/}
        <div className='flex flex-col gap-4  p-2 items-center justify-center w-9/13'>
          <Link to='/signup'>
            <div className="text-white flex  items-center  clr1 grey rounded-3xl w-max p-2 gap-2">
              <p className=''>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </Link>
          <div className='text-4xl font-medium pt-4 text-center'>
            Empower Your Future with <span className='cool-blue'>Coding Skills</span>
          </div>
          <div className='grey text-center font-inter font-500 pt-3'>
            With our online coding courses, you can learn at your own pace,
            from anywhere in the world, and get access to a wealth of resources,
            including hands-on projects, quizzes, and personalized feedback from instructors.
          </div>
          <div className='flex gap-5 p-2  pt-3'>
            <Button1>Learn More</Button1>
            <Button2>Book a Demo</Button2>
          </div>
        </div>

        <div className='my-9 video flex items-center justify-center '>
          <video muted loop autoPlay>
            <source src={Banner} />
          </video>
        </div>
        <div className='w-10/11 my-13 p-7 mx-5 flex flex-col gap-30 items-center justify-between md:flex-row md:justify-between'>
          <TextBlock
            h1={"Unlock your"} high={"coding potential"}
            h2={"with our online courses."}
            des={'Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.'}
            b1={"Try it Yourself"}
            b2={"Learn More"}
          /><CodeBlocks className='text-[#f9d644]' code={`<!DOCTYPE html>
    <html>
      <head>
      <title>Example</title>
      <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <h1>
          <a href="/">Header</a>
        </h1>
    </html>
      `
          } />
        </div>
        <div className='w-10/11 my-13 mb-100 p-7 mx-5 flex flex-col-reverse gap-30 items-center justify-between md:flex-row'>
          <CodeBlocks  className='text-[#daf4fe]' code={`import React from "react";
                            function App() {
                          const name = "World";
                            return (
                                <div>
                                  <h1>Hello, {name}!</h1>
                                  <p>This is a basic React app.</p>
                                </div>
                            );
                          }
                          export default App`
          } />
          <TextBlock
            h1={"Start"} high={"Coding in Seconds"}
            h2={"with our compiler."}
            des={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
            b1={"Continue Lesson"}
            b2={"Learn More"}
          />

        </div>
        <div className='flex items-center justify-center'>
          <PowerOfCode />
        </div>
      </div>
      {/* section 2 */}
      <div className='grey-5 w-[100%] trb900 flex flex-col items-center justify-center'>
        <div className='w-[100%] flex items-center justify-center gap-5 x p-10 pb-20 border-b-1 border-black'>
          <div className='flex items-center justify-center gap-7 mt-30'>
            <Button1>Explore Full Catalog <FaArrowRight /></Button1>
            <Button2>Learn More</Button2>
          </div>
        </div>
        <div className='flex gap-20 mt-20  w-[85%]'>
          <div className='font-semibold text-4xl w-[95%]'>Get the skills you
            need for a <span className='cool-blue'>job that are in demand.</span></div>
          <div className='flex flex-col gap-7'>
            <div>The modern StudyNotion is the dictates its own terms. Today,
              to be a competitive specialist requires more than professional skills.</div>
            <Button1>Learn More</Button1>
          </div>

        </div>
        <div className='w-[85%] flex my-20 items-center justify-center'>
          <div className='flex items-center justify-center gap-37 '>
            <TimeLine />
            <div className='relative'>
              <img className='ws' src={sideImage} alt=""></img>
              <div className='text-wrap break-words absolute bg-[#014A32] z-10 flex p-5 gap-5 w-[65%] items-center justify-center translate-y-[-50%] translate-x-[31%]'>
                <div className='text-3xl font-semibold text-white '>10</div>
                <div className='text-[#05A77B]' >YEARS OF EXPERIENCE</div>
                <div className='text-[#05A77B]'>|</div>
                <div className='text-3xl font-semibold text-white '>250</div>
                <div className=' text-[#05A77B]' >TYPES OF COURSES</div>
              </div>
            </div>
          </div>

        </div>
        <div className='w-[85%] flex flex-col justify-center items-center my-10'>
          <div className='mx-auto flex flex-col justify-center items-center w-[63%] gap-4' >
            <div className='font-semibold text-4xl text-center' >
              Your swiss knife for <span className='cool-blue'>learning any language</span>
            </div>
            <div className='text-center' >
              Using spin making learning multiple languages easy. with 20+ languages realistic
              voice-over, progress tracking, custom schedule and more.
            </div>
          </div>
          <div>
            <LearningLanguage />
          </div>
          <div className='shadow-2xs'>
            <Button1>Learn More</Button1>
          </div>

        </div>


      </div>


      <div className='richblack  w-[100%] flex flex-col items-center justify-center my-10 gap-30' >
        <BecomeInstructor />
        <Reviews />
      </div>

    


    </div>
    <div className='w-[100%] text-[#6E727F]'>
      <Footer/>
    </div>
    </div>
)
}
export default Home