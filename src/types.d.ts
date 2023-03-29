type project = {
    _id?: string;
    name: string;
    desc: string | null | undefined;
    members: string[];
};
type ticket = {
    _id?: string;
    title: string;
    author?: string;
    desc: string | undefined;
    status: "New" | "In Progress" | "Resolved";
    priority: "Low" | "Medium" | "High" | "Immediate";
    type: "Issue" | "Bug" | "Feature Request" | "Error";
    timeEstimate: number;
    comments?: {
        poster: user["username"];
        comment: string;
        createdAt: string;
        id: string;
    }[];
    assignedDevs: string[];
    projectName: string;
    createdAt?: string;
};
type user = {
    _id?: string;
    username: string;
    email: string;
    password?: string;
    role: "Developer" | "Project Manager" | "Admin";
    protected: boolean;
};
