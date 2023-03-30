import { useEffect, useState } from "react";
import { deleteProject, getAllProjects } from "../../api/projects";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PlayState } from "react-gsap/dist/";
import { FaTrash } from "react-icons/fa";
import ConfirmDelete from "./ConfirmDelete";
import useAuth from "../../hooks/useAuth";
import ClipLoader from "react-spinners/ClipLoader";
import { activateTextTruncateScroll } from "text-truncate-scroll";

interface props {
    allProjects: project[] | undefined;
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    setAllProjects: React.Dispatch<React.SetStateAction<project[] | undefined>>;
    setPlayState: React.Dispatch<React.SetStateAction<PlayState>>;
    showConfirmDelete: boolean;
    setShowConfirmDelete: React.Dispatch<React.SetStateAction<boolean>>;
}

function Projects({
    setShowForm,
    allProjects,
    setAllProjects,
    setPlayState,
    showConfirmDelete,
    setShowConfirmDelete,
}: props) {
    useEffect(() => {
        const getData = async () => {
            const projects: project[] = await getAllProjects();
            setAllProjects(projects);
        };
        getData();
    }, []);

    useEffect(() => {
        activateTextTruncateScroll();
    }, [allProjects]);

    const navigate = useNavigate();

    const [selectedProject, setSelectedProject] = useState<project>();
    const [deletePlayState, setDeletePlayState] = useState(PlayState.pause);

    const handleDelete = async (projectId: string) => {
        const res = await deleteProject(projectId);
        if (res.status === 200) {
            const deletedProject: project = res.data;
            const filteredProjects = allProjects?.filter(
                (project) => project._id !== projectId
            );
            setDeletePlayState(PlayState.reverse);
            setTimeout(() => setShowConfirmDelete(false), 401);
            setAllProjects(filteredProjects);
            return toast.success(
                `"${deletedProject.name}" was deleted successfully.`
            );
        }
        toast.error("Failed to delete the project, try again later.");
    };

    const [parent] = useAutoAnimate();

    const { isAdmin, isManager } = useAuth();

    if (!allProjects)
        return (
            <div className="text-left mt-8 w-[93vw] bg-white rounded-lg mx-auto mb-12 dark:bg-zinc-800 dark:text-slate-50 bp1:w-[91vw] bp2:w-[88vw]">
                <h2 className="text-lg font-bold p-4 border-b border-zinc-400">
                    Projects
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

    if (allProjects.length === 0) {
        return (
            <div className="text-left mt-8 w-[93vw] bg-white rounded-lg mx-auto mb-12 max-h-[396.5px] dark:bg-zinc-800 dark:text-slate-50 bp1:w-[91vw] bp2:w-[88vw] c-scroll overflow-y-auto">
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-bold">Projects</h2>
                    <button
                        className="rounded-md bg-purple-500 px-4 py-2 hover:bg-emerald-400 transition-all duration-500 text-white"
                        onClick={() => {
                            if (!isAdmin && !isManager)
                                return toast.error(
                                    "Please contact your project manager in order to create a new project."
                                );
                            setShowForm(true);
                            setPlayState(PlayState.play);
                        }}
                    >
                        New Project
                    </button>
                </div>
                <div className="flex justify-center items-center border-t border-zinc-400 h-[200px] text-xl text-center">
                    No projects are currently available. If you have the
                    necessary permissions, you can create a new project using
                    the button above.
                </div>
            </div>
        );
    }

    return (
        <div className="text-left mt-8 w-[93vw] bg-white relative rounded-lg mx-auto mb-12 max-h-[396.5px] dark:bg-zinc-800 dark:text-zinc-50 bp2:w-[88vw] c-scroll overflow-y-auto bp0:w-[92vw] bp1:w-[90vw] bp3:w-[97vw]">
            <div className="flex justify-between items-center p-4 ">
                <h2 className="text-lg font-bold">Projects</h2>
                <button
                    className="rounded-md bg-purple-500 px-4 py-2 hover:bg-emerald-400 transition-all duration-500 text-white"
                    onClick={() => {
                        if (!isAdmin && !isManager)
                            return toast.error(
                                "Please contact your project manager in order to create a new project."
                            );
                        setShowForm(true);
                        setPlayState(PlayState.play);
                    }}
                >
                    New Project
                </button>
            </div>
            <table className="w-full">
                <thead className="border-y border-zinc-400 bg-gray-100 font-medium text-zinc-700 text-sm dark:text-zinc-300 dark:bg-zinc-900">
                    <tr className=" h-8">
                        <th className="pl-4">PROJECT</th>
                        <th>DESCSRIPTION</th>
                        <th>CONTRIBUTORS</th>
                        <th hidden={!isAdmin && !isManager}></th>
                    </tr>
                </thead>
                <tbody ref={parent}>
                    {allProjects?.map((project) => (
                        <tr
                            onClick={() => {
                                navigate(`/projects/${project.name}`);
                            }}
                            key={project._id}
                            className="h-12 border-b border-zinc-400 last:border-none hover:bg-gray-300 cursor-pointer dark:hover:bg-[#111111]"
                        >
                            <td className="pl-4 text-blue-500">
                                {project.name}
                            </td>
                            <td>
                                <p className="w-[600px] bp2:w-[400px] bp35:w-[200px] bp4:w-[150px]">
                                    <span className="text-truncate-scroll">
                                        {project.desc ||
                                            "No description available."}
                                    </span>
                                </p>
                            </td>
                            <td>
                                {project.members.length > 1 ? (
                                    <div className="w-56 bp2:w-40 bp35:w-28">
                                        <div className="text-truncate-scroll">
                                            <ul className="flex gap-3">
                                                {project.members.map(
                                                    (member, index) => (
                                                        <li key={index}>
                                                            {member}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <span>{project.members[0]}</span>
                                )}
                            </td>
                            <td
                                hidden={!isAdmin && !isManager}
                                className="bp2:px-4 bp4:px-2"
                            >
                                <button
                                    className="mt-[9px] mr-[4px] hover:text-red-700 text-red-500"
                                    title="Delete project"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                            ["Frogger", "Masenko"].includes(
                                                project.name
                                            )
                                        ) {
                                            return toast.error(
                                                "This project can only be deleted by the website owner."
                                            );
                                        }
                                        setSelectedProject(project);
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
                <ConfirmDelete
                    setShowConfirmDelete={setShowConfirmDelete}
                    handleDelete={handleDelete}
                    project={selectedProject!}
                    deletePlayState={deletePlayState}
                    setDeletePlayState={setDeletePlayState}
                />
            )}
        </div>
    );
}

export default Projects;
