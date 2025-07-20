import React from 'react'

const IcoBtn = ({
    text,
    children,
    onClick=()=>{},
    disabled,
    customClasses,
    type
}) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`flex items-center gap-x-2 rounded-md py-2 px-5 font-semibold text-[#000814] bg-[#FFD60A] ${customClasses}`}
            type={type}
        >
            {text && <span>{text}</span>}
            {children}
        </button>
    )
}

export default IcoBtn