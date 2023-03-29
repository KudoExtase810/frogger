import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js/auto";
import { useEffect, useState } from "react";
import { getAllTickets } from "../../api/tickets";
import ClipLoader from "react-spinners/ClipLoader";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Stats() {
    const [allTickets, setAllTickets] = useState<ticket[]>([]);
    const [ticketsData, setTicketsData] = useState<any>(null);

    useEffect(() => {
        try {
            const getData = async () => {
                const tickets = await getAllTickets();
                setAllTickets(tickets);
            };
            getData();
        } catch (error) {}
    }, []);

    useEffect(() => {
        setTicketsData({
            byPriority: {
                labels: ["Priority"],
                datasets: [
                    {
                        label: "Low",
                        data: [
                            allTickets
                                .map((ticket) => ticket.priority)
                                .filter((priority) => priority === "Low")
                                .length,
                        ],
                        backgroundColor: "rgba(39, 219, 102,0.6)",
                        borderColor: "rgba(0, 219, 77)",
                        borderWidth: 1,
                    },
                    {
                        label: "Medium",
                        data: [
                            allTickets
                                .map((ticket) => ticket.priority)
                                .filter((priority) => priority === "Medium")
                                .length,
                        ],
                        backgroundColor: "rgba(224, 224, 43,0.6)",
                        borderColor: "rgba(219, 219, 0)",
                        borderWidth: 1,
                    },
                    {
                        label: "High",
                        data: [
                            allTickets
                                .map((ticket) => ticket.priority)
                                .filter((priority) => priority === "High")
                                .length,
                        ],
                        backgroundColor: "rgba(230, 101, 37,0.6)",
                        borderColor: "rgba(232, 77, 0)",
                        borderWidth: 1,
                    },
                    {
                        label: "Immediate",
                        data: [
                            allTickets
                                .map((ticket) => ticket.priority)
                                .filter((priority) => priority === "Immediate")
                                .length,
                        ],
                        backgroundColor: "rgba(247, 79, 79,0.6)",
                        borderColor: "rgba(247, 42, 42)",
                        borderWidth: 1,
                    },
                ],
            },
            byType: {
                labels: ["Type"],
                datasets: [
                    {
                        label: "Issue",
                        data: [
                            allTickets
                                .map((ticket) => ticket.type)
                                .filter((type) => type === "Issue").length,
                        ],
                        backgroundColor: "rgba(5, 225, 242, 0.6)",
                        borderColor: "rgba(2, 145, 156)",
                        borderWidth: 1,
                    },
                    {
                        label: "Bug",
                        data: [
                            allTickets
                                .map((ticket) => ticket.type)
                                .filter((type) => type === "Bug").length,
                        ],
                        backgroundColor: "rgba(42, 84, 222, 0.6)",
                        borderColor: "rgba(4, 53, 214)",
                        borderWidth: 1,
                    },
                    {
                        label: "Error",
                        data: [
                            allTickets
                                .map((ticket) => ticket.type)
                                .filter((type) => type === "Error").length,
                        ],
                        backgroundColor: "rgba(107, 49, 214, 0.6)",
                        borderColor: "rgba(78, 8, 207)",
                        borderWidth: 1,
                    },
                    {
                        label: "Feature Request",
                        data: [
                            allTickets
                                .map((ticket) => ticket.type)
                                .filter((type) => type === "Feature Request")
                                .length,
                        ],
                        backgroundColor: "rgba(235, 54, 232, 0.6)",
                        borderColor: "rgba(207, 4, 203)",
                        borderWidth: 1,
                    },
                ],
            },
            byStatus: {
                labels: ["Status"],
                datasets: [
                    {
                        label: "New",
                        data: [
                            allTickets
                                .map((ticket) => ticket.status)
                                .filter((status) => status === "New").length,
                        ],
                        backgroundColor: "rgba(230, 101, 37,0.6)",
                        borderColor: "rgba(232, 77, 0)",
                        borderWidth: 1,
                    },
                    {
                        label: "In Progress",
                        data: [
                            allTickets
                                .map((ticket) => ticket.status)
                                .filter((status) => status === "In Progress")
                                .length,
                        ],
                        backgroundColor: "rgba(224, 224, 43,0.6)",
                        borderColor: "rgba(219, 219, 0)",
                        borderWidth: 1,
                    },
                    {
                        label: "Resolved",
                        data: [
                            allTickets
                                .map((ticket) => ticket.status)
                                .filter((status) => status === "Resolved")
                                .length,
                        ],
                        backgroundColor: "rgba(39, 219, 102,0.6)",
                        borderColor: "rgba(0, 219, 77)",
                        borderWidth: 1,
                    },
                ],
            },
        });
    }, [allTickets]);

    return (
        <div className="flex w-[93vw] bp0:w-[92vw] bp1:w-[90vw] bp2:w-[88vw] bp3:w-[97vw] justify-between mx-auto mb-8  dark:text-slate-50 flex-wrap bp3:flex-col bp3:gap-6">
            <div className="bg-white w-[32%] rounded-lg p-4 dark:bg-zinc-800 bp05:w-[45vw] bp1:w-[43vw] bp3:w-[97vw]">
                <div className="my-2 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Tickets by Status</h2>
                </div>
                {ticketsData ? (
                    <Bar data={ticketsData.byStatus} />
                ) : (
                    <div className="h-[200px] flex justify-center items-center">
                        <ClipLoader
                            color="rgb(168,85,247)"
                            role="status"
                            speedMultiplier={0.75}
                            size={64}
                        />
                    </div>
                )}
            </div>
            <div className="bg-white w-[32%] rounded-lg p-4 dark:bg-zinc-800 bp05:w-[45vw] bp1:w-[43vw] bp3:w-[97vw]">
                <div className="my-2 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Tickets by Type</h2>
                </div>
                {ticketsData ? (
                    <Bar data={ticketsData.byType} />
                ) : (
                    <div className="h-[200px] flex justify-center items-center">
                        <ClipLoader
                            color="rgb(168,85,247)"
                            role="status"
                            speedMultiplier={0.75}
                            size={64}
                        />
                    </div>
                )}
            </div>
            <div className="bg-white w-[32%] rounded-lg p-4 dark:bg-zinc-800 bp05:w-[45vw] bp05:mt-7 bp05:mx-auto bp1:w-[43vw] bp3:w-[97vw] bp3:mt-0">
                <div className="my-2 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Tickets by Priority</h2>
                </div>
                {ticketsData ? (
                    <Bar data={ticketsData.byPriority} />
                ) : (
                    <div className="h-[200px] flex justify-center items-center">
                        <ClipLoader
                            color="rgb(168,85,247)"
                            role="status"
                            speedMultiplier={0.75}
                            size={64}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Stats;
