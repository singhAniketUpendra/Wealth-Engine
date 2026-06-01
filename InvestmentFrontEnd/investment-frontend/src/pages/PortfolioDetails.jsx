import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllAssets } from '../api/assetApi';
import { getPortfolioSummary } from '../api/portfolioApi';
import { executeTransaction, getPortfolioTransactionHistory } from '../api/transactionApi';

const PortfolioDetails = () => {
    const { id } = useParams();
    const portfolioId = parseInt(id);
    const navigate = useNavigate();

    // Core States
    const [summary, setSummary] = useState(null);
    const [globalAssets, setGlobalAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 🔥 PORTFOLIO HISTORY STATES
    const [portfolioHistory, setPortfolioHistory] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    // Modal Input States
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [tradeType, setTradeType] = useState(1); // 1 = Buy, 2 = Sell
    const [tradeAssetId, setTradeAssetId] = useState('');
    const [tradeQuantity, setTradeQuantity] = useState('');
    const [tradePrice, setTradePrice] = useState('');

    const fetchPortfolioDetails = async () => {
        setLoading(true);
        setError('');
        try {
            const marketAssets = await getAllAssets();
            setGlobalAssets(marketAssets || []);

            const data = await getPortfolioSummary(portfolioId);

            setSummary({
                portfolioId: portfolioId,
                portfolioName: data.portfolioName || data.PortfolioName || "Investment Portfolio Bag",
                description: data.description || data.Description || "",
                totalInvested: data.totalInvested !== undefined ? data.totalInvested : data.TotalInvested || 0,
                currentValue: data.currentValue !== undefined ? data.currentValue : data.CurrentValue || 0,
                totalProfitLoss: data.totalProfitLoss !== undefined ? data.totalProfitLoss : data.TotalProfitLoss || 0,
                profitLossPercentage: data.profitLossPercentage !== undefined ? data.profitLossPercentage : data.ProfitLossPercentage || 0,
                portfolioRiskScore: data.portfolioRiskScore !== undefined ? data.portfolioRiskScore : data.PortfolioRiskScore || 0,
                riskLevel: data.riskLevel !== undefined ? data.riskLevel : data.RiskLevel || 1,
                assetBreakdown: (data.assetBreakdown || data.AssetBreakdown || []).map(asset => ({
                    assetId: asset.assetId !== undefined ? asset.assetId : asset.AssetId,
                    assetName: asset.assetName !== undefined ? asset.assetName : asset.AssetName,
                    tickerSymbol: asset.tickerSymbol !== undefined ? asset.tickerSymbol : asset.TickerSymbol,
                    netQuantity: asset.netQuantity !== undefined ? asset.netQuantity : asset.NetQuantity,
                    avgBuyPrice: asset.avgBuyPrice !== undefined ? asset.avgBuyPrice : asset.AvgBuyPrice,
                    totalInvested: asset.totalInvested !== undefined ? asset.totalInvested : asset.TotalInvested || 0,
                    currentValue: asset.currentValue !== undefined ? asset.currentValue : asset.CurrentValue || 0,
                    profitLoss: asset.profitLoss !== undefined ? asset.profitLoss : asset.ProfitLoss || 0,
                    profitLossPercentage: asset.profitLossPercentage !== undefined ? asset.profitLossPercentage : asset.ProfitLossPercentage || 0
                }))
            });
        } catch (err) {
            console.error("Deep dive single view profile load crash:", err);
            setSummary({
                portfolioId: portfolioId,
                portfolioName: "Active Bag Context",
                description: "Live system calculation ledger",
                totalInvested: 0,
                currentValue: 0,
                totalProfitLoss: 0,
                profitLossPercentage: 0,
                portfolioRiskScore: 0,
                riskLevel: 1,
                assetBreakdown: []
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (portfolioId) {
            fetchPortfolioDetails();
        }
    }, [portfolioId]);

    // 🔥 FETCH PORTFOLIO LOG HISTORY OPENER
    const openPortfolioHistoryWindow = async () => {
        setError('');
        try {
            const data = await getPortfolioTransactionHistory(portfolioId);
            setPortfolioHistory(data || []);
            setShowHistoryModal(true);
        } catch (err) {
            setError('Failed to fetch specific pipeline transaction logs.');
        }
    };

    const openTradeWindow = (typeSelection, fallbackAssetId = '') => {
        setTradeType(typeSelection);
        setTradeQuantity('');

        const initialAssetId = fallbackAssetId || (globalAssets.length > 0 ? (globalAssets[0].id || globalAssets[0].Id) : '');
        setTradeAssetId(initialAssetId);

        if (globalAssets.length > 0 && initialAssetId) {
            const defaultAsset = globalAssets.find(a => (a.id || a.Id) === parseInt(initialAssetId));
            setTradePrice(defaultAsset ? (defaultAsset.currentPrice || defaultAsset.CurrentPrice || '') : '');
        }
        setShowTradeModal(true);
    };

    const handleAssetChangeSyncPrice = (id) => {
        setTradeAssetId(id);
        const matchAsset = globalAssets.find(a => (a.id || a.Id) === parseInt(id));
        if (matchAsset) {
            setTradePrice(matchAsset.currentPrice || matchAsset.CurrentPrice || 0);
        }
    };

    const handleExecuteTransactionSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const payload = {
            portfolioId: portfolioId,
            assetId: parseInt(tradeAssetId),
            type: parseInt(tradeType),
            quantity: parseFloat(tradeQuantity),
            priceAtTransaction: parseFloat(tradePrice)
        };

        try {
            await executeTransaction(payload);
            setShowTradeModal(false);
            await fetchPortfolioDetails();
        } catch (err) {
            setError('Order routing execution failed.');
            setShowTradeModal(false);
        }
    };

    const getRiskBadge = (level) => {
        switch(level) {
            case 1: return <span className="badge bg-success fs-6">Conservative (Low)</span>;
            case 2: return <span className="badge bg-primary fs-6">Balanced (Medium)</span>;
            case 3: return <span className="badge bg-warning text-dark fs-6">Aggressive (High)</span>;
            case 4: return <span className="badge bg-danger fs-6">Speculative (Very High)</span>;
            default: return <span className="badge bg-secondary fs-6">Calculated Volatility</span>;
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            <Navbar />

            <div className="container pb-5 pt-3">
                <button className="btn btn-outline-secondary btn-sm mb-4 fw-semibold shadow-sm" onClick={() => navigate('/dashboard')}>
                    ← Back to Global Dashboard
                </button>

                {error && <div className="alert alert-danger text-center shadow-sm py-2 mb-4">{error}</div>}

                {summary && (
                    <div className="card shadow border-0 p-4 bg-white" style={{ borderRadius: '16px', borderTop: '5px solid #0d6efd' }}>

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-4">
                            <div>
                                <span className="badge bg-primary text-white text-uppercase tracking-wider px-2 py-1 small mb-2 d-inline-block">Dedicated Portfolio Workspace</span>
                                <h2 className="fw-bold text-dark">{summary.portfolioName}</h2>
                                <p className="text-muted small mb-0"><strong>Strategy focus overview:</strong> {summary.description || 'No strategic focus targeted.'}</p>
                            </div>

                            {/* CONTROL ACTIONS PANEL */}
                            <div className="d-flex gap-2 mt-3 mt-md-0 align-items-center">
                                {/* 🔥 Fresh History Viewer Trigger button inserted neatly */}
                                <button className="btn btn-outline-dark fw-bold px-3 shadow-sm d-flex align-items-center gap-1" onClick={openPortfolioHistoryWindow}>
                                    📜 View History
                                </button>
                                <button className="btn btn-success fw-bold px-4 shadow-sm" onClick={() => openTradeWindow(1)}>
                                    💵 Buy Asset
                                </button>
                                <button className="btn btn-danger fw-bold px-4 shadow-sm" onClick={() => openTradeWindow(2)}>
                                    📉 Sell Asset
                                </button>
                            </div>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <div className="bg-light rounded p-3 text-center">
                                    <small className="text-secondary fw-bold text-uppercase block mb-1">Portfolio Placed Cost</small>
                                    <h4 className="fw-bold text-dark mb-0">₹{summary.totalInvested.toLocaleString('en-IN')}</h4>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="bg-light rounded p-3 text-center">
                                    <small className="text-secondary fw-bold text-uppercase block mb-1">Current Appraisal Value</small>
                                    <h4 className="fw-bold text-primary mb-0">₹{summary.currentValue.toLocaleString('en-IN')}</h4>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="bg-light rounded p-3 text-center">
                                    <small className="text-secondary fw-bold text-uppercase block mb-1">Net Fund P&L Yield</small>
                                    <h4 className={`fw-bold mb-0 ${summary.totalProfitLoss >= 0 ? 'text-success' : 'text-danger'}`}>
                                        {summary.totalProfitLoss >= 0 ? '+' : ''}₹{summary.totalProfitLoss.toLocaleString('en-IN')}
                                    </h4>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="bg-light rounded p-3 text-center">
                                    <small className="text-secondary fw-bold text-uppercase block mb-1">ROI Speed Score</small>
                                    <h4 className={`fw-bold mb-0 ${summary.profitLossPercentage >= 0 ? 'text-success' : 'text-danger'}`}>
                                        {summary.profitLossPercentage >= 0 ? '▲' : '▼'} {summary.profitLossPercentage}%
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className="bg-light rounded p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                            <div>
                                <h6 className="fw-bold text-dark mb-0">Holdings Risk Distribution Index</h6>
                                <p className="text-muted mb-0 small">Automated dynamic stratification class value weighted metrics index.</p>
                            </div>
                            <div className="mt-2 mt-md-0 fw-bold fs-5">
                                <span className="text-secondary me-3">Weight Vector: <strong className="text-dark">{summary.portfolioRiskScore} / 10</strong></span>
                                {getRiskBadge(summary.riskLevel)}
                            </div>
                        </div>

                        <h5 className="fw-bold text-dark mb-3">Individual Securities Breakdown Ledger</h5>
                        <div className="table-responsive">
                            <table className="table table-striped align-middle table-sm mb-0">
                                <thead className="table-dark small text-uppercase">
                                    <tr>
                                        <th>Asset Class Entity Name</th>
                                        <th className="text-end">Holdings Qty</th>
                                        <th className="text-end">Avg Purchase Cost</th>
                                        <th className="text-end">Total Capital Placed</th>
                                        <th className="text-end">Current Value appraisal</th>
                                        <th className="text-end px-3">Yield Profit/Loss</th>
                                        <th className="text-center">Quick Trade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summary.assetBreakdown.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted py-4 small">
                                                No active assets inside this folder context yet. Trigger order execution buttons to add stock tokens.
                                            </td>
                                        </tr>
                                    ) : (
                                        summary.assetBreakdown.map((asset) => (
                                            <tr key={asset.assetId}>
                                                <td>
                                                    <span className="fw-bold text-dark">{asset.assetName}</span>
                                                    <span className="badge bg-secondary ms-2 small">{asset.tickerSymbol}</span>
                                                </td>
                                                <td className="text-end fw-semibold text-dark">{asset.netQuantity}</td>
                                                <td className="text-end text-muted">₹{asset.avgBuyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                                <td className="text-end fw-medium text-dark">₹{asset.totalInvested.toLocaleString('en-IN')}</td>
                                                <td className="text-end text-primary fw-medium">₹{asset.currentValue.toLocaleString('en-IN')}</td>
                                                <td className={`text-end fw-bold px-3 ${asset.profitLoss >= 0 ? 'text-success' : 'text-danger'}`}>
                                                    {asset.profitLoss >= 0 ? '+' : ''}₹{asset.profitLoss.toLocaleString('en-IN')}
                                                    <span className="d-block small fw-normal">({asset.profitLossPercentage}%)</span>
                                                </td>
                                                <td className="text-center">
                                                    <button className="btn btn-sm btn-outline-danger fw-bold px-2 py-0 small" onClick={() => openTradeWindow(2, asset.assetId)}>
                                                        Sell
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* 🔥 NEW MODAL: PORTFOLIO HISTORICAL TRANSACTIONS SHEET */}
            {showHistoryModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                            <div className="modal-header bg-dark text-white" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                <h5 className="modal-title fw-bold">📜 {summary?.portfolioName} - Order Ledger</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowHistoryModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="table-responsive">
                                    <table className="table table-hover table-sm align-middle mb-0">
                                        <thead className="table-light small text-uppercase text-secondary">
                                            <tr>
                                                <th>Ref Code</th>
                                                <th>Asset</th>
                                                <th className="text-center">Action</th>
                                                <th className="text-end">Units Qty</th>
                                                <th className="text-end">Price Paid</th>
                                                <th className="text-end">Total Capital</th>
                                                <th className="text-center">Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {portfolioHistory.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center text-muted py-4 small">
                                                        Bhai, is specific bag mein abhi tak koi buy/sell transactions records logged nahi hain.
                                                    </td>
                                                </tr>
                                            ) : (
                                                portfolioHistory.map((trx) => (
                                                    <tr key={trx.id}>
                                                        <td className="fw-semibold text-muted">#TX-{trx.id}</td>
                                                        <td className="fw-bold text-dark">{trx.assetName || "Market Security"}</td>
                                                        <td className="text-center">
                                                            {trx.type === 1 ? (
                                                                <span className="badge bg-success-subtle text-success fw-bold px-2 py-1">BUY</span>
                                                            ) : (
                                                                <span className="badge bg-danger-subtle text-danger fw-bold px-2 py-1">SELL</span>
                                                            )}
                                                        </td>
                                                        <td className="text-end fw-medium">{parseFloat(trx.quantity).toLocaleString()}</td>
                                                        <td className="text-end text-muted">₹{parseFloat(trx.priceAtTransaction).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                                        <td className="text-end fw-bold text-primary">₹{((trx.quantity || 0) * (trx.priceAtTransaction || 0)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                                        <td className="text-center small text-secondary">
                                                            {new Date(trx.transactionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                            <span className="d-block text-muted" style={{ fontSize: '0.65rem' }}>
                                                                {new Date(trx.transactionDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer bg-light">
                                <button type="button" className="btn btn-secondary fw-semibold px-4" onClick={() => setShowHistoryModal(false)}>Close Ledger</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TRADE TRANSACTION MODAL */}
            {showTradeModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                            <div className={`modal-header text-white ${tradeType === 1 ? 'bg-success' : 'bg-danger'}`} style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                <h5 className="modal-title fw-bold">
                                    {tradeType === 1 ? '💵 Execute Buy Order Entry' : '📉 Execute Sell Liquidation Order'}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowTradeModal(false)}></button>
                            </div>
                            <form onSubmit={handleExecuteTransactionSubmit}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Select Target Market Asset Class Ticker</label>
                                        <select className="form-select fw-semibold" value={tradeAssetId} onChange={(e) => handleAssetChangeSyncPrice(e.target.value)} required>
                                            {globalAssets.map(asset => {
                                                const aId = asset.id !== undefined ? asset.id : asset.Id;
                                                const aName = asset.assetName !== undefined ? asset.assetName : asset.AssetName;
                                                const aSymbol = asset.tickerSymbol !== undefined ? asset.tickerSymbol : asset.TickerSymbol;
                                                return <option key={aId} value={aId}>{aSymbol} - {aName}</option>;
                                            })}
                                        </select>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-secondary">Order Units Quantity</label>
                                            <input type="number" step="0.0001" className="form-control" placeholder="0.00" value={tradeQuantity} onChange={(e) => setTradeQuantity(e.target.value)} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-secondary">Price per Unit (INR)</label>
                                            <input type="number" step="0.01" className="form-control" placeholder="0.00" value={tradePrice} onChange={(e) => setTradePrice(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="bg-light rounded p-3 border text-center small text-muted">
                                        Order Summary Value: <strong className="text-dark">₹{((parseFloat(tradeQuantity) || 0) * (parseFloat(tradePrice) || 0)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">
                                    <button type="button" className="btn btn-secondary fw-semibold" onClick={() => setShowTradeModal(false)}>Cancel Order</button>
                                    <button type="submit" className={`btn fw-bold px-4 ${tradeType === 1 ? 'btn-success' : 'btn-danger'}`}>
                                        {tradeType === 1 ? 'Confirm Purchase' : 'Liquidate Positions'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioDetails;
