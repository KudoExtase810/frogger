import { MdAdminPanelSettings, MdSpaceDashboard } from "react-icons/md";
import { ImTicket } from "react-icons/im";
import { BsFillSunFill, BsFillMoonStarsFill } from "react-icons/bs";
import { GoSignOut } from "react-icons/go";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
function Navbar() {
    const [isHovered, setIsHovered] = useState(false);
    const [useDarkMode, setUseDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    const navigate = useNavigate();
    const location = useLocation();

    const { isAdmin } = useAuth();

    useEffect(() => {
        if (useDarkMode) localStorage.setItem("theme", "dark");
        else localStorage.setItem("theme", "light");

        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            document.body.classList.remove("bg-sky-300");
            document.body.classList.add("dark", "bg-sky-900");
        } else {
            document.body.classList.remove("dark", "bg-sky-900");
            document.body.classList.add("bg-sky-300");
        }
    }, [useDarkMode]);

    return (
        <nav
            onMouseLeave={() => setIsHovered(false)}
            onMouseOver={() => setIsHovered(true)}
            className="fixed h-screen w-[80px] bg-zinc-400 dark:bg-zinc-800 transition-[width] !duration-500 ease-in hover:w-56 font-medium font-rubik text-lg left-0 top-0 z-10 bp3:bottom-0 bp3:left-auto bp3:top-auto bp3:h-[80px] bp3:w-screen bp3:hover:w-screen"
        >
            <ul className="h-full flex flex-col items-center p-0 m-0 bp3:flex-row bp3:justify-around">
                <li
                    className={`w-full ${
                        location.pathname === "/dashboard"
                            ? "text-purple-500"
                            : "text-zinc-700 dark:text-zinc-400"
                    } hover:text-purple-500 dark:hover:text-purple-500 hover:bg-zinc-600 hover:dark:bg-zinc-900 bp3:w-max`}
                >
                    <Link
                        to="/dashboard"
                        className="flex items-center h-[80px] !duration-[600ms]"
                    >
                        <MdSpaceDashboard
                            size={52}
                            className="min-w-[62px] mx-2"
                        />
                        <span
                            className={`${
                                !isHovered && "invisible !opacity-0"
                            } block w-[50px] ml-4 opacity-100 transition-opacity !duration-[2s] bp3:hidden`}
                        >
                            Dashboard
                        </span>
                    </Link>
                </li>
                <li
                    className={`w-full ${
                        location.pathname === "/tickets"
                            ? "text-purple-500"
                            : "text-zinc-700 dark:text-zinc-400"
                    } hover:text-purple-500 dark:hover:text-purple-500 hover:bg-zinc-600 hover:dark:bg-zinc-900 bp3:w-max`}
                >
                    <Link
                        to="/tickets"
                        className="flex items-center h-[80px] !duration-[600ms]"
                    >
                        <ImTicket size={52} className="min-w-[62px] mx-2" />
                        <span
                            className={`${
                                !isHovered && "invisible !opacity-0"
                            } block w-[50px] ml-4 opacity-100 transition-opacity !duration-[2s] bp3:hidden`}
                        >
                            Tickets
                        </span>
                    </Link>
                </li>
                <li
                    hidden={!isAdmin}
                    className={`w-full ${
                        location.pathname === "/administration"
                            ? "text-purple-500"
                            : "text-zinc-700 dark:text-zinc-400"
                    } hover:text-purple-500 dark:hover:text-purple-500 hover:bg-zinc-600 hover:dark:bg-zinc-900 bp3:w-max`}
                >
                    <Link
                        to="/administration"
                        className="flex items-center h-[80px] !duration-[600ms] "
                    >
                        <MdAdminPanelSettings
                            size={62}
                            className="min-w-[62px] mx-2"
                        />
                        <span
                            className={`${
                                !isHovered && "invisible !opacity-0"
                            } block w-[50px] ml-4 opacity-100 transition-opacity !duration-[2s] bp3:hidden`}
                        >
                            Admin
                        </span>
                    </Link>
                </li>
                <li
                    className="w-full text-zinc-700 dark:text-zinc-400 hover:text-purple-500 dark:hover:text-purple-500 hover:bg-zinc-600 hover:dark:bg-zinc-900 cursor-pointer bp3:w-max"
                    onClick={() => document.getElementById("logout")?.click()}
                >
                    <button
                        id="logout"
                        className="flex items-center h-[80px] !duration-[600ms] max-w-[80px]"
                        onClick={() => {
                            localStorage.removeItem("JWToken");
                            sessionStorage.removeItem("JWToken");
                            navigate("/login");
                        }}
                    >
                        <GoSignOut size={52} className="min-w-[62px] mx-2" />
                        <span
                            className={`${
                                !isHovered && "invisible !opacity-0"
                            } block w-[50px] ml-4 opacity-100 transition-opacity !duration-[2s] bp3:hidden`}
                        >
                            Logout
                        </span>
                    </button>
                </li>
                <li
                    className="mt-auto w-full text-zinc-700 dark:text-zinc-400 hover:text-purple-500 dark:hover:text-purple-500 hover:bg-zinc-600 hover:dark:bg-zinc-900 cursor-pointer bp3:w-max"
                    onClick={() => document.getElementById("theme")?.click()}
                >
                    <button
                        id="theme"
                        className="flex items-center h-[80px] !duration-[600ms] max-w-[80px]"
                        onClick={() => setUseDarkMode(!useDarkMode)}
                    >
                        {useDarkMode ? (
                            <BsFillMoonStarsFill
                                color="#FEFCD7"
                                size={52}
                                className="min-w-[62px] mx-2"
                            />
                        ) : (
                            <BsFillSunFill
                                color="#F9D71C"
                                size={52}
                                className="min-w-[62px] mx-2"
                            />
                        )}
                        <span
                            className={`${
                                !isHovered && "invisible !opacity-0"
                            } block w-[50px] ml-4 opacity-100 transition-opacity !duration-[2s] bp3:hidden`}
                        >
                            Theme
                        </span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
