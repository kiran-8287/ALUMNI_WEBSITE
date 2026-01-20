import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";
import logo from "../../assets/iar.png"

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const seen = localStorage.getItem("introSeen");
    if (seen) {
      navigate("/home");
    }

    const timer = setTimeout(() => {
      localStorage.setItem("introSeen", "true");
      navigate("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="intro">
      <img src={logo} className="logo" alt="Campus Placement Cell" />
      <p className="tagline">Global Opportunities, Lifelong Connections</p>
    </div>
  );
}
