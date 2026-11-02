import React, { useState, useEffect } from "react";
import "../components/Alumni_profile/Alumni_profile.css";
import "../components/Alumni_profile/UpdateProfileModal.css";
import Navbar from "../components/Navbar/Navbar";
import pic from "../components/Alumni_profile/profile_pic.png";
import { FiEdit2 } from "react-icons/fi";

const DemoProfile = () => {
  const [profile, setProfile] = useState({
    Name: "Aarav Sharma",
    Email: "aarav.sharma@example.com",
    Gender: "Male",
    DateOfBirth: "1998-04-12",
    ContactNumber1: "+91 98765 43210",
    ContactNumber2: "+91 91234 56780",
    WhatsAppNumber: "+91 98765 43210",
    CountryCode: "+91",
    LinkedinProfile: "linkedin.com/in/aaravsharma",
    Department: "Computer Science and Engineering",
    Degree: "B.Tech",
    YearOfPassOut: "2021",
    Hostel: "Neelakurinji",
    PermanentAddress: "Bengaluru, Karnataka, India",
    Awards: "Best Campus Project Award (2021)",
    Designation: "Software Engineer",
    Organisation: "TechCorp India",
    Current_Location: "Bengaluru, India",
    EmployeeSector: "Private",
    CurrentCTC: "18",
    CampusPlacement: {
      Placed: true,
      Company: "TechCorp India",
      Role: "Software Development Engineer",
      Package: "12",
      Year: "2021",
    },
    verified: true,
    testimonial:
      "The alumni network at IIT Palakkad played a huge role in my career. I am glad to give back by mentoring current students through the IAR Cell.",
  });

  const [draft, setDraft] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const openModal = () => {
    setDraft(JSON.parse(JSON.stringify(profile)));
    setShowUpdateModal(true);
  };

  const closeModal = () => setShowUpdateModal(false);

  const saveChanges = () => {
    if (!draft) return;
    setProfile(draft);
    setShowUpdateModal(false);
  };

  const Detail = ({ label, value }) => (
    <div className="detail-item">
      <label className="detail-label">{label}</label>
      <span className="detail-value">{value}</span>
    </div>
  );

  const handlePersonal = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleCampus = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({
      ...prev,
      CampusPlacement: {
        ...prev.CampusPlacement,
        [name]: name === "Placed" ? value === "true" : value,
      },
    }));
  };

  useEffect(() => {
    if (showUpdateModal) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prevOverflow; };
    }
  }, [showUpdateModal]);

  return (
    <>
      <div className={`main-content-wrapper ${showUpdateModal ? "blurred-bg" : ""}`}>
        <div>
          <Navbar />

          <section className="page-header">
            <div className="container">
              <h1 className="page-title">Alumni Profile</h1>
              <p className="page-subtitle">Connecting Excellence, Building Future</p>
            </div>
          </section>
        </div>

        <div className="profile-card fade-in-up">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-container">
                <img src={pic} alt="Avatar" className="avatar-img" />
                {profile.verified && <div className="status-badge">✓ Verified</div>}
              </div>
            </div>

            <div className="testimonial-block">
              <div className="testimonial-quote">
                <span className="quote-mark">"</span>
                <span>{profile.testimonial}</span>
                <span className="quote-mark">"</span>
              </div>
              <div className="testimonial-author">
                — {profile.Name}, {profile.Degree}, Class of {profile.YearOfPassOut}
              </div>
            </div>
          </div>

          <div className="profile-content">
            <section className="details-section">
              <h2 className="section-title">Personal Details</h2>
              <div className="details-grid">
                <Detail label="Full Name" value={profile.Name} />
                <Detail label="Email" value={profile.Email} />
                <Detail label="Gender" value={profile.Gender || "Not provided"} />
                <Detail label="Date of Birth" value={profile.DateOfBirth || "Not provided"} />
                <Detail label="Contact Number1" value={profile.ContactNumber1} />
                <Detail label="Contact Number2" value={profile.ContactNumber2} />
                <Detail label="WhatsApp Number" value={profile.WhatsAppNumber} />
                <Detail label="Country Code" value={profile.CountryCode} />
                <Detail label="LinkedIn Profile" value={profile.LinkedinProfile} />
                <Detail label="Department" value={profile.Department} />
                <Detail label="Degree Program" value={profile.Degree} />
                <Detail label="Graduation Year" value={profile.YearOfPassOut} />
                <Detail label="Hostel" value={profile.Hostel} />
                <Detail label="Permanent Address" value={profile.PermanentAddress || "Not provided"} />
                <Detail label="Awards" value={profile.Awards} />
              </div>
            </section>

            <section className="details-section">
              <h2 className="section-title">Professional Details</h2>
              <div className="details-grid">
                <Detail label="Job Title" value={profile.Designation || "Not provided"} />
                <Detail label="Company" value={profile.Organisation || "Not provided"} />
                <Detail label="Location" value={profile.Current_Location || "Not provided"} />
                <Detail label="Employee Sector" value={profile.EmployeeSector || "Not provided"} />
                <Detail label="Current CTC" value={profile.CurrentCTC || "Not provided"} />
              </div>
            </section>

            <section className="details-section">
              <h2 className="section-title">Campus Placement Details</h2>
              <div className="details-grid">
                <Detail label="Placed" value={profile.CampusPlacement?.Placed ? "Yes" : "No"} />
                <Detail label="Company" value={profile.CampusPlacement?.Company || "Not provided"} />
                <Detail label="Role" value={profile.CampusPlacement?.Role || "Not provided"} />
                <Detail label="Package" value={profile.CampusPlacement?.Package || "Not provided"} />
                <Detail label="Year" value={profile.CampusPlacement?.Year || "Not provided"} />
              </div>
            </section>
          </div>

          <div className="button-container">
            <button onClick={openModal} className="styled-button update-button">
              <FiEdit2 /> Update Profile
            </button>
          </div>
        </div>
      </div>
      {showUpdateModal && draft && (
        <div className="update-modal-overlay">
          <div className="update-modal">
            <div className="update-modal-header">
              <h2>Update Profile</h2>
              <button type="button" className="close-btn" onClick={closeModal}>✕</button>
            </div>

            <form
              className="update-form"
              onSubmit={(e) => {
                e.preventDefault();
                saveChanges();
              }}
            >
              <h3 className="section-heading">Personal Details</h3>
              <div className="section-divider" />

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="Name" type="text" value={draft.Name} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="Email" type="email" value={draft.Email} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <input name="Gender" type="text" value={draft.Gender} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input name="DateOfBirth" type="text" value={draft.DateOfBirth} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Contact Number1</label>
                  <input name="ContactNumber1" type="text" value={draft.ContactNumber1} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Contact Number2</label>
                  <input name="ContactNumber2" type="text" value={draft.ContactNumber2} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>WhatsApp Number</label>
                  <input name="WhatsAppNumber" type="text" value={draft.WhatsAppNumber} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Country Code</label>
                  <input name="CountryCode" type="text" value={draft.CountryCode} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>LinkedIn Profile</label>
                  <input name="LinkedinProfile" type="text" value={draft.LinkedinProfile} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input name="Department" type="text" value={draft.Department} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Degree Program</label>
                  <input name="Degree" type="text" value={draft.Degree} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Graduation Year</label>
                  <input name="YearOfPassOut" type="text" value={draft.YearOfPassOut} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Hostel</label>
                  <input name="Hostel" type="text" value={draft.Hostel} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Permanent Address</label>
                  <input name="PermanentAddress" type="text" value={draft.PermanentAddress} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Awards</label>
                  <input name="Awards" type="text" value={draft.Awards} onChange={handlePersonal} />
                </div>
              </div>

              <h3 className="section-heading">Professional Details</h3>
              <div className="section-divider" />

              <div className="form-grid">
                <div className="form-group">
                  <label>Job Title</label>
                  <input name="Designation" type="text" value={draft.Designation} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input name="Organisation" type="text" value={draft.Organisation} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input name="Current_Location" type="text" value={draft.Current_Location} onChange={handlePersonal} />
                </div>
                <div className="form-group">
                  <label>Employee Sector</label>
                  <select name="EmployeeSector" value={draft.EmployeeSector} onChange={handlePersonal}>
                    <option>Private</option>
                    <option>Government</option>
                    <option>Startup</option>
                    <option>Entrepreneur</option>
                    <option>Higher Studies</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Current CTC (LPA)</label>
                  <input name="CurrentCTC" type="text" value={draft.CurrentCTC} onChange={handlePersonal} />
                </div>
              </div>

              <h3 className="section-heading">Campus Placement Details</h3>
              <div className="section-divider" />

              <div className="form-grid">
                <div className="form-group">
                  <label>Placed through campus?</label>
                  <select
                    name="Placed"
                    value={draft.CampusPlacement?.Placed ? "true" : "false"}
                    onChange={handleCampus}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input name="Company" type="text" value={draft.CampusPlacement?.Company || ""} onChange={handleCampus} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input name="Role" type="text" value={draft.CampusPlacement?.Role || ""} onChange={handleCampus} />
                </div>
                <div className="form-group">
                  <label>Package (LPA)</label>
                  <input name="Package" type="text" value={draft.CampusPlacement?.Package || ""} onChange={handleCampus} />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input name="Year" type="text" value={draft.CampusPlacement?.Year || ""} onChange={handleCampus} />
                </div>
              </div>

              <h3 className="section-heading">Testimonial</h3>
              <div className="section-divider" />

              <div className="form-group">
                <label>Your Testimonial *</label>
                <textarea
                  name="testimonial"
                  rows={5}
                  value={draft.testimonial || ""}
                  onChange={handlePersonal}
                  className="form-control"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">Update</button>
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DemoProfile;
