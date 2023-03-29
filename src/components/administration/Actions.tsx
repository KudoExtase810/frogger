import { toast } from "react-hot-toast";
import { assignRole, deleteUser, editUserInfo } from "../../api/users";
import { useEffect, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { FaUser, FaUserSlash, FaUserTie } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { Tween, PlayState } from "react-gsap/dist";

interface props {
    selectedUser: user | undefined;
    setSelectedUser: React.Dispatch<React.SetStateAction<user | undefined>>;
    filteredUsers: user[] | undefined;
    setFilteredUsers: React.Dispatch<React.SetStateAction<user[] | undefined>>;
    allUsers: user[] | undefined;
    setAllUsers: React.Dispatch<React.SetStateAction<user[] | undefined>>;
}

function Actions({
    selectedUser,
    setSelectedUser,
    filteredUsers,
    setFilteredUsers,
    allUsers,
    setAllUsers,
}: props) {
    const [showInfoForm, setShowInfoForm] = useState(false);
    const [infoPlayState, setInfoPlayState] = useState(PlayState.pause);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deletePlayState, setDeletePlayState] = useState(PlayState.pause);

    const [showAssignRole, setShowAssignRole] = useState(false);
    const [rolePlayState, setRolePlayState] = useState(PlayState.pause);

    const [newUsername, setNewUsername] = useState(selectedUser?.username);
    const [newEmail, setNewEmail] = useState(selectedUser?.email);

    useEffect(() => {
        setNewUsername(selectedUser?.username);
        setNewEmail(selectedUser?.email);
    }, [selectedUser]);

    const { username } = useAuth();

    const handleRole = async (newRole: user["role"]) => {
        if (selectedUser?.username === username) {
            return toast.error(
                "Admins cannot downgrade themselves, that would be unusual..."
            );
        }
        try {
            const res = await assignRole(selectedUser?._id, newRole!);
            if (res.status === 200) {
                toast.success(res.data.msg);
                const updatedUsers = filteredUsers?.map((user) =>
                    user._id === selectedUser?._id
                        ? { ...user, role: newRole }
                        : user
                );
                setAllUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
                setRolePlayState(PlayState.reverse);
                setTimeout(() => setShowAssignRole(false), 401);
            } else {
                toast.error("Something went wrong, try again later.");
            }
        } catch (error: any) {
            if (error.response.status === 401) {
                toast.error(
                    "This user's info is protected and can only be edited by the website owner."
                );
            } else {
                toast.error("Something went wrong, try again later.");
            }
        }
    };

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await editUserInfo(selectedUser?._id, {
                username: newUsername!,
                email: newEmail!,
            });
            const updatedUsers = filteredUsers?.map((user) =>
                user._id === selectedUser?._id
                    ? { ...user, username: newUsername!, email: newEmail! }
                    : user
            );
            setAllUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
            setInfoPlayState(PlayState.reverse);
            setTimeout(() => setShowInfoForm(false), 401);
            if (res.status === 200) {
                toast.success(res.data.msg);
            } else {
                toast.error("Something went wrong, try again later.");
            }
        } catch (error: any) {
            if (error.response.status === 401) {
                toast.error(
                    "This user's info is protected and can only be edited by the website owner."
                );
            } else {
                toast.error("Something went wrong, try again later.");
            }
        }
    };

    const handleDelete = async (id: user["_id"]) => {
        if (selectedUser?.username === username) {
            return toast.error("You can't delete your own account!");
        }
        try {
            const res = await deleteUser(id);
            if (res.status === 200) {
                toast.success(res.data.msg);
                setAllUsers(allUsers?.filter((user) => user._id !== id));
                setFilteredUsers(
                    filteredUsers?.filter((user) => user._id !== id)
                );
                setSelectedUser(undefined);
                setDeletePlayState(PlayState.reverse);
                setTimeout(() => setShowConfirmDelete(false), 401);
            } else {
                toast.error("Something went wrong, try again later.");
            }
        } catch (error: any) {
            if (error.response.status === 401) {
                toast.error(
                    "This user is protected and can only be deleted by the website owner."
                );
            } else {
                toast.error("Something went wrong, try again later.");
            }
        }
    };

    useEffect(() => {
        if (showInfoForm || showAssignRole || showConfirmDelete)
            document.body.classList.add("overflow-y-hidden");
        else document.body.classList.remove("overflow-y-hidden");
    }, [showInfoForm, showAssignRole, showConfirmDelete]);

    return (
        <div className="bg-white rounded-lg mt-12 px-4 pb-4 w-4/5 mx-auto dark:bg-zinc-800 dark:text-zinc-50 bp1:w-[92%] mb-8">
            <h2 className="text-center w-full py-5 block text-2xl font-extrabold ">
                {selectedUser?._id ? (
                    <span>Selected User: {selectedUser?.username}</span>
                ) : (
                    <span className="flex gap-3 items-center justify-center">
                        No user is selected <FaUserSlash size={32} />
                    </span>
                )}
            </h2>
            <div className="flex justify-around items-center py-4 dark:text-white bp4:flex-col bp4:justify-center bp4:gap-4">
                <button
                    disabled={!selectedUser}
                    type="button"
                    className="px-3 py-2 rounded-md bg-green-500 hover:bg-green-600 disabled:bg-green-300 bp4:w-[240px]"
                    onClick={() => {
                        setShowInfoForm(true);
                        setInfoPlayState(PlayState.play);
                    }}
                >
                    Edit Info
                </button>
                <button
                    onClick={() => {
                        setShowConfirmDelete(true);
                        setDeletePlayState(PlayState.play);
                    }}
                    disabled={!selectedUser}
                    type="button"
                    className="px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 disabled:bg-red-300 bp4:w-[240px]"
                >
                    Remove User
                </button>
                <button
                    onClick={() => {
                        setShowAssignRole(true);
                        setRolePlayState(PlayState.play);
                    }}
                    disabled={!selectedUser}
                    type="button"
                    className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-800 disabled:bg-blue-300 bp4:w-[240px]"
                >
                    Assign Role
                </button>
            </div>
            {showInfoForm && (
                <>
                    <div className="w-screen h-screen fixed inset-0 bg-gray-500 opacity-80"></div>
                    <Tween
                        from={{
                            opacity: 0,
                            scale: 0.5,
                            z: -1000,
                        }}
                        to={{
                            opacity: 1,
                            scale: 1,
                            z: 0,
                        }}
                        duration={0.4}
                        ease="power3.out"
                        playState={infoPlayState}
                    >
                        <div className="bg-neutral-100 py-6 px-9 h-fit rounded-lg fixed w-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-zinc-800 dark:text-slate-200">
                            <h2 className="mb-6 font-bold text-lg">
                                Edit User Info
                            </h2>
                            <form
                                onSubmit={handleEdit}
                                className="flex flex-col gap-6"
                            >
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        className="rounded-md p-2 border border-zinc-400"
                                        type="text"
                                        onChange={(e) =>
                                            setNewUsername(e.target.value)
                                        }
                                        value={newUsername}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        className="rounded-md p-2 border border-zinc-400"
                                        type="email"
                                        onChange={(e) =>
                                            setNewEmail(e.target.value)
                                        }
                                        value={newEmail}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white w-fit rounded-md px-4 py-2 mt-2 hover:bg-green-400"
                                >
                                    Save
                                </button>
                                <button
                                    className="absolute top-4 right-4"
                                    type="button"
                                    onClick={() => {
                                        setInfoPlayState(PlayState.reverse);
                                        setTimeout(
                                            () => setShowInfoForm(false),
                                            401
                                        );
                                    }}
                                >
                                    <RiCloseCircleFill
                                        size={32}
                                        color="rgb(239 68 68)"
                                    />
                                </button>
                            </form>
                        </div>
                    </Tween>
                </>
            )}
            {showConfirmDelete && (
                <>
                    <div className="w-screen h-screen fixed inset-0 bg-gray-500 opacity-80"></div>
                    <Tween
                        from={{
                            opacity: 0,
                            scale: 0.5,
                            z: -1000,
                        }}
                        to={{
                            opacity: 1,
                            scale: 1,
                            z: 0,
                        }}
                        duration={0.4}
                        ease="power3.out"
                        playState={deletePlayState}
                    >
                        <div className="bg-neutral-100 py-6 px-9 h-fit rounded-lg fixed w-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-zinc-800 dark:text-slate-200">
                            <h3 className="my-6 bp5:text-center">
                                Are you sure you want to delete{" "}
                                <b>{selectedUser?.username}</b>'s account?
                            </h3>
                            <div className="flex justify-center gap-12">
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white w-fit rounded-md px-4 py-2 mt-2 hover:bg-blue-400"
                                    onClick={() => {
                                        setDeletePlayState(PlayState.reverse);
                                        setTimeout(
                                            () => setShowConfirmDelete(false),
                                            401
                                        );
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 text-white w-fit rounded-md px-4 py-2 mt-2 hover:bg-red-400"
                                    onClick={() =>
                                        handleDelete(selectedUser?._id)
                                    }
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </Tween>
                </>
            )}
            {showAssignRole && (
                <>
                    <div className="w-screen h-screen fixed inset-0 bg-gray-500 opacity-80"></div>
                    <Tween
                        from={{
                            opacity: 0,
                            scale: 0.5,
                            z: -1000,
                        }}
                        to={{
                            opacity: 1,
                            scale: 1,
                            z: 0,
                        }}
                        duration={0.4}
                        ease="power3.out"
                        playState={rolePlayState}
                    >
                        <div className="bg-neutral-100 py-6 px-9 h-fit rounded-lg fixed w-fit max-w-[450px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-zinc-800 dark:text-slate-200">
                            <h3 className="mt-1 mb-6 text-center">
                                <b>{selectedUser?.username}</b> currently has
                                the role <b>"{selectedUser?.role}"</b>, what
                                would you like to change it to?
                            </h3>
                            <ul className="flex justify-center items-center gap-6">
                                {["Developer", "Project Manager", "Admin"]
                                    .filter(
                                        (role) => role !== selectedUser?.role
                                    )
                                    .map((role, index) => {
                                        return (
                                            <li
                                                key={index}
                                                className="flex flex-col items-center gap-2 hover:text-blue-600 cursor-pointer"
                                                onClick={() =>
                                                    handleRole(
                                                        role as user["role"]
                                                    )
                                                }
                                            >
                                                {role === "Admin" ? (
                                                    <FaUserTie size={132} />
                                                ) : (
                                                    <FaUser size={132} />
                                                )}
                                                <span>{role}</span>
                                            </li>
                                        );
                                    })}
                            </ul>
                            <button
                                type="button"
                                className="bg-red-500 text-white w-fit rounded-md px-4 py-2 mt-5 hover:bg-red-400 mx-auto block"
                                onClick={() => {
                                    setRolePlayState(PlayState.reverse);
                                    setTimeout(
                                        () => setShowAssignRole(false),
                                        401
                                    );
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </Tween>
                </>
            )}
        </div>
    );
}

export default Actions;
