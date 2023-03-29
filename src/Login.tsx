import logo from "./assets/FroggerLogo.png";
import { IoMdLock, IoMdMail } from "react-icons/io";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaUserTie, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

interface props {
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

function Login({ setToken }: props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showDemoRoles, setShowDemoRoles] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const URL = "https://frogger.up.railway.app/auth/login";
        try {
            const res = await axios.post(URL, {
                email: email.toLowerCase(),
                password,
            });

            if (res.status === 200) {
                if (rememberMe) {
                    localStorage.setItem("JWToken", res.data.token);
                } else {
                    sessionStorage.setItem("JWToken", res.data.token);
                }
                setToken(res.data.token);

                navigate("/dashboard");
            }
        } catch (error: any) {
            toast.error(error?.response.data.msg);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen gap-6 font-medium bg-slate-700">
            <svg
                className="left-0 top-0 absolute"
                width="100%"
                height="100%"
                id="svg"
                viewBox="0 0 1440 690"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <path
                    d="M 0,700 C 0,700 0,350 0,350 C 268,292.5 536,235 776,235 C 1016,235 1228,292.5 1440,350 C 1440,350 1440,700 1440,700 Z"
                    stroke="none"
                    strokeWidth="0"
                    fill="#5a5de8"
                    fillOpacity="1"
                    transform="rotate(-180 720 350)"
                ></path>
            </svg>
            <header className="flex items-center flex-col gap-6  z-[2]">
                <Link to="/">
                    <img
                        src={logo}
                        alt="Frogger-logo"
                        width={160}
                        className="select-none"
                    />
                </Link>
                <h1 className="text-center text-4xl font-extrabold m-3 bp3:text-3xl">
                    Frogger, a bug tracking tool that eats bugs for breakfast.
                </h1>
            </header>
            <main className="flex flex-col gap-3 z-[2] mb-6 ">
                <form
                    onSubmit={handleSubmit}
                    className="text-gray-700 flex flex-col gap-5 items-center bg-slate-100 py-10 px-7 rounded-md w-[460px] relative bp4:w-[98vw] "
                >
                    <div className="relative w-[90%] bp4:w-full">
                        <IoMdMail
                            size={22}
                            className="absolute top-[10px] left-[10px]"
                        />
                        <input
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            required
                            placeholder="Email"
                            className="outline-none border py-[8px] pl-10 rounded-md w-full hover:border-slate-700 focus:border-slate-700"
                            minLength={6}
                            maxLength={48}
                        />
                    </div>
                    <div className="relative w-[90%] bp4:w-full">
                        <IoMdLock
                            size={22}
                            className="absolute top-[10px] left-[10px]"
                        />
                        <input
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Password"
                            className="outline-none border py-[8px] pl-10 rounded-md w-full hover:border-slate-700 focus:border-slate-700"
                            minLength={6}
                            maxLength={32}
                        />
                        {showPassword ? (
                            <BsEyeFill
                                size={22}
                                className="absolute top-[10px] right-[10px] cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                            />
                        ) : (
                            <BsEyeSlashFill
                                size={22}
                                className="absolute top-[10px] right-[10px] cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                            />
                        )}
                    </div>
                    <div className="flex items-center justify-start w-[90%] gap-2 bp4:w-full">
                        <input
                            type="checkbox"
                            name="remember"
                            id="remember"
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="remember">Remember me</label>
                    </div>
                    <div className="flex w-full justify-around">
                        <button
                            className="text-gray-50 px-8 py-2  border rounded-md hover:border-gray-300 bg-green-500 hover:bg-green-400 text-lg"
                            type="submit"
                        >
                            Login
                        </button>
                        <button
                            className="text-gray-50 px-8 py-2  border rounded-md hover:border-gray-300 bg-green-500 hover:bg-green-400 text-lg"
                            type="button"
                            onClick={() => setShowDemoRoles(true)}
                        >
                            Demo
                        </button>
                    </div>
                    <div
                        style={{ display: showDemoRoles ? undefined : "none" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-300 flex gap-4 rounded-md w-full h-full items-center justify-center"
                    >
                        <div
                            className="flex flex-col items-center gap-1 cursor-pointer text-black hover:text-slate-700"
                            onClick={() => {
                                setShowDemoRoles(false);
                                setEmail("AdminDemo@gmail.com");
                                setPassword("demoaccount123");
                            }}
                        >
                            <FaUserTie className="text-[128px] bp5:text-[120px] bp6:text-[112px]" />
                            <span className="text-lg">Admin</span>
                        </div>
                        <div
                            className="flex flex-col items-center gap-1 cursor-pointer text-black hover:text-slate-700"
                            onClick={() => {
                                setShowDemoRoles(false);
                                setEmail("ManagerDemo@gmail.com");
                                setPassword("demoaccount123");
                            }}
                        >
                            <FaUser className="text-[128px] bp5:text-[120px] bp6:text-[112px]" />
                            <span className="text-lg">Manager</span>
                        </div>
                        <div
                            className="flex flex-col items-center gap-1 cursor-pointer text-black hover:text-slate-700"
                            onClick={() => {
                                setShowDemoRoles(false);
                                setEmail("DeveloperDemo@gmail.com");
                                setPassword("demoaccount123");
                            }}
                        >
                            <FaUser className="text-[128px] bp5:text-[120px] bp6:text-[112px]" />
                            <span className="text-lg">Developer</span>
                        </div>
                    </div>
                </form>
                <Link
                    className="text-slate-200 hover:underline bp4:ml-2 w-max"
                    to="/register"
                >
                    Create an account
                </Link>
            </main>
        </div>
    );
}

export default Login;
