import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            // 🔥 FIX: Read the user structure returned directly from the AuthContext update execution
            const targetRole = result.user?.role || '';

            if (targetRole === 'Admin' || targetRole === '1' || targetRole === 1) {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.message || 'Invalid authentication credentials.');
        }
    };

    return (
        <div className="auth-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f4f7f6' }}>
            <div className="card shadow-lg border-0 p-4 p-md-5 bg-white m-3" style={{ width: '100%', maxWidth: '440px', borderRadius: '24px' }}>

                {/* 📊 PREMIUM WEALTHENGINE BRANDING HEADER */}
                <div className="text-center mb-5">
                    <div className="brand-icon-box mx-auto mb-3 d-flex align-items-center justify-content-center text-white rounded-4 shadow-sm"
                         style={{ width: '54px', height: '54px', background: '#0d6efd', fontSize: '1.5rem' }}>
                        📊
                    </div>
                    <h2 className="fw-extrabold text-dark tracking-tight mb-1" style={{ fontSize: '1.75rem' }}>
                        Wealth<span className="text-primary">Engine</span>
                    </h2>
                    <p className="text-muted small fw-semibold text-uppercase tracking-wider">Institutional Portfolio Gateway</p>
                </div>

                {/* Error Alert Box */}
                {error && (
                    <div className="alert alert-danger text-center py-2 mb-4 border-0 rounded-3 small fw-medium" role="alert">
                        ⚠️ {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-4">
                        <label className="form-label fw-bold small text-secondary">Email Address</label>
                        <input
                            type="email"
                            className="form-control form-control-lg custom-input bg-light border-0 px-3 py-2 fs-6"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ borderRadius: '12px' }}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <label className="form-label fw-bold small text-secondary">Password</label>
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

                    {/* Submit Button matched to primary portal blue */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 fw-bold fs-6 shadow d-flex align-items-center justify-content-center py-2 mt-2"
                        disabled={loading}
                        style={{ borderRadius: '12px', background: '#0d6efd', border: 'none' }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Authenticating...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                {/* Bottom Redirection Links */}
                <div className="text-center mt-5 pt-3 border-top border-light">
                    <p className="small mb-0 text-secondary fw-medium">
                        New to WealthEngine? <Link to="/register" className="text-primary fw-bold text-decoration-none ms-1">Create an Account</Link>
                    </p>
                </div>

            </div>

            {/* Global style overrides for fields focus behavior */}
            <style>{`
                .fw-extrabold { font-weight: 800; }
                .tracking-tight { letter-spacing: -0.03em; }
                .tracking-wider { letter-spacing: 0.08em; font-size: 0.72rem; }
                .custom-input:focus { background-color: #ffffff !important; border: 2px solid #0d6efd !important; box-shadow: none !important; }
            `}</style>
        </div>
    );
};

export default Login;
