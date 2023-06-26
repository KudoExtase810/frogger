import logo from "./assets/FroggerLogo.png";
import { IoMdLock, IoMdMail } from "react-icons/io";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Developer");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            const URL = `${"https://frogger.up.railway.app"}/auth/register`;
            e.preventDefault();
            const res = await axios.post(URL, {
                username,
                email,
                password,
                role,
            });
            if (res.status === 201) {
                toast.success(
                    "Registration successful! You will now be redirected to the login page."
                );
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
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
            <main className="flex flex-col gap-3 z-[2] mb-6">
                <form
                    onSubmit={handleSubmit}
                    className="text-gray-700 flex flex-col gap-5 items-center bg-slate-100 py-10 px-7 rounded-md w-[460px] max-w-[97vw]"
                >
                    <div className="relative w-[90%] bp4:w-full">
                        <FaUser
                            size={22}
                            className="absolute top-[10px] left-[10px]"
                        />
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            id="username"
                            required
                            placeholder="Username"
                            className="outline-none border py-[8px] pl-10 rounded-md w-full hover:border-slate-700 focus:border-slate-700"
                            minLength={6}
                            maxLength={18}
                        />
                    </div>
                    <div className="relative w-[90%] bp4:w-full">
                        <IoMdMail
                            size={22}
                            className="absolute top-[10px] left-[10px]"
                        />
                        <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    <div className="w-[90%] bp4:w-full">
                        <select
                            name="role"
                            id="role"
                            className="py-[8px] pl-2 outline-none border rounded-md"
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="Developer">Developer</option>
                            <option value="Project Manager">
                                Project Manager
                            </option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <button
                        className="text-gray-50 px-5 py-2 border rounded-md bg-green-500 hover:bg-green-400 text-lg hover:border-gray-300"
                        type="submit"
                    >
                        Create account
                    </button>
                </form>
                <div>
                    <Link
                        to="/login"
                        className="hover:text-slate-200 hover:underline bp4:ml-2 w-max"
                    >
                        I already have an account
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default Register;
