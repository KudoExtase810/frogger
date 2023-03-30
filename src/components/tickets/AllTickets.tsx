import { useEffect, useState } from "react";
import { deleteTicket, getAllTickets } from "../../api/tickets";
import { AiFillWarning } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FaTrash } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { PlayState } from "react-gsap/dist";
import ConfirmDelete from "./ConfirmDelete";
import EditStatus from "./EditStatus";
import { toast } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

interface props {
    selectedTicket: ticket | undefined;
    setSelectedTicket: React.Dispatch<React.SetStateAction<ticket | undefined>>;
    setSelectedTicketId: React.Dispatch<React.SetStateAction<string | null>>;
    showConfirmDelete: boolean;
    setShowConfirmDelete: React.Dispatch<React.SetStateAction<boolean>>;
    showEditStatus: boolean;
    setShowEditStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

function AllTickets({
    selectedTicket,
    setSelectedTicket,
    setSelectedTicketId,
    showConfirmDelete,
    setShowConfirmDelete,
    showEditStatus,
    setShowEditStatus,
}: props) {
    const navigate = useNavigate();

    const { username, isAdmin, isManager } = useAuth(); // check hook file for docs

    const [allTickets, setAllTickets] = useState<ticket[]>();
    const [allTicketsCopy, setAllTicketsCopy] = useState<ticket[]>();

    const [deletePlayState, setDeletePlayState] = useState(PlayState.pause);
    const [statusPlayState, setStatusPlayState] = useState(PlayState.pause);

    useEffect(() => {
        const getData = async () => {
            const tickets = await getAllTickets();
            setAllTickets(tickets);
            setAllTicketsCopy(tickets);
        };
        getData();
    }, []);

    function handleFilter(isChecked: boolean) {
        if (isChecked) {
            const filtered = allTicketsCopy?.filter((ticket) =>
                ticket.assignedDevs.includes(username!)
            );
            setAllTickets(filtered);
        } else {
            setAllTickets(allTicketsCopy);
        }
    }

    const handleDelete = async (ticketId: string) => {
        const res = await deleteTicket(ticketId);
        if (res.status === 200) {
            const deletedTicket: ticket = res.data;
            const filteredTickets = allTickets?.filter(
                (ticket) => ticket._id !== deletedTicket._id
            );
            const filteredTicketsCopy = allTicketsCopy?.filter(
                (ticket) => ticket._id !== deletedTicket._id
            );

            setDeletePlayState(PlayState.reverse);
            setTimeout(() => setShowConfirmDelete(false), 401);
            setAllTickets(filteredTickets);
            setAllTicketsCopy(filteredTicketsCopy);
            return toast.success(
                `"${deletedTicket.title}" was deleted successfully.`
            );
        }
        toast.error("Failed to delete the project, try again later.");
    };

    const [parent, enableAnimations] = useAutoAnimate();
    if (!allTickets)
        return (
            <div className="text-left mt-8 w-[93vw] bg-white rounded-lg mx-auto mb-12 dark:bg-zinc-800 dark:text-slate-50 bp0:w-[92vw] bp1:w-[90vw]">
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

    if (allTickets?.length === 0)
        return (
            <div className="text-left mt-8 w-[93vw] bg-white rounded-lg mx-auto mb-12 dark:bg-zinc-800 dark:text-slate-50 bp0:w-[92vw] bp1:w-[90vw]">
                <div className="flex justify-between items-center p-4 relative ">
                    <h2 className="text-lg font-bold">Tickets</h2>

                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            name="assigned-only"
                            id="assigned-only"
                            onChange={(e) => {
                                enableAnimations(false);
                                handleFilter(e.target.checked);
                            }}
                        />
                        <label htmlFor="assigned-only">
                            Show assigned tickets only
                        </label>
                    </div>
                </div>
                <div className="flex justify-center items-center border-t border-zinc-400 h-[200px] text-xl text-center">
                    No tickets available.
                </div>
            </div>
        );

    return (
        <div className="text-left mt-8 w-[93vw] bg-white rounded-lg mx-auto mb-12 dark:bg-zinc-800 dark:text-zinc-50 bp0:w-[92vw] bp1:w-[90vw] bp3:w-[97vw] bp35:overflow-x-auto">
            <div className="flex justify-between items-center p-4 relative ">
                <h2 className="text-lg font-bold">Tickets</h2>

                <div className="flex gap-2">
                    <input
                        type="checkbox"
                        name="assigned-only"
                        id="assigned-only"
                        onChange={(e) => {
                            enableAnimations(false);
                            handleFilter(e.target.checked);
                        }}
                    />
                    <label htmlFor="assigned-only">
                        Show assigned tickets only
                    </label>
                </div>
            </div>
            <table className="w-full bp35:truncate">
                <thead className="border-y border-zinc-400 bg-gray-100 font-medium text-zinc-700 text-sm dark:text-zinc-300 dark:bg-zinc-900">
                    <tr className=" h-8">
                        <th className="pl-4">PROJECT</th>
                        <th>TICKET</th>
                        <th>STATUS</th>
                        <th>CREATED ON</th>
                        <th>PRIORITY</th>
                        <th hidden={!isAdmin && !isManager}></th>
                    </tr>
                </thead>
                <tbody ref={parent}>
                    {allTickets?.map((ticket) => {
                        let {
                            _id,
                            projectName,
                            title,
                            status,
                            createdAt,
                            priority,
                        } = ticket;
                        // status and priority colors
                        let statusColor = "";
                        let priorityColor = "";
                        switch (status) {
                            case "New":
                                statusColor = "text-red-500";
                                break;
                            case "In Progress":
                                statusColor = "text-orange-500";
                                break;

                            default:
                                statusColor = "text-emerald-500";
                                break;
                        }
                        switch (priority) {
                            case "Low":
                                priorityColor = "text-yellow-500";
                                break;
                            case "Medium":
                                priorityColor = "text-orange-500";
                                break;
                            case "High":
                                priorityColor = "text-red-500";
                                break;
                            default:
                                priorityColor = "text-red-700";
                                break;
                        }

                        return (
                            <tr
                                key={_id}
                                className="h-12 border-b border-zinc-400 last:border-none hover:bg-gray-300 cursor-pointer dark:hover:bg-[#111111]"
                                onClick={() => {
                                    navigate(`/projects/${ticket.projectName}`);
                                    setSelectedTicket(ticket);
                                    setSelectedTicketId(ticket._id as string);
                                }}
                            >
                                <td className="pl-4 text-blue-500 bp35:pr-4">
                                    {projectName}
                                </td>
                                <td className="bp35:pr-4">{title}</td>
                                <td className={`${statusColor} bp35:pr-4`}>
                                    {status}
                                    {status === "Resolved" && (
                                        <BsCheckCircleFill
                                            size={19}
                                            className="inline relative bottom-[1.5px] left-[3px] bp35:hidden"
                                        />
                                    )}
                                </td>
                                <td className="bp35:pr-4">
                                    {createdAt?.split("T")[0]}
                                </td>
                                <td className={`${priorityColor} bp35:pr-4`}>
                                    {priority}{" "}
                                    {priority === "Immediate" && (
                                        <AiFillWarning
                                            size={20}
                                            className="inline relative bottom-[1.5px] bp35:hidden"
                                        />
                                    )}
                                </td>
                                <td
                                    hidden={!isAdmin && !isManager}
                                    className="bp35:pr-4"
                                >
                                    <button
                                        className="mt-[9px] mr-1 text-blue-500 hover:text-blue-700"
                                        title="Edit status"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (
                                                [
                                                    "Frogger",
                                                    "Masenko",
                                                ].includes(ticket.projectName)
                                            ) {
                                                return toast.error(
                                                    `Tickets that belong to "${ticket.projectName}" can only be edited by the website owner.`
                                                );
                                            }
                                            setSelectedTicket(ticket);
                                            setShowEditStatus(true);
                                            setStatusPlayState(PlayState.play);
                                        }}
                                    >
                                        <MdEditDocument size={20} />
                                    </button>
                                    <button
                                        className="mt-[9px] hover:text-red-700 text-red-500"
                                        title="Delete Ticket"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (
                                                ["Frogger", "Masenko"].includes(
                                                    ticket.projectName
                                                )
                                            ) {
                                                return toast.error(
                                                    `Tickets that belong to "${ticket.projectName}" can only be deleted by the website owner.`
                                                );
                                            }
                                            setSelectedTicket(ticket);
                                            setShowConfirmDelete(true);
                                            setDeletePlayState(PlayState.play);
                                        }}
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {showConfirmDelete && (
                <ConfirmDelete
                    setShowConfirmDelete={setShowConfirmDelete}
                    selectedTicket={selectedTicket!}
                    deletePlayState={deletePlayState}
                    setDeletePlayState={setDeletePlayState}
                    handleDelete={handleDelete}
                />
            )}
            {showEditStatus && (
                <EditStatus
                    setShowEditStatus={setShowEditStatus}
                    selectedTicket={selectedTicket!}
                    statusPlayState={statusPlayState}
                    setStatusPlayState={setStatusPlayState}
                    allTickets={allTickets}
                    setAllTickets={setAllTickets}
                    allTicketsCopy={allTicketsCopy}
                    setAllTicketsCopy={setAllTicketsCopy}
                />
            )}
        </div>
    );
}

export default AllTickets;
