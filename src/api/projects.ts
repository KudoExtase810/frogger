import axios from "axios";

const BASE_URL = "https://frogger.up.railway.app:5033";
const token = `Bearer ${
    localStorage.getItem("JWToken") || sessionStorage.getItem("JWToken")
}`;

// -- CREATE -- //
async function addProject(projectInfo: project) {
    const URL = BASE_URL + "/projects/add";
    const res = await axios.post(URL, projectInfo, {
        headers: { Authorization: token },
    });
    return res;
}

// -- READ -- //
async function getAllProjects() {
    const URL = BASE_URL + "/projects/all";

    const res = await axios.get(URL, { headers: { Authorization: token } });
    const projects = await res?.data;

    return projects;
}

async function getProject(name: string) {
    const URL = `${BASE_URL}/projects/${name}`;
    const res = await axios.get(URL, {
        headers: { Authorization: token },
    });

    return res;
}
// -- UPDATE -- //

async function addProjectMember(projectName: string, members: user[]) {
    const URL = `${BASE_URL}/projects/${projectName}/addmember`;
    const res = await axios.patch(
        URL,
        { members },
        {
            headers: { Authorization: token },
        }
    );
    return res;
}

// -- DELETE -- //
async function deleteProject(projectId: string) {
    const URL = `${BASE_URL}/projects/${projectId}`;
    const res = await axios.delete(URL, { headers: { Authorization: token } });
    return res;
}

async function deleteTeamMember(projectName: string, member: string) {
    const URL = `${BASE_URL}/projects/${projectName}/remove`;
    const res = await axios.patch(
        URL,
        { member },
        { headers: { Authorization: token } }
    );
    return res;
}

export {
    getAllProjects,
    addProject,
    getProject,
    addProjectMember,
    deleteProject,
    deleteTeamMember,
};
