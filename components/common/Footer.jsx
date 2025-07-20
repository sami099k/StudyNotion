import React from "react";
import { FooterLink2 } from "../../../data/footer-links";
import { Link } from "react-router-dom";

// Images
import Logo from "../../Images/Logo/Logo-Full-Light.png";

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  return (
    <div className="w-[100%] text-[#6E727F]" style={{ backgroundColor: "#151d29" }}>
      <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent leading-6 mx-auto relative py-14" style={{ color: "#6E727F" }}>
        <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5" style={{ borderColor: "#2C333F" }}>
          {/* Section 1 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r pl-3 lg:pr-5 gap-3" style={{ borderRightColor: "#2C333F" }}>
            <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
              <img src={Logo} alt="" className="object-contain" />
              <h1 style={{ color: "#C5C7D4" }} className="font-semibold text-[16px]">
                Company
              </h1>
              <div className="flex flex-col gap-2 rb400">
                {["About", "Careers", "Affiliates"].map((ele, i) => {
                  return (
                    <div
                      key={i}
                      className="text-[14px] text-[#6E727F] cursor-pointer transition-all duration-200"
                      style={{ color: "#6E727F" }}
                      onMouseOver={e => e.currentTarget.style.color = "#C5C7D4"}
                      onMouseOut={e => e.currentTarget.style.color = "#6E727F"}
                    >   
                    <Link to={ele.toLowerCase()} ><span  className="rb400 font-medium">{ele}</span></Link>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 text-lg">
                <FaFacebook />
                <FaGoogle />
                <FaTwitter />
                <FaYoutube />
              </div>
              <div></div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 style={{ color: "#C5C7D4" }} className="font-semibold text-[16px]">
                Resources
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Resources.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer transition-all duration-200"
                      style={{ color: "#6E727F" }}
                      onMouseOver={e => e.currentTarget.style.color = "#C5C7D4"}
                      onMouseOut={e => e.currentTarget.style.color = "#6E727F"}
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        <span className="rb400 font-medium">{ele}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>

              <h1 style={{ color: "#C5C7D4" }} className="font-semibold text-[16px] mt-7">
                Support
              </h1>
              <div
                className="text-[14px] cursor-pointer transition-all duration-200 mt-2"
                style={{ color: "#6E727F" }}
                onMouseOver={e => e.currentTarget.style.color = "#F1F2FF"}
                onMouseOut={e => e.currentTarget.style.color = "#6E727F"}
              >
                <Link to={"/help-center"}><span className="rb400 font-medium">Help Center</span></Link>
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 style={{ color: "#C5C7D4" }} className="font-semibold text-[16px]">
                Plans
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Plans.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer transition-all duration-200"
                      style={{ color: "#F1F2FF" }}
                      onMouseOver={e => e.currentTarget.style.color = "#F1F2FF"}
                      onMouseOut={e => e.currentTarget.style.color = "#F1F2FF"}
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        <span className="rb400 font-medium" >{ele}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
              <h1 style={{ color: "#C5C7D4" }} className="font-semibold text-[16px] mt-7">
                Community
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Community.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer transition-all duration-200"
                      style={{ color: "#F1F2FF" }}
                      onMouseOver={e => e.currentTarget.style.color = "#F1F2FF"}
                      onMouseOut={e => e.currentTarget.style.color = "#F1F2FF"}
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        <span className="rb400 font-medium">{ele}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
            {FooterLink2.map((ele, i) => {
              return (
                <div key={i} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                  <h1 style={{ color: "#F1F2FF" }} className="font-semibold text-[16px]">
                    {ele.title}
                  </h1>
                  <div className="flex flex-col gap-2 mt-2">
                    {ele.links.map((link, index) => {
                      return (
                        <div
                          key={index}
                          className="text-[14px] cursor-pointer transition-all duration-200"
                          style={{ color: "#F1F2FF" }}
                          onMouseOver={e => e.currentTarget.style.color = "#F1F2FF"}
                          onMouseOut={e => e.currentTarget.style.color = "#F1F2FF"}
                        >
                          <Link to={link.link}><span className="rb400 font-medium">{link.title}</span></Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
