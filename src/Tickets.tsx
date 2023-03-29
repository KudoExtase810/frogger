import Navbar from "./components/Navbar";
import AllTickets from "./components/tickets/AllTickets";
import { useState, useEffect } from "react";

interface props {
    selectedTicket: ticket | undefined;
    setSelectedTicket: React.Dispatch<React.SetStateAction<ticket | undefined>>;
    setSelectedTicketId: React.Dispatch<React.SetStateAction<string | null>>;
}

function Tickets({
    selectedTicket,
    setSelectedTicket,
    setSelectedTicketId,
}: props) {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showEditStatus, setShowEditStatus] = useState(false);

    useEffect(() => {
        if (showEditStatus || showConfirmDelete)
            document.body.classList.add("overflow-y-hidden");
        else document.body.classList.remove("overflow-y-hidden");
    }, [showEditStatus, showConfirmDelete]);

    return (
        <>
            <Navbar />
            <div className="ml-[80px] bp3:ml-0 bp3:mb-[120px]">
                <AllTickets
                    selectedTicket={selectedTicket}
                    setSelectedTicket={setSelectedTicket}
                    setSelectedTicketId={setSelectedTicketId}
                    showConfirmDelete={showConfirmDelete}
                    setShowConfirmDelete={setShowConfirmDelete}
                    showEditStatus={showEditStatus}
                    setShowEditStatus={setShowEditStatus}
                />
            </div>
        </>
    );
}

export default Tickets;
