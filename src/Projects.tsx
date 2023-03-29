import Navbar from "./components/Navbar";
import ProjectTickets from "./components/projects/ProjectTickets";
import Team from "./components/projects/Team";
import TikcetInfo from "./components/projects/TikcetInfo";
import { useEffect, useState } from "react";
import AddNewTicket from "./components/projects/AddNewTicket";
import AddNewMember from "./components/projects/AddNewMember";
import { PlayState } from "react-gsap/dist";
import { useParams } from "react-router-dom";
import { getProject } from "./api/projects";
import NotFound from "./NotFound";

interface props {
    selectedTicket: ticket | undefined;
    setSelectedTicket: React.Dispatch<React.SetStateAction<ticket | undefined>>;
    selectedTicketId: string | null;
    setSelectedTicketId: React.Dispatch<React.SetStateAction<string | null>>;
}

function Projects({
    selectedTicket,
    setSelectedTicket,
    selectedTicketId,
    setSelectedTicketId,
}: props) {
    const [showForm, setShowForm] = useState(false);
    const [showAddMembers, setShowAddMembers] = useState(false);

    const [projectTickets, setProjectTickets] = useState<ticket[]>();

    const [ticketsPlayState, setTicketsPlayState] = useState(PlayState.pause);
    const [membersPlayState, setMembersPlayState] = useState(PlayState.pause);

    useEffect(() => {
        if (showForm || showAddMembers)
            document.body.classList.add("overflow-y-hidden");
        else document.body.classList.remove("overflow-y-hidden");
    }, [showForm, showAddMembers]);

    const params = useParams();
    const { projectName } = params;

    const [exists, setExists] = useState(true); // to check if the project exists
    useEffect(() => {
        try {
            const checkExists = async () => {
                const res: any = await getProject(projectName!);
                if (res.response?.status === 404) {
                    setExists(false);
                    return;
                }
                setExists(true);
            };
            checkExists();
        } catch (error: any) {}
    }, []);

    useEffect(() => {
        if (selectedTicket && selectedTicket.projectName !== projectName) {
            setSelectedTicket(undefined);
            setSelectedTicketId(null);
        }
    }, []);

    if (!exists) return <NotFound />;
    return (
        <>
            <Navbar />
            <div className="ml-[80px] bp3:ml-auto bp3:mb-[120px] bp3:w-[97vw] mx-auto">
                <div className="w-[93vw] mx-auto flex justify-between items-start bp1:flex-col bp1:items-center bp1:justify-start bp1:gap-4 bp1:w-[91.5vw] bp15:w-[90.4vw] bp2:w-[89.4vw] bp3:w-[97vw]">
                    <Team
                        showAddMembers={showAddMembers}
                        setShowAddMembers={setShowAddMembers}
                        setPlayState={setMembersPlayState}
                    />
                    {showAddMembers && (
                        <>
                            <div className="w-screen h-screen fixed inset-0 bg-gray-500 opacity-80 z-[8]"></div>
                            <AddNewMember
                                setShowAddMembers={setShowAddMembers}
                                playState={membersPlayState}
                                setPlayState={setMembersPlayState}
                            />
                        </>
                    )}
                    <ProjectTickets
                        setShowForm={setShowForm}
                        setSelectedTicketId={setSelectedTicketId}
                        projectTickets={projectTickets}
                        setProjectTickets={setProjectTickets}
                        setPlayState={setTicketsPlayState}
                        setSelectedTicket={setSelectedTicket}
                    />
                    {showForm && (
                        <>
                            <div className="w-screen h-screen fixed inset-0 bg-gray-500 opacity-80 z-[8]"></div>
                            <AddNewTicket
                                setShowForm={setShowForm}
                                projectTickets={projectTickets}
                                setProjectTickets={setProjectTickets}
                                playState={ticketsPlayState}
                                setPlayState={setTicketsPlayState}
                            />
                        </>
                    )}
                </div>
                <TikcetInfo
                    selectedTicketId={selectedTicketId}
                    selectedTicket={selectedTicket!}
                    setSelectedTicket={setSelectedTicket}
                />
            </div>
        </>
    );
}

export default Projects;
