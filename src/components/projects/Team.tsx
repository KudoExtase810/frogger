import { useState, useEffect } from "react";
import { getAllUsers } from "../../api/users";
import { deleteTeamMember, getAllProjects } from "../../api/projects";
import { useParams } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PlayState } from "react-gsap/dist";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import ConfirmDeleteMember from "./ConfirmDeleteMember";
import useAuth from "../../hooks/useAuth";
import ClipLoader from "react-spinners/ClipLoader";
import { activateTextTruncateScroll } from "text-truncate-scroll";

interface props {
    showAddMembers: boolean;
    setShowAddMembers: React.Dispatch<React.SetStateAction<boolean>>;
    setPlayState: React.Dispatch<React.SetStateAction<PlayState>>;
}

function Team({ showAddMembers, setShowAddMembers, setPlayState }: props) {
    const params = useParams();
    const { projectName } = params;

    const [projectTeam, setProjectTeam] = useState<user[]>();

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<string>();
    const [deletePlayState, setDeletePlayState] = useState(PlayState.pause);

    useEffect(() => {
        try {
            if (showConfirmDelete) {
                document.body.classList.add("overflow-y-hidden");
            } else {
                document.body.classList.remove("overflow-y-hidden");
            }

            const getProjectTeam = async () => {
                const allProjects: project[] = await getAllProjects();
                const allUsers: user[] = await getAllUsers();
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
    }, [showAddMembers, showConfirmDelete]);

    useEffect(() => {
        activateTextTruncateScroll();
    }, [projectTeam]);

    const handleDelete = async (member: string) => {
        const res = await deleteTeamMember(projectName!, member);
        if (res.status === 200) {
            setDeletePlayState(PlayState.reverse);
            setTimeout(() => setShowConfirmDelete(false), 401);
            return toast.success(
                `${member} has been successfully removed from ${projectName}`
            );
        }
        toast.error("Something went wrong, try again later.");
    };

    const [parent] = useAutoAnimate();

    const { isAdmin, isManager } = useAuth();

    if (!projectTeam)
        return (
            <div className="rounded-lg bg-white mt-8 text-left w-[38%] bp0:w-[47%] bp1:mx-auto bp1:w-full dark:bg-zinc-800 dark:text-slate-50">
                <h2 className="text-lg font-bold p-4 border-b border-zinc-400">
                    Team
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
        <div className="rounded-lg bg-white mt-8 text-left w-[38%] bp0:w-[47%] c-scroll max-h-[348.5px] dark:bg-zinc-800 dark:text-zinc-50 bp1:mx-auto bp1:w-full overflow-auto">
            <div className="flex justify-between items-center p-4">
                <h2 className="text-lg font-bold">Team</h2>
                <button
                    onClick={() => {
                        setShowAddMembers(true);
                        setPlayState(PlayState.play);
                    }}
                    className="rounded-md bg-purple-500 px-4 py-2 hover:bg-emerald-400 transition-all duration-500 text-white"
                >
                    New Member
                </button>
            </div>
            <table className="w-full truncate bp3:min-w-[720px]">
                <thead className="border-y border-zinc-400 bg-gray-100 font-medium text-zinc-700 text-sm dark:text-zinc-300 dark:bg-zinc-900">
                    <tr className="h-8">
                        <th className="pl-4">NAME</th>
                        <th>EMAIL</th>
                        <th>ROLE</th>
                        <th hidden={!isAdmin && !isManager}></th>
                    </tr>
                </thead>
                <tbody ref={parent}>
                    {projectTeam?.map((member) => (
                        <tr
                            key={member._id}
                            className="h-12 border-b border-zinc-400 last:border-none hover:bg-gray-300 cursor-pointer dark:hover:bg-[#111111]"
                        >
                            <td className="pl-4 pr-1">{member.username}</td>
                            <td>
                                <div className="w-[22.5ch] bp1:w-[21ch]">
                                    <span className="text-truncate-scroll">
                                        {member.email}
                                    </span>
                                </div>
                            </td>
                            <td>{member.role}</td>
                            <td
                                hidden={!isAdmin && !isManager}
                                className="px-2"
                            >
                                <button
                                    className="mt-[6px] mr-[4px] hover:text-red-700 text-red-500"
                                    onClick={() => {
                                        if (
                                            ["Frogger", "Masenko"].includes(
                                                projectName!
                                            )
                                        ) {
                                            return toast.error(
                                                "This project's members can only be deleted by the website owner."
                                            );
                                        }
                                        setMemberToDelete(member.username);
                                        setShowConfirmDelete(true);
                                        setDeletePlayState(PlayState.play);
                                    }}
                                >
                                    <FaTrash size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showConfirmDelete && (
                <ConfirmDeleteMember
                    setShowConfirmDelete={setShowConfirmDelete}
                    member={memberToDelete!}
                    projectName={projectName!}
                    handleDelete={handleDelete}
                    deletePlayState={deletePlayState}
                    setDeletePlayState={setDeletePlayState}
                />
            )}
        </div>
    );
}

export default Team;
