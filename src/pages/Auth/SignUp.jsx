import React, { useState, useEffect, useRef } from 'react'
import { motion } from "framer-motion"
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle,
  Upload,
  Briefcase
} from "lucide-react"
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from "../../utils/apiPath";
import { useAuth } from '../../context/AuthContext'
import uploadImage from '../../utils/uploadImage';

const Signup = () => {
  const { login, user } = useAuth(); // ✅ Get user from context
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobseeker",
    profileImage: null
  })

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    showConfirmPassword: false,
    success: false,
    imagePreview: null
  })

  const fileInputRef = useRef(null)

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, [name]: '' }
      }))
    }
  }

  // Auto-redirect after success
  useEffect(() => {
    if (formState.success && user) {
      const timer = setTimeout(() => {
        window.location.href = user.role === "employer" 
          ? "/employer-dashboard" 
          : "/find-jobs"
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [formState.success, user])

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormState(prev => ({
          ...prev,
          errors: { ...prev.errors, profileImage: "Please select a valid image file" }
        }))
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormState(prev => ({
          ...prev,
          errors: { ...prev.errors, profileImage: "Image size must be less than 5MB" }
        }))
        return
      }

      setFormData(prev => ({ ...prev, profileImage: file }))

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormState(prev => ({ ...prev, imagePreview: reader.result }))
      }
      reader.readAsDataURL(file)

      if (formState.errors.profileImage) {
        setFormState(prev => ({
          ...prev,
          errors: { ...prev.errors, profileImage: '' }
        }))
      }
    }
  }

  // Validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (password) => password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)

  const validateForm = () => {
    const errors = {}

    if (!formData.fullName.trim()) errors.fullName = "Full name is required"
    if (!validateEmail(formData.email)) errors.email = "Please enter a valid email"
    if (!validatePassword(formData.password)) errors.password = "Password: 8+ chars, uppercase & number"
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormState(prev => ({ ...prev, errors }))
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setFormState(prev => ({ ...prev, loading: true }))

    try {
      let avatarUrl = "";

      if(formData.profileImage) {
        const imgUploadRes = await uploadImage(formData.profileImage);
        avatarUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        avatar: avatarUrl || ''
      })

      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        errors: {}
      }));

      // ✅ Extract user and token separately
      const { token, ...userData } = response.data;

      if(token){
        login(userData, token); // ✅ Pass user object without token property
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        loading: false,
        errors: {
          ...prev.errors,
          submit: error?.response?.data?.message || "Signup failed. Please try again."
        }
      }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center min-h-screen bg-gray-100"
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formState.errors.fullName ? 'border-red-500' : ''}`}
              />
              {formState.errors.fullName && (
                <p className="text-red-500 text-xs italic mt-2">{formState.errors.fullName}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formState.errors.email ? 'border-red-500' : ''}`}
              />
              {formState.errors.email && (
                <p className="text-red-500 text-xs italic mt-2">{formState.errors.email}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                type={formState.showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formState.errors.password ? 'border-red-500' : ''}`}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
              >
                {formState.showPassword ? <EyeOff /> : <Eye />}
              </div>
              {formState.errors.password && (
                <p className="text-red-500 text-xs italic mt-2">{formState.errors.password}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={formState.showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formState.errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                onClick={() => setFormState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
              >
                {formState.showConfirmPassword ? <EyeOff /> : <Eye />}
              </div>
              {formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs italic mt-2">{formState.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formState.errors.role ? 'border-red-500' : ''}`}
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
              {formState.errors.role && (
                <p className="text-red-500 text-xs italic mt-2">{formState.errors.role}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profileImage">
              Profile Image
            </label>
            <div className="relative">
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  <Upload className="inline-block mr-2" />
                  Upload Image
                </button>
                {formState.imagePreview && (
                  <img
                    src={formState.imagePreview}
                    alt="Profile Preview"
                    className="ml-4 w-16 h-16 rounded-full object-cover"
                  />
                )}
              </div>
              {formState.errors.profileImage && (
                <p className="text-red-500 text-xs italic mt-2">{formState.errors.profileImage}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={formState.loading}
            >
              {formState.loading ? (
                <Loader className="animate-spin inline-block mr-2" />
              ) : (
                "Sign Up"
              )}
            </button>
            {formState.errors.submit && (
              <p className="text-red-500 text-xs italic mt-2 text-center">{formState.errors.submit}</p>
            )}
            {formState.success && (
              <p className="text-green-500 text-xs italic mt-2 text-center">
                <CheckCircle className="inline-block mr-2" />
                Signup successful! Redirecting...
              </p>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default Signup
