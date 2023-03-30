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

// -- READ -- //
async function getAllUsers() {
    const URL = BASE_URL + "/users/all";
    const res = await axios.get(URL, { headers: { Authorization: getToken() } });
    return await res.data;
}
// -- UPDATE -- //
async function editUserInfo(
    id: user["_id"],
    newInfo: { username: string; email: string }
) {
    const URL = `${BASE_URL}/users/${id}`;
    const res = await axios.put(
        URL,
        { username: newInfo.username, email: newInfo.email },
        {
            headers: { Authorization: getToken() },
        }
    );
    return res;
}

async function assignRole(id: user["_id"], newRole: user["role"]) {
    const URL = `${BASE_URL}/users/${id}`;
    const res = await axios.patch(
        URL,
        { newRole },
        {
            headers: { Authorization: getToken() },
        }
    );
    return res;
}

// -- DELETE -- //
async function deleteUser(id: user["_id"]) {
    const URL = `${BASE_URL}/users/${id}`;
    const res = await axios.delete(URL, {
        headers: { Authorization: getToken() },
    });
    return res;
}

export { getAllUsers, assignRole, editUserInfo, deleteUser };
