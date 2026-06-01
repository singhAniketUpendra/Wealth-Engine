import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import AdminNavbar from '../components/AdminNavbar'; // 🔥 Imported cleanly for Admin integration
import { useAuth } from '../context/AuthContext';
import { getAllAssets, getAssetsByType, createAsset, updateAsset, deleteAsset } from '../api/assetApi';

const Assets = () => {
    const { user } = useAuth();

    // 🛡️ Airtight Role Verification Standard (Reads Context & Cache safely)
    const userRole = user?.role || localStorage.getItem('role') || 'User';
    const isAdmin = userRole === 'Admin' || userRole === '1' || userRole === 1;

    // Core States
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Form/Modal States for Add/Edit CRUD
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentAssetId, setCurrentAssetId] = useState(null);

    // DTO State Framework
    const [tickerSymbol, setTickerSymbol] = useState('');
    const [assetName, setAssetName] = useState('');
    const [type, setType] = useState(1); // Default 1 = Equity
    const [currentPrice, setCurrentPrice] = useState('');

    const fetchAssets = async () => {
        setLoading(true);
        try {
            let data;
            if (filterType === 'all') {
                data = await getAllAssets(); // Endpoint 1
            } else {
                data = await getAssetsByType(parseInt(filterType)); // Endpoint 3
            }
            setAssets(data || []);
            setError('');
        } catch (err) {
            setError('Failed to load assets from server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, [filterType]);

    // Open Modal for Fresh Creation
    const openAddModal = () => {
        setIsEditMode(false);
        setTickerSymbol('');
        setAssetName('');
        setType(1);
        setCurrentPrice('');
        setShowModal(true);
    };

    // Open Modal with Pre-filled Data for Update
    const openEditModal = (asset) => {
        setIsEditMode(true);
        setCurrentAssetId(asset.id);
        setTickerSymbol(asset.tickerSymbol);
        setAssetName(asset.assetName);
        setType(asset.type);
        setCurrentPrice(asset.currentPrice);
        setShowModal(true);
    };

    // Form Submission for Create & Update (Endpoints 4 & 5)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            tickerSymbol: tickerSymbol.trim().toUpperCase(),
            assetName: assetName.trim(),
            type: parseInt(type),
            currentPrice: parseFloat(currentPrice)
        };

        try {
            if (isEditMode) {
                await updateAsset(currentAssetId, payload); // Endpoint 5
            } else {
                await createAsset(payload); // Endpoint 4
            }
            setShowModal(false);
            fetchAssets(); // Refresh local list state
        } catch (err) {
            setError('Operation failed. Check admin validation parameters.');
        }
    };

    // Handler for Asset Deletion (Endpoint 6)
    const handleDelete = async (id) => {
        if (window.confirm('Bhai sach mein udana hai ye Asset? Portfolio mapping check kar lena!')) {
            try {
                await deleteAsset(id); // Endpoint 6
                fetchAssets();
            } catch (err) {
                setError('Failed to delete asset. It might be linked to structural user portfolios.');
            }
        }
    };

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            {/* 🔄 DYNAMIC NAVBAR SWAPPER ENGINE */}
            {isAdmin ? <AdminNavbar /> : <Navbar />}

            <div className="container pb-5">

                {/* HEAD & CONTROLS */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                    <div>
                        <h2 className="fw-bold text-dark">🏛️ Asset Market Terminal</h2>
                        <p className="text-muted small mb-0">Global financial tickers tracked inside the server database</p>
                    </div>

                    <div className="d-flex gap-2 mt-3 mt-md-0">
                        {/* Dynamic Endpoint 3 Trigger Filter */}
                        <select
                            className="form-select shadow-sm fw-semibold"
                            style={{ width: '190px' }}
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">📁 All Asset Classes</option>
                            <option value="1">📈 Equity / Stocks</option>
                            <option value="2">🪙 Cryptocurrency</option>
                        </select>

                        {/* 🔥 Admin Control Button shifts from Green to Premium Blue if Admin logs in */}
                        {isAdmin && (
                            <button className="btn btn-primary fw-bold shadow-sm px-4" onClick={openAddModal}>
                                + Add New Asset
                            </button>
                        )}
                    </div>
                </div>

                {error && <div className="alert alert-danger shadow-sm text-center py-2">{error}</div>}

                {loading ? (
                    <div className="text-center py-5">
                        <div className={`spinner-border ${isAdmin ? 'text-primary' : 'text-success'}`} role="status"></div>
                    </div>
                ) : (
                    /* MAIN LISTING TABLE */
                    <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '16px' }}>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-secondary small uppercase fw-bold">
                                    <tr>
                                        <th>Asset Name</th>
                                        <th>Ticker Symbol</th>
                                        <th>Classification</th>
                                        <th className="text-end">Current Market Price</th>
                                        {isAdmin && <th className="text-center">Admin Controls</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.length === 0 ? (
                                        <tr>
                                            <td colSpan={isAdmin ? 5 : 4} className="text-center text-muted py-5 small">
                                                No assets matching criteria found in system.
                                            </td>
                                        </tr>
                                    ) : (
                                        assets.map((asset) => (
                                            <tr key={asset.id}>
                                                <td><span className="fw-bold text-dark fs-6">💼 {asset.assetName}</span></td>
                                                <td><span className="badge bg-dark px-2 py-1 tracking-wider">{asset.tickerSymbol}</span></td>
                                                <td>
                                                    <span className={`badge px-2 py-1 ${asset.type === 1 ? 'bg-info-subtle text-info-emphasis border border-info-subtle' : 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'}`}>
                                                        {asset.type === 1 ? '📈 Equity / Stock' : '🪙 Cryptocurrency'}
                                                    </span>
                                                </td>
                                                {/* 🔥 Pricing updates from Green to Admin Blue for absolute context parity */}
                                                <td className={`text-end fw-bold fs-6 ${isAdmin ? 'text-primary' : 'text-success'}`}>
                                                    ₹{asset.currentPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </td>
                                                {isAdmin && (
                                                    <td className="text-center">
                                                        <button className="btn btn-outline-primary btn-sm me-2 fw-bold rounded-2 px-3" onClick={() => openEditModal(asset)}>
                                                            Edit
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm fw-bold rounded-2 px-3" onClick={() => handleDelete(asset.id)}>
                                                            Delete
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* DYNAMIC MODAL ENGINE FOR ADD / EDIT CRUD */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                            <div className="modal-header bg-dark text-white" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                <h5 className="modal-title fw-bold">{isEditMode ? '🔧 Edit Asset Entity' : '➕ List New Financial Asset'}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleFormSubmit}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Asset Name</label>
                                        <input type="text" className="form-control" placeholder="e.g. Apple Inc" value={assetName} onChange={(e) => setAssetName(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Ticker Symbol</label>
                                        <input type="text" className="form-control text-uppercase" placeholder="e.g. AAPL" value={tickerSymbol} onChange={(e) => setTickerSymbol(e.target.value)} required disabled={isEditMode} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Asset Type Class</label>
                                        <select className="form-select fw-semibold" value={type} onChange={(e) => setType(e.target.value)}>
                                            <option value={1}>📈 Equity / Stock</option>
                                            <option value={2}>🪙 Cryptocurrency</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Current Price (INR)</label>
                                        <input type="number" step="0.01" className="form-control" placeholder="0.00" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="modal-footer bg-light px-4">
                                    <button type="button" className="btn btn-secondary fw-semibold px-3" onClick={() => setShowModal(false)}>Cancel</button>
                                    {/* 🔥 Form Submission Button acts matching the layout context color standard */}
                                    <button type="submit" className={`btn fw-bold px-4 ${isAdmin ? 'btn-primary' : 'btn-success'}`}>{isEditMode ? 'Save Changes' : 'Publish Asset'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assets;
