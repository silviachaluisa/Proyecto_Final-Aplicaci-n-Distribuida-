import React from 'react'

const ChargeChatBanner = () => {
    return (
        <div className='flex items-center justify-between bg-gray-700 rounded-lg p-10 w-full h-10 animate-pulse'>
            <div class="w-14 h-14 bg-gray-600 rounded-full"></div>
            <div class="flex flex-col items-center justify-center">
                <div class="w-20 h-4 bg-gray-600 rounded-full"></div>
                <div class="w-16 h-4 bg-gray-600 rounded-full mt-2"></div>
            </div>
            <div class="flex flex-col items-center justify-center">
                <div class="w-4 h-4 bg-gray-600 rounded-full"></div>
                <div class="w-4 h-4 bg-gray-600 rounded-full mt-2"></div>
            </div>
        </div>
    )
}

export default ChargeChatBanner
