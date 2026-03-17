import { useEffect, useState } from "react"
import {
    Briefcase,
    Building2,
    LogOut,
    Menu,
    X
} from "lucide-react"
import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from "../../context/AuthContext"
import { NAVIGATION_MENU } from "../../utils/data"
import ProfileDropdown from "./ProfileDropdown"

const NavigationItem = ({item, isActive , onNavigate, isCollapsed}) => {
    const Icon = item.icon;

    return <button 
        onClick={() => onNavigate(item.id)}
        className={`w-full flex items-center px-3 py-2.5 text-sm font-medium cursor-pointer rounded-lg transition-all duration-200 group 
            ${isActive ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-50" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
        `}
    >
        <Icon 
            className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-blue-500" : "text-gray-500"}`}
         />
        {!isCollapsed && <span className="ml-2">{item.name}</span>}
    </button>
}

const DashboardLayout = ({activeMenu, children}) =>{
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    //Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if(!mobile){
                setSidebarOpen(false)
            }}
        
        handleResize();
        window.addEventListener("resize", handleResize);
        
            return ( ) => {
                window.removeEventListener("resize", handleResize);
            }
    }, []);

   

    useEffect(() => {
        const handleClickOutside = () => {
            if(profileDropdownOpen){
                setProfileDropdownOpen(false)
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [profileDropdownOpen])

    const handleNavigation = (itemId) => {
        setActiveNavItem(itemId);
        navigate(`/${itemId}`);
        if(isMobile){
            setSidebarOpen(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    }

    const sidebarCollapsed = !isMobile && false;


  return (
    <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div
            className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform 
                ${isMobile ? sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    : "translate-x-0"
                }
                ${sidebarCollapsed ? "w-16" : "w-64"}
            bg-white border-r border-gray-200
            `}
        >
            {/* Company Logo */}
            <div className="flex items-center h-16 border-b border-gray-200 pl-6">
                {!sidebarCollapsed ?(
                    <Link className="flex items-center space-x-3" to="/">
                    <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-white"  />
                    </div>
                    <span className="text-xl text-gray-900 font-bold ml-2">JobPortal</span>
                    </Link>
                ) : (
                    <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 space-y-2 ">
                {NAVIGATION_MENU.map((item) => (
                    <NavigationItem 
                        key={item.id}
                        item={item}
                        isActive={activeNavItem === item.id}
                        onNavigate={handleNavigation}
                        isCollapsed={sidebarCollapsed}
                    />
                ))}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-4 left-4 right-4">
                <button
                    className="w-full flex items-center justify-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                    onClick={logout}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0 text-gray-500" />
                    {!sidebarCollapsed && <span className="ml-2">Logout</span>}
                </button>
            </div> 
        </div>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
            <div
                className="fixed inset-0 bg-opacity-25 z-40 backdrop-blur-sm "j
                onClick={() => setSidebarOpen(false)}
             />
        )}

        {/* Main Content Area */}

        <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
                isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
            }`}
        >

            {/* Top Bar */}
            <header
                className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center justify-between top-0 z-30 sticky px-4"
            >
                <div className="flex items-center space-x-4">
                    {isMobile && (
                        <button
                            className="p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            onClick={toggleSidebar}
                        >
                            {sidebarOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
                        </button>
                    )}
                    <div>
                        <h1 className="text-base font-semibold text-gray-900">Welcome Back</h1>
                        <p className="text-sm text-gray-500 hidden sm:block">
                            Here'a what's happening with your job postings and applications today.
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Profile Dropdown */}
                    <ProfileDropdown 
                        isOpen={profileDropdownOpen}
                        onToggle={(e) => {
                            e.stopPropagation();
                            setProfileDropdownOpen(!profileDropdownOpen)
                        }}
                        avatar={user?.avatar || ""}
                        companyName={user?.name || ""}
                        email={user?.email || ""}
                        onLogout={logout}
                    />
                </div>
            </header>

            {/* Main Content area */}
            <div className="flex-1 overflow-auto p-6">{children}</div>
        </div>
    </div>
  )
}

export default DashboardLayout