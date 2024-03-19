import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

function Profilo() {
    const navigate = useNavigate();

    useEffect(() => {
        let username = sessionStorage.getItem("username");
        if (username === "" || username === null) {
            navigate("/login");
        }
    });

    return (
        <>
            <div className="h-screen p-2">
                <Header />
            </div>
        </>
    );
}

export default Profilo;
