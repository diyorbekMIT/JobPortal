import { motion } from "framer-motion";

// Centralized color constants
const COLORS = {
  blue: "blue",
  purple: "purple",
  green: "green",
  orange: "orange",
};
import { TrendingUp, Users, Briefcase, Target } from "lucide-react";


const Analytics = () => {
  const stats = [
    {
      icon: Users,
      title: "Active Users",
      value: "2.4M+",
      growth: "+15",
      color: COLORS.blue
    },

    {
      icon: Briefcase,
      title: "Jobs Posted",
      value: "150k+",
      growth: "+20",
      color: COLORS.purple
    },

    {
      icon: Target,
      title: "Successful Hires",
      value: "50k+",
      growth: "+25",
      color: COLORS.green
    },

    {
      icon: TrendingUp,
      title: "Growth Rate", 
      value: "30%",
      growth: "+10%",
      color: COLORS.orange
    }
    
  ]
  return (
    <section className="bg-white py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 ">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{once: true}}
          className="text-center mb-16"
        >
           <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Platform
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Analytics</span>
           </h2>
           <p className="text-xl max-w-4xl mx-auto text-gray-600 leading-relaxed">
            Real-time insights into our platform's performance, user engagement, and growth metrics, helping us make data-driven decisions to enhance your job search and hiring experience.
           </p>
        </motion.div>


        {/* Stats Cards*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05,  ease: "easeOut" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.2, duration: 0.8 , scale: {
                duration: 0.5,
                ease: "easeOut"
              }}}
              viewport={{once: true}}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 "
            >
              <div className=" flex items-start space-x-4 mb-4 justify-between">
                <div className={`bg-${stat.color}-100 w-12 h-12 flex items-center justify-center rounded-xl mb-2`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="bg-green-100 text-sm text-semibold">{stat.growth} growth</span>
              </div>
                <h3 className="font-bold text-2xl md:3xl text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Analytics