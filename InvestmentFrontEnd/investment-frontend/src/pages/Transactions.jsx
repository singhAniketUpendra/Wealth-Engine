import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getUserTransactionHistory } from '../api/transactionApi'; // 🔥 Safely isolated!

const Transactions = () => {
    const currentUserId = parseInt(localStorage.getItem('userId')) || 1;

    // Core States
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter & Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all'); // 'all', '1' (Buy), '2' (Sell)

    const fetchHistory = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getUserTransactionHistory(currentUserId);
            const verifiedData = data || [];
            setTransactions(verifiedData);
            setFilteredTransactions(verifiedData);
        } catch (err) {
            console.error("Failed to load transaction history arrays:", err);
            setError('Could not process transaction archives ledger securely.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // 🔍 Live Client-Side Filter Engine
    useEffect(() => {
        let result = transactions;

        // 1. Filter by Asset Name Search
        if (searchTerm.trim() !== '') {
            result = result.filter(t =>
                t.assetName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Filter by Enum Type (1 = Buy, 2 = Sell)
        if (typeFilter !== 'all') {
            result = result.filter(t => t.type?.toString() === typeFilter);
        }

        setFilteredTransactions(result);
    }, [searchTerm, typeFilter, transactions]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
    );

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            {/* Purana clean white standard navbar load hoga wrapper layout par */}
            <Navbar />

            <div className="container pb-5">
                {error && <div className="alert alert-danger text-center shadow-sm py-2 mb-4">{error}</div>}

                {/* HEADER SECTION */}
                <div className="mb-4">
                    <h2 className="fw-bold text-dark mb-1">📜 Transaction Ledger Archives</h2>
                    <p className="text-muted small">Complete master tracking index of your execution trades, buys, and liquidations history.</p>
                </div>

                {/* 🔍 SEARCH AND FILTERS CONTROLS BAR */}
                <div className="card shadow-sm border-0 p-3 bg-white mb-4">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-secondary">Search by Asset Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Reliance Industries, Microsoft..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold text-secondary">Filter by Order Action</label>
                            <select
                                className="form-select fw-semibold"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">📁 Show All Action Classes</option>
                                <option value="1">💵 Buy Purchases Only</option>
                                <option value="2">📉 Sell Liquidations Only</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-flex align-items-end h-100 mt-4 mt-md-0">
                            <button className="btn btn-outline-secondary w-100 fw-bold shadow-sm" onClick={() => { setSearchTerm(''); setTypeFilter('all'); }}>
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* 📋 MASTER DATA GRID TABLE CARD */}
                <div className="card shadow-sm border-0 p-4 bg-white">
                    <div className="table-responsive">
                        <table className="table table-striped align-middle mb-0">
                            <thead className="table-dark small text-uppercase">
                                <tr>
                                    <th>Transaction Ref ID</th>
                                    <th>Asset Security</th>
                                    <th className="text-center">Order Action</th>
                                    <th className="text-end">Executed Qty</th>
                                    <th className="text-end">Price Per Unit</th>
                                    <th className="text-end">Total Order Value</th>
                                    <th className="text-center">Timestamp Execution</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted py-5 small">
                                            Bhai, is criteria mein koi matching trades data records nahi mile database ledger mein.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((t) => {
                                        const totalValue = (t.quantity || 0) * (t.priceAtTransaction || 0);
                                        return (
                                            <tr key={t.id}>
                                                <td>
                                                    <span className="text-secondary small fw-bold">#TRX-{t.id}</span>
                                                    <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>Bag Link ID: #{t.portfolioId}</span>
                                                </td>
                                                <td>
                                                    <span className="fw-bold text-dark fs-6">💼 {t.assetName || "Market Security"}</span>
                                                </td>
                                                <td className="text-center">
                                                    {t.type === 1 ? (
                                                        <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 border border-success-subtle uppercase" style={{ fontSize: '0.8rem' }}>
                                                            💵 BUY
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-danger-subtle text-danger fw-bold px-3 py-2 border border-danger-subtle uppercase" style={{ fontSize: '0.8rem' }}>
                                                            📉 SELL
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-end fw-semibold text-dark">
                                                    {parseFloat(t.quantity).toLocaleString()}
                                                </td>
                                                <td className="text-end text-muted">
                                                    ₹{parseFloat(t.priceAtTransaction).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="text-end fw-bold text-primary">
                                                    ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="text-center text-secondary small fw-medium">
                                                    {new Date(t.transactionDate).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                    <span className="d-block text-muted" style={{ fontSize: '0.7rem' }}>
                                                        {new Date(t.transactionDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
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
        </div>
    );
};

export default Transactions;
