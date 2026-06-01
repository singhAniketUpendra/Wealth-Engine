import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogoutClick = () => {
        if (window.confirm('are you sure would like to log out ?')) {
            logout();
            navigate('/login');
        }
    };

    const getNavLinkClass = (path) => {
        const baseClass = "nav-link px-3 py-2 rounded-3 transition-all fw-semibold small";
        return location.pathname === path
            ? `${baseClass} bg-primary text-white shadow-sm active`
            : `${baseClass} text-secondary hover-bg-light`;
    };

    return (
        <nav className="navbar navbar-expand-xl navbar-light bg-white border-bottom border-light shadow-sm sticky-top mb-5 py-2">
            <div className="container-fluid px-4">

                {/* BRAND LOGO LAYER */}
                <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-dark fs-5 tracking-tight me-4" to="/admin/dashboard">
                    <span className="p-2 bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center shadow-sm" style={{ width: '34px', height: '34px' }}>
                        🛡️
                    </span>
                    <span className="text-dark fw-extrabold">Wealth<span className="text-primary">Engine</span></span>
                    <span className="badge bg-danger-subtle text-danger fw-bold rounded-pill uppercase tracking-wider" style={{ fontSize: '0.58rem', padding: '0.35em 0.65em' }}>Admin</span>
                </Link>

                {/* RESPONSIVE MOBILE TOGGLER */}
                <button
                    className="navbar-toggler border-0 bg-light p-2 rounded-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#wealthEngineAdminNavbar"
                    aria-controls="wealthEngineAdminNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* CONTAINER PIPELINE CLUSTER */}
                <div className="collapse navbar-collapse" id="wealthEngineAdminNavbar">

                    {/* DESKTOP CENTER MENU CAPSULE */}
                    <div className="d-none d-xl-flex mx-auto bg-light p-1 rounded-4 border border-light shadow-inner">
                        <ul className="navbar-nav d-flex flex-row gap-1 align-items-center mb-0">
                            <li className="nav-item">
                                <Link className={getNavLinkClass('/admin/dashboard')} to="/admin/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={getNavLinkClass('/admin/assets')} to="/admin/assets">Manage Assets</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={getNavLinkClass('/admin/users')} to="/admin/users">Manage Users</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={getNavLinkClass('/admin/transactions')} to="/admin/transactions">Transactions</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={getNavLinkClass('/admin/account')} to="/admin/account">Account</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={getNavLinkClass('/admin/about')} to="/admin/about">About</Link>
                            </li>
                        </ul>
                    </div>

                    {/* RESPONSIVE FALLBACK MOBILE LINKS */}
                    <ul className="navbar-nav d-xl-none gap-1 my-3 border-top pt-3">
                        <li className="nav-item"><Link className={getNavLinkClass('/admin/dashboard')} to="/admin/dashboard">Dashboard</Link></li>
                        <li className="nav-item"><Link className={getNavLinkClass('/admin/assets')} to="/admin/assets">Manage Assets</Link></li>
                        <li className="nav-item"><Link className={getNavLinkClass('/admin/users')} to="/admin/users">Manage Users</Link></li>
                        <li className="nav-item"><Link className={getNavLinkClass('/admin/transactions')} to="/admin/transactions">Transactions</Link></li>
                        <li className="nav-item"><Link className={getNavLinkClass('/admin/account')} to="/admin/account">Account</Link></li>
                        <li className="nav-item"><Link className={getNavLinkClass('/admin/about')} to="/admin/about">About</Link></li>
                    </ul>

                    {/* RIGHT SIDE SESSION CONTROL IDENTITY CENTER */}
                    <div className="d-flex align-items-center gap-3 ms-auto border-top pt-3 pt-xl-0 border-light border-xl-0">
                        {user && (
                            <div className="text-end lh-1 pe-2 border-end border-light d-none d-sm-block">
                                <span className="text-dark small fw-bold d-block mb-1">{user.username || 'Aniket Singh'}</span>
                                <span className="text-primary text-uppercase fw-extrabold font-monospace" style={{ fontSize: '0.6rem', letterSpacing: '0.03em' }}>
                                    🛡️ Admin Node
                                </span>
                            </div>
                        )}
                        <button className="btn btn-outline-danger btn-sm fw-bold px-3 py-1.5 rounded-3 shadow-sm border-2 transition-all" onClick={handleLogoutClick}>
                            Logout
                        </button>
                    </div>

                </div>
            </div>

            {/* EMBEDDED MICRO-INTERACTIVE STYLE RULES */}
            <style>{`
                .transition-all { transition: all 0.2s ease-in-out; }
                .hover-bg-light:hover { background-color: #e9ecef !important; color: #212529 !important; }
                .navbar-nav .active { transform: scale(1.02); }
                .fw-extrabold { font-weight: 800; }
                .tracking-tight { letter-spacing: -0.025em; }
                .tracking-wider { letter-spacing: 0.05em; }
                .shadow-inner { box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); }
            `}</style>
        </nav>
    );
};

export default AdminNavbar;
