import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Navigation ke liye
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
    getPortfoliosByUser,
    getPortfolioSummary,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
} from '../api/portfolioApi';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); // Router hook initialized
    const currentUserId = parseInt(localStorage.getItem('userId')) || 1;

    // Global Aggregate Boxes Metrics States
    const [metrics, setMetrics] = useState({
        totalPortfoliosCount: 0,
        totalInvestedAmount: 0,
        totalProfitLossAmount: 0,
        combinedGrowthPercentage: 0
    });

    // Lists & General States
    const [portfolioList, setPortfolioList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modals Forms Framework Input States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
    const [formName, setFormName] = useState('');
    const [formDesc, setFormDesc] = useState('');

    // Dynamic Aggregation Engine
    const masterFetchAndCalculate = async () => {
        setLoading(true);
        setError('');
        try {
            const list = await getPortfoliosByUser(currentUserId);
            const verifiedList = list || [];
            setPortfolioList(verifiedList);

            if (verifiedList.length === 0) {
                setMetrics({
                    totalPortfoliosCount: 0,
                    totalInvestedAmount: 0,
                    totalProfitLossAmount: 0,
                    combinedGrowthPercentage: 0
                });
                setLoading(false);
                return;
            }

            let computedTotalInvested = 0;
            let computedTotalCurrentValue = 0;
            let computedTotalProfitLoss = 0;

            for (let item of verifiedList) {
                const pId = item.id !== undefined ? item.id : item.Id;
                try {
                    const summary = await getPortfolioSummary(pId);
                    if (summary) {
                        computedTotalInvested += summary.totalInvested || summary.TotalInvested || 0;
                        computedTotalCurrentValue += summary.currentValue || summary.CurrentValue || 0;
                        computedTotalProfitLoss += summary.totalProfitLoss || summary.TotalProfitLoss || 0;
                    }
                } catch (summaryErr) {
                    console.log(`Calculations empty for ID: ${pId}`);
                }
            }

            let growthRate = 0;
            if (computedTotalInvested > 0) {
                growthRate = ((computedTotalCurrentValue - computedTotalInvested) / computedTotalInvested) * 100;
                growthRate = parseFloat(growthRate.toFixed(2));
            }

            setMetrics({
                totalPortfoliosCount: verifiedList.length,
                totalInvestedAmount: computedTotalInvested,
                totalProfitLossAmount: computedTotalProfitLoss,
                combinedGrowthPercentage: growthRate
            });

        } catch (err) {
            console.error("Master dashboard system chain failure:", err);
            setError('Could not process dashboard index arrays.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        masterFetchAndCalculate();
    }, []);

    const handleCreatePortfolio = async (e) => {
        e.preventDefault();
        try {
            await createPortfolio({
                name: formName,
                description: formDesc,
                userId: currentUserId
            });
            setShowCreateModal(false);
            setFormName('');
            setFormDesc('');
            await masterFetchAndCalculate();
        } catch (err) {
            setError('Failed to deploy portfolio.');
        }
    };

    const openEditMode = (p) => {
        const pId = p.id !== undefined ? p.id : p.Id;
        setSelectedPortfolioId(pId);
        setFormName(p.name || p.Name || '');
        setFormDesc(p.description || p.Description || '');
        setShowEditModal(true);
    };

    const handleUpdatePortfolio = async (e) => {
        e.preventDefault();
        try {
            await updatePortfolio(selectedPortfolioId, {
                name: formName,
                description: formDesc,
                userId: currentUserId
            });
            setShowEditModal(false);
            setFormName('');
            setFormDesc('');
            await masterFetchAndCalculate();
        } catch (err) {
            setError('Update patch rejected by server.');
        }
    };

    const handleDeletePortfolio = async (id) => {
        if (window.confirm('Are you sure to delete portfolio ?')) {
            try {
                await deletePortfolio(id);
                await masterFetchAndCalculate();
            } catch (err) {
                setError('Delete action blocked by server constraints.');
            }
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
    );

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            <Navbar />

            <div className="container pb-5">
                {error && <div className="alert alert-danger text-center py-2 mb-4 shadow-sm">{error}</div>}

                {/* 📊 GLOBAL ACCOUNT METRICS */}
                <div className="row g-4 mb-5 pt-3">
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0 p-3 bg-white h-100">
                            <span className="text-secondary small fw-bold uppercase tracking-wider">Total Portfolio</span>
                            <h2 className="fw-bold mt-2 text-dark">{metrics.totalPortfoliosCount} Bags</h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0 p-3 bg-white h-100">
                            <span className="text-secondary small fw-bold uppercase tracking-wider">Total Investment</span>
                            <h2 className="fw-bold mt-2 text-primary">
                                ₹{metrics.totalInvestedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0 p-3 bg-white h-100">
                            <span className="text-secondary small fw-bold uppercase tracking-wider">Total Profit / Loss</span>
                            <h2 className={`fw-bold mt-2 ${metrics.totalProfitLossAmount >= 0 ? 'text-success' : 'text-danger'}`}>
                                {metrics.totalProfitLossAmount >= 0 ? '+' : ''}₹{metrics.totalProfitLossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0 p-3 bg-white h-100">
                            <span className="text-secondary small fw-bold uppercase tracking-wider">Growth Percent</span>
                            <h2 className={`fw-bold mt-2 ${metrics.combinedGrowthPercentage >= 0 ? 'text-success' : 'text-danger'}`}>
                                {metrics.combinedGrowthPercentage >= 0 ? '▲' : '▼'} {metrics.combinedGrowthPercentage}%
                            </h2>
                        </div>
                    </div>
                </div>

                {/* HEADER LAYOUT */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="fw-bold text-dark mb-1">Your Portfolio Indexes Hub</h4>
                        <p className="text-muted small mb-0">List framework records loaded securely from centralized repository.</p>
                    </div>
                    <button className="btn btn-success fw-bold px-4 shadow-sm" onClick={() => { setFormName(''); setFormDesc(''); setShowCreateModal(true); }}>
                        + Add Portfolio
                    </button>
                </div>

                {/* MASTER PORTFOLIOS TABLE LIST */}
                <div className="card shadow-sm border-0 p-4 bg-white mb-5">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary small uppercase">
                                <tr>
                                    <th>Portfolio Name Pointer</th>
                                    <th>Focus Brief</th>
                                    <th>Initialization Date</th>
                                    <th className="text-end px-4">Action Center Controls</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolioList.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted py-5">
                                            No explicit investments tracked yet inside this user account identity context pool.
                                        </td>
                                    </tr>
                                ) : (
                                    portfolioList.map((p) => {
                                        const pId = p.id !== undefined ? p.id : p.Id;
                                        const pName = p.name !== undefined ? p.name : p.Name;
                                        const pDesc = p.description !== undefined ? p.description : p.Description;
                                        const pDate = p.createdAt !== undefined ? p.createdAt : p.CreatedAt;

                                        return (
                                            <tr key={pId}>
                                                <td>
                                                    <span className="fw-bold text-dark fs-6 d-block">💼 {pName}</span>
                                                    <small className="text-muted">ID: #{pId}</small>
                                                </td>
                                                <td>
                                                    <span className="text-secondary small d-inline-block text-truncate" style={{ maxWidth: '300px' }}>
                                                        {pDesc || 'No context objective provided.'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="text-dark small fw-medium">
                                                        {new Date(pDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <div className="d-inline-flex gap-2">
                                                        <button className="btn btn-outline-primary btn-sm fw-semibold px-3" onClick={() => openEditMode(p)}>
                                                            Update
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm fw-semibold px-3" onClick={() => handleDeletePortfolio(pId)}>
                                                            Delete
                                                        </button>
                                                        <button className="btn btn-primary btn-sm fw-bold px-4 shadow-sm" onClick={() => navigate(`/portfolio/${pId}`)}>
                                                            Show
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL 1: ADD PORTFOLIO */}
            {showCreateModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                            <div className="modal-header bg-success text-white" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                <h5 className="modal-title fw-bold">💼 Create New Portfolio Bag</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)}></button>
                            </div>
                            <form onSubmit={handleCreatePortfolio}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Portfolio Name</label>
                                        <input type="text" className="form-control" placeholder="e.g. My Retirement Plan" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Description</label>
                                        <textarea className="form-control" rows="3" placeholder="Objective focus..." value={formDesc} onChange={(e) => setFormDesc(e.target.value)} required></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">
                                    <button type="button" className="btn btn-secondary fw-semibold" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success fw-bold px-4">Create Portfolio</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: UPDATE PORTFOLIO CONTEXT DETAILS */}
            {showEditModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                            <div className="modal-header bg-dark text-white" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                <h5 className="modal-title fw-bold">🔧 Update Portfolio Context</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <form onSubmit={handleUpdatePortfolio}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Portfolio Name</label>
                                        <input type="text" className="form-control" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Strategy Description</label>
                                        <textarea className="form-control" rows="3" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} required></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">
                                    <button type="button" className="btn btn-secondary fw-semibold" onClick={() => setShowEditModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary fw-bold px-4">Save Configuration</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
