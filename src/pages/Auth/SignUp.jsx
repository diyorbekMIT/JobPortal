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
  const { login } = useAuth();
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
    if (formState.success) {
      const timer = setTimeout(() => {
        window.location.href = formData.role === "employer" ? "/employer-dashboard" : "/find-jobs"
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [formState.success, formData.role])

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
        avatarUrl = imgUploadRes.imageUrl || ""; // ✅ Adjust based on your API response
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        avatar: avatarUrl || ''
      })

      setFormState((prev) => (
        {
          ...prev,
          loading: false,
          success: true,
          errors: {}
        }
      ));

      const { token, user } = response.data;

      if(token){
        login(response.data, token);

        //Reirect based on role
        setTimeout(() => {
          window.location.href = formData.role === "employer"
            ? "/employer-dashboarad"
            : "find-jobs/"
        }, 3000)
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

  // ✅ Success Screen
  if (formState.success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 px-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center'
        >
          <div className='w-24 h-24 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg'>
            <CheckCircle className='w-12 h-12 text-white' />
          </div>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>Account Created!</h2>
          <p className='text-lg text-gray-600 mb-8'>
            Welcome to JobPortal, {formData.fullName.split(' ')[0]}!
          </p>
          <div className='w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden'>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'linear' }}
              className='h-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full'
            />
          </div>
          <p className='text-sm text-gray-500'>Redirecting to dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-12'>
      <div className='max-w-md mx-auto w-full'>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-10'
        >
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Create Account</h1>
          <p className='text-gray-500'>Join thousands of professionals finding their dream jobs</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='bg-white rounded-3xl shadow-xl p-8 border border-gray-100'
        >
          <form onSubmit={handleSubmit} className='space-y-5'>

            {/* Full Name */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Full Name <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                {/* ✅ FIXED: top-1/2 -translate-y-1/2 */}
                <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder='John Doe'
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    formState.errors.fullName
                      ? 'border-red-300 bg-red-50 focus:ring-red-200'
                      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
              </div>
              {formState.errors.fullName && (
                <p className='flex items-center mt-1.5 text-sm text-red-600'>
                  <AlertCircle className='w-4 h-4 mr-1 flex-shrink-0' />
                  {formState.errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Email Address <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                {/* ✅ FIXED: top-1/2 -translate-y-1/2 */}
                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='john@example.com'
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    formState.errors.email
                      ? 'border-red-300 bg-red-50 focus:ring-red-200'
                      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
              </div>
              {formState.errors.email && (
                <p className='flex items-center mt-1.5 text-sm text-red-600'>
                  <AlertCircle className='w-4 h-4 mr-1 flex-shrink-0' />
                  {formState.errors.email} 
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Password <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                {/* ✅ FIXED: top-1/2 -translate-y-1/2 */}
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type={formState.showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder='Enter your password'
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    formState.errors.password
                      ? 'border-red-300 bg-red-50 focus:ring-red-200'
                      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                >
                  {formState.showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
              {formState.errors.password && (
                <p className='flex items-center mt-1.5 text-sm text-red-600'>
                  <AlertCircle className='w-4 h-4 mr-1 flex-shrink-0' />
                  {formState.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Confirm Password <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                {/* ✅ FIXED: top-1/2 -translate-y-1/2 */}
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type={formState.showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder='Confirm your password'
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    formState.errors.confirmPassword
                      ? 'border-red-300 bg-red-50 focus:ring-red-200'
                      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setFormState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                >
                  {formState.showConfirmPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
              {formState.errors.confirmPassword && (
                <p className='flex items-center mt-1.5 text-sm text-red-600'>
                  <AlertCircle className='w-4 h-4 mr-1 flex-shrink-0' />
                  {formState.errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Profile Picture (Optional)
              </label>
              <div
                className='flex items-center gap-4 border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group'
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                />
                {/* Avatar Preview */}
                <div className='w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-100 border-2 border-gray-200 overflow-hidden'>
                  {formState.imagePreview ? (
                    <img
                      src={formState.imagePreview}
                      alt='Preview'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <User className='w-7 h-7 text-gray-400' />
                  )}
                </div>
                {/* Upload Text */}
                <div>
                  <div className='flex items-center gap-2 text-gray-700 font-medium group-hover:text-blue-600 transition-colors'>
                    <Upload className='w-4 h-4' />
                    <span>Upload Photo</span>
                  </div>
                  <p className='text-xs text-gray-400 mt-0.5'>JPG, PNG up to 5MB</p>
                </div>
              </div>
              {formState.errors.profileImage && (
                <p className='flex items-center mt-1.5 text-sm text-red-600'>
                  <AlertCircle className='w-4 h-4 mr-1 flex-shrink-0' />
                  {formState.errors.profileImage}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-3'>
                I am a <span className='text-red-500'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-3'>
                <button
                  type='button'
                  onClick={() => setFormData(prev => ({ ...prev, role: 'jobseeker' }))}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                    formData.role === 'jobseeker'
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <User className={`w-7 h-7 ${formData.role === 'jobseeker' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold text-sm ${formData.role === 'jobseeker' ? 'text-blue-700' : 'text-gray-700'}`}>
                    Job Seeker
                  </span>
                  <span className='text-xs text-gray-400'>Looking for opportunities</span>
                </button>
                <button
                  type='button'
                  onClick={() => setFormData(prev => ({ ...prev, role: 'employer' }))}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                    formData.role === 'employer'
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase className={`w-7 h-7 ${formData.role === 'employer' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold text-sm ${formData.role === 'employer' ? 'text-emerald-700' : 'text-gray-700'}`}>
                    Employer
                  </span>
                  <span className='text-xs text-gray-400'>Hiring talent</span>
                </button>
              </div>
            </div>

            {/* Submit Error */}
            {formState.errors.submit && (
              <div className='bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3'>
                <AlertCircle className='w-5 h-5 text-red-500 mt-0.5 flex-shrink-0' />
                <p className='text-sm text-red-700'>{formState.errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={formState.loading}
              className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-lg focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {formState.loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <Loader className='w-5 h-5 animate-spin' />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <div className='text-center pt-2'>
              <p className='text-sm text-gray-600'>
                Already have an account?{' '}
                <a href='/login' className='font-semibold text-blue-600 hover:text-blue-700 transition-colors'>
                  Sign in here
                </a>
              </p>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup
