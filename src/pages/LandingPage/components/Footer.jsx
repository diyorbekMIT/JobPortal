import React from 'react'
import {Briefcase} from "lucide-react"

const Footer = () => {
  return (
    <footer className='relative overflow-hidden text-gray-900 bg-gray-50'>
        <div className='relative z-10 container max-w-6xl mx-auto px-6 py-16'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
                <div className='text-center md:text-left mb-4 md:mb-0'>
                    <div className='flex items-center space-x-3 justify-center md:justify-start mb-2'>
                        <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                            <Briefcase className='w-5 h-5 text-white' /> 
                        </div>
                        <h3 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>JobPortal</h3>
                    </div>
                   
                        <p className='text-gray-600'>Connecting Talent with Opportunity</p>
                </div>

                <div className='flex space-x-6'>
                    <a href="#" className='text-gray-600 hover:text-gray-900 transition-colors duration-300'>Home</a>
                    <a href="#" className='text-gray-600 hover:text-gray-900 transition-colors duration-300'>About</a>
                    <a href="#" className='text-gray-600 hover:text-gray-900 transition-colors duration-300'>Contact</a>
                    <a href="#" className='text-gray-600 hover:text-gray-900 transition-colors duration-300'>Privacy Policy</a>
                </div>
            </div>

            <div className='mt-8 text-center text-sm text-gray-500'>
                &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
            </div>
        </div>
    </footer>
  )
}

export default Footer