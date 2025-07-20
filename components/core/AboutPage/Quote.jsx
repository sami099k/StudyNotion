import React from 'react'
import HighlightText from '../../homepage/HighlightText'

const Quote = () => {
  return (
    <div className=" text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white ">
        "We are passionate about revolutionizing the way we learn. Our
        innovative platform <HighlightText text={"combines technology"}/>, 
        <span className='font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FF512F] to-[#F09819]'>
            {" "}
            expertise
        </span>
        , and community to create an
        <span className='font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#E65C00] to-[#F9D423]'>
            {" "}
            unparalleled educational experience.
        </span>"
    </div>
  )
}

export default Quote