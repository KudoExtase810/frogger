import { FcSearch } from "react-icons/fc";
import { useState, useEffect } from "react";
import { getAllUsers } from "../../api/users";
import { BsFillShieldLockFill } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import ClipLoader from "react-spinners/ClipLoader";
import { IoMdClose } from "react-icons/io";

interface props {
    allUsers: user[] | undefined;
    setAllUsers: React.Dispatch<React.SetStateAction<user[] | undefined>>;
    setSelectedUser: React.Dispatch<React.SetStateAction<user | undefined>>;
    filteredUsers: user[] | undefined;
    setFilteredUsers: React.Dispatch<React.SetStateAction<user[] | undefined>>;
}

function Organization({
    allUsers,
    setAllUsers,
    filteredUsers,
    setFilteredUsers,
    setSelectedUser,
}: props) {
    const { username } = useAuth(); //returs current user

    const [showSearchBar, setShowSearchBar] = useState(false); // for small screens

    useEffect(() => {
        try {
            const getData = async () => {
                const res: user[] = await getAllUsers();
                setAllUsers(res);
                setFilteredUsers(res);
            };
            getData();
        } catch (error) {}
    }, []);

    const [parent] = useAutoAnimate();

    if (!filteredUsers)
        return (
            <div className="rounded-lg bg-white mt-32 text-left w-4/5 mx-auto dark:bg-zinc-800 dark:text-slate-50 bp1:w-[92%]">
                <h2 className="text-lg font-bold p-4 border-b border-zinc-400">
                    Organization
                </h2>
                <div className="h-[200px] flex justify-center items-center">
                    <ClipLoader
                        color="rgb(168,85,247)"
                        role="status"
                        speedMultiplier={0.75}
                        size={64}
                    />
                </div>
            </div>
        );

    return (
        <div className="bg-white rounded-lg mt-8 px-4 pb-4 w-4/5 mx-auto dark:bg-zinc-800 dark:text-zinc-50 bp1:w-[92%] ">
            <div className="border-b border-zinc-400 py-4 mb-6 flex justify-between items-center relative bp5:flex-col bp5:gap-3">
                <h2 className="text-lg font-bold ">Organization</h2>
                <input
                    type="search"
                    className={`bg-zinc-200 rounded-3xl pr-3 pl-9 py-1 text-lg bp5:pl-3 ${
                        !showSearchBar && "bp5:hidden"
                    }`}
                    placeholder="Search users"
                    onChange={(e) => {
                        const value = e.target.value.toLowerCase();
                        const filtered = allUsers?.filter((user) =>
                            user.username.toLowerCase().includes(value)
                        );
                        setFilteredUsers(filtered);
                    }}
                />
                <FcSearch
                    size={23}
                    className="absolute right-[225px] bp5:hidden"
                />
                <button
                    className="absolute right-0 hidden bp5:inline"
                    onClick={() => {
                        showSearchBar && setFilteredUsers(allUsers);
                        setShowSearchBar(!showSearchBar);
                    }}
                >
                    {showSearchBar ? (
                        <IoMdClose size={28} className="text-red-500" />
                    ) : (
                        <FcSearch size={28} />
                    )}
                </button>
            </div>
            {filteredUsers.length !== 0 ? (
                <ul ref={parent} className="rounded-lg border border-zinc-400">
                    {filteredUsers.map((user) => (
                        <li
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className="flex justify-between items-center px-4 py-2 hover:bg-gray-300 border-b border-zinc-400 first:rounded-t-lg last:border-none last:rounded-b-lg cursor-pointer dark:hover:bg-[#111111]"
                        >
                            <span>
                                {user.username}{" "}
                                <span
                                    className={`${
                                        user.username === username
                                            ? "text-red-500"
                                            : "text-blue-500"
                                    }`}
                                >
                                    (
                                    {user.username === username
                                        ? "You"
                                        : user.role}
                                    )
                                </span>
                            </span>
                            <BsFillShieldLockFill
                                title="No actions can be taken on this user as they are protected."
                                size={22}
                                className={`text-zinc-700 dark:text-zinc-400 ${
                                    !user.protected && "hidden"
                                }`}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="h-[200px] flex justify-center items-center text-center text-xl">
                    We're sorry, we couldn't find any users with that name.
                    Please check your spelling and try again.
                </div>
            )}
        </div>
    );
}

export default Organization;
