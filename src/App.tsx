import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Administration from "./Administration";
import Dashboard from "./Dashboard";
import Login from "./Login";
import NotFound from "./NotFound";
import Projects from "./Projects";
import Register from "./Register";
import Tickets from "./Tickets";

function App() {
    // had to be global in order to share between both tickets and projects page
    const [selectedTicket, setSelectedTicket] = useState<ticket>();
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
        null
    );

    const [token, setToken] = useState(
        localStorage.getItem("JWToken") || sessionStorage.getItem("JWToken")
    );

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (!theme) localStorage.setItem("theme", "light");
    }, []);

    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route
                    path="/dashboard"
                    element={token ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                    path="/tickets"
                    element={
                        token ? (
                            <Tickets
                                selectedTicket={selectedTicket}
                                setSelectedTicket={setSelectedTicket}
                                setSelectedTicketId={setSelectedTicketId}
                            />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/administration"
                    element={
                        token ? <Administration /> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/projects/:projectName"
                    element={
                        token ? (
                            <Projects
                                selectedTicket={selectedTicket}
                                setSelectedTicket={setSelectedTicket}
                                selectedTicketId={selectedTicketId}
                                setSelectedTicketId={setSelectedTicketId}
                            />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
