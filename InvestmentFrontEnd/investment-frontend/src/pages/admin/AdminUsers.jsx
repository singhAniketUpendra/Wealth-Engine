import { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import API from '../../api/axiosInstance';

const AdminUsers = () => {
    // Core Data States
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // 🔥 NEW FILTER STATE: 0 = All, 1 = Admins Only, 2 = Investors Only
    const [roleFilter, setRoleFilter] = useState(0);

    // Update Form Modal States
    const [showModal, setShowModal] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(2); // 1 = Admin, 2 = User based on backend domain enums

    // 1. Fetch All Registered Users (GET /api/Users)
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await API.get('/Users');
            setUsers(response.data || []);
            setError('');
        } catch (err) {
            console.error("🔒 Security Terminal Audit:", err.response);
            const statusCode = err.response?.status;
            if (statusCode === 401) {
                setError('Security Alert: Authentication Token Missing or Expired (401).');
            } else if (statusCode === 403) {
                setError('Access Denied: Current Admin Identity lacks Authorization Claims (403).');
            } else {
                setError(err.response?.data?.message || 'Failed to fetch system users ledger from the server.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Open Modal with Pre-filled Metadata for Update Execution
    const openEditModal = (userInstance) => {
        setCurrentUserId(userInstance.id);
        setUsername(userInstance.username);
        setEmail(userInstance.email);

        // Handling both string and numeric roles coming from backend response
        if (userInstance.role === 'Admin' || userInstance.role === 1 || userInstance.role === '1') {
            setRole(1);
        } else {
            setRole(2);
        }
        setShowModal(true);
    };

    // 3. Form Submission for Profile Updates (PUT /api/Users/{id})
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            id: parseInt(currentUserId),
            username: username.trim(),
            email: email.trim(),
            role: parseInt(role)
        };

        try {
            setError('');
            await API.put(`/Users/${currentUserId}`, payload);
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            console.error("❌ PUT Validation Terminal Exception:", err.response?.data);

            let detailedError = '';
            if (err.response?.data?.errors) {
                const validationErrors = err.response.data.errors;
                detailedError = Object.values(validationErrors).flat().join(' | ');
            } else if (err.response?.data?.message) {
                detailedError = err.response.data.message;
            } else if (typeof err.response?.data === 'string') {
                detailedError = err.response.data;
            }

            setError(detailedError || 'Profile update rejected. Check data validation constraints.');
        }
    };

    // 4. Handler for User Hard Deletion (DELETE /api/Users/{id})
    const handleDeleteUser = async (id, targetName) => {
        if (window.confirm(`Bhai, kya aap sach mein ${targetName} ka account permanently delete karna chahte hain?`)) {
            try {
                await API.delete(`/Users/${id}`);
                fetchUsers();
            } catch (err) {
                setError('Failed to execute account eviction sequence.');
            }
        }
    };

    // 🔍 MULTI-MATRIX FILTER ENGINE (Combines Dropdown Role filtering and Search text checks)
    const filteredUsers = users.filter(u => {
        // A. Filter by Dropdown Selection
        const isModelAdmin = u.role === 'Admin' || u.role === 1 || u.role === '1';

        if (parseInt(roleFilter) === 1 && !isModelAdmin) return false; // Want Admins, but user is Investor
        if (parseInt(roleFilter) === 2 && isModelAdmin) return false;  // Want Investors, but user is Admin

        // B. Filter by Search Query
        const matchesSearch =
            u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            <AdminNavbar />

            <div className="container pb-5">
                {/* PAGE HEADER SECTOR */}
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 gap-3">
                    <div>
                        <h2 className="fw-bold text-dark">👥 Manage Users Terminal</h2>
                        <p className="text-muted small mb-0">System-wide directory of all authenticated investor profiles</p>
                    </div>

                    {/* 🔥 INTEGRATED FILTER & SEARCH TOOLBAR ROW */}
                    <div className="d-flex flex-column flex-sm-row gap-2" style={{ width: '100%', maxWidth: '600px' }}>

                        {/* Dropdown Identity Filter Selector */}
                        <div style={{ minWidth: '160px' }}>
                            <select
                                className="form-select shadow-sm fw-semibold text-secondary"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value={0}>👥 All Profiles</option>
                                <option value={2}>💵 Investors Only</option>
                                <option value={1}>🛡️ Admins Only</option>
                            </select>
                        </div>

                        {/* Search Input Bar Component */}
                        <div className="flex-grow-1">
                            <div className="input-group shadow-sm">
                                <span className="input-group-text bg-white border-end-0 text-muted">🔍</span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0 fw-medium"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {error && <div className="alert alert-danger shadow-sm text-center py-2 mb-4">{error}</div>}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : (
                    /* CENTRAL USERS DATA LEDGER */
                    <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '16px' }}>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-secondary small uppercase fw-bold">
                                    <tr>
                                        <th>User Identification Profile</th>
                                        <th>Registered Email</th>
                                        <th className="text-center">Authorized Privilege Level</th>
                                        <th className="text-center">Control Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted py-5 small">
                                                No registered system identities found matching active filter criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((item) => {
                                            const isUserAdmin = item.role === 'Admin' || item.role === 1 || item.role === '1';
                                            return (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="avatar-mock rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center"
                                                                 style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>
                                                                {item.username ? item.username.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                            <div>
                                                                <span className="fw-bold text-dark d-block mb-0">{item.username}</span>
                                                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>UID Node: {item.id}</small>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span className="text-secondary font-monospace small">{item.email}</span>
                                                    </td>

                                                    <td className="text-center">
                                                        <span className={`badge px-3 py-1 rounded-pill fw-bold uppercase ${
                                                            isUserAdmin
                                                                ? 'bg-danger-subtle text-danger border border-danger-subtle'
                                                                : 'bg-primary-subtle text-primary border border-primary-subtle'
                                                        }`} style={{ fontSize: '0.72rem' }}>
                                                            {isUserAdmin ? '🛡️ Admin' : '💵 Investor'}
                                                        </span>
                                                    </td>

                                                    <td className="text-center">
                                                        <button
                                                            className="btn btn-outline-primary btn-sm me-2 fw-bold px-3 rounded-2"
                                                            onClick={() => openEditModal(item)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm fw-bold px-3 rounded-2"
                                                            onClick={() => handleDeleteUser(item.id, item.username)}
                                                        >
                                                            Evict
                                                        </button>
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

            {/* DYNAMIC METADATA EDIT MODAL ENGINE */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                            <div className="modal-header bg-dark text-white" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                <h5 className="modal-title fw-bold">🔧 Modify Identity Parameters</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Profile Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control fw-medium"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Communication Email</label>
                                        <input
                                            type="email"
                                            className="form-control fw-medium"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Privilege Security Group</label>
                                        <select
                                            className="form-select fw-semibold"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value={2}>💵 Investor / Standard Account</option>
                                            <option value={1}>🛡️ Administrative System Controller</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light px-4">
                                    <button type="button" className="btn btn-secondary fw-semibold px-3" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary fw-bold px-4">Save Identity Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
