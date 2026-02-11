import { useState, useEffect } from "react";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import "./AlumniDirectory.css";
import { getAuth} from "firebase/auth"
const AlumniDirectory = () => {
  const [filters, setFilters] = useState({
    name: "",
    campusID: "",
    yearOfPassOut: "",
    department: "",
    degree: "",
  });

  const [alumniData, setAlumniData] = useState([]);
  const [years, setYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);

  const BASE_URL = "https://alumni-website-v7pq.onrender.com";

  useEffect(() => {
    fetch(`${BASE_URL}/passout-years`)
      .then((res) => res.json())
      .then((data) => setYears(data))
      .catch((err) => console.error("Error fetching years:", err));

    fetch(`${BASE_URL}/departments`)
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error("Error fetching departments:", err));

    fetch(`${BASE_URL}/degrees`)
      .then((res) => res.json())
      .then((data) => setDegrees(data))
      .catch((err) => console.error("Error fetching degrees:", err));
  }, []);

      const handleSearch = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error("User not logged in");
          return;
        }

        const token = await user.getIdToken();

        const res = await fetch(
          `${BASE_URL}/alumni?${new URLSearchParams(filters).toString()}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        const data = await res.json();
        console.log("Fetched alumni data:", data);
        setAlumniData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching alumni:", err);
        setAlumniData([]);
      }
    };


  return (
    <div className="alumni-page">
      <Navbar />
      <div className="filter-container">
        <select
          value={filters.yearOfPassOut}
          onChange={(e) => setFilters({ ...filters, yearOfPassOut: e.target.value })}
        >
          <option value="">Select Year</option>
          {years.map((item) => (
            <option key={item.YearOfPassOut} value={item.YearOfPassOut}>
              {item.YearOfPassOut}
            </option>
          ))}
        </select>

        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        >
          <option value="">Select Department</option>
          {departments.map((item) => (
            <option key={item.Deparment} value={item.Deparment}>
              {item.Deparment}
            </option>
          ))}
        </select>

        <select
          value={filters.degree}
          onChange={(e) => setFilters({ ...filters, degree: e.target.value })}
        >
          <option value="">Select Degree</option>
          {degrees.map((item) => (
            <option key={item.Degree} value={item.Degree}>
              {item.Degree}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Campus ID"
          value={filters.campusID}
          onChange={(e) => setFilters({ ...filters, campusID: e.target.value })}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="alumni-list">
        {alumniData.map((alumni, index) => (
          <div key={index} className="alumni-card">
        <h3>{alumni.Name}</h3>
        <p><strong>Email:</strong> {alumni.Email}</p>

        {alumni.LikedlnProfile && (
          <p>
            <strong>LinkedIn:</strong>{" "}
            <a
              href={alumni.LikedlnProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-link"
            >
              {alumni.LikedlnProfile}
            </a>
          </p>
        )}

        <p><strong>Current Location:</strong> {alumni.Current_Location}</p>
        <p><strong>Organisation:</strong> {alumni.Organisation}</p>
        <p><strong>Designation:</strong> {alumni.Designation}</p>
        <p><strong>Awards:</strong> {alumni.Awards}</p>
      </div>

        ))}
      </div>
      <Footer />
    </div>
  );
};

export default AlumniDirectory;
