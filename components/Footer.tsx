import React from 'react'

export default function Footer() {
    return (
        <footer className="bg-[#007AFF] text-white py-12 px-8">
            <div className="flex flex-col md:flex-row justify-between items-center px-6 sm:px-8">
                <div>
                    <span className="text-xl font-bold">
                        TaskBothy
                    </span>
                </div>

                <div>
                    <span>©2025 TaskBothy. All rights reserved.</span>
                </div>
            </div>
        </footer>
    )
}
