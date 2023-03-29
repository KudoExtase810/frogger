import { FaQuestionCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { addTicket } from "../../api/tickets";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getAllProjects } from "../../api/projects";
import { getAllUsers } from "../../api/users";
import { Tween, PlayState } from "react-gsap/dist";

interface props {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    projectTickets: ticket[] | undefined;
    setProjectTickets: React.Dispatch<
        React.SetStateAction<ticket[] | undefined>
    >;
    playState: PlayState;
    setPlayState: React.Dispatch<React.SetStateAction<PlayState>>;
}

function AddNewTicket({
    setShowForm,
    projectTickets,
    setProjectTickets,
    playState,
    setPlayState,
}: props) {
    const { username } = useAuth(); //check hook file for docs

    const [showTip, setShowTip] = useState<boolean>(false);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [status, setStatus] = useState<ticket["status"]>("New");
    const [priority, setPriority] = useState<ticket["priority"]>("Medium");
    const [type, setType] = useState<ticket["type"]>("Bug");
    const [timeEstimate, setTimeEstimate] = useState(3);
    const [assignedDevs, setAssignedDevs] = useState<ticket["assignedDevs"]>(
        []
    );

    const params = useParams();
    const { projectName } = params;

    const [projectTeam, setProjectTeam] = useState<user[]>([]);

    useEffect(() => {
        try {
            const getProjectTeam = async () => {
                const allProjects: project[] = await getAllProjects();
                const allUsers: user[] = await getAllUsers();
                // to get only the project of the page you're on
                const currentProject: project[] = allProjects.filter(
                    (project) => project.name === projectName
                );
                const { members } = currentProject[0];
                const teamMembers: user[] = allUsers.filter((user) =>
                    members.includes(user.username)
                );
                setProjectTeam(teamMembers);
            };
            getProjectTeam();
        } catch (error) {}
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res: any = await addTicket({
                title,
                desc,
                author: username,
                status,
                priority,
                type,
                timeEstimate,
                projectName: params.projectName!,
                assignedDevs,
            });
            if ((await res.status) === 201) {
                const { newTicket } = await res.data;
                setProjectTickets([...projectTickets!, newTicket]);
                toast.success(res.data.msg);
                setPlayState(PlayState.reverse);
                setTimeout(() => setShowForm(false), 501);
            }
        } catch (error) {}
    };

    return (
        <Tween
            from={{ y: -window.innerHeight, opacity: 0 }}
            to={{ y: 0, opacity: 1 }}
            duration={0.5}
            playState={playState}
        >
            <div className="bg-neutral-100 px-6 pt-6 h-fit rounded-lg w-fit fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10] dark:bg-zinc-800 dark:text-slate-200 max-w-[98vw] max-h-[86vh] overflow-y-auto">
                <header className="mb-6 font-bold text-lg">
                    Create Ticket
                </header>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title">Title</label>
                        <input
                            required
                            type="text"
                            name="title"
                            id="title"
                            placeholder="e.g. Fix responsiveness"
                            className="rounded-md p-3 border border-zinc-400"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description">Description</label>
                        <textarea
                            required
                            name="description"
                            id="description"
                            placeholder="e.g. Website broken on screens smaller than 512px"
                            cols={30}
                            rows={5}
                            className="rounded-md p-3 border border-zinc-400 bp3:h-20"
                            maxLength={100}
                            onChange={(e) => setDesc(e.target.value)}
                            value={desc}
                        ></textarea>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-2 relative">
                            <label htmlFor="assigndevs">
                                <span>Assign Devs</span>
                                <FaQuestionCircle
                                    size={18}
                                    className="inline relative left-[2px]"
                                    onMouseOver={() => setShowTip(true)}
                                    onMouseLeave={() => setShowTip(false)}
                                />
                                <span
                                    className={`absolute text-red-600 text-sm p-1 bg-zinc-800 dark:bg-slate-200 rounded-sm w-max left-[120px] -top-[18px] ${
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
                                multiple
                                name="assigndevs"
                                id="assigndevs"
                                className="rounded-md p-3 border border-zinc-400 bp3:max-h-24"
                                onChange={(e) => {
                                    let value = Array.from(
                                        e.target.selectedOptions,
                                        (option) => option.value
                                    );
                                    setAssignedDevs(value);
                                }}
                            >
                                {projectTeam.map((member, index) => (
                                    <option key={index} value={member.username}>
                                        {member.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="time">Time Estimate (hours)</label>
                            <input
                                required
                                type="number"
                                name="time"
                                id="time"
                                className="rounded-md p-3 border border-zinc-400 bp4:w-40"
                           
                                max={10000}
                                onChange={(e) =>
                                    setTimeEstimate(e.target.value as any)
                                }
                                value={timeEstimate}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex flex-col w-[30%] gap-2">
                            <label htmlFor="type">Type</label>
                            <select
                                required
                                className="rounded-md p-3 border border-zinc-400"
                                onChange={(e) =>
                                    setType(e.target.value as ticket["type"])
                                }
                                value={type}
                            >
                                <option value="Issue">Issue</option>
                                <option value="Bug">Bug</option>
                                <option value="Error">Error</option>
                                <option value="Feature Request">
                                    Feature Request
                                </option>
                            </select>
                        </div>
                        <div className="flex flex-col w-[30%] gap-2">
                            <label htmlFor="priority">Priority</label>
                            <select
                                required
                                className="rounded-md p-3 border border-zinc-400"
                                onChange={(e) =>
                                    setPriority(
                                        e.target.value as ticket["priority"]
                                    )
                                }
                                value={priority}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Immediate">Immediate</option>
                            </select>
                        </div>
                        <div className="flex flex-col w-[30%] gap-2">
                            <label htmlFor="status">Status</label>
                            <select
                                required
                                className="rounded-md p-3 border border-zinc-400"
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value as ticket["status"]
                                    )
                                }
                                value={status}
                            >
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white w-fit mx-auto rounded-md px-4 py-2 mt-2 hover:bg-green-400"
                    >
                        Submit
                    </button>
                </form>
                <button
                    type="button"
                    onClick={() => {
                        setPlayState(PlayState.reverse);
                        setTimeout(() => setShowForm(false), 501);
                    }}
                >
                    <RiCloseCircleFill
                        size={32}
                        className="absolute top-4 right-4 text-red-500"
                    />
                </button>
            </div>
        </Tween>
    );
}

export default AddNewTicket;
