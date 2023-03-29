/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                rubik: ["Rubik, sans-serif"],
            },
            screens: {
                bp0: { max: "1630px" },
                bp05: { max: "1500px" },
                bp1: { max: "1380px" },
                bp15: { max: "1293px" },
                bp2: { max: "1064px" },
                bp3: { max: "864px" },
                bp35: { max: "780px" },
                bp4: { max: "540px" },
                bp5: { max: "480px" },
                bp6: { max: "395px" },
            },
        },
    },
    plugins: [],
};
