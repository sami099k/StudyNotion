import React, { useState } from "react";

// You can replace these with your actual image imports
import signupImage from "../Images/signup.webp"; // The right-side photo
import framePattern from "../Images/frame.png"
import { apiConnector } from "../services/apiConnector";
import { signup } from "../services/apis";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSignupData } from "../slices/authSlice";
import { sendOTP } from "../services/authAPIs";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

function SignUp() {
  // State for form fields (optional, for demonstration)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phNo: "",
    password: "",
    confirmPassword: "",
    accountType: "Student",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading} = useSelector((state)=>state.auth);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle role switch
  const handleRole = (accountType) => {
    setForm({ ...form, accountType });
  };



  // Handle form submission (dummy)
  const handleSubmit = (e) => {
    e.preventDefault();
    if(form.password!==form.confirmPassword){
        toast.error('Passwords do not match');
      return;
    }
    dispatch(setSignupData(form))
    dispatch(sendOTP(form.email,navigate));
    
  };

  return (
      <div className="flex items-center justify-center h-[100vh] mt-20 md:mt-0">
      {
        loading ? (<div className="pb-25">
          <ClipLoader color='#e0e0e0'/>
        </div>) : (<div className="w-[100%] min-h-screen bg-[#00081] flex items-center justify-center ">
      <div className="flex flex-col md:flex-row  w-[80%] gap-20  lg:justify-between">
        {/* Left: Form */}
        <div className="w-full max-w-md">
          <h1 className="text-white text-3xl font-semibold">Welcome Back</h1>
          <p className="mt-2 text-[#AFB2BF] text-base">
            Discover your passions,
            <br />
            <span className="text-[#47A5C5] italic font-semibold">
              Be <span className="font-bold">Unstoppable</span>
            </span>
          </p>

          {/* Role Switch */}
          <div className="flex gap-2 mt-6 mb-6">
            <button
              type="button"
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                form.accountType === "Student"
                  ? "bg-[#2C333F] text-white"
                  : "bg-transparent text-[#AFB2BF] border border-[#2C333F]"
              }`}
              onClick={() => handleRole("Student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                form.accountType === "Instructor"
                  ? "bg-[#2C333F] text-white"
                  : "bg-transparent text-[#AFB2BF] border border-[#2C333F]"
              }`}
              onClick={() => handleRole("Instructor")}
            >
              Instructors
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name fields */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[#AFB2BF] text-sm mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full px-3 py-2 rounded bg-[#161D29] text-white border border-[#2C333F] focus:outline-none"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-[#AFB2BF] text-sm mb-1">
                  Last Name <span className="text-pink-200">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full px-3 py-2 rounded bg-[#161D29] text-white border border-[#2C333F] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#AFB2BF] text-sm mb-1">
                Email Address <span className="text-pink-200">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full px-3 py-2 rounded bg-[#161D29] text-white border border-[#2C333F] focus:outline-none"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[#AFB2BF] text-sm mb-1">
                Phone Number <span className="text-pink-200">*</span>
              </label>
              <div className="flex">
                <span className="flex items-center px-3 bg-[#161D29] text-[#AFB2BF] border border-[#2C333F] rounded-l">
                  +91
                </span>
                <input
                  type="tel"
                  name="phNo"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="12345 67890"
                  className="w-full px-3 py-2 rounded-r bg-[#161D29] text-white border-t border-b border-r border-[#2C333F] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Password fields */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[#AFB2BF] text-sm mb-1">
                  Create Password <span className="text-pink-200">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="w-full px-3 py-2 rounded bg-[#161D29] text-white border border-[#2C333F] focus:outline-none"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-[#AFB2BF] text-sm mb-1">
                  Confirm Password <span className="text-pink-200">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="w-full px-3 py-2 rounded bg-[#161D29] text-white border border-[#2C333F] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full mt-4 py-3 rounded bg-[#FFD60A] text-black font-semibold text-base transition hover:bg-[#ffe066]"
            >
              Create Account
            </button>
          </form>
        </div>

        <div className="relative w-full max-w-md flex items-center justify-center">
          <img
            src={signupImage}
            alt="Sign up visual"
            className="relative z-10 w-full h-auto rounded"
          />
        </div>
      </div>
    </div>)
      }
    </div>
  );
}

export default SignUp;
