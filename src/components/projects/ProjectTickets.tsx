import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { deleteTicket, getAllTickets } from "../../api/tickets";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PlayState } from "react-gsap/dist";
import { FaTrash } from "react-icons/fa";
import ConfirmDelete from "../tickets/ConfirmDelete";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import ClipLoader from "react-spinners/ClipLoader";
import { activateTextTruncateScroll } from "text-truncate-scroll";

interface props {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedTicketId: React.Dispatch<React.SetStateAction<string | null>>;
    projectTickets: ticket[] | undefined;
    setProjectTickets: React.Dispatch<
        React.SetStateAction<ticket[] | undefined>
    >;
    setPlayState: React.Dispatch<React.SetStateAction<PlayState>>;
    setSelectedTicket: React.Dispatch<React.SetStateAction<ticket | undefined>>;
}

function ProjectTickets({
    setShowForm,
    setSelectedTicketId,
    projectTickets,
    setProjectTickets,
    setPlayState,
    setSelectedTicket,
}: props) {
    const params = useParams();
    const { projectName } = params;

    const [ticketToDelete, setTicketToDelete] = useState<ticket>();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deletePlayState, setDeletePlayState] = useState(PlayState.pause);

    useEffect(() => {
        try {
            const getProjectTickets = async () => {
                const allTickets: ticket[] = await getAllTickets();
                const filtered = allTickets.filter(
                    (tikcet) => tikcet.projectName === projectName
                );
                setProjectTickets(filtered);
            };
            getProjectTickets();
        } catch (error) {}
    }, []);

    useEffect(() => {
        activateTextTruncateScroll();
    }, [projectTickets]);

    useEffect(() => {
        if (showConfirmDelete) {
            document.body.classList.add("overflow-y-hidden");
        } else {
            document.body.classList.remove("overflow-y-hidden");
        }
    }, [showConfirmDelete]);

    const [parent] = useAutoAnimate();

    const { isAdmin, isManager } = useAuth();

    const handleDelete = async (ticketId: string) => {
        const res = await deleteTicket(ticketId);
        if (res.status === 200) {
            const deletedTicket: ticket = res.data;
            const filteredTickets = projectTickets?.filter(
                (ticket) => ticket._id !== deletedTicket._id
            );
            setDeletePlayState(PlayState.reverse);
            setTimeout(() => setShowConfirmDelete(false), 401);
            setProjectTickets(filteredTickets);
            setSelectedTicket(undefined);
            return toast.success(
                `"${deletedTicket.title}" was deleted successfully.`
            );
        }
        toast.error("Failed to delete the project, try again later.");
    };

    if (!projectTickets)
        return (
            <div className="rounded-lg bg-white mt-8 mb-12 text-left w-[60%] bp1:mx-auto bp0:w-[52%] bp1:mt-0 bp1:w-full dark:bg-zinc-800 dark:text-slate-50">
                <h2 className="text-lg font-bold p-4 border-b border-zinc-400">
                    Tickets
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

    if (projectTickets.length === 0) {
        return (
            <div className="rounded-lg bg-white mt-8 mb-12 text-left w-[60%] bp1:mx-auto bp0:w-[52%] bp1:mt-0 bp1:w-full dark:bg-zinc-800 dark:text-slate-50">
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-bold">Tickets</h2>
                    <button
                        className="rounded-md bg-purple-500 px-4 py-2 hover:bg-emerald-400 transition-all duration-500 text-white"
                        onClick={() => {
                            setShowForm(true);
                            setPlayState(PlayState.play);
                        }}
                    >
                        New Ticket
                    </button>
                </div>
                <div className="flex justify-center items-center border-t border-zinc-400 h-[200px] text-xl text-center">
                    This project has no tickets. You can create a new one using
                    the button above.
                </div>
            </div>
        );
    }

    return (
        <div className="text-left mt-8 bg-white rounded-lg mb-12 w-[60%] bp1:mx-auto c-scroll max-h-[348.5px] dark:bg-zinc-800 dark:text-zinc-50 bp0:w-[52%] bp1:mt-0 bp1:w-full overflow-auto">
            <div className="flex justify-between items-center p-4">
                <h2 className="text-lg font-bold">Tickets</h2>
                <button
                    className="rounded-md bg-purple-500 px-4 py-2 hover:bg-emerald-400 transition-all duration-500 text-white"
                    onClick={() => {
                        if (["Masenko", "Frogger"].includes(projectName!)) {
                            return toast.error(
                                "Only the website owner can add tickets to this project."
                            );
                        }
                        setShowForm(true);
                        setPlayState(PlayState.play);
                    }}
                >
                    New Ticket
                </button>
            </div>
            <table className="w-full truncate bp3:min-w-[720px]">
                <thead className="border-y border-zinc-400 bg-gray-100 font-medium text-zinc-700 text-sm dark:text-zinc-300 dark:bg-zinc-900">
                    <tr className=" h-8">
                        <th className="pl-4">TICKET</th>
                        <th>DESCSRIPTION</th>
                        <th>AUTHOR</th>
                        <th hidden={!isAdmin && !isManager}></th>
                    </tr>
                </thead>
                <tbody ref={parent}>
                    {projectTickets.map((ticket) => (
                        <tr
                            key={ticket._id}
                            className="h-12 border-b border-zinc-400 last:border-none hover:bg-gray-300 cursor-pointer dark:hover:bg-[#111111]"
                            onClick={() => {
                                setSelectedTicketId(ticket._id as string);
                            }}
                        >
                            <td className="pl-4">{ticket.title}</td>
                            <td>
                                <p className="w-[400px] bp35:w-[200px] bp4:w-[150px] bp0:w-[260px]">
                                    <span className="text-truncate-scroll">
                                        {ticket.desc}
                                    </span>
                                </p>
                            </td>
                            <td>{ticket.author}</td>
                            <td
                                className="px-2"
                                hidden={!isAdmin && !isManager}
                            >
                                <button
                                    className="mt-[6px] hover:text-red-700 text-red-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                            ["Frogger", "Masenko"].includes(
                                                ticket.projectName
                                            )
                                        ) {
                                            return toast.error(
                                                "This project's tickets can only be deleted by the website owner."
                                            );
                                        }
                                        setTicketToDelete(ticket);
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
                    deletePlayState={deletePlayState}
                    setDeletePlayState={setDeletePlayState}
                    handleDelete={handleDelete}
                    selectedTicket={ticketToDelete!}
                />
            )}
        </div>
    );
}

export default ProjectTickets;
