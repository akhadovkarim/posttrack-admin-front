import { FaBars } from "react-icons/fa";

const Header = ({ toggleSidebar }) => (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 h-14 bg-[#1E293B] border-b border-gray-700 md:ml-64">
        <button
            className="md:hidden text-white"
            onClick={toggleSidebar}
        >
            <FaBars size={20} />
        </button>
    </header>
);

export default Header;
