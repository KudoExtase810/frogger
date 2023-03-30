import axios from "axios";
const BASE_URL = "https://frogger.up.railway.app";
const getToken = () => {
    let token = `Bearer ${
        localStorage.getItem("JWToken") || sessionStorage.getItem("JWToken")
    }`;
    if (token === "Bearer null") {
        setTimeout(() => {
            token = `Bearer ${
                localStorage.getItem("JWToken") ||
                sessionStorage.getItem("JWToken")
            }`;
        }, 1);
    }
    return token;
};

// -- CREATE -- //
async function addTicket(ticketInfo: ticket) {
    const URL = BASE_URL + "/tickets/add";

    const res = await axios.post(URL, ticketInfo, {
        headers: { Authorization: getToken() },
    });

    return res;
}
// -- READ -- //
async function getAllTickets() {
    const URL = BASE_URL + "/tickets/all";
    const res = await axios.get(URL, { headers: { Authorization: getToken() } });
    const tickets = await res.data;

    return tickets;
}

async function getTicketById(id: string) {
    const URL = `${BASE_URL}/tickets/${id}`;
    const res = await axios.get(URL, { headers: { Authorization: getToken() } });
    const ticket = await res.data;

    return ticket;
}

// -- UPDATE -- //
async function addComment(
    ticketId: string,
    comment: string,
    poster: user["username"]
) {
    const URL = `${BASE_URL}/tickets/${ticketId}/comment`;
    const res = await axios.patch(
        URL,
        { comment, poster },
        { headers: { Authorization: getToken() } }
    );
    return res.data;
}

async function deleteComment(ticketId: string, commentId: string) {
    const URL = `${BASE_URL}/tickets/${ticketId}/comments/delete`;
    const res = await axios.patch(
        URL,
        { commentId },
        { headers: { Authorization: getToken() } }
    );
    return res;
}

async function editTicketStatus(ticketId: string, newStatus: ticket["status"]) {
    const URL = `${BASE_URL}/tickets/status/${ticketId}`;
    const res = await axios.patch(
        URL,
        { status: newStatus },
        { headers: { Authorization: getToken() } }
    );
    return res;
}
// -- DELETE -- //
async function deleteTicket(ticketId: string) {
    const URL = `${BASE_URL}/tickets/${ticketId}`;
    const res = await axios.delete(URL, { headers: { Authorization: getToken() } });
    return res;
}

export {
    getAllTickets,
    addTicket,
    getTicketById,
    addComment,
    deleteComment,
    editTicketStatus,
    deleteTicket,
};
