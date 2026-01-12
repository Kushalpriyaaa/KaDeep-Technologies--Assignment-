import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await signIn(formData.email, formData.password);

      if (formData.email === 'admin@test.com') {
        navigate('/admin');
      } else if (formData.email === 'delivery@test.com') {
        navigate('/delivery');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/user');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please enable pop-ups and try again.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-image-wrapper">
          <img src="/login.jpeg" alt="Food" className="login-image" />
          <div className="login-overlay">
            <h2 className="login-tagline">Need some<br />Pizza, yo?</h2>
            <p className="login-description">C'mon and order from nearby Pizza<br />delivery and pickup restaurants</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <img src="/LOGO.png" alt="Sah One Logo" className="login-logo" />
           
            <p className="login-welcome">Welcome Back!</p>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <button className="google-signin-btn" onClick={handleGoogleSignIn} type="button" disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.8055 10.2292C19.8055 9.55056 19.7501 8.86726 19.6322 8.19824H10.2002V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.8252C18.7174 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
                <path d="M10.2002 20.0006C12.9517 20.0006 15.2723 19.1151 16.8293 17.5865L13.6066 15.0879C12.7096 15.6979 11.5468 16.0433 10.2043 16.0433C7.54293 16.0433 5.28895 14.2833 4.50607 11.9097H1.18652V14.4818C2.7847 17.6554 6.30933 20.0006 10.2002 20.0006Z" fill="#34A853"/>
                <path d="M4.50191 11.9097C4.08813 10.6677 4.08813 9.33653 4.50191 8.09448V5.52246H1.18652C-0.395508 8.66605 -0.395508 12.3381 1.18652 15.4817L4.50191 11.9097Z" fill="#FBBC04"/>
                <path d="M10.2002 3.95805C11.6246 3.936 13.0035 4.47247 14.0368 5.45722L16.8917 2.60218C15.1847 0.990833 12.9352 0.0969627 10.2002 0.121847C6.30933 0.121847 2.7847 2.46701 1.18652 5.64552L4.50191 8.21753C5.28062 5.83975 7.53877 3.95805 10.2002 3.95805Z" fill="#EA4335"/>
              </svg>
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>

            <p className="login-footer">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>

            <div className="test-credentials">
              <p><strong>Test Credentials:</strong></p>
              <p>Admin: admin@test.com / admin1</p>
              <p>Delivery: delivery@test.com / delivery</p>
              <p>User: user@test.com / user</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
