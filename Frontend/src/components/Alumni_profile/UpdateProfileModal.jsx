import React, { useEffect, useRef, useState } from "react";
import "./UpdateProfileModal.css";
import pic from './profile_pic.png';
import useStore from "../../Store";

const UpdateProfileModal = ({ isOpen, onClose, onSuccess }) => {
  const modalRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const email = useStore((state) => state.userEmail);
  const tokenId = useStore((state) => state.tokenId);
  useEffect(() => {
    if (!isOpen) return;
    if (!tokenId) {
      console.error("No token available");
      return;
    }
    if (!email) {
      console.error("No email found");
      return;
    }
    else {
      console.log(email);
    }
    fetch("https://alumni-website-v7pq.onrender.com/api/profile", {
    headers: {
      Authorization: `Bearer ${tokenId}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => setProfile(data))
    .catch((err) => console.error("Error fetching profile:", err));
  }, [isOpen]);

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
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);

            const updatedData = {
              Name: formData.get("name"),
              Email: formData.get("email"),
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
              verified: false,
            };


        fetch("https://alumni-website-v7pq.onrender.com/api/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenId}`,
          },
          body: JSON.stringify(updatedData),
        })
          .then(async (res) => {
            if (!res.ok) {
              const text = await res.text();
              console.error("Backend error:", text);
              throw new Error("Failed to update profile");
            }
            return res.json();
          })
          .then(() => {
            onSuccess();
            onClose();
          })
          .catch((err) => {
            console.error("Error updating profile:", err);
            alert("Failed to update profile. Try again.");
          });

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
