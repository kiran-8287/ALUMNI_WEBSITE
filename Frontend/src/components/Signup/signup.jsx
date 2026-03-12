import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './signup.css';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    campusID: '',
    name: '',
    email: '',
    gender: '',
    dob:'',
    contact1: '',
    contact2: '',
    whatsapp: '',
    countryCode: '',
    linkedin: '',
    department: '',
    degree: '',
    passoutYear: '',
    hostel: '',
    location: '',
    organisation: '',
    designation: '',
    employmentSector: '',
    currentCTC: '',
    permanentAddress:'',
    awards: '',

  // campus placement
  placed: '',
  placementCompany: '',
  placementRole: '',
  placementPackage: '',
  placementYear: ''
  });

  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [passoutYears, setPassoutYears] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchMetadata = async () => {
  //     try {
  //       const [deptRes, degRes, yearRes] = await Promise.all([
  //         fetch('https://alumni-website-v7pq.onrender.com/departments'),
  //         fetch('https://alumni-website-v7pq.onrender.com/degrees'),
  //         fetch('https://alumni-website-v7pq.onrender.com/passout-years')
  //       ]);

  //       const [deptData, degData, yearData] = await Promise.all([
  //         deptRes.json(), degRes.json(), yearRes.json()
  //       ]);

  //       setDepartments(deptData.map(d => d.Department));
  //       setDegrees(degData.map(d => d.Degree));
  //       setPassoutYears(yearData.map(y => y.YearOfPassOut));
  //     } catch (error) {
  //       console.error('Error fetching metadata:', error);
  //       setErrorMessage('Failed to load dropdown options. Please try again later.');
  //     }
  //   };

  //   fetchMetadata();
  // }, []);
  const BASE_URL = "https://alumni-website-v7pq.onrender.com";

   useEffect(() => {
 
    fetch(`${BASE_URL}/departments`)
      .then((res) => res.json())
      .then((data) => setDepartments(data))
       .catch((err) => console.error("Error fetching departments:", err));
     
   fetch(`${BASE_URL}/passout-years`)
      .then((res) => res.json())
      .then((data) => setPassoutYears(data))
      .catch((err) => console.error("Error fetching years:", err));

    fetch(`${BASE_URL}/degrees`)
      .then((res) => res.json())
      .then((data) => setDegrees(data))
      .catch((err) => console.error("Error fetching degrees:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!/^\d{9}$/.test(formData.campusID)) {
      setErrorMessage('Campus ID must be exactly 9 digits');
      return;
    }

    const required = ['campusID', 'name', 'email', 'contact1', 'whatsapp', 'countryCode', 'department', 'degree', 'passoutYear', 'hostel', 'location','employmentSector','permanentAddress'];
    for (let field of required) {
      if (!formData[field]) {
        setErrorMessage(`Please fill the required field: ${field}`);
        return;
      }
    }

    try {
  

      const response = await fetch('https://alumni-website-v7pq.onrender.com/check-duplicate', {
        method: 'POST',
        headers: {

          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          campusID: formData.campusID,
        }),
      });

      const data = await response.json();

      if (data.emailExists) {
        setErrorMessage('Email is already registered. Please use it to log in.');
        return;
      }

      if (data.idExists) {
        setErrorMessage('Campus ID is already registered with a different email. Please contact us to update your email.');
        return;
      }

      // Proceed if no error
      // Format data to match Firestore field names
      // Proceed if no error
      const firestorePayload = {
        CampusID: formData.campusID,
        Name: formData.name,
        Gender: formData.gender,
        DateOfBirth: formData.dob,
        Email: formData.email,
        ContactNumber1: formData.contact1,
        ContactNumber2: formData.contact2 || '',
        WhatsAppNumber: formData.whatsapp,
        CountryCode: formData.countryCode,
        LinkedInProfile: formData.linkedin,
        Department: formData.department,
        Degree: formData.degree,
        YearOfPassOut: formData.passoutYear,
        Hostel: formData.hostel,
        CurrentLocation: formData.location,
        Organisation: formData.organisation || '',
        Designation: formData.designation || '',
        PermanentAddress: formData.permanentAddress,
        EmployeeSector: formData.employeeSector,
CurrentCTC: formData.currentCTC,
        Awards: formData.awards || '',
        
CampusPlacement: {
  Placed: formData.placed === "Yes",
  Company: formData.placementCompany,
  Role: formData.placementRole,
  Package: formData.placementPackage,
  Year: formData.placementYear
}

      };

      try {
        const registerRes = await fetch('https://alumni-website-v7pq.onrender.com/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(firestorePayload),
        });

        const registerData = await registerRes.json();

        if (registerData.success) {
          setSuccessMessage('🎉 Registration successful! Redirecting to homepage...');
          setTimeout(() => {
            navigate('/');
          }, 2500);
        } else {
          setErrorMessage(registerData.error || 'Registration failed');
        }
      } catch (error) {
        console.error('Error storing data:', error);
        setErrorMessage('Something went wrong while registering. Please try again later.');
      }
    } catch (error) {
      console.error('Error checking duplicates:', error);
      setErrorMessage('Something went wrong while checking duplicates. Please try again later.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <div className="signup-header">
          <h1>IAR Cell – Alumni Sign-Up</h1>
          <p>Join the IIT Palakkad Alumni Network</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form-grid">
          <input name="campusID" value={formData.campusID} onChange={handleChange} placeholder="Campus ID" className="signup-input-field" />
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="signup-input-field" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="signup-select-field">
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          </select>

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="signup-input-field"
            />


          <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" className="signup-input-field" />
          {/* <input name="contact1" value={formData.contact1} onChange={handleChange} placeholder="Contact Number 1" className="signup-input-field" /> */}
          {/* <input name="contact2" value={formData.contact2} onChange={handleChange} placeholder="Contact Number 2 (optional)" className="signup-input-field" /> */}
          {/* <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="WhatsApp Number" className="signup-input-field" /> */}
          <div className='phone-field'>
          <label>Contact Number 1</label>
          <PhoneInput 
        
          country={"in"}
          value={formData.contact1}
          onChange={(phone, country) => {
            setFormData({
              ...formData,
              contact1: phone,
              countryCode: "+" + country.dialCode
            });
          }}
          inputClass="signup-input-field"
            />
          </div>
          
          <div className='phone-field'>

        <label>Contact Number 2 (optional)</label>
          <PhoneInput 
        
          country={"in"}
          value={formData.contact2}
          onChange={(phone, country) => {
            setFormData({
              ...formData,
              contact2: phone,
              countryCode: "+" + country.dialCode
            });
          }}
          inputClass="signup-input-field"
            />
              
          </div>
          <div className='phone-field'>
          
          <label>WhatsApp Number</label>
        <PhoneInput
  country={"in"}
  value={formData.whatsapp}
  onChange={(phone, country) => {
    setFormData({
      ...formData,
      whatsapp: phone
    });
  }}
  inputClass="signup-input-field"
/></div>


          {/* <input name="countryCode" value={formData.countryCode} onChange={handleChange} placeholder="Country Code (e.g., +91)" className="signup-input-field" /> */}
          <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn Profile URL" className="signup-input-field" />

          {/* Department */}
          <select name="department" value={formData.department} onChange={handleChange} className="signup-select-field">
            <option value="">Select Department</option>
            {departments.map((item) => (
            <option key={item.Department} value={item.Department}>
              {item.Department}
            </option>
            ))}
          </select>

          {/* Degree */}
          <select name="degree" value={formData.degree} onChange={handleChange} className="signup-select-field">
            <option value="">Select Degree</option>
            {/* <a href="">hakuna</a> */}
            {degrees.map((item) => (
              <option key={item.Degree} value={item.Degree}>
                {item.Degree}

              </option>
            ))}
            {/* {degrees.map((deg, idx) => (
              <option key={idx} value={deg}>{deg}</option>
            ))} */}
          </select>

          {/* Passout Year */}
          <select name="passoutYear" value={formData.passoutYear} onChange={handleChange} className="signup-select-field">
            <option value="">Year of Passout</option>
            {passoutYears.map((item) => (
              <option key={item.YearOfPassOut} value={item.YearOfPassOut}>{item.YearOfPassOut}</option>
            ))}
          </select>

          <select name="hostel" value={formData.hostel} onChange={handleChange} className="signup-select-field">
            <option value="">Hostel</option>
            <option value="Malhar">Malhar</option>
            <option value="Saveri">Saveri</option>
            <option value="Brindavani">Brindavani</option>
            <option value="Tilang A">Tilang A</option>
            <option value="Tilang B">Tilang B</option>
          </select>

          <input name="location" value={formData.location} onChange={handleChange} placeholder="Current Location" className="signup-input-field" />
          <input name="organisation" value={formData.organisation} onChange={handleChange} placeholder="Organisation (optional)" className="signup-input-field" />
          <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation (optional)" className="signup-input-field" />
         {/* <div className="form-group"> */}
        {/* <label>Employee Sector</label> */}
        <select name="sector"  className="signup-select-field">
          <option value="">Employee Sector</option>
          <option value="Private">Private</option>
          <option value="Government">Government</option>
          <option value="Startup">Startup</option>
          <option value="Entrepreneur">Entrepreneur</option>
          <option value="Higher Studies">Higher Studies</option>
        </select>
      {/* </div> */}


                  <input
        name="currentCTC"
        value={formData.currentCTC}
        onChange={handleChange}
        placeholder="Current CTC"
        className="signup-input-field"
        />
            <input
      name="permanentAddress"
      value={formData.permanentAddress}
      onChange={handleChange}
      placeholder="Permanent Address"
      className="signup-input-field"
      />

          <input name="awards" value={formData.awards} onChange={handleChange} placeholder="Awards (optional)" className="signup-input-field" />
 <div className='placement-section'>
          <h3 >Campus Placement Details</h3>

          <select name="placed" value={formData.placed} onChange={handleChange} className="signup-select-field">
          <option value="">Placed through campus?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          </select>

          <input
          name="placementCompany"
          value={formData.placementCompany}
          onChange={handleChange}
          placeholder="Placement Company"
          className="signup-input-field"
          />

          <input
          name="placementRole"
          value={formData.placementRole}
          onChange={handleChange}
          placeholder="Placement Role"
          className="signup-input-field"
          />

          <input
          name="placementPackage"
          value={formData.placementPackage}
          onChange={handleChange}
          placeholder="Package"
          className="signup-input-field"
          />

          <input
          name="placementYear"
          value={formData.placementYear}
          onChange={handleChange}
          placeholder="Placement Year"
          className="signup-input-field"
          />
          </div>
          <div></div>
          <div>
            <p>Already have an account? <Link to="/Verification" className="link-btn">Sign In</Link></p>
          </div>

          {successMessage && <p className="success-text">{successMessage}</p>}
          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <div className="signup-submit-section">
            <button type="submit" className="signup-submit-button">Submit Form</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
