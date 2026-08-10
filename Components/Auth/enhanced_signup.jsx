// Enhanced Signup - State Selection First
import React, { useState } from 'react';
import { GovveritasLogo } from './govveritas_logo';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

export default function EnhancedSignup({ onSignupComplete }) {
  const [step, setStep] = useState('state'); // 'state' or 'details'
  const [selectedState, setSelectedState] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('coordinator');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setStep('details');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || !name) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      // In real app, this would call your backend
      const userData = {
        name,
        email,
        state: selectedState,
        role,
        createdAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store in localStorage for demo
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userState', selectedState);

      onSignupComplete(userData);
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F3F] via-[#003366] to-[#001F3F]">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="dots" x="20" y="20" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="#FFD700" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <GovveritasLogo size="lg" showText={true} />
            </div>
            <p className="text-white text-sm opacity-90">
              World Bank HOPE-GOV Programme
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#001F3F] to-[#003366] text-white p-6 text-center border-b-4 border-[#FFD700]">
              <h1 className="text-2xl font-bold">
                {step === 'state' ? 'Select Your State' : 'Create Account'}
              </h1>
              <p className="text-sm opacity-90 mt-1">
                {step === 'state'
                  ? 'Choose which state you are signing up for'
                  : `Signing up for ${selectedState} State`}
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {step === 'state' ? (
                // STATE SELECTION STEP
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    All 37 Nigerian States + FCT
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {NIGERIAN_STATES.map((state) => (
                      <button
                        key={state}
                        onClick={() => handleStateSelect(state)}
                        className="p-3 text-sm font-500 rounded-lg border-2 border-gray-200 hover:border-[#FFD700] hover:bg-yellow-50 transition-all text-left"
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // SIGNUP DETAILS STEP
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* State Confirmation */}
                  <div className="bg-[#FFD700] text-[#001F3F] p-3 rounded-lg font-600 text-center">
                    ✅ Signing up for {selectedState} State
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-600 text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-600 text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@state.gov.ng"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-600 text-gray-700 mb-2">
                      Password (min 8 characters)
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-600 text-gray-700 mb-2">
                      Your Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none"
                    >
                      <option value="coordinator">State Coordinator</option>
                      <option value="reviewer">State Reviewer</option>
                      <option value="manager">State Manager</option>
                    </select>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep('state')}
                      className="flex-1 px-4 py-2 border-2 border-[#001F3F] text-[#001F3F] rounded-lg font-600 hover:bg-gray-50"
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-[#001F3F] hover:bg-[#003366] text-white rounded-lg font-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Account'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-600 border-t">
              <p>
                Secure platform for tracking HOPE-GOV compliance across {selectedState || 'your state'}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
