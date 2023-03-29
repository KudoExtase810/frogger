import { Link } from "react-router-dom";

function AccessDenied() {
    return (
        <main className="bg-zinc-900 text-center h-screen flex flex-col justify-center">
            <h2 className="font-semibold text-8xl text-red-600 bp3:text-5xl">
                Access Denied
            </h2>
            <div className="bg-zinc-100 h-[2px] w-[250px] mx-auto my-6"></div>
            <p className="text-zinc-100 text-xl mb-6">
                Oops, it looks like you don't have access to this page 🚫
                <br />
                Perhaps doing a few pushups will give you more permission power
                💪
            </p>
            <Link
                rel="noopener noreferrer"
                to="/dashboard"
                className="px-8 py-3 font-semibold rounded w-max mx-auto hover:bg-violet-400 text-gray-900 bg-violet-500"
            >
                Back to Dashboard
            </Link>
        </main>
    );
}

export default AccessDenied;
