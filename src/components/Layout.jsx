import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#0E1621] text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-4 pt-20 bg-[#0E1621] min-h-screen">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
