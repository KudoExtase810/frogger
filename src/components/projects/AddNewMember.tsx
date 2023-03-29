import { FaQuestionCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { addProjectMember, getProject } from "../../api/projects";
import { useParams } from "react-router-dom";
import { getAllUsers } from "../../api/users";
import { RiCloseCircleFill } from "react-icons/ri";
import { Tween, PlayState } from "react-gsap/dist";

interface props {
    setShowAddMembers: React.Dispatch<React.SetStateAction<boolean>>;
    playState: PlayState;
    setPlayState: React.Dispatch<React.SetStateAction<PlayState>>;
}

function AddNewMember({ setShowAddMembers, playState, setPlayState }: props) {
    const [showTip, setShowTip] = useState(false);
    const [newMembers, setNewMembers] = useState<null | user[]>(null);
    const [users, setUsers] = useState<user[]>([]);
    const [currentProject, setCurrentProject] = useState<project>();

    const params = useParams();
    const { projectName } = params;

    useEffect(() => {
        try {
            const getUsers = async () => {
                const allUsers: user[] = await getAllUsers();
                setUsers(allUsers);
            };
            getUsers();
        } catch (error) {}
    }, []);

    useEffect(() => {
        try {
            const getCurrentProject = async () => {
                const res = await getProject(projectName!);
                const project: project = res.data;
                setCurrentProject(project);
            };
            getCurrentProject();
        } catch (error) {}
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await addProjectMember(projectName!, newMembers!);
        setPlayState(PlayState.reverse);
        setTimeout(() => setShowAddMembers(false), 501);
    };

    return (
        <Tween
            from={{ y: -window.innerHeight, opacity: 0 }}
            to={{ y: 0, opacity: 1 }}
            duration={0.5}
            playState={playState}
        >
            <div className="bg-neutral-100 p-6 h-fit rounded-lg w-[500px] max-w-[98vw] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 dark:bg-zinc-800 dark:text-slate-200">
                <header className="mb-6 font-bold text-lg">Add Member</header>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 relative flex flex-col gap-2">
                        <label htmlFor="users">
                            <span>Available Users</span>
                            <FaQuestionCircle
                                size={18}
                                className="inline relative bottom-[1px] left-1"
                                onMouseOver={() => setShowTip(true)}
                                onMouseLeave={() => setShowTip(false)}
                            />
                            <span
                                className={`absolute text-red-600 text-sm p-1 bg-zinc-800 rounded-sm w-max left-[0px] -top-[25px] dark:bg-slate-200 ${
                                    showTip || "hidden"
                                }`}
                            >
                                Hold{" "}
                                <kbd>
                                    <b>CTRL</b>
                                </kbd>{" "}
                                for multiple selection.
                            </span>
                        </label>
                        <select
                            required
                            className="rounded-md p-3 border border-zinc-400"
                            name=""
                            id=""
                            multiple
                            onChange={(e) => {
                                let value = Array.from(
                                    e.target.selectedOptions,
                                    (option) => option.value
                                );
                                setNewMembers(value as any);
                            }}
                        >
                            {users?.map((user) => (
                                <option
                                    key={user._id}
                                    value={user.username}
                                    disabled={currentProject?.members.includes(
                                        user?.username
                                    )}
                                >
                                    {user.username}{" "}
                                    {currentProject?.members.includes(
                                        user?.username
                                    ) && "(Already a member)"}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        className="bg-green-500 text-white w-fit mx-auto rounded-md px-4 py-2 mt-2 hover:bg-green-400"
                        type="submit"
                    >
                        Add Selected Devs To Team
                    </button>
                </form>
                <button
                    className="absolute top-4 right-4"
                    type="button"
                    onClick={() => {
                        setPlayState(PlayState.reverse);
                        setTimeout(() => setShowAddMembers(false), 501);
                    }}
                >
                    <RiCloseCircleFill size={32} color="rgb(239 68 68)" />
                </button>
            </div>
        </Tween>
    );
}

export default AddNewMember;
