import { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import API from '../../api/axiosInstance';

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchMasterLedger = async () => {
        setLoading(true);
        try {
            // 🔥 Hits the newly registered premium administrative analytics block route
            const response = await API.get('/Transactions/admin/all');
            setTransactions(response.data || []);
            setError('');
        } catch (err) {
            console.error("❌ Ledger Execution Interruption:", err.response);
            setError('Failed to fetch the master audit log from the secure database nodes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMasterLedger();
    }, []);

    // 🔍 Real-time memory filter matching client metadata fields perfectly
    const filteredTx = transactions.filter(t =>
        t.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assetName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            <AdminNavbar />

            <div className="container pb-5">
                {/* SYSTEM WORKSPACE HEADER */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                    <div>
                        <h2 className="fw-bold text-dark">📜 Global Master Transactions Ledger</h2>
                        <p className="text-muted small mb-0">Immutable tracking feed of all client asset deployment activities</p>
                    </div>

                    <div className="mt-3 mt-md-0" style={{ width: '100%', maxWidth: '360px' }}>
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-white border-end-0 text-muted">🔍</span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0 fw-medium"
                                placeholder="Search by name, email, or asset..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {error && <div className="alert alert-danger text-center shadow-sm py-2 mb-4">{error}</div>}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : (
                    /* DATAGRID CONTAINER INTERFACE */
                    <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '16px' }}>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-secondary small uppercase fw-bold">
                                    <tr>
                                        <th>Timestamp Node</th>
                                        <th>Investor Identity</th>
                                        <th>Financial Asset</th>
                                        <th className="text-center">Action Operation</th>
                                        <th className="text-end">Volume / Price</th>
                                        <th className="text-end">Gross Transaction Volume</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTx.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center text-muted py-5 small">
                                                No financial data records tracked matching execution constraints.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTx.map((tx) => {
                                            const grossVolume = tx.quantity * tx.priceAtTransaction;
                                            const formattedDate = new Date(tx.transactionDate).toLocaleString('en-IN', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short'
                                            });

                                            return (
                                                <tr key={tx.id}>
                                                    {/* Date string */}
                                                    <td className="small text-secondary font-monospace">{formattedDate}</td>

                                                    {/* User data descriptor slots */}
                                                    <td>
                                                        <span className="fw-bold text-dark d-block mb-0">{tx.username}</span>
                                                        <small className="text-muted font-monospace" style={{ fontSize: '0.72rem' }}>{tx.email}</small>
                                                    </td>

                                                    {/* Asset allocation pointer name */}
                                                    <td><span className="fw-bold text-primary">💼 {tx.assetName}</span></td>

                                                    {/* Operation action enum conversion status pills */}
                                                    <td className="text-center">
                                                        <span className={`badge px-3 py-1 rounded-pill fw-bold uppercase ${
                                                            tx.type === 1 || tx.type === "Buy"
                                                                ? 'bg-success-subtle text-success border border-success-subtle'
                                                                : 'bg-danger-subtle text-danger border border-danger-subtle'
                                                        }`} style={{ fontSize: '0.7rem' }}>
                                                            {tx.type === 1 || tx.type === "Buy" ? '📈 BUY' : '📉 SELL'}
                                                        </span>
                                                    </td>

                                                    {/* Volume breakdowns */}
                                                    <td className="text-end small font-monospace text-dark fw-medium">
                                                        {tx.quantity} units @ ₹{tx.priceAtTransaction.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </td>

                                                    {/* Gross transaction summation */}
                                                    <td className="text-end fw-bold text-dark">
                                                        ₹{grossVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTransactions;
