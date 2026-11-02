import React, { useEffect, useState, useRef } from 'react';
import './Alumni_profile.css';
import UpdateProfileModal from "./UpdateProfileModal";
import pic from './profile_pic.png';
import useStore from '../../Store';
import Navbar from '../Navbar/Navbar';
import { getAuth } from "firebase/auth"
import { FiEdit2 } from 'react-icons/fi';

const Icons = {
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  gender: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>,
  degree: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  email: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  linkedin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  graduation: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c0 2 6 3 6 3s6-1 6-3v-5"/></svg>,
  hostel: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-6 9 6-9 6-9-6z"/><path d="M3 9v6l9 6 9-6V9"/></svg>,
  awards: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.9 6.6L22 9.3l-5 4.9 1.2 7-6.2-3.5L5.8 21.2 7 14.2 2 9.3l7.1-.7L12 2z"/></svg>,
  location: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  job: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg>,
  company: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-6 9 6-9 6-9-6z"/><path d="M3 9v6l9 6 9-6V9"/></svg>,
  briefcase: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg>,
  rupee: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  placement: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  department: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
};

const ContactIcon = ({ type, href, children }) => {
  const icons = {
    email: Icons.email,
    phone: Icons.phone,
    whatsapp: Icons.phone,
    linkedin: Icons.linkedin,
  };
  return (
    <a className="contact-chip" href={href} target="_blank" rel="noreferrer">
      <span style={{ display: 'inline-flex', width: 14, height: 14 }}>{icons[type]}</span>
      {children}
    </a>
  );
};

const DetailIcon = ({ icon, label, value }) => (
  <div className="detail-item">
    <span className="detail-icon">{icon}</span>
    <span className="detail-text">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </span>
  </div>
);

const AlumniProfile = () => {
  const [profile, setProfile] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const currentUserRef = useRef(null);
  const lastFetchedUid = useRef(null);
  const abortControllerRef = useRef(null);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  useEffect(() => {
    if (showUpdateModal) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prevOverflow; };
    }
  }, [showUpdateModal]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        currentUserRef.current = null;
        lastFetchedUid.current = null;
        setProfile(null);
        return;
      }

      if (currentUserRef.current?.uid !== user.uid) {
        setProfile(null);
        lastFetchedUid.current = null;
      }

      currentUserRef.current = user;

      if (lastFetchedUid.current === user.uid) return;
      lastFetchedUid.current = user.uid;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setLoading(true);
        setError(null);

        const token = await user.getIdToken();

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

        if (currentUserRef.current?.uid === user.uid) {
          setProfile(data);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
          setError("Unable to load profile");
        }
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (!profile) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa, #e4ecf7)"
      }}>
        <div className="spinner"></div>
        <p style={{
          marginTop: "20px",
          fontSize: "18px",
          fontWeight: "600",
          color: "#333"
        }}>
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <>
      {!showUpdateModal && showSuccess && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px',
          background: '#fff8db', color: '#333', border: '2px solid #ffec9e',
          borderRadius: '8px', padding: '12px 20px', fontWeight: '600',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '10px',
          animation: 'slideInOut 4s ease-in-out forwards',
        }}>
          <span style={{
            display: 'inline-block', width: '18px', height: '18px',
            backgroundColor: '#4CAF50', borderRadius: '4px', color: '#fff',
            fontSize: '14px', textAlign: 'center', lineHeight: '18px'
          }}>✓</span>
          Profile updated successfully!
        </div>
      )}

      {!showVerifyModal && verified && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px',
          background: '#fff8db', color: '#333', border: '2px solid #ffec9e',
          borderRadius: '8px', padding: '12px 20px', fontWeight: '600',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '10px',
          animation: 'slideInOut 4s ease-in-out forwards',
        }}>
          <span style={{
            display: 'inline-block', width: '18px', height: '18px',
            backgroundColor: '#4CAF50', borderRadius: '4px', color: '#fff',
            fontSize: '14px', textAlign: 'center', lineHeight: '18px'
          }}>✓</span>
          Email verified successfully!
        </div>
      )}

      {showUpdateModal && (
        <UpdateProfileModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={() => {
            handleSuccess();
          }}
        />
      )}

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
              <span className="mentor-badge">● Open to mentoring</span>
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

              <div className="detail-group">
                <div className="detail-group-title">IDENTITY</div>
                <div className="details-grid">
                  <DetailIcon icon={Icons.user} label="Full Name" value={profile.Name} />
                  <DetailIcon icon={Icons.calendar} label="Date of Birth" value={profile.DateOfBirth || "Not provided"} />
                  <DetailIcon icon={Icons.gender} label="Gender" value={profile.Gender || "Not provided"} />
                  <DetailIcon icon={Icons.degree} label="Degree Program" value={profile.Degree || "Not provided"} />
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-group-title">CONTACT</div>
                <div className="contact-row">
                  <ContactIcon type="email" href={`mailto:${profile.Email}`}>{profile.Email}</ContactIcon>
                  <ContactIcon type="phone" href={`tel:${profile.ContactNumber1}`}>{profile.ContactNumber1}</ContactIcon>
                  {profile.LinkedinProfile && (
                    <ContactIcon type="linkedin" href={profile.LinkedinProfile.startsWith('http') ? profile.LinkedinProfile : `https://${profile.LinkedinProfile}`}>
                      {profile.LinkedinProfile}
                    </ContactIcon>
                  )}
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-group-title">ACADEMIC</div>
                <div className="details-grid">
                  <DetailIcon icon={Icons.graduation} label="Graduation Year" value={profile.YearOfPassOut || "Not provided"} />
                  <DetailIcon icon={Icons.hostel} label="Hostel" value={profile.Hostel || "Not provided"} />
                  <DetailIcon icon={Icons.awards} label="Awards" value={profile.Awards || "Not provided"} />
                  <DetailIcon icon={Icons.location} label="Permanent Address" value={profile.PermanentAddress || "Not provided"} />
                </div>
              </div>
            </section>

            <section className="details-section">
              <h2 className="section-title">Professional Details</h2>
              <div className="details-grid">
                <DetailIcon icon={Icons.job} label="Job Title" value={profile.Designation || "Not provided"} />
                <DetailIcon icon={Icons.company} label="Company" value={profile.Organisation || "Not provided"} />
                <DetailIcon icon={Icons.location} label="Location" value={profile.Current_Location || "Not provided"} />
                <DetailIcon icon={Icons.rupee} label="Current CTC" value={profile.CurrentCTC ? `${profile.CurrentCTC} LPA` : "Not provided"} />
              </div>
            </section>

            <section className="details-section">
              <h2 className="section-title">Campus Placement Details</h2>
              <div className="details-grid">
                <DetailIcon icon={Icons.placement} label="Placed" value={profile.CampusPlacement?.Placed ? "Yes" : "No"} />
                <DetailIcon icon={Icons.company} label="Company" value={profile.CampusPlacement?.Company || "Not provided"} />
                <DetailIcon icon={Icons.job} label="Role" value={profile.CampusPlacement?.Role || "Not provided"} />
                <DetailIcon icon={Icons.rupee} label="Package" value={profile.CampusPlacement?.Package ? `${profile.CampusPlacement.Package} LPA` : "Not provided"} />
                <DetailIcon icon={Icons.calendar} label="Year" value={profile.CampusPlacement?.Year || "Not provided"} />
              </div>
            </section>
          </div>
        </div>

        <div className="button-container">
          <button
            onClick={() => setShowUpdateModal(true)}
            className="styled-button update-button"
          >
            <FiEdit2 /> Update Profile
          </button>
        </div>
      </div>
    </>
  );
};

const Detail = ({ label, value }) => (
  <div className="detail-item">
    <label className="detail-label">{label}</label>
    <span className="detail-value">{value}</span>
  </div>
);

export default AlumniProfile;
