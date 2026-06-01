import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../api/userApi';

const Account = () => {
    const { logout } = useAuth();
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
                // 🔥 FIX: Backend Enum mapping -> 1 = Admin, 2 = User text conversion
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
            console.error("Failed to load user profile context:", err);
            setError('Could not process profile management parameters safely.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfileData();
    }, []);

    // 🔧 HANDLER: METADATA & PASSWORD PROFILE UPDATER
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

        // 🔥 FIX: Mapping structural request object directly matching your Backend UserRequestDto properties
        const payload = {
            username: formUsername,
            email: formEmail,
            password: targetedPassword,
            role: profile.role === 'Admin' ? 1 : 2 // 1 = Admin, 2 = User as per your Backend Enum
        };

        try {
            await updateUserProfile(currentUserId, payload);
            setSuccessMessage('Account properties updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');

            await fetchUserProfileData();
        } catch (err) {
            setError('Profile update data properties rejected by authentication server.');
        }
    };

    // 🗑️ 🔥 FAIL-PROOF ACCOUNT DELETION & IMMEDIATE LOGOUT TRIGGER
    const handleAccountSoftDelete = async () => {
        const firstCheck = window.confirm('Bhai, kya aap sach mein apna account system se remove karna chahte hain? Sabhi portfolio bags freeze ho jayenge.');
        if (!firstCheck) return;

        const finalVerification = window.prompt('Confirm karne ke liye apna "USERNAME" capital letters mein type karein:');

        if (finalVerification?.toUpperCase() === profile.username.toUpperCase()) {
            setLoading(true);
            setError('');
            try {
                // 1. Hit soft-delete backend endpoint route
                await deleteUserAccount(currentUserId);

                // 2. Clear token parameters instantly on success response code
                alert('Aapka account successfully soft-delete kar diya gaya hai. Ab aap login nahi kar payenge.');

                localStorage.clear(); // Clear all localStorage items
                logout();             // Context trigger logoff clear data

                // 3. Immediately kick user out to login root gate
                setTimeout(() => {
                    navigate('/login');
                }, 100);

            } catch (err) {
                console.error("Account termination workflow crash:", err);
                setError('Account delete karne mein backend server ne error diya. Console ya permission check karein.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Verification string mismatched! Action canceled safely.');
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

            <div className="container pb-5">
                {error && <div className="alert alert-danger text-center shadow-sm py-2 mb-4">{error}</div>}
                {successMessage && <div className="alert alert-success text-center shadow-sm py-2 mb-4">{successMessage}</div>}

                {/* HEADER ROW */}
                <div className="mb-5">
                    <h2 className="fw-bold text-dark mb-1">⚙️ Account Configuration Terminal</h2>
                    <p className="text-muted small">Manage secure identity profiles, credential structures, and transaction ledger account states.</p>
                </div>

                <div className="row g-4">
                    {/* LEFT PANEL: IDENTITY CARD SUMMARY */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 text-center p-4 bg-white h-100" style={{ borderRadius: '15px' }}>
                            <div className="my-3">
                                <div className="bg-primary text-white mx-auto rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                    {profile.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                            <h4 className="fw-bold text-dark mb-1">{profile.username}</h4>
                            <p className="text-muted small mb-3">{profile.email}</p>

                            <div className="bg-light rounded p-2 mb-4">
                                <small className="text-secondary d-block uppercase tracking-wider fw-bold" style={{ fontSize: '0.7rem' }}>Authorized System Role</small>
                                <span className={`badge mt-1 fs-6 px-3 ${profile.role === 'Admin' ? 'bg-danger' : 'bg-success'}`}>
                                    🛡️ {profile.role}
                                </span>
                            </div>

                            <hr className="text-muted" />

                            <div className="mt-auto pt-3">
                                <p className="text-muted small text-start bg-light-subtle p-2 border rounded">
                                    ⚠️ <strong>Please Note: </strong>You may delete your account at any time. if you wish to reactivate or recover your account in the future, please contact our Support Administration team for assistance.
                                </p>
                                <button className="btn btn-outline-danger btn-sm w-100 fw-bold mt-2 py-2 rounded-3 shadow-sm" onClick={handleAccountSoftDelete}>
                                    🛑 Terminate Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: EDIT PROFILE FORM */}
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '15px' }}>
                            <h5 className="fw-bold text-dark border-bottom pb-2 mb-4">🔧 Identity Parameters Profile Setup</h5>

                            <form onSubmit={handleProfileUpdateSubmit}>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-secondary">Username Handler</label>
                                        <input type="text" className="form-control" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-secondary">Registered Email Index</label>
                                        <input type="email" className="form-control" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
                                    </div>
                                </div>

                                <h5 className="fw-bold text-dark border-bottom pb-2 mt-4 mb-4 text-primary">🔒 Credentials Update Authorization</h5>

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
                                        💾 Save Account Details
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

export default Account;
