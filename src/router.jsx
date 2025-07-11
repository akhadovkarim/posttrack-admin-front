import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import LeadRequests from "./pages/LeadRequests.jsx";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Users />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/payments"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Payments />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/expenses"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Expenses />
                            </Layout>
                        </PrivateRoute>
                    }
                />


                <Route
                    path="/lead-requests"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <LeadRequests />
                            </Layout>
                        </PrivateRoute>
                    }
                />

            </Routes>

        </Router>
    );
}
