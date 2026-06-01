import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogoutClick = () => {
        if (window.confirm('Are you sure would like to log out ?')) {
            logout();
            navigate('/login');
        }
    };

    // Helper to determine menu highlight
    const getNavLinkClass = (path) => {
        const baseClass = "nav-link px-3 py-2 rounded-3 transition-all fw-semibold";
        return location.pathname === path
            ? `${baseClass} bg-success text-white shadow-sm active`
            : `${baseClass} text-secondary hover-bg-light`;
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom border-light shadow-sm sticky-top mb-5 py-3">
            <div className="container">
                {/* Brand Logo with Premium Icon style */}
                <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-dark fs-4 tracking-tight" to="/dashboard">
                    <span className="p-2 bg-success text-white rounded-3 d-inline-flex align-items-center justify-content-center shadow-sm" style={{ width: '38px', height: '38px' }}>
                        📊
                    </span>
                    <span className="text-dark fw-extrabold">Wealth<span className="text-success">Engine</span></span>
                </Link>

                {/* Mobile Toggler Responsive Menu */}
                <button
                    className="navbar-toggler border-0 bg-light p-2 rounded-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#wealthEngineNavbar"
                    aria-controls="wealthEngineNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Action items links */}
                <div className="collapse navbar-collapse" id="wealthEngineNavbar">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 p-1 bg-light rounded-4 d-none d-lg-flex">
                        <li className="nav-item">
                            <Link className={getNavLinkClass('/dashboard')} to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getNavLinkClass('/assets')} to="/assets">Assets</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getNavLinkClass('/transactions')} to="/transactions">Transactions</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getNavLinkClass('/account')} to="/account">Account</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getNavLinkClass('/about')} to="/about">About</Link>
                        </li>
                    </ul>

                    {/* Fallback for Mobile View (Without light background container layout) */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1 d-lg-none mt-3">
                        <li className="nav-item">
                            <Link className={getNavLinkClass('/dashboard')} to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getNavLinkClass('/assets')} to="/assets">Assets</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getNavLinkClass('/transactions')} to="/transactions">Transactions</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getNavLinkClass('/account')} to="/account">Account</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getNavLinkClass('/about')} to="/about">About</Link>
                        </li>
                    </ul>

                    {/* Right Side Identity & Session Center */}
                    <div className="d-flex align-items-center justify-content-between justify-content-lg-end gap-3 mt-3 mt-lg-0 border-top pt-3 pt-lg-0 border-light">
                        {user && (
                            <div className="d-flex flex-column align-items-end lh-sm">
                                <span className="text-dark small fw-bold">{user.username || 'Aniket Singh'}</span>
                                <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.68rem', trackingWider: '0.05em' }}>
                                    {user.role || 'User'}
                                </span>
                            </div>
                        )}
                        <button className="btn btn-outline-danger btn-md fw-bold px-4 rounded-3 shadow-sm border-2 transition-all btn-sm" onClick={handleLogoutClick}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Interactive CSS Tricks Embedded directly for hover styles safety */}
            <style>{`
                .transition-all { transition: all 0.2s ease-in-out; }
                .hover-bg-light:hover { background-color: #f1f3f5 !important; color: #212529 !important; }
                .navbar-nav .active { transform: scale(1.03); }
                .fw-extrabold { font-weight: 800; }
                .tracking-tight { letter-spacing: -0.025em; }
            `}</style>
        </nav>
    );
};

export default Navbar;
