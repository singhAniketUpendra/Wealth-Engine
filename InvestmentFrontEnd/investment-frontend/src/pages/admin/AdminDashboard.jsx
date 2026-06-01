import { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import API from '../../api/axiosInstance';

const AdminDashboard = () => {
    // Analytics Metrics States
    const [metrics, setMetrics] = useState({
        totalInvestors: 0,
        totalAdmins: 0,
        totalAssets: 0,
        totalTransactions: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDashboardMetrics = async () => {
        setLoading(true);
        try {
            // 🔥 Parallel Async Engine: Hits all nodes simultaneously
            const [usersRes, assetsRes, txRes] = await Promise.all([
                API.get('/Users'),
                API.get('/Assets'),
                API.get('/Transactions/admin/all')
            ]);

            const usersList = usersRes.data || [];
            const assetsList = assetsRes.data || [];
            const txList = txRes.data || [];

            const investorsCount = usersList.filter(u => u.role !== 'Admin' && u.role !== 1 && u.role !== '1').length;
            const adminsCount = usersList.filter(u => u.role === 'Admin' || u.role === 1 || u.role === '1').length;

            setMetrics({
                totalInvestors: investorsCount,
                totalAdmins: adminsCount,
                totalAssets: assetsList.length,
                totalTransactions: txList.length
            });
            setError('');
        } catch (err) {
            console.error("❌ Metrics Compilation Failed:", err);
            setError('Failed to sync real-time database ledger states.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardMetrics();
    }, []);

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            {/* Mounted Premium Navbar */}
            <AdminNavbar />

            <div className="container pb-5">

                {/* 🌟 USER-FRIENDLY WELCOME HEADER (Simple, Clean and Professional) */}
                <div className="card border-0 shadow-sm p-4 text-white mb-4"
                     style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="live-dot"></span>
                            <h4 className="fw-extrabold mb-0 tracking-tight">Welcome to Admin Control System</h4>
                        </div>
                        <p className="lead opacity-75 mb-0 fs-6" style={{ maxWidth: '600px' }}>
                            Hello Admin! Easily manage your platform assets, monitor active investor accounts, and view overall transaction histories from here.
                        </p>
                    </div>
                </div>

                {error && <div className="alert alert-danger text-center shadow-sm py-2 mb-4 small">{error}</div>}

                {loading ? (
                    <div className="text-center py-5 mt-5">
                        <div className="spinner-border text-primary" role="status" style={{ width: '2.5rem', height: '2.5rem' }}></div>
                        <p className="text-muted mt-3 small font-monospace">Loading dashboard metrics...</p>
                    </div>
                ) : (
                    /* 📊 PREMIUM BALANCED GRID (Horizontal screen fill, clean and rich) */
                    <div className="row g-4">

                        {/* CARD 1: TOTAL INVESTORS BLOCK */}
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm p-4 bg-white dashboard-premium-card h-100">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="w-100">
                                        <span className="text-muted text-uppercase tracking-wider fw-bold font-monospace" style={{ fontSize: '0.68rem' }}>Platform Access Group</span>
                                        <h2 className="fw-extrabold text-dark font-monospace mt-1 mb-2">{metrics.totalInvestors}</h2>
                                        <h6 className="fw-bold text-secondary-emphasis small mb-0">Total Verified Investors</h6>
                                    </div>
                                    <div className="icon-box bg-primary-subtle text-primary shadow-inner">💵</div>
                                </div>
                                <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center mt-4" style={{ fontSize: '0.75rem' }}>
                                    <span className="text-muted">Funding accounts ledger pool size</span>
                                    <span className="badge bg-success-subtle text-success fw-bold font-monospace border border-success-subtle">Active</span>
                                </div>
                            </div>
                        </div>

                        {/* CARD 2: TOTAL ADMINS BLOCK */}
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm p-4 bg-white dashboard-premium-card h-100">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="w-100">
                                        <span className="text-muted text-uppercase tracking-wider fw-bold font-monospace" style={{ fontSize: '0.68rem' }}>Security Authority Node</span>
                                        <h2 className="fw-extrabold text-dark font-monospace mt-1 mb-2">{metrics.totalAdmins}</h2>
                                        <h6 className="fw-bold text-secondary-emphasis small mb-0">Total Administrative Accounts</h6>
                                    </div>
                                    <div className="icon-box bg-danger-subtle text-danger shadow-inner">🛡️</div>
                                </div>
                                <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center mt-4" style={{ fontSize: '0.75rem' }}>
                                    <span className="text-muted">Identities with root write-access controls</span>
                                    <span className="badge bg-danger-subtle text-danger fw-bold font-monospace border border-danger-subtle">Root Vault</span>
                                </div>
                            </div>
                        </div>

                        {/* CARD 3: TOTAL ASSETS BLOCK */}
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm p-4 bg-white dashboard-premium-card h-100">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="w-100">
                                        <span className="text-muted text-uppercase tracking-wider fw-bold font-monospace" style={{ fontSize: '0.68rem' }}>Market Index Data</span>
                                        <h2 className="fw-extrabold text-dark font-monospace mt-1 mb-2">{metrics.totalAssets}</h2>
                                        <h6 className="fw-bold text-secondary-emphasis small mb-0">Total Tracked Financial Assets</h6>
                                    </div>
                                    <div className="icon-box bg-info-subtle text-info shadow-inner">💼</div>
                                </div>
                                <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center mt-4" style={{ fontSize: '0.75rem' }}>
                                    <span className="text-muted">Global equities and tickers recorded</span>
                                    <span className="badge bg-info-subtle text-info-emphasis fw-bold font-monospace border border-info-subtle">Global Sync</span>
                                </div>
                            </div>
                        </div>

                        {/* CARD 4: TOTAL TRANSACTIONS BLOCK */}
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm p-4 bg-white dashboard-premium-card h-100">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="w-100">
                                        <span className="text-muted text-uppercase tracking-wider fw-bold font-monospace" style={{ fontSize: '0.68rem' }}>Auditing Ledger Streams</span>
                                        <h2 className="fw-extrabold text-dark font-monospace mt-1 mb-2">{metrics.totalTransactions}</h2>
                                        <h6 className="fw-bold text-secondary-emphasis small mb-0">Total Compiled Transactions</h6>
                                    </div>
                                    <div className="icon-box bg-warning-subtle text-warning-emphasis shadow-inner">📜</div>
                                </div>
                                <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center mt-4" style={{ fontSize: '0.75rem' }}>
                                    <span className="text-muted">Immutable allocations sequence blocks</span>
                                    <span className="badge bg-warning-subtle text-warning-emphasis fw-bold font-monospace border border-warning-subtle">Audited Pool</span>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </div>

            {/* Custom Embedded Design Accents */}
            <style>{`
                .fw-extrabold { font-weight: 800; }
                .tracking-wider { letter-spacing: 0.05em; }
                .tracking-tight { letter-spacing: -0.025em; }
                .dashboard-premium-card {
                    border-radius: 20px;
                    transition: all 0.2s ease-in-out;
                    border: 1px solid rgba(0,0,0,0.01) !important;
                }
                .dashboard-premium-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.06) !important;
                }
                .icon-box {
                    width: 50px;
                    height: 50px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                }
                .live-dot {
                    width: 8px;
                    height: 8px;
                    background-color: #22c55e;
                    border-radius: 50%;
                    display: inline-block;
                    animation: pulse-glow 2s infinite;
                }
                @keyframes pulse-glow {
                    0% { transform: scale(0.9); opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); }
                    70% { transform: scale(1); opacity: 0.4; box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
                    100% { transform: scale(0.9); opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }
                .shadow-inner { box-shadow: inset 0 1px 2px rgba(0,0,0,0.02); }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
