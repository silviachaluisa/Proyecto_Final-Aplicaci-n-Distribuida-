import React from 'react'
import { FaRegTimesCircle, FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const Notification = ({ type="success", content }) => {
    const colorClasses = {
        error: { bg: 'bg-red-500', border: 'border-red-700', iconBg: 'bg-red-900' },
        success: { bg: 'bg-blue-500', border: 'border-blue-700', iconBg: 'bg-blue-900' },
        warning: { bg: 'bg-orange-500', border: 'border-orange-700', iconBg: 'bg-orange-900' }
    };

    let { bg, border, iconBg } = colorClasses[type] || colorClasses.warning;

    return (
        <div className={ `fixed top-18 flex m-2 text-white rounded-lg shadow-lg ${bg} ${border}` }>
            <div className={ `h-full w-12 flex items-center justify-center rounded-l-lg p-6 ${iconBg}` }>
                <span className="text-3xl">
                    {
                        type === 'error' ? <FaRegTimesCircle /> :
                        type === 'success' ? <FaRegCheckCircle /> :
                        <AiOutlineExclamationCircle />
                    }
                </span>
            </div>
            <div className="flex items-center justify-center p-6 font-bold w-fit-content">
                <p>
                    { content }
                </p>
            </div>
        </div>
    )
}

export default Notification