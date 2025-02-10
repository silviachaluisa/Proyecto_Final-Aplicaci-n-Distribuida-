import React from 'react'

const ChargeChatBanner = () => {
    return (
        <div className='flex items-center justify-between bg-gray-700 rounded-lg p-10 w-full h-10 animate-pulse'>
            <div className="w-14 h-14 bg-gray-600 rounded-full"></div>
            <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-4 bg-gray-600 rounded-full"></div>
                <div className="w-16 h-4 bg-gray-600 rounded-full mt-2"></div>
            </div>
            <div className="flex flex-col items-center justify-center">
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-600 rounded-full mt-2"></div>
            </div>
        </div>
    )
}

export default ChargeChatBanner
