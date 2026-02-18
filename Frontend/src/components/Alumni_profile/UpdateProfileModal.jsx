import React, { useEffect, useRef, useState } from "react";
import "./UpdateProfileModal.css";
import pic from './profile_pic.png';
import useStore from "../../Store";
import { getAuth} from "firebase/auth"
const auth = getAuth();
const UpdateProfileModal = ({ isOpen, onClose, onSuccess }) => {
  const modalRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const email = useStore((state) => state.userEmail);
  const tokenId = useStore((state) => state.tokenId);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lastFetchedUid = useRef(null);

// ✅ 1. Listen to auth state once
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setProfile(null);              // reset old profile
      lastFetchedUid.current = null; // allow refetch for new user
    });

    return () => unsubscribe();
  }, []);
 // ✅ 2. Fetch profile safely
  useEffect(() => {
    if (!isOpen || !currentUser) return;

    // prevent duplicate fetch for same user
    if (lastFetchedUid.current === currentUser.uid) return;

    lastFetchedUid.current = currentUser.uid;

    const controller = new AbortController();

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await currentUser.getIdToken();

        const res = await fetch(
          "https://alumni-website-v7pq.onrender.com/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch profile");
        }

        const data = await res.json();
        setProfile(data);

      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
          setError("Unable to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => controller.abort(); // cancel if component unmounts

  }, [isOpen, currentUser]);



  // useEffect(() => {
  //   if (!isOpen) return;
  //   if (!tokenId) {
  //     console.error("No token available");
  //     return;
  //   }
  //   if (!email) {
  //     console.error("No email found");
  //     return;
  //   }
  //   else {
  //     console.log(email);
  //   }
  //   fetch("https://alumni-website-v7pq.onrender.com/api/profile", {
  //   headers: {
  //     Authorization: `Bearer ${tokenId}`,
  //   },
  // })
  //   .then(async (res) => {
  //     if (!res.ok) {
  //       const text = await res.text();
  //       console.error("Backend error:", text);
  //       throw new Error(`HTTP error! status: ${res.status}`);
  //     }
  //     return res.json();
  //   })
  //   .then((data) => setProfile(data))
  //   .catch((err) => console.error("Error fetching profile:", err));
  // }, [isOpen]);

  useEffect(() => {
    if (isOpen && profile && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      modalRef.current.focus();
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  if (!profile) {
    return (
      <div className="update-modal-overlay" onClick={onClose}>
        <div className="update-modal" onClick={(e) => e.stopPropagation()}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="update-modal-overlay" onClick={onClose}>
      <div
        className="update-modal"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="update-modal-header">
          <h2>Update Profile Information</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form
          className="update-form"
          onSubmit={async(e) => {
          e.preventDefault();
            
          if (!currentUser) {
            alert("User not authenticated");
            return;
          }
          const form = e.target;
          const formData = new FormData(form);

            const updatedData = {
              Name: formData.get("name"),
              Email: formData.get("email"),
              Gender: formData.get("gender"),
              DateOfBirth: formData.get("dob"),
              PermanentAddress: formData.get("address"),
              EmployeeSector: formData.get("sector"),
              CurrentCTC: formData.get("ctc"),
              Deparment: formData.get("department"),
              Degree: formData.get("degree"),
              YearOfPassOut: formData.get("year"),
              ContactNumber1: formData.get("contact1"),
              ContactNumber2: formData.get("contact2"),
              WhatsAppNumber: formData.get("whatsapp"),
              CountryCode: formData.get("country"),
              LikedInProfile: formData.get("linkedin"),
              Hostel: formData.get("hostel"),
              Awards: formData.get("awards"),
              Designation: formData.get("designation"),
              Organisation: formData.get("organisation"),
              Current_Location: formData.get("location"),
              testimonial: formData.get("testimonial"),

            CampusPlacement: {
            Placed: formData.get("placed") === "true",
            Company: formData.get("placementCompany"),
            Role: formData.get("placementRole"),
            Package: formData.get("placementPackage"),
            Year: formData.get("placementYear"),
          },
              verified: false,
            };


        
          try {
            const token = await currentUser.getIdToken(); // ✅ get fresh token

    const res = await fetch(
      "https://alumni-website-v7pq.onrender.com/api/profile",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ now valid
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to update profile");
    }

    onSuccess();
    onClose();

  }catch (err) {
    console.error("Error updating profile:", err);
    alert("Failed to update profile. Try again.");
  }

          }}
        >
          <h3 className="section-heading">Personal Information</h3>
          <div className="section-divider" />

          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" type="text" defaultValue={profile.Name || ""} required />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input name="email" type="email" defaultValue={profile.Email || ""} required />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" defaultValue={profile.Gender || ""}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date of Birth *</label>
              <input 
                name="dob" 
                type="date" 
                defaultValue={profile.DateOfBirth || ""} 
              />
            </div>

            <div className="form-group">
              <label>Permanent Address *</label>
              <textarea
                name="address"
                defaultValue={profile.PermanentAddress || ""}
              />
            </div>


            <div className="form-group">
              <label>Department *</label>
              <select name="department" defaultValue={profile.Deparment || ""} required>
                <option>Chemistry</option>
                <option>Civil Engineering</option>
                <option>Computer Science & Engineering</option>
                <option>Computing and Mathematics</option>
                <option>Data Science</option>
                <option>Electrical Engineering</option>
                <option>Geotechnical Engineering</option>
                <option>Manufacturing and Materials Engineering</option>
                <option>Mathematics</option>
                <option>Mechanical Engineering</option>
                <option>Physics</option>
                <option>Power Electronics and Power Systems</option>
                <option>System-on-Chip Design</option>
              </select>
            </div>

            <div className="form-group">
              <label>Degree Program *</label>
              <select name="degree" defaultValue={profile.Degree || ""} required>
                <option>Bachelor of Technology Honors(B.Tech Hons.)</option>
                <option>Bachelor of Technology (B.Tech)</option>
                <option>Master of Technology (M.Tech)</option>
                <option>Master of Science (M.S.)</option>
                <option>Master of Science (M.Sc)</option>
                <option>Doctor of Philosophy (Ph.D.)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Graduation Year *</label>
              <input name="year" type="text" defaultValue={profile.YearOfPassOut || ""} required />
            </div>

            <div className="form-group">
              <label>Contact Number 1 *</label>
              <input name="contact1" type="text" defaultValue={profile.ContactNumber1 || ""} required />
            </div>

            <div className="form-group">
              <label>Contact Number 2</label>
              <input name="contact2" type="text" defaultValue={profile.ContactNumber2 || ""} />
            </div>

            <div className="form-group">
              <label>Whatsapp Number *</label>
              <input name="whatsapp" type="text" defaultValue={profile.WhatsAppNumber || ""} required />
            </div>

            <div className="form-group">
              <label>Country Code *</label>
              <input name="country" type="text" defaultValue={profile.CountryCode || ""} required />
            </div>

            <div className="form-group">
              <label>LinkedIn Profile *</label>
              <input name="linkedin" type="text" defaultValue={profile.LikedInProfile || ""} required />
            </div>

            <div className="form-group">
              <label>Hostel *</label>
              <input name="hostel" type="text" defaultValue={profile.Hostel || ""} required />
            </div>

            <div className="form-group">
              <label>Awards</label>
              <input name="awards" type="text" defaultValue={profile.Awards || ""} />
            </div>
          </div>

          <h3 className="section-heading">Professional Information</h3>
          <div className="section-divider" />

          <div className="form-group">
            <label>Job Title</label>
            <input name="designation" type="text" defaultValue={profile.Designation || ""} />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input name="organisation" type="text" defaultValue={profile.Organisation || ""} />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input name="location" type="text" defaultValue={profile.Current_Location || ""} />
          </div>

          <div className="form-group">
            <label>Employee Sector</label>
            <select name="sector" defaultValue={profile.EmployeeSector || ""}>
              <option>Private</option>
              <option>Government</option>
              <option>Startup</option>
              <option>Entrepreneur</option>
              <option>Higher Studies</option>
            </select>
          </div>

          <div className="form-group">
            <label>Current CTC (LPA)</label>
            <input 
              name="ctc" 
              type="number" 
              defaultValue={profile.CurrentCTC || ""} 
            />
          </div>

          <h3 className="section-heading">Campus Placement Details</h3>

          <div className="form-group">
            <label>Placed through campus?</label>
            <select name="placed" defaultValue={profile.CampusPlacement?.Placed || ""}>
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>Company</label>
            <input 
              name="placementCompany" 
              defaultValue={profile.CampusPlacement?.Company || ""} 
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input 
              name="placementRole" 
              defaultValue={profile.CampusPlacement?.Role || ""} 
            />
          </div>

          <div className="form-group">
            <label>Package (LPA)</label>
            <input 
              name="placementPackage" 
              defaultValue={profile.CampusPlacement?.Package || ""} 
            />
          </div>

          <div className="form-group">
            <label>Year</label>
            <input 
              name="placementYear" 
              defaultValue={profile.CampusPlacement?.Year || ""} 
            />
          </div>


          <h3 className="section-heading">Testimonial</h3>
          <div className="section-divider" />

          <div className="form-group">
            <label htmlFor="testimonial">Your Testimonial *</label>
            <textarea
              id="testimonial"
              name="testimonial"
              rows={5}
              required
              defaultValue={profile.testimonial || ""}
              className="form-control"
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="submit-btn">Update</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
