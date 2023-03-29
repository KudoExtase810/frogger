import Navbar from "./components/Navbar";
import Projects from "./components/dashboard/Projects";
import Stats from "./components/dashboard/Stats";
import AddNewProject from "./components/dashboard/AddNewProject";
import { useState, useEffect } from "react";
import { PlayState } from "react-gsap/dist/";
import { toast } from "react-hot-toast";

function Dashboard() {
    const [showForm, setShowForm] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [allProjects, setAllProjects] = useState<project[]>();
    const [playState, setPlayState] = useState(PlayState.pause);

    useEffect(() => {
        if (showForm || showConfirmDelete)
            document.body.classList.add("overflow-y-hidden");
        else document.body.classList.remove("overflow-y-hidden");
    }, [showForm, showConfirmDelete]);

    useEffect(() => {
        if (localStorage.getItem("showWarning") !== "false") {
            toast((e) => (
                <div className="flex flex-col items-center gap-2">
                    <span>
                        Hover <b>long</b> text inside tables to see the rest of
                        it!
                    </span>
                    <button
                        className="rounded-md bg-red-500 text-white px-4 py-2"
                        onClick={() => {
                            localStorage.setItem("showWarning", "false");
                            toast.dismiss(e.id);
                        }}
                    >
                        Don't show again.
                    </button>
                </div>
            ));
        }
    }, []);

    return (
        <>
            <Navbar />

            <div className="ml-[80px] bp3:ml-0 bp3:mb-[120px]">
                <Projects
                    setPlayState={setPlayState}
                    setShowForm={setShowForm}
                    allProjects={allProjects}
                    setAllProjects={setAllProjects}
                    showConfirmDelete={showConfirmDelete}
                    setShowConfirmDelete={setShowConfirmDelete}
                />
                {showForm && (
                    <>
                        <div className="w-screen h-screen fixed inset-0 bg-gray-500 opacity-80"></div>
                        <AddNewProject
                            playState={playState}
                            setPlayState={setPlayState}
                            setShowForm={setShowForm}
                            allProjects={allProjects}
                            setAllProjects={setAllProjects}
                        />
                    </>
                )}
                <Stats />
            </div>
        </>
    );
}

export default Dashboard;
