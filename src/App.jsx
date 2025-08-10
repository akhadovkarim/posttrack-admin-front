import AppRouter from "./router";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <AuthProvider>
            <>
                <AppRouter />
                <Toaster
                    position="top-right"
                    gutter={8}
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: "#1f2937",
                            color: "#fff",
                            fontSize: "14px",
                            padding: "12px 16px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        },
                        success: {
                            iconTheme: {
                                primary: "#10b981",
                                secondary: "#fff",
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: "#ef4444",
                                secondary: "#fff",
                            },
                        },
                    }}
                    containerStyle={{
                        top: 60,
                        right: 20,
                    }}
                />
            </>
        </AuthProvider>
    );
}

export default App;
