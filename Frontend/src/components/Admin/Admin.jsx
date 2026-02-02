import React, { useState, useEffect, useRef } from 'react';
import {db} from '../../firebase/firebaseConfig'
// import { initializeApp } from 'firebase/firestore';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import './Admin.css';
import iarcell from '../../assets/iar.png';



// const app = initializeApp(firebaseConfig);

const AdminDashboard = () => {
  // State management
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [sidebarActive, setSidebarActive] = useState(false);
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [notification, setNotification] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const fileInputRef = useRef(null);
  
  
  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [passoutYears, setPassoutYears] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [deptRes, degRes, yearRes] = await Promise.all([
          fetch('https://alumni-website-v7pq.onrender.com/departments'),
          fetch('https://alumni-website-v7pq.onrender.com/degrees'),
          fetch('https://alumni-website-v7pq.onrender.com/passout-years')
        ]);

        const [deptData, degData, yearData] = await Promise.all([
          deptRes.json(), degRes.json(), yearRes.json()
        ]);

        setDepartments(deptData.map(d => d.Deparment));
        setDegrees(degData.map(d => d.Degree));
        setPassoutYears(yearData.map(y => y.YearOfPassOut));
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setErrorMessage('Failed to load dropdown options. Please try again later.');
      }
       };

    fetchMetadata();
  }, []);




  // Form state
  const [newAlumni, setNewAlumni] = useState({
    CampusID: '',
    Name: '',
    Email: '',
    ContactNumber1: '',
    ContactNumber2: '',
    WhatsAppNumber: '',
    CountryCode: '+91',
    LinkedinProfile: '',
    Department: 'Computer Science',
    Degree: 'B.Tech',
    YearOfPassOut: new Date().getFullYear().toString(),
    Hostel: '',
    CurrentLocation: '',
    Organisation: '',
    Designation: '',
    Awards: '',
    verified: false
  });

  const [editAlumni, setEditAlumni] = useState(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch alumni data
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'students'));
        const alumniList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAlumniData(alumniList);
      } catch (error) {
        showNotification('Failed to fetch alumni data', 'error');
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlumni();
  }, []);

  // Notification handler
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAlumni(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditAlumni(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // CRUD Operations
  const addAlumni = async () => {
    try {
      const docRef = await addDoc(collection(db, 'students'), newAlumni);
      setAlumniData(prev => [...prev, { id: docRef.id, ...newAlumni }]);
      showNotification('Alumni added successfully', 'success');
      setActiveModal(null);
      resetForm();
    } catch (error) {
      showNotification('Failed to add alumni', 'error');
      console.error('Error adding document: ', error);
    }
  };

  const updateAlumni = async () => {
    try {
      await updateDoc(doc(db, 'students', editAlumni.id), editAlumni);
      setAlumniData(prev => 
        prev.map(item => item.id === editAlumni.id ? editAlumni : item)
      );
      showNotification('Alumni updated successfully', 'success');
      setActiveModal(null);
    } catch (error) {
      showNotification('Failed to update alumni', 'error');
      console.error('Error updating document: ', error);
    }
  };

  const deleteAlumni = async (id) => {
    if (window.confirm('Are you sure you want to delete this alumni record?')) {
      try {
        await deleteDoc(doc(db, 'students', id));
        setAlumniData(prev => prev.filter(item => item.id !== id));
        showNotification('Alumni deleted successfully', 'success');
      } catch (error) {
        showNotification('Failed to delete alumni', 'error');
        console.error('Error deleting document: ', error);
      }
    }
  };

  const deleteSelected = async () => {
    if (selectedRows.size === 0) return;
    
    if (window.confirm(`Delete ${selectedRows.size} selected alumni?`)) {
      try {
        const deletePromises = Array.from(selectedRows).map(id => 
          deleteDoc(doc(db, 'students', id))
        );
        await Promise.all(deletePromises);
        setAlumniData(prev => prev.filter(item => !selectedRows.has(item.id)));
        setSelectedRows(new Set());
        showNotification(`${selectedRows.size} alumni deleted`, 'success');
      } catch (error) {
        showNotification('Failed to delete alumni', 'error');
        console.error('Error deleting documents: ', error);
      }
    }
  };

  // Helper functions
  const resetForm = () => {
    setNewAlumni({
      CampusID: '',
      Name: '',
      Email: '',
      ContactNumber1: '',
      ContactNumber2: '',
      WhatsAppNumber: '',
      CountryCode: '+91',
      LinkedinProfile: '',
      Department: 'Computer Science',
      Degree: 'B.Tech',
      YearOfPassOut: new Date().getFullYear().toString(),
      Hostel: '',
      CurrentLocation: '',
      Organisation: '',
      Designation: '',
      Awards: '',
      verified: false
    });
  };

  const toggleRowSelection = (id, checked) => {
    const newSelected = new Set(selectedRows);
    checked ? newSelected.add(id) : newSelected.delete(id);
    setSelectedRows(newSelected);
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      const allIds = filteredAlumni.map(item => item.id);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 1024) {
      setSidebarActive(false);
    }
  };

  const openModal = (modalType, alumni = null) => {
    setActiveModal(modalType);
    if (modalType === 'edit' && alumni) {
      setEditAlumni(alumni);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Filter and pagination
  const filteredAlumni = alumniData.filter(alumni => {
    const matchesSearch = Object.values(alumni).some(
      val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesDept = selectedDepartment === 'All Departments' || 
      alumni.Department === selectedDepartment;
    const matchesYear = selectedYear === 'All Years' || 
      alumni.YearOfPassOut === selectedYear;
    
    const matchStatus =
      selectedStatus === "all" ||
      alumni.verified === (selectedStatus==="true");
    
    return matchesSearch && matchesDept && matchesYear && matchStatus;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAlumni.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAlumni.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Department options
  // const departments = [
  //   'Computer Science', 
  //   'Electrical Engineering', 
  //   'Mechanical Engineering', 
  //   'Civil Engineering'
  // ];

  // Year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => (currentYear - i).toString());

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Get department class for badge
  const getDepartmentClass = (department) => {
    const deptMap = {
      'Computer Science': 'cs',
      'Electrical Engineering': 'ee',
      'Mechanical Engineering': 'me',
      'Civil Engineering': 'ce'
    };
    return deptMap[department] || 'cs';
  };

  return (
    <div className='admin-dashboard-container' data-theme={theme}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active">
              <a href="#" className="nav-link">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={() => openModal('records')}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>Alumni Records</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={() => openModal('settings')}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" onClick={closeSidebar}>
        {/* Header */}
        <header className="header1">
          <div className="header-left">
            <h1 className="page-title">Alumni Management</h1>
          </div>
          <div className="header-right">
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search alumni..." 
                className="search-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? (
                <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
            </button>
            <img src={iarcell} alt="IAR Cell IIT Palakkad" className="iarcell-logo" />
          </div>
        </header>

        {/* Loading indicator */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading alumni data...</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-bar">
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => openModal('add')}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Alumni
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                if (selectedRows.size === 1) {
                  const selected = alumniData.find(a => a.id === Array.from(selectedRows)[0]);
                  openModal('edit', selected);
                } else {
                  showNotification('Please select exactly one alumni to edit', 'error');
                }
              }}
              disabled={selectedRows.size !== 1}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Update Selected
            </button>
            <button 
              className="btn btn-danger" 
              onClick={deleteSelected}
              disabled={selectedRows.size === 0}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              {selectedRows.size > 0 ? `Delete (${selectedRows.size})` : 'Delete'}
            </button>
          </div>
          <div className="table-controls">
            <select 
              className="filter-select" 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option>All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select 
              className="filter-select" 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option>All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              className='filter-select'
              value={selectedStatus}
              onChange={(e)=>setSelectedStatus(e.target.value)}
            ><option value="all">All Status</option>
              <option value="true">Verified</option>
              <option  value="false">Not Verified</option>

            </select>
          </div>
        </div>

        {/* Alumni Table */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="alumni-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      className="checkbox" 
                      checked={selectedRows.size === filteredAlumni.length && filteredAlumni.length > 0}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Designation</th>
                  <th>Organisation</th>
                  <th>Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map(alumni => (
                    <tr key={alumni.id} className={selectedRows.has(alumni.id) ? 'selected' : ''}>
                      <td>
                        <input 
                          type="checkbox" 
                          className="checkbox" 
                          checked={selectedRows.has(alumni.id)}
                          onChange={(e) => toggleRowSelection(alumni.id, e.target.checked)}
                        />
                      </td>
                      <td><span className="id-badge">{alumni.CampusID}</span></td>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">{getInitials(alumni.Name)}</div>
                          <span>{alumni.Name}</span>
                        </div>
                      </td>
                      <td>{alumni.Email}</td>
                      <td><span className={`dept-badge ${getDepartmentClass(alumni.Department)}`}>{alumni.Department}</span></td>
                      <td>{alumni.YearOfPassOut}</td>
                      <td>{alumni.Designation || '-'}</td>
                      <td>{alumni.Organisation || '-'}</td>
                      <td>{alumni.verified ? 'Yes' : 'No'}</td>
                      <td>
                        <div className="action-buttons-cell">
                          <button 
                            className="btn-icon-small edit-btn" 
                            onClick={() => openModal('edit', alumni)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button 
                            className="btn-icon-small delete-btn" 
                            onClick={() => deleteAlumni(alumni.id)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6"/>
                              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="no-data">
                      {loading ? 'Loading...' : 'No alumni records found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredAlumni.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {Math.min((currentPage - 1) * recordsPerPage + 1, filteredAlumni.length)}-
                {Math.min(currentPage * recordsPerPage, filteredAlumni.length)} of {filteredAlumni.length} alumni
              </div>
              <div className="pagination-controls">
                <button 
                  className="pagination-btn" 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => paginate(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  className="pagination-btn" 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Alumni Modal */}
      {activeModal === 'add' && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Alumni</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <form className="alumni-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="addCampusID">Campus ID</label>
                    <input 
                      type="text" 
                      id="addCampusID"
                      name="CampusID"
                      placeholder="IITPKD001" 
                      value={newAlumni.CampusID}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="addName">Full Name</label>
                    <input 
                      type="text" 
                      id="addName"
                      name="Name"
                      placeholder="Enter full name" 
                      value={newAlumni.Name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="addEmail">Email Address</label>
                    <input 
                      type="email" 
                      id="addEmail"
                      name="Email"
                      placeholder="Enter email address" 
                      value={newAlumni.Email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="addPhone">Contact Number</label>
                    <input 
                      type="tel" 
                      id="addPhone"
                      name="ContactNumber1"
                      placeholder="9876543210" 
                      value={newAlumni.ContactNumber1}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="addWhatsApp">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      id="addWhatsApp"
                      name="WhatsAppNumber"
                      placeholder="9876543210" 
                      value={newAlumni.WhatsAppNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="addLinkedIn">LinkedIn Profile</label>
                    <input 
                      type="url" 
                      id="addLinkedIn"
                      name="LinkedinProfile"
                      placeholder="https://linkedin.com/in/username" 
                      value={newAlumni.LinkedinProfile}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="addDepartment">Department</label>
                    <select 
                      id="addDepartment"
                      name="Department"
                      value={newAlumni.Department}
                      onChange={handleInputChange}
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="addYear">Graduation Year</label>
                    <select
                      id="addYear"
                      name="YearOfPassOut"
                      value={newAlumni.YearOfPassOut}
                      onChange={handleInputChange}
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="addOrganisation">Organisation</label>
                    <input 
                      type="text" 
                      id="addOrganisation"
                      name="Organisation"
                      placeholder="Current organisation" 
                      value={newAlumni.Organisation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="addDesignation">Designation</label>
                    <input 
                      type="text" 
                      id="addDesignation"
                      name="Designation"
                      placeholder="Current designation" 
                      value={newAlumni.Designation}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="addAwards">Awards</label>
                  <textarea
                    id="addAwards"
                    name="Awards"
                    placeholder="Any notable awards or achievements" 
                    value={newAlumni.Awards}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="verified"
                      checked={newAlumni.verified}
                      onChange={handleInputChange}
                    />
                    Verified Alumni
                  </label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={addAlumni}>Add Alumni</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Alumni Modal */}
      {activeModal === 'edit' && editAlumni && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2>Update Alumni Information</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <form className="alumni-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editCampusID">Campus ID</label>
                    <input 
                      type="text" 
                      id="editCampusID"
                      name="CampusID"
                      value={editAlumni.CampusID}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editName">Full Name</label>
                    <input 
                      type="text" 
                      id="editName"
                      name="Name"
                      value={editAlumni.Name}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editEmail">Email Address</label>
                    <input 
                      type="email" 
                      id="editEmail"
                      name="Email"
                      value={editAlumni.Email}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editPhone">Contact Number</label>
                    <input 
                      type="tel" 
                      id="editPhone"
                      name="ContactNumber1"
                      value={editAlumni.ContactNumber1}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editWhatsApp">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      id="editWhatsApp"
                      name="WhatsAppNumber"
                      value={editAlumni.WhatsAppNumber}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editLinkedIn">LinkedIn Profile</label>
                    <input 
                      type="url" 
                      id="editLinkedIn"
                      name="LinkedinProfile"
                      value={editAlumni.LinkedinProfile}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editDepartment">Department</label>
                    <select 
                      id="editDepartment"
                      name="Department"
                      value={editAlumni.Department}
                      onChange={handleEditInputChange}
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="editYear">Graduation Year</label>
                    <select
                      id="editYear"
                      name="YearOfPassOut"
                      value={editAlumni.YearOfPassOut}
                      onChange={handleEditInputChange}
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editOrganisation">Organisation</label>
                    <input 
                      type="text" 
                      id="editOrganisation"
                      name="Organisation"
                      value={editAlumni.Organisation}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editDesignation">Designation</label>
                    <input 
                      type="text" 
                      id="editDesignation"
                      name="Designation"
                      value={editAlumni.Designation}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="editAwards">Awards</label>
                  <textarea
                    id="editAwards"
                    name="Awards"
                    value={editAlumni.Awards}
                    onChange={handleEditInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>
                    <input
                      
                      type="checkbox"
                      name="verified"
                      checked={editAlumni.verified}
                      onChange={handleEditInputChange}
                    />
                    Verified Alumni
                  </label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={updateAlumni}>Update Alumni</button>
            </div>
          </div>
        </div>
      )}

      {/* Records Modal */}
      {activeModal === 'records' && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2>Alumni Records</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="records-section">
                <h3>Export Options</h3>
                <div className="export-buttons">
                  <button className="btn btn-primary">Export to CSV</button>
                  <button className="btn btn-primary">Export to PDF</button>
                  <button className="btn btn-primary">Export to Excel</button>
                </div>
              </div>
              <div className="records-section">
                <h3>Import Options</h3>
                <div className="import-section">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept=".csv,.xlsx,.xls" 
                    style={{ display: 'none' }} 
                  />
                  <button className="btn btn-secondary">Import from File</button>
                  <p className="help-text">Supported formats: CSV, Excel (.xlsx, .xls)</p>
                </div>
              </div>
              <div className="records-section">
                <h3>Data Management</h3>
                <div className="data-actions">
                  <button className="btn btn-danger">Backup Data</button>
                  <button className="btn btn-secondary">Restore Data</button>
                  <button className="btn btn-danger">Clear All Data</button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2>Settings</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="settings-section">
                <h3>General Settings</h3>
                <div className="setting-item">
                  <label htmlFor="themeSetting">Theme</label>
                  <select id="themeSetting" defaultValue={theme}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label htmlFor="recordsPerPage">Records per page</label>
                  <select id="recordsPerPage" defaultValue={recordsPerPage}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
              <div className="settings-section">
                <h3>Notifications</h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Email notifications
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Browser notifications
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary">Save Settings</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type} show`}>
          <div className="notification-content">
            <span>{notification.message}</span>
            <button className="notification-close" onClick={() => setNotification(null)}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;