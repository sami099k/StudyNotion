import React, { useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { useNavigate } from 'react-router-dom'
import { CiLogout } from 'react-icons/ci'
import { useDispatch, useSelector } from 'react-redux'
import { logouthandler } from '../../services/handlers'
import SideBarLink from '../core/sidebar/SideBarLink'
import ConfirmationModa from './ConfirmationModa'

const SideBar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);

    console.log('SideBar - user:', user);

    if (!user) {
        console.log('SideBar - no user, returning null');
        return null;
    }

    return (
        <>
            <div className='flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-[#2C333F]  py-10'>
                <div className='flex flex-col'>
                    {sidebarLinks.map((link) => {
                        if (link.type && user.accountType !== link.type) return null;
                        return <SideBarLink key={link.id} link={link} iconName={link.icon} />;
                    })}
                </div>
                <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-[#2C333F]' />
                <div className='flex flex-col'>
                    <button
                        onClick={() => setConfirmationModal({
                            text1: 'Are You Sure?',
                            text2: 'You will be logged out of your account.',
                            btn1Text: 'Log out',
                            btn2Text: 'Cancel',
                            btn1Handler: () => dispatch(logouthandler(navigate)),
                            btn2Handler: () => setConfirmationModal(null),
                        })}
                        className='px-8 py-2 text-sm font-medium text-[#838894]'
                    >
                        <div className='flex items-center gap-x-2'>
                            <CiLogout className='text-lg' />
                            <span>Log out</span>
                        </div>
                    </button>
                </div>
            </div>
            {confirmationModal && <ConfirmationModa modalData={confirmationModal} />}
        </>
    );
}

export default SideBar;