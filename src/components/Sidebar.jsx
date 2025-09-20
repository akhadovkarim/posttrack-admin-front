import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const links = [
    { to: "/", label: "Главная" },
    { to: "/users", label: "Пользователи" },
    { to: "/payments", label: "Платежи" },
    { to: "/expenses", label: "Расходы" },
    { to: "/lead-requests", label: "Заявки" },
    { to: "/plans", label: "Тарифы" },
    { to: "/blog", label: "Блог" }

];

const Sidebar = ({ isOpen, closeSidebar }) => {
    const location = useLocation();

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}
            <aside
                className={`fixed md:static top-0 left-0 z-50 h-screen w-64 bg-[#1E293B] border-r border-gray-700 flex flex-col justify-between transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                <div>
                    <div className="flex items-center justify-center h-100 border-b border-gray-700">
                        <img src={logo} alt="PostTrack Logo" className="h-14 mr-2" />
                    </div>
                    <nav className="flex flex-col p-2">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`p-3 rounded text-sm font-medium transition ${
                                    location.pathname === link.to
                                        ? "bg-[#334155] text-white"
                                        : "text-gray-300 hover:bg-[#475569]"
                                }`}
                                onClick={closeSidebar}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="p-4">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold">
                        Выйти
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
