import AdminNavbar from '../../components/AdminNavbar'; // 🔥 Mapped cleanly to your Admin components folder

const AdminAbout = () => {
    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            {/* 🔥 UPDATED NAVBAR: Swapped with your responsive Admin Control Menu */}
            <AdminNavbar />

            <div className="container pb-5">
                {/* HERO BANNER SECTION (Theme updated to reflect Admin Central command Center) */}
                <div className="card shadow-sm border-0 p-5 text-white mb-5 text-center"
                     style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #0d6efd 0%, #064094 100%)' }}>
                    <div className="py-4">
                        <span className="badge bg-white text-primary text-uppercase tracking-wider px-3 py-2 mb-3 fw-bold shadow-sm">
                            Administrative Interface Node v1.0 Live
                        </span>
                        <h1 className="display-4 fw-extrabold mb-2">WealthEngine Architecture</h1>
                        <p className="lead opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
                            A high-performance, secure, and full-stack portfolio tracking system designed with multi-tier ledger consistency.
                        </p>
                    </div>
                </div>

                <div className="row g-4">
                    {/* LEFT SIDE: CORE OBJECTIVE & SPECS */}
                    <div className="col-lg-7">
                        <div className="card shadow-sm border-0 p-4 bg-white h-100" style={{ borderRadius: '15px' }}>
                            <h4 className="fw-bold text-dark border-bottom pb-2 mb-3">🚀 Core Objective</h4>
                            <p className="text-secondary">
                                <strong>WealthEngine</strong> is a comprehensive, automated portfolio tracking infrastructure. The platform focuses on delivering real-time market appraisal calculations and live metrics processing matrices for multi-asset class investments, including equities, core large-cap industrial holdings, and global technology securities.
                            </p>
                            <p className="text-secondary">
                                Leveraging mathematically precise **Weighted Risk Index Algorithms** implemented at the service layer, the application dynamically updates allocation tracking profiles. This allows the system to evaluate individual portfolio exposures and automatically assign risk distribution classes, providing investors with immediate strategic insights.
                            </p>

                            <h4 className="fw-bold text-dark border-bottom pb-2 mt-4 mb-3">🛠️ Architecture Specifications</h4>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-3 border-start border-primary border-4">
                                        <h6 className="fw-bold mb-1 text-dark">Data Stream Integrity</h6>
                                        <small className="text-muted d-block">Automatic precision filters utilizing a 18,2 numeric precision standard to maintain perfect ledger and fractional share calculation accuracy.</small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-3 border-start border-success border-4">
                                        <h6 className="fw-bold mb-1 text-dark">Soft Deletion Cascade</h6>
                                        <small className="text-muted d-block">Strict structural enforcement of transactional audit safety protocols. Moving user accounts to an inactive state prevents database foreign key isolation failures.</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: ADVANCED TECH STACK LEDGER */}
                    <div className="col-lg-5">
                        <div className="card shadow-sm border-0 p-4 bg-white h-100" style={{ borderRadius: '15px' }}>
                            <h4 className="fw-bold text-dark border-bottom pb-2 mb-4">⚡ Core Tech Stack Matrix</h4>

                            {/* BACKEND TECH SQUAD */}
                            <div className="mb-4">
                                <h6 className="fw-bold text-primary mb-2 uppercase tracking-wider small">Backend Systems Pipeline</h6>
                                <ul className="list-group list-group-flush small">
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                                        <span>🖥️ ASP.NET Core Web API</span>
                                        <span className="badge bg-secondary-subtle text-secondary fw-semibold">C# / .NET Core</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                                        <span>💾 Entity Framework Core (EF Core)</span>
                                        <span className="badge bg-secondary-subtle text-secondary fw-semibold">LINQ Data Layers</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                                        <span>🛢️ Microsoft SQL Server</span>
                                        <span className="badge bg-secondary-subtle text-secondary fw-semibold">RDBMS Engine</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                                        <span>🔒 JWT Bearer & BCrypt.NET</span>
                                        <span className="badge bg-secondary-subtle text-secondary fw-semibold">Secure Encryption</span>
                                    </li>
                                </ul>
                            </div>

                            {/* FRONTEND TECH SQUAD */}
                            <div>
                                <h6 className="fw-bold text-success mb-2 uppercase tracking-wider small">Client Interface Layer</h6>
                                <ul className="list-group list-group-flush small">
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                                        <span>⚛️ React.js (Single Page Application)</span>
                                        <span className="badge bg-secondary-subtle text-secondary fw-semibold">Vite Bundler</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                                        <span>🛣️ React Router DOM v6</span>
                                        <span className="badge bg-secondary-subtle text-secondary fw-semibold">Route Guards</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                                        <span>🌐 Axios HTTP Client</span>
                                        <span className="badge bg-secondary-subtle text-secondary fw-semibold">Interceptors Config</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                                        <span>🎨 Bootstrap 5 Framework Layout</span>
                                        <span className="badge bg-secondary-subtle text-secondary fw-semibold">Responsive Grid</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PROJECT ARCHITECT FOOTER CAPTION */}
                <div className="text-center mt-5 text-muted small">
                    <hr className="w-25 mx-auto mb-3" />
                    Designed & Engineered by <strong className="text-dark">Aniket Singh</strong> • Full-Stack Investment Portal Node
                </div>
            </div>

            {/* Layout Helpers */}
            <style>{`
                .fw-extrabold { font-weight: 800; }
                .tracking-wider { letter-spacing: 0.05em; }
            `}</style>
        </div>
    );
};

export default AdminAbout;
