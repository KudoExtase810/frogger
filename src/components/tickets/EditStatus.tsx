import { useState } from "react";
import { Tween, PlayState } from "react-gsap/dist";
import { RiCloseCircleFill } from "react-icons/ri";
import { editTicketStatus } from "../../api/tickets";
import { toast } from "react-hot-toast";

interface props {
    statusPlayState: PlayState;
    setStatusPlayState: React.Dispatch<React.SetStateAction<PlayState>>;
    setShowEditStatus: React.Dispatch<React.SetStateAction<boolean>>;
    selectedTicket: ticket;
    allTickets: ticket[] | undefined;
    setAllTickets: React.Dispatch<React.SetStateAction<ticket[] | undefined>>;
    allTicketsCopy: ticket[] | undefined;
    setAllTicketsCopy: React.Dispatch<
        React.SetStateAction<ticket[] | undefined>
    >;
}

function EditStatus({
    statusPlayState,
    setStatusPlayState,
    setShowEditStatus,
    selectedTicket,
    allTickets,
    setAllTickets,
    allTicketsCopy,
    setAllTicketsCopy,
}: props) {
    const [newStatus, setNewStatus] = useState<ticket["status"]>();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newStatus) return toast.error("No status selected.");
        const res = await editTicketStatus(selectedTicket._id!, newStatus!);
        if (res.status === 200) {
            setStatusPlayState(PlayState.reverse);
            setTimeout(() => setShowEditStatus(false), 401);

            const updatedTickets = allTickets?.map((ticket) =>
                ticket._id === selectedTicket._id
                    ? { ...ticket, status: newStatus }
                    : ticket
            );
            setAllTickets(updatedTickets);

            const updatedTicketsCopy = allTicketsCopy?.map((ticket) =>
                ticket._id === selectedTicket._id
                    ? { ...ticket, status: newStatus }
                    : ticket
            );
            setAllTicketsCopy(updatedTicketsCopy);

            return toast.success("Status updated successfully.");
        }
        toast.error("Failed to update the status, try again later.");
    };

    return (
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
                playState={statusPlayState}
            >
                <div className="bg-neutral-100 p-6 h-fit rounded-lg w-[500px] max-w-[98vw] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 dark:bg-zinc-800 dark:text-slate-200">
                    <header className="mb-6 font-bold text-lg">
                        Edit Ticket Status
                    </header>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 flex flex-col gap-2">
                            <select
                                required
                                className="rounded-md p-3 border border-zinc-400"
                                name="status"
                                id="status"
                                onChange={(e) => {
                                    setNewStatus(
                                        e.target.value as ticket["status"]
                                    );
                                }}
                            >
                                {["New", "In Progress", "Resolved"].map(
                                    (status, index) => (
                                        <option
                                            key={index}
                                            selected={
                                                status === selectedTicket.status
                                            }
                                            disabled={
                                                status === selectedTicket.status
                                            }
                                            value={status}
                                        >
                                            {status}{" "}
                                            {status === selectedTicket.status &&
                                                " (current status)"}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                        <button
                            className="bg-green-500 text-white w-fit mx-auto rounded-md px-4 py-2 mt-2 hover:bg-green-400"
                            type="submit"
                        >
                            Change status
                        </button>
                    </form>
                    <button
                        className="absolute top-4 right-4"
                        type="button"
                        onClick={() => {
                            setStatusPlayState(PlayState.reverse);
                            setTimeout(() => setShowEditStatus(false), 401);
                        }}
                    >
                        <RiCloseCircleFill size={32} color="rgb(239 68 68)" />
                    </button>
                </div>
            </Tween>
        </>
    );
}

export default EditStatus;
