import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { addComment, deleteComment, getTicketById } from "../../api/tickets";
import useAuth from "../../hooks/useAuth";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "react-hot-toast";
import { activateTextTruncateScroll } from "text-truncate-scroll";

interface props {
    selectedTicketId: string | null;
    selectedTicket: ticket;
    setSelectedTicket: React.Dispatch<React.SetStateAction<ticket | undefined>>;
}

function TikcetInfo({
    selectedTicketId,
    selectedTicket,
    setSelectedTicket,
}: props) {
    const [comment, setComment] = useState("");
    const [numComments, setNumComments] = useState(0);

    const { username, isAdmin, isManager } = useAuth();

    useEffect(() => {
        if (selectedTicketId) {
            try {
                const getTicket = async () => {
                    const ticket: ticket = await getTicketById(
                        selectedTicketId!
                    );
                    setSelectedTicket(ticket);
                    setNumComments(
                        ticket.comments ? ticket.comments.length : 0
                    );
                };
                getTicket();
            } catch (error) {}
        }
    }, [selectedTicketId, numComments]);

    useEffect(() => {
        activateTextTruncateScroll();
    }, [selectedTicket, selectedTicketId]);

    const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (comment.length < 2) {
            return toast.error("Comments must be atleast 2 characters long.");
        }
        try {
            await addComment(selectedTicketId!, comment, username!);
            setComment("");
            setNumComments(numComments + 1);
        } catch (error) {}
    };

    const handleDeleteComment = async (ticketId: string, commentId: string) => {
        const res = await deleteComment(ticketId, commentId);
        if (res.status === 200) {
            setComment("");
            setNumComments(numComments - 1);
            return;
        }
        toast.error("Error deleting the comment, try again later.");
    };

    const [parent] = useAutoAnimate();

    if (!selectedTicket)
        return (
            <div className="mx-auto mt-12 w-[93vw] bp1:w-[91.5vw] bp15:w-[90.4vw] bp2:w-[89.4vw] bp3:w-[97vw] bg-white rounded-lg p-4 dark:bg-zinc-800 dark:text-slate-50">
                No ticket selected.
            </div>
        );

    return (
        <div className="mx-auto mt-12 w-[93vw] bg-white rounded-lg p-4 dark:bg-zinc-800 dark:text-slate-50 bp1:w-[91.5vw] bp15:w-[90.4vw] bp2:w-[89.4vw] bp3:w-[97vw]">
            <h2 className="p-4 text-lg font-bold border-b border-zinc-400 mb-7">
                Selected Ticket Info
            </h2>
            <div className="flex justify-between bp15:flex-col gap-10">
                <div className="p-4 shadow shadow-zinc-400 dark:shadow-zinc-100 text-left w-3/5 rounded bp15:w-full">
                    <table className="w-full mb-10">
                        <thead className="text-zinc-400 text-sm">
                            <tr>
                                <th>TITLE</th>
                                <th>AUTHOR</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{selectedTicket?.title}</td>
                                <td>{selectedTicket?.author}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="w-full mb-5">
                        <thead className="text-zinc-400 text-sm">
                            <tr>
                                <th>DESCRIPTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <p className="w-[90%] break-all">
                                        {selectedTicket.desc}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="w-full mb-5">
                        <thead className="text-zinc-400 text-sm">
                            <tr>
                                <th>STATUS</th>
                                <th>PRIORITY</th>
                                <th>TYPE</th>
                                <th>TIME ESTIMATE (H)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{selectedTicket?.status}</td>
                                <td>{selectedTicket?.priority}</td>
                                <td>{selectedTicket?.type}</td>
                                <td>{selectedTicket?.timeEstimate}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="border-t border-zinc-400 pt-5 w-full">
                        <thead className="text-zinc-400 text-sm">
                            <tr>
                                <th className="pt-5">ASSIGNED DEVS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {selectedTicket.assignedDevs.length > 1 ? (
                                        <div className="w-[96%]">
                                            <div className="text-truncate-scroll">
                                                <ul className="flex gap-3">
                                                    {selectedTicket?.assignedDevs.map(
                                                        (dev, index) => (
                                                            <li key={index}>
                                                                {dev}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <span>
                                            {selectedTicket.assignedDevs[0]}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="shadow shadow-zinc-400 dark:shadow-zinc-100 p-4 w-[38%] rounded h-max bp15:w-full">
                    <h2 className="p-4 text-lg font-bold border-b border-zinc-400 mb-7">
                        Add Comments
                    </h2>
                    <form onSubmit={handleComment}>
                        <input
                            type="text"
                            className="border border-zinc-400 rounded-l-md px-2 h-[40px] w-[calc(100%-106.23px)] text-black"
                            placeholder="Enter a comment."
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                        />
                        <button
                            type="submit"
                            className="px-3 h-[40px] rounded-r bg-violet-500 text-white"
                        >
                            Comment
                        </button>
                    </form>
                </div>
            </div>
            <div className="shadow shadow-zinc-400 dark:shadow-zinc-100 p-4 w-full rounded h-max mt-5">
                <h2 className="p-4 text-lg font-bold border-b border-zinc-400 mb-7">
                    Comments
                </h2>
                {selectedTicket?.comments?.length !== 0 ? (
                    <ul ref={parent}>
                        {selectedTicket?.comments?.map((comment, index) => (
                            <li
                                key={index}
                                className="px-6 py-4 rounded-md p-1 mb-3 shadow shadow-zinc-400 dark:shadow-zinc-100"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <b>{comment.poster}</b>
                                        <span className="text-sm">
                                            {comment.createdAt}
                                        </span>
                                    </div>
                                    <button
                                        hidden={
                                            !isAdmin &&
                                            !isManager &&
                                            comment.poster !== username
                                        }
                                        type="button"
                                        className="bg-red-500 p-[5px] rounded"
                                        onClick={() => {
                                            handleDeleteComment(
                                                selectedTicketId!,
                                                comment.id
                                            );
                                        }}
                                    >
                                        <FaTrash
                                            size={20}
                                            className="text-white hover:text-zinc-900"
                                        />
                                    </button>
                                </div>
                                <p className="break-all">{comment.comment}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span>This ticket has no comments.</span>
                )}
            </div>
        </div>
    );
}

export default TikcetInfo;
