import jwtDecode from "jwt-decode";

// payload interface
interface jwtPayload {
    id: string;
    username: string;
    role: string;
    isProtected: boolean;
    jti: string;
    iat: number;
    exp: number;
}

// Get the JWT from local/session storage
function getJWT() {
    const jwt =
        localStorage.getItem("JWToken") || sessionStorage.getItem("JWToken");
    if (jwt) {
        return jwt;
    }
    throw new Error("No jwt found");
}

// Hook (a way to get the name && role of the user)
const useAuth = () => {
    const token = getJWT();
    let isManager = false;
    let isAdmin = false;
    if (token) {
        const decoded: jwtPayload = jwtDecode(token);
        const { id, username, role, isProtected } = decoded;
        if (role === "Admin") isAdmin = true;
        if (role === "Project Manager") isManager = true;
        return { id, username, isAdmin, isManager, isProtected };
    }
    return {};
};
export default useAuth;
