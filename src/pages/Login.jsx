import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, Chrome, Loader2 } from 'lucide-react';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const [formError, setFormError] = useState('');
  
  const { signIn, signUp, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (isSignUp) {
        if (!formData.displayName.trim()) {
          setFormError('Please enter your name');
          return;
        }
        await signUp(formData.email, formData.password, formData.displayName);
      } else {
        await signIn(formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'An error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Failed to sign in with Google');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 dark:from-gray-900 dark:via-primary-900 dark:to-gray-900 p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAtNGgydjJoLTJ2LTJ6bTAgNGgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="w-full max-w-md relative">
        <div className="card p-8 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 mb-4 shadow-lg shadow-primary-500/50">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Life & Finance Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </p>
          </div>

          {/* Error Message */}
          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-slide-down">
              <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="displayName" className="label block mb-2 text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="input pl-10 w-full"
                    placeholder="John Doe"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="label block mb-2 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10 w-full"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label block mb-2 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10 w-full"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full h-11 text-base font-semibold"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn w-full h-11 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
          >
            <Chrome className="w-5 h-5 mr-2" />
            Google
          </button>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormError('');
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-white/80">
          Track your goals, recaps, and finances all in one place
        </p>
      </div>
    </div>
  );
};

export default Login;
