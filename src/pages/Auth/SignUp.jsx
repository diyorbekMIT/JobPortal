import React, { useState, useRef, useEffect } from 'react'
import { motion } from "framer-motion"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  User,
  Briefcase,
  Camera,
  X,
  CheckCircle
} from "lucide-react"

const Signup = () => {
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
    success: false
  })

  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  // Auto-redirect after success
  useEffect(() => {
    if (formState.success) {
      const timer = setTimeout(() => {
        window.location.href = '/'
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [formState.success])

  // Validation functions
  const validateFullName = (name) => name.trim().length >= 2

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => password.length >= 6

  const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword
  }

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

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, profileImage: 'Please upload a valid image file' }
      }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, profileImage: 'Image size must be less than 5MB' }
      }))
      return
    }

    setFormData(prev => ({ ...prev, profileImage: file }))
    setImagePreview(URL.createObjectURL(file))
    setFormState(prev => ({
      ...prev,
      errors: { ...prev.errors, profileImage: '' }
    }))
  }

  // Remove selected image
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, profileImage: null }))
    setImagePreview(null)
    fileInputRef.current.value = ''
  }

  const validateForm = () => {
    const errors = {}

    if (!validateFullName(formData.fullName)) {
      errors.fullName = "Full name must be at least 2 characters"
    }
    if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
    if (!validatePassword(formData.password)) {
      errors.password = "Password must be at least 6 characters long"
    }
    if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
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
      // Signup API integration here
      // const data = new FormData()
      // data.append('fullName', formData.fullName)
      // data.append('email', formData.email)
      // data.append('password', formData.password)
      // data.append('role', formData.role)
      // if (formData.profileImage) data.append('profileImage', formData.profileImage)
      // await axios.post('/api/auth/signup', data)

      // On success:
      setFormState(prev => ({ ...prev, loading: false, success: true }))
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
      <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center'
        >
          {/* Avatar preview or fallback icon */}
          {imagePreview ? (
            <img
              src={imagePreview}
              alt='Profile'
              className='w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-green-100'
            />
          ) : (
            <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
          )}

          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Welcome, {formData.fullName.split(' ')[0]}! 🎉
          </h2>
          <p className='text-gray-600 mb-2'>
            Your account has been successfully created.
          </p>
          <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-6 ${
            formData.role === 'employer'
              ? 'bg-purple-100 text-purple-600'
              : 'bg-blue-100 text-blue-600'
          }`}>
            {formData.role === 'employer' ? '🏢 Employer' : '💼 Job Seeker'}
          </span>

          {/* Animated progress bar */}
          <div className='w-full bg-gray-100 rounded-full h-1.5 mb-3 overflow-hidden'>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'linear' }}
              className='h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full'
            />
          </div>

          <p className='text-sm text-gray-400'>Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  // 📝 Signup Form
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full'
      >
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-2 mb-2'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
              <Briefcase className='w-5 h-5 text-white' />
            </div>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              JobPortal
            </h1>
          </div>
          <h2 className='text-xl font-bold text-gray-900 mb-1'>Create an Account</h2>
          <p className='text-gray-600 text-sm'>Join thousands of job seekers and employers</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>

          {/* Role Selector */}
          <div className='grid grid-cols-2 gap-3'>
            <button
              type='button'
              onClick={() => setFormData(prev => ({ ...prev, role: 'jobseeker' }))}
              className={`py-2 px-4 rounded-lg border-2 font-medium text-sm transition-all duration-300 ${
                formData.role === 'jobseeker'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              Job Seeker
            </button>
            <button
              type='button'
              onClick={() => setFormData(prev => ({ ...prev, role: 'employer' }))}
              className={`py-2 px-4 rounded-lg border-2 font-medium text-sm transition-all duration-300 ${
                formData.role === 'employer'
                  ? 'border-purple-600 bg-purple-50 text-purple-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              Employer
            </button>
          </div>

          {/* Profile Image Uploader */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Profile Picture <span className='text-gray-400 font-normal'>(optional)</span>
            </label>
            <div className='flex items-center gap-4'>
              <div className='relative w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0'>
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt='Preview' className='w-full h-full object-cover' />
                    <button
                      type='button'
                      onClick={handleRemoveImage}
                      className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </>
                ) : (
                  <User className='w-7 h-7 text-gray-300' />
                )}
              </div>
              <div className='flex-1'>
                <input
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className='hidden'
                  id='profileImage'
                />
                <label
                  htmlFor='profileImage'
                  className='flex items-center gap-2 cursor-pointer w-full py-2 px-4 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:border-blue-400 transition-colors duration-300'
                >
                  <Camera className='w-4 h-4 text-blue-500' />
                  {formData.profileImage ? formData.profileImage.name : 'Choose a photo'}
                </label>
                <p className='text-xs text-gray-400 mt-1'>JPG, PNG or GIF — max 5MB</p>
              </div>
            </div>
            {formState.errors.profileImage && (
              <p className='flex items-center mt-2 text-sm text-red-600'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {formState.errors.profileImage}
              </p>
            )}
          </div>

          {/* Full Name Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                name='fullName'
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder='Enter your full name'
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  formState.errors.fullName ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              />
            </div>
            {formState.errors.fullName && (
              <p className='flex items-center mt-2 text-sm text-red-600'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {formState.errors.fullName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Enter your email'
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  formState.errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              />
            </div>
            {formState.errors.email && (
              <p className='flex items-center mt-2 text-sm text-red-600'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {formState.errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type={formState.showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                placeholder='Create a password'
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                  formState.errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              />
              <button
                type='button'
                onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              >
                {formState.showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
            {formState.errors.password && (
              <p className='flex items-center mt-2 text-sm text-red-600'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {formState.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Confirm Password</label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type={formState.showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder='Repeat your password'
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                  formState.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              />
              <button
                type='button'
                onClick={() => setFormState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              >
                {formState.showConfirmPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
            {formState.errors.confirmPassword && (
              <p className='flex items-center mt-2 text-sm text-red-600'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {formState.errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {formState.errors.submit && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
              <p className='flex items-center text-sm text-red-700'>
                <AlertCircle className='w-4 h-4 mr-2' />
                {formState.errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={formState.loading}
            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {formState.loading ? (
              <div className='flex items-center justify-center'>
                <Loader className='w-5 h-5 mr-2 animate-spin' />
                <span>Creating Account...</span>
              </div>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          {/* Login Link */}
          <div className='text-center'>
            <p className='text-gray-600'>
              Already have an account?{' '}
              <a href='/login' className='text-blue-600 hover:text-blue-700 font-medium'>
                Sign in here
              </a>
            </p>
          </div>

        </form>
      </motion.div>
    </div>
  )
}

export default Signup
