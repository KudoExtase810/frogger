import { Tween, PlayState } from "react-gsap/dist";

interface props {
    setShowConfirmDelete: React.Dispatch<React.SetStateAction<boolean>>;
    member: string;
    projectName: string;
    handleDelete: (member: string) => Promise<string | undefined>;
    deletePlayState: PlayState;
    setDeletePlayState: React.Dispatch<React.SetStateAction<PlayState>>;
}

function ConfirmDeleteMember({
    setShowConfirmDelete,
    member,
    projectName,
    handleDelete,
    deletePlayState,
    setDeletePlayState,
}: props) {
    return (
        <>
            <div className="w-screen h-screen fixed inset-0 bg-gray-500 opacity-80 z-[9]"></div>
            <Tween
                from={{
                    opacity: 0,
                    scale: 0.5,
                    z: -1000,
                }}
                to={{
                    opacity: 1,
                    scale: 1,
                    z: 0,
                }}
                duration={0.4}
                ease="power3.out"
                playState={deletePlayState}
            >
                <div className="bg-neutral-100 py-6 px-9 h-fit rounded-lg fixed w-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-zinc-800 dark:text-slate-200 z-20">
                    <h3 className="my-6">
                        Are you sure you want to remove
                        <b>"{member}"</b> from <b>"{projectName}"</b>?
                    </h3>
                    <div className="flex justify-center gap-12">
                        <button
                            type="button"
                            className="bg-blue-500 text-white w-fit rounded-md px-4 py-2 mt-2 hover:bg-blue-400"
                            onClick={() => {
                                setDeletePlayState(PlayState.reverse);
                                setTimeout(
                                    () => setShowConfirmDelete(false),
                                    401
                                );
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 text-white w-fit rounded-md px-4 py-2 mt-2 hover:bg-red-400"
                            onClick={() => handleDelete(member)}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Tween>
        </>
    );
}

export default ConfirmDeleteMember;
