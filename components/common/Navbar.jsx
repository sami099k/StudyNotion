import React, { useEffect, useState } from 'react';
import logo from '../../Images/Logo/Logo-full-Light.png';
import { Link, matchPath } from 'react-router-dom';
import { NavbarLinks } from '../../../data/navbar-links';
import Button3 from '../buttons/Button3'; // Assuming this is a styled button component
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import ProfileDropDown from '../profile/ProfileDropDown';
import NotificationSystem from './NotificationSystem';
import { apiConnector } from '../../services/apiConnector';
import { categories } from '../../services/apis';
import { IoIosArrowDown } from 'react-icons/io';

const Navbar = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const location = useLocation();

    const [cat, setCat] = useState([]);
    const fetchCat = async () => {
        try {
            console.log(categories.CATEGORIES_API);
            const result = await apiConnector('GET', categories.CATEGORIES_API);
            console.log(result.data.data);
            setCat(result.data.data);
        } catch (err) {
            console.log(err);
            console.log('cant fetch categories');
        }
    };

    useEffect(() => {
        fetchCat();
    }, []);

    const matchRoute = (route) => {
        return matchPath(route, location.pathname);
    };

    return (
        <div className='w-full flex items-center justify-center border-b border-[#2c333f] h-14'> {/* Added height and full width */}
            <div className='w-11/12 max-w-maxContent flex justify-between items-center px-4 py-2'> {/* Adjusted width and padding */}
                <div>
                    <Link to='/'>
                        <img src={logo} alt="Logo" className='h-8' /> {/* Adjusted logo height */}
                    </Link>
                </div>
                <nav> {/* Use nav for semantic correctness */}
                    <ul className='flex gap-x-6 text-[#dbddea]'> {/* Use ul for list items, set base text color */}
                        {NavbarLinks.map((key, index) => (
                            <li key={index}>
                                {key.title === 'Catalog' ? (
                                    <div className='relative flex items-center gap-1 cursor-pointer group'> {/* Added relative for dropdown positioning */}
                                        <p>{key.title}</p>
                                        <IoIosArrowDown className='text-sm transition-all duration-200 group-hover:rotate-180' /> {/* Rotate arrow on hover */}

                                        {/* Catalog Dropdown Menu */}
                                        <div className='
                                            absolute left-1/2 -translate-x-1/2 top-[calc(100%+15px)]
                                            invisible opacity-0 transition-all duration-200
                                            group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                                            w-[200px] bg-[#161D29] rounded-lg p-4 z-[1000] border border-[#2C333F]
                                        '>
                                            <div className="absolute left-1/2 -translate-x-1/2 -top-2 h-4 w-4 rotate-45 bg-[#161D29]"></div> {/* Arrow pointer */}
                                            {cat.length > 0 ? (
                                                cat.map((value, idx) => (
                                                    <Link to={`/catalog/${value.name.toLowerCase()}`} key={idx}>
                                                        <div className='
                                                            text-[#F1F2F3] text-base p-2 rounded-lg transition-all duration-200
                                                            hover:bg-[#2C333F] hover:text-[#F1F2F3]
                                                        '>
                                                            {value.name}
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="text-center text-[#999DAA]">No categories found</div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={key.path}>
                                        <span className={`${matchRoute(key.path) ? 'text-[#FFD60A]' : 'text-[#dbddea]'} transition-all duration-200`}> {/* Adjusted active color to yellow */}
                                            {key.title}
                                        </span>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className='flex items-center gap-x-4'>
                    {token !== null && <NotificationSystem />}
                    {user && user?.accountType !== 'Instructor' && (
                        <Link to='/dashboard/cart' className='relative'>
                            <AiOutlineShoppingCart className='text-2xl text-[#dbddea]' />
                            {totalItems > 0 && (
                                <span className='absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-[#FF0000] text-xs font-bold text-white'>
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    {token === null && (
                        <Button3 to='/login'>Log in</Button3>
                    )}
                    {token === null && (
                        <Button3 to='/signup'>Sign up</Button3>
                    )}
                    {token !== null && (
                        <ProfileDropDown />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;