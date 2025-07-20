import React from 'react'
import ContactUsForm from '../ContactPage/ContactUsForm'

const ContactFormSection = () => {
  return (
    <div className='mx-auto flex flex-col items-center'>
      <h1 className='text-center text-4xl font-semibold'>
        Get in Touch
      </h1>
      <p className='text-center text-[#838894] mt-3'>
        We'd love to hear from you. Please fill out this form.
      </p>
      <div className='mt-12 mx-auto'>
        <ContactUsForm/>
      </div>
    </div>
  )
}

export default ContactFormSection