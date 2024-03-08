import React from "react";
import Header from "./components/Header";
import SearchView from "./components/SearchView";
import Footer from "./components/Footer";

function App() {
    return (
        <>
            <div className="p-4 bg-white dark:bg-gray-950 h-screen space-y-4 flex flex-col">
                <Header></Header>
                <SearchView></SearchView>
                <Footer></Footer>
            </div>
        </>
    );
}

export default App;
