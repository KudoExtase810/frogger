import Actions from "./components/administration/Actions";
import Organization from "./components/administration/Organization";
import Navbar from "./components/Navbar";
import { useState } from "react";
import useAuth from "./hooks/useAuth";
import AccessDenied from "./AccessDenied";

function Administration() {
    const [allUsers, setAllUsers] = useState<user[]>();
    const [filteredUsers, setFilteredUsers] = useState(allUsers);
    const [selectedUser, setSelectedUser] = useState<user>();

    const { isAdmin } = useAuth();
    if (!isAdmin) return <AccessDenied />;
    return (
        <>
            <Navbar />
            <div className="ml-[80px] bp3:ml-0 bp3:mb-[120px]">
                <Organization
                    allUsers={allUsers}
                    setAllUsers={setAllUsers}
                    setSelectedUser={setSelectedUser}
                    filteredUsers={filteredUsers}
                    setFilteredUsers={setFilteredUsers}
                />
                <Actions
                    allUsers={allUsers}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    filteredUsers={filteredUsers}
                    setFilteredUsers={setFilteredUsers}
                    setAllUsers={setAllUsers}
                />
            </div>
        </>
    );
}

export default Administration;
