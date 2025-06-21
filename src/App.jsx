import AppRouter from "./router";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}

export default App;
