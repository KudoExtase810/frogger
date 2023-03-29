import { useState, useEffect } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { addProject } from "../../api/projects";
import { toast } from "react-hot-toast";
import { getAllUsers } from "../../api/users";
import { Tween, PlayState } from "react-gsap/dist/";

interface props {
    allProjects: project[] | undefined;
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    setAllProjects: React.Dispatch<React.SetStateAction<project[] | undefined>>;
    playState: PlayState;
    setPlayState: React.Dispatch<React.SetStateAction<PlayState>>;
}

function AddNewProject({
    setShowForm,
    allProjects,
    setAllProjects,
    playState,
    setPlayState,
}: props) {
    const [showTip, setShowTip] = useState<boolean>(false);
    const [projectName, setProjectName] = useState("");
    const [projectDesc, setProjectDesc] = useState("");
    const [projectMembers, setProjectMembers] = useState<string[]>([]);
    const [users, setUsers] = useState<user[]>([]);

    useEffect(() => {
        try {
            const getUsers = async () => {
                const allUsers: user[] = await getAllUsers();
                setUsers(allUsers);
            };
            getUsers();
        } catch (error) {}
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        function hasSpecialChars(projectName: string) {
            const allowedInputs = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z",
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z",
                "-",
            ];
            for (let i = 0; i < projectName.length; i++) {
                if (!allowedInputs.includes(projectName.charAt(i))) return true;
            }
            return false;
        }
        if (hasSpecialChars(projectName))
            return toast.error(
                "The project's name can only contain letters, numbers, and hyphens (-)."
            );
        const res = await addProject({
            name: projectName,
            desc: projectDesc,
            members: projectMembers,
        });
        const addedProject = res.data.project;
        if (res.status === 201) {
            setPlayState(PlayState.reverse);
            setTimeout(() => setShowForm(false), 501);
            toast.success(res.data.msg);
            setAllProjects([...allProjects!, addedProject]);
        }
    };

    return (
        <Tween
            from={{ y: -window.innerHeight, opacity: 0 }}
            to={{ y: 0, opacity: 1 }}
            duration={0.5}
            playState={playState}
        >
            <div className="bg-neutral-100 py-6 px-9 h-fit rounded-lg fixed w-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-zinc-800 dark:text-slate-200">
                <header className="mb-6 font-bold text-lg">
                    Add New Project
                </header>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title">
                            Project Title<span className="text-red-600">*</span>
                        </label>
                        <input
                            required
                            className="rounded-md p-3 border border-zinc-400"
                            name="title"
                            id="title"
                            type="text"
                            maxLength={16}
                            placeholder="e.g. Bug tracker"
                            value={projectName}
                            onChange={(e) => {
                                setProjectName(e.target.value);
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description">Project Description</label>
                        <textarea
                            maxLength={124}
                            className="rounded-md p-3 border border-zinc-400"
                            name="description"
                            id="description"
                            cols={26}
                            rows={3}
                            placeholder="e.g. Project management tool to track project issues.."
                            value={projectDesc}
                            onChange={(e) => {
                                setProjectDesc(e.target.value);
                            }}
                        ></textarea>
                    </div>
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="members">
                            <span>
                                Add Team Members
                                <span className="text-red-600">*</span>
                            </span>
                            <FaQuestionCircle
                                size={18}
                                className="inline relative left-1 bottom-[1px]"
                                onMouseOver={() => setShowTip(true)}
                                onMouseLeave={() => setShowTip(false)}
                            />
                            <span
                                className={`absolute text-red-600 text-sm p-1 bg-zinc-800 dark:bg-slate-200 rounded-sm w-max left-[80px] -top-[30px] ${
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
                            name="members"
                            id="members"
                            multiple
                            onChange={(e) => {
                                let value = Array.from(
                                    e.target.selectedOptions,
                                    (option) => option.value
                                );
                                setProjectMembers(value);
                            }}
                        >
                            {users?.map((user) => (
                                <option key={user._id} value={user.username}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white w-fit mx-auto rounded-md px-4 py-2 mt-2 hover:bg-green-400"
                    >
                        Submit
                    </button>
                    <button
                        className="absolute top-4 right-4"
                        type="button"
                        onClick={() => {
                            setPlayState(PlayState.reverse);
                            setTimeout(() => setShowForm(false), 501);
                        }}
                    >
                        <RiCloseCircleFill size={32} color="rgb(239 68 68)" />
                    </button>
                </form>
            </div>
        </Tween>
    );
}

export default AddNewProject;
