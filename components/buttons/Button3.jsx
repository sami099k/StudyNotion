import React from 'react'
import { Link } from 'react-router-dom'

const Button3 = ({children , to }) => {
  return (
    <div>
        <Link to={to}><button className='text-[#b0b2bf] bg-[#151d29] py-2 px-3 rounded-lg border-[#2c333f] border-1'>{children}</button></Link>
    </div>
  )
}

export default Button3