import { employerFeatures, jobSeekerFeatures } from "../../../utils/data"

const Features = () => {
  return (
   <section className="py-20 bg-white relative overflow-hidden">
    <div className="container mx-auto px-4 realtive z-10">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl  font-bold mb-6 text-gray-900">
                Everything You Need to 
                <span className="block mt-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ">
                    Succeed 
                </span>
            </h2>
            <p className="text-xl pt-6 text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Whether you're a job seeker or an employer, our platform offers a comprehensive suite of features designed to help you achieve your goals. From powerful job search tools and personalized recommendations for job seekers, to advanced applicant tracking and recruitment analytics for employers, we provide everything you need to succeed in today's competitive job market.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            
            {/*JOB SEEKERES SECTION */}
            <div>
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">For Job Seekers</h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
                </div>
                

                <div className="space-y-8">
                {jobSeekerFeatures.map((feature, index) => (
                    <div className="flex items-start p-6 group rounded-2xl hover:bg-blue-50 transition-all durarion-300 space-x-6 cursor-pointer" key={index}>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-300 to-purple-300 rounded-xl flex items-center justify-center text-blue p-4 group-hover:from-blue-400 group-hover:to-purple-400 transition-colors duration-300">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                            <p className="leading-relaxed text-gray-600">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            </div>

            
            {/* EMPLOYERS SECTION */}
            <div>
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        For Employers
                    </h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"/>
                </div>

                <div className="space-y-8">
                    {employerFeatures.map((feature, index) => (
                        <div className="flex items-start space-x-6 p-6 group rounded-2xl hover:bg-blue-50 cursor-poiter transition-all duration-300 cursor-pointer" 
                        key={index}>
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-300 to-purple-300 rounded-xl flex items-center justify-center text-blue p-4 group-hover:from-blue-400 group-hover:to-purple-400 transition-colors duration-300">
                                <feature.icon className="w-6 h6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                                <p className="leading-relaxed text-gray-600">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
   </section>
  )
}

export default Features