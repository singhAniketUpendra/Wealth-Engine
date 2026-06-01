import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../../api/userApi';

const AdminAccount = () => {
    // 🔥 LIVE REFRESH SYNC INTERFACE: Added updateAuthUser method extraction point
    const { logout, updateAuthUser } = useAuth();
    const navigate = useNavigate();
    const currentUserId = parseInt(localStorage.getItem('userId')) || 1;

    // Profile Data State
    const [profile, setProfile] = useState({
        id: 0,
        username: '',
        email: '',
        role: ''
    });

    // Form Update States
    const [formUsername, setFormUsername] = useState('');
    const [formEmail, setFormEmail] = useState('');

    // Security Verification Password States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Operational Framework States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchUserProfileData = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getUserProfile(currentUserId);
            if (data) {
                let readableRole = 'User';
                if (data.role === 1 || data.role === 'Admin') {
                    readableRole = 'Admin';
                }

                setProfile({
                    id: data.id || currentUserId,
                    username: data.username || '',
                    email: data.email || '',
                    role: readableRole
                });
                setFormUsername(data.username || '');
                setFormEmail(data.email || '');
            }
        } catch (err) {
            console.error("Failed to load admin profile context:", err);
            setError('Could not process admin management parameters safely.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfileData();
    }, []);

    // 🔧 HANDLER: METADATA & PASSWORD PROFILE UPDATER (Patched for Clean DTO)
    const handleProfileUpdateSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        let targetedPassword = currentPassword;

        if (newPassword !== '') {
            if (currentPassword === '') {
                setError('Bhai, password badalne ke liye pehle apna real (current) password daalo!');
                return;
            }
            if (newPassword !== confirmNewPassword) {
                setError('Naya password aur confirm password ek-doosre se match nahi kar rahe hain!');
                return;
            }
            targetedPassword = newPassword;
        }

        const payload = {
            id: currentUserId,
            username: formUsername.trim(),
            email: formEmail.trim(),
            password: targetedPassword || null,
            role: 1
        };

        try {
            await updateUserProfile(currentUserId, payload);
            setSuccessMessage('Administrative account properties updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');

            // 🔥 INSTANT CONTEXT SYNC ENGINE: Aligns global authentication states right now
            if (typeof updateAuthUser === 'function') {
                updateAuthUser({
                    username: formUsername.trim(),
                    email: formEmail.trim()
                });
            }

            await fetchUserProfileData();
        } catch (err) {
            console.error("Profile update rejected:", err.response);
            setError(err.response?.data?.message || 'Profile update data properties rejected by authentication server.');
        }
    };

    // 🗑️ 🔥 ADMINISTRATIVE ACCOUNT RETIREMENT SEQUENCING
    const handleAccountSoftDelete = async () => {
        const firstCheck = window.confirm('🚨 WARNING: Bhai, kya aap sach mein is Admin account ko system se remove karna chahte hain? Pura terminal access instantly revoke ho jayega.');
        if (!firstCheck) return;

        const finalVerification = window.prompt('Confirm karne ke liye apna ADMIN "USERNAME" capital letters mein type karein:');

        if (finalVerification?.toUpperCase() === profile.username.toUpperCase()) {
            setLoading(true);
            setError('');
            try {
                await deleteUserAccount(currentUserId);
                alert('Admin account successfully soft-deleted from server infrastructure.');

                localStorage.clear();
                logout();

                setTimeout(() => {
                    navigate('/login');
                }, 100);

            } catch (err) {
                console.error("Account termination workflow crash:", err);
                setError('Account delete karne mein backend server ne error diya. Permission restrictions verify karein.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Verification identity mismatched! Action canceled safely.');
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            <AdminNavbar />

            <div className="container pb-5">
                {error && <div className="alert alert-danger text-center shadow-sm py-2 mb-4">{error}</div>}
                {successMessage && <div className="alert alert-success text-center shadow-sm py-2 mb-4">{successMessage}</div>}

                {/* HEADER ROW */}
                <div className="mb-5">
                    <h2 className="fw-bold text-dark mb-1">⚙️ Admin Configuration Terminal</h2>
                    <p className="text-muted small">Manage server root identities, master credential structures, and runtime authentication keys.</p>
                </div>

                <div className="row g-4">
                    {/* LEFT PANEL: SYSTEM IDENTITY SUMMARY */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 text-center p-4 bg-white h-100" style={{ borderRadius: '15px' }}>
                            <div className="my-3">
                                <div className="bg-primary text-white mx-auto rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                    {profile.username?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            </div>
                            <h4 className="fw-bold text-dark mb-1">{profile.username}</h4>
                            <p className="text-muted small mb-3">{profile.email}</p>

                            <div className="bg-light rounded p-2 mb-4">
                                <small className="text-secondary d-block uppercase tracking-wider fw-bold" style={{ fontSize: '0.7rem' }}>Authorized System Role</small>
                                <span className="badge mt-1 fs-6 px-3 bg-danger border border-danger-subtle">
                                    🛡️ {profile.role}
                                </span>
                            </div>

                            <hr className="text-muted" />

                            <div className="mt-auto pt-3">
                                <p className="text-muted small text-start bg-danger-subtle text-danger-emphasis p-3 border border-danger-subtle rounded">
                                    🛑 <strong>Critical Point: </strong>Terminating an administrative system controller identity could disrupt underlying ledger audit access. Ensure an alternate master admin exists before proceeding.
                                </p>
                                <button className="btn btn-outline-danger btn-sm w-100 fw-bold mt-2 py-2 rounded-3 shadow-sm" onClick={handleAccountSoftDelete}>
                                    🛑 Terminate Admin Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: EDIT PROFILE FORM */}
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '15px' }}>
                            <h5 className="fw-bold text-dark border-bottom pb-2 mb-4">🔧 Root Identity Parameters Setup</h5>

                            <form onSubmit={handleProfileUpdateSubmit}>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-secondary">Username Handler</label>
                                        <input type="text" className="form-control fw-semibold text-dark" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-secondary">Registered Email Index</label>
                                        <input type="email" className="form-control fw-semibold text-dark" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
                                    </div>
                                </div>

                                <h5 className="fw-bold text-dark border-bottom pb-2 mt-4 mb-4 text-primary">🔒 Root Credentials Security Authentication</h5>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-danger">Real Current Password (Required if changing password)</label>
                                    <input
                                        type="password"
                                        className="form-control border-danger-subtle"
                                        placeholder="••••••••"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Identity chain block authentication verification step requirement point.</small>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-secondary">New Secure Password Target</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Leave blank to keep unchanged"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-secondary">Confirm New Password Entry</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Leave blank to keep unchanged"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="text-end border-top pt-3 mt-4">
                                    <button type="submit" className="btn btn-primary fw-bold px-5 shadow-sm rounded-3 py-2">
                                        💾 Save Admin Details
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAccount;
