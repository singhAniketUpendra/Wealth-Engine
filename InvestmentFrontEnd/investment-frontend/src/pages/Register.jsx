import { useState } from 'react';
import { registerUser } from '../api/authApi';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        const payload = {
            username: username.trim(),
            email: email.trim(),
            password: password,
            role: 2 // 2 = User role matching your C# Backend UserRole Enum
        };

        try {
            await registerUser(payload);
            setSuccess(true);
            setLoading(false);

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Registration failed. Check connectivity validation rules.');
        }
    };

    return (
        <div className="auth-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f4f7f6' }}>
            <div className="card shadow-lg border-0 p-4 p-md-5 bg-white m-3" style={{ width: '100%', maxWidth: '440px', borderRadius: '24px' }}>

                {/* 📊 WEALTHENGINE BRANDING HEADER (FIXED: Matched to Primary Blue) */}
                <div className="text-center mb-5">
                    <div className="brand-icon-box mx-auto mb-3 d-flex align-items-center justify-content-center text-white rounded-4 shadow-sm"
                         style={{ width: '54px', height: '54px', background: '#0d6efd', fontSize: '1.5rem' }}>
                        📊
                    </div>
                    <h2 className="fw-extrabold text-dark tracking-tight mb-1" style={{ fontSize: '1.75rem' }}>
                        Wealth<span className="text-primary">Engine</span>
                    </h2>
                    <p className="text-muted small fw-semibold text-uppercase tracking-wider">Initialize Investor Node Identity</p>
                </div>

                {/* Success Alert */}
                {success && (
                    <div className="alert alert-success text-center py-2 mb-4 border-0 rounded-3 small fw-medium" role="alert">
                        🎉 Registration Successful! Redirecting to login terminal...
                    </div>
                )}

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-danger text-center py-2 mb-4 border-0 rounded-3 small fw-medium" role="alert">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Username Input */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small text-secondary">Full Name</label>
                        <input
                            type="text"
                            className="form-control form-control-lg custom-input bg-light border-0 px-3 py-2 fs-6"
                            placeholder="Aniket Singh"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ borderRadius: '12px' }}
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small text-secondary">Email Address</label>
                        <input
                            type="email"
                            className="form-control form-control-lg custom-input bg-light border-0 px-3 py-2 fs-6"
                            placeholder="name@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ borderRadius: '12px' }}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <label className="form-label fw-bold small text-secondary">Secure Password</label>
                        <input
                            type="password"
                            className="form-control form-control-lg custom-input bg-light border-0 px-3 py-2 fs-6"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ borderRadius: '12px' }}
                        />
                    </div>

                    {/* Submit Button (FIXED: Matched to Primary Blue) */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 fw-bold fs-6 shadow d-flex align-items-center justify-content-center py-2 mt-2"
                        disabled={loading}
                        style={{ borderRadius: '12px', background: '#0d6efd', border: 'none' }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Deploying Profile Record...
                            </>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>

                {/* Redirect Link back to Login */}
                <div className="text-center mt-5 pt-3 border-top border-light">
                    <p className="small mb-0 text-secondary fw-medium">
                        Already registered? <Link to="/login" className="text-primary fw-bold text-decoration-none ms-1">Login here</Link>
                    </p>
                </div>

            </div>

            {/* Focus behavior helpers matching the blue outline theme */}
            <style>{`
                .fw-extrabold { font-weight: 800; }
                .tracking-tight { letter-spacing: -0.03em; }
                .tracking-wider { letter-spacing: 0.08em; font-size: 0.72rem; }
                .custom-input:focus { background-color: #ffffff !important; border: 2px solid #0d6efd !important; box-shadow: none !important; }
            `}</style>
        </div>
    );
};

export default Register;
