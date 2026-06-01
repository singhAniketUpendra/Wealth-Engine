import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets'; // 🔥 Teri main pages folder wali file
import PortfolioDetails from './pages/PortfolioDetails';
import Transactions from './pages/Transactions';
import Account from './pages/Account';
import About from './pages/About';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminAbout from './pages/admin/AdminAbout';
import AdminAccount from './pages/admin/AdminAccount';

// Standard User route guard
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;

    // Strict separation: regular user routes block admins from blending in
    if (user && (user.role === 'Admin' || user.role === '1' || user.role === 1)) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return user ? children : <Navigate to="/login" replace />;
};

// Dedicated Admin Authorization Guard
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;

    const isAdmin = user && (user.role === 'Admin' || user.role === '1' || user.role === 1);
    return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* 💵 STANDARD USER SECTION INTERFACES */}
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/portfolio/:id" element={<PrivateRoute><PortfolioDetails /></PrivateRoute>} />
                    <Route path="/assets" element={<PrivateRoute><Assets /></PrivateRoute>} />
                    <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
                    <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
                    <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />

                    {/* 🛡️ SEPARATED ADMIN COMMAND SPACES */}
                    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                    {/* 🔥 EXTRA SAFE ENTRY POINT FOR ADMIN:
                        Points strictly to the main Assets.jsx file inside pages directory */}
                    <Route path="/admin/assets" element={<AdminRoute><Assets /></AdminRoute>} />

                    <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                    <Route path="/admin/transactions" element={<AdminRoute><AdminTransactions /></AdminRoute>} />
                    <Route path="/admin/about" element={<AdminRoute><AdminAbout /></AdminRoute>} />
                    <Route path="/admin/account" element={<AdminRoute><AdminAccount /></AdminRoute>} />

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
