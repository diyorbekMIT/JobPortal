import {motion} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {Search, ArrowRight, Users, Building2, TrendingUp} from "lucide-react";

const Hero = () => {
    const navigate = useNavigate();
    const isAuthenticated = true;
    const user = {fullName: "Alex", role: "employer"};

    const stats = [
        {icon: Users, label: 'Active users', value: '2.4M+'},
        {icon: Building2, label: 'Companies', value: '10K+'},
        {icon: TrendingUp, label: 'Jobs Posted', value: '50K+'},
    ];

    return (
        <section className='pt-24 pb-16 bg-white min-h-screen flex items-center relative overflow-hidden'>
            {/* ✨ Background Glow Decorations - FULL VIEWPORT */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none z-0'>
                {/* Top-left blue glow */}
                <div className='absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-30'></div>
                
                {/* Bottom-right purple glow */}
                <div className='absolute bottom-20 right-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-30'></div>
                
                {/* Center huge gradient glow */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full blur-3xl opacity-20'></div>
            </div>

            {/* Actual Content - ON TOP */}
            <div className='container mx-auto px-4 relative z-10'>
                <div className='max-w-2xl mx-auto text-center'>
                    {/* Main Heading */}
                    <motion.h1 
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, ease: "easeOut"}}
                        className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight'
                    >
                        Find Your Dream Job or 
                        <span className='block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                            Perfect Hire
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p 
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, ease: "easeOut", delay: 0.2}}
                        className='text-xl md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed'
                    >
                        JobPortal connects talented professionals with top employers, 
                        making job searching and hiring effortless and efficient.
                    </motion.p>

                    {/* CTA BUTTONS */}
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.4, duration: 0.8}}
                        className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'
                    >   
                        <motion.button
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                            className='group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2'
                            onClick={() => {navigate("/find-jobs")}}
                        >
                            <Search className='w-5 h-5'/>
                            <span>Find Jobs</span>
                            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform'/>
                        </motion.button>

                        <motion.button
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                            className='bg-white border-2 border-gray-300 text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg'
                            onClick={() => {navigate(isAuthenticated && user?.role === "employer"
                                ? "/employer-dashboard" 
                                : "/login"
                            )}}
                        >
                            Post a Job
                        </motion.button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.6, duration: 0.8}}
                        className='grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto'
                    >
                        {stats.map((stat, index) =>(
                            <motion.div
                                key={index}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.8 + index * 0.2, duration: 0.8}}
                                className='flex flex-col items-center text-center space-y-2 p-4 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg'
                            >
                                <div className='w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-2'>
                                    <stat.icon className='w-6 h-6 text-blue-600'/>
                                </div>
                                <div className='text-2xl font-bold text-gray-900'>{stat.value}</div>
                                <div className='text-sm text-gray-600 font-medium'>{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                {/* 1. Top-left blue glow */}
                <div className='absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-30'></div>
  
                {/* 2. Bottom-right purple glow */}
                <div className='absolute bottom-20 right-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-30'></div>
  
                {/* 3. Center huge gradient glow */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full blur-3xl opacity-20'></div>
            </div>

        </section>
    )
}

export default Hero
