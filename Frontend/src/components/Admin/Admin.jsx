import React, { useState, useEffect, useRef, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import './Admin.css';
import iarcell from '../../assets/iar.png';
import { getSelectedAlumni,exportToCSV,exportToExcel,exportToPDF } from '../../utils/exportUtils';
import {
  FiPlus, FiEdit2, FiTrash2, FiDownload, FiUpload, FiFileText, FiFile,
  FiGrid, FiUsers, FiSettings, FiX, FiChevronLeft, FiChevronRight,
  FiRotateCcw, FiFilter, FiCheck, FiHardDrive, FiSearch, FiMenu, FiEye
} from 'react-icons/fi';

const ADMIN_API_BASE = 'https://alumni-website-v7pq.onrender.com';

async function adminRequest(path, options = {}) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Please sign in again to continue.');

  const response = await fetch(`${ADMIN_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${await currentUser.getIdToken()}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Administrator request failed.');
  return result;
}


// const app = initializeApp(firebaseConfig);

const AdminDashboard = () => {
  // State management
  const [sidebarActive, setSidebarActive] = useState(false);
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSector, setselectedSector] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [recordsPerPageDraft, setRecordsPerPageDraft] = useState(10);
  const hasActiveFilters = searchTerm !== '' || selectedDepartment !== 'All Departments' || selectedYear !== 'All Years' || selectedStatus !== 'all' || selectedSector !== 'All';
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [notification, setNotification] = useState(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const fileInputRef = useRef(null);
  
  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [passoutYears, setPassoutYears] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  // stats



  const totalAlumni = alumniData.length;

  const verifiedCount = alumniData.filter(a => a.verified).length;

    const avgCTC =
    alumniData.length > 0
      ? (
          alumniData.reduce((sum, a) => sum + Number(a.CTC || 0), 0) /
          alumniData.length
        ).toFixed(2)
      : 0;
  
  const placedCount = alumniData.filter(
    a => a.CampusPlacement?.Placed
  ).length;

  const sectorStats = alumniData.reduce((acc, alumni) => {
    const sector = alumni.EmployeeSector || "Unknown";
    acc[sector] = (acc[sector] || 0) + 1;
    return acc;
  }, {});

// -------------------------------------------

  // Loads dropdown options (departments / degrees / passout years) from the API.
  // Failure is non-fatal — the dropdowns just stay with whatever values are shown.
const loadMetadata = useCallback(async () => {
  try {
    const ts = Date.now();
    const base = 'https://alumni-website-v7pq.onrender.com';
    const [deptRes, degRes, yearRes] = await Promise.all([
      fetch(`${base}/departments?t=${ts}`),
      fetch(`${base}/degrees?t=${ts}`),
      fetch(`${base}/passout-years?t=${ts}`)
    ]);

    if (!deptRes.ok || !degRes.ok || !yearRes.ok) {
      throw new Error('One or more metadata requests failed');
    }

    const [deptData, degData, yearData] = await Promise.all([
      deptRes.json(), degRes.json(), yearRes.json()
    ]);

    const newDepartments = Array.isArray(deptData)
      ? deptData.map((d) => d && d.Department).filter(Boolean)
      : [];
    const newDegrees = Array.isArray(degData)
      ? degData.map((d) => d && d.Degree).filter(Boolean)
      : [];
    const newYears = Array.isArray(yearData)
      ? yearData.map((y) => y && (y.YearOfPassOut)).filter((v) => v != null && v !== '')
      : [];

    // Only overwrite with real data so good values are never clobbered by empties
    if (newDepartments.length) setDepartments(newDepartments);
    if (newDegrees.length) setDegrees(newDegrees);
    if (newYears.length) setPassoutYears(newYears);
  } catch (error) {
    console.error('Error fetching metadata:', error);
  }
}, []);

useEffect(() => {
  loadMetadata();
}, [loadMetadata]);




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
  const [viewAlumni, setViewAlumni] = useState(null);

  // Fetch alumni data
  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
      if (!currentUser) {
        if (active) {
          setLoading(false);
          showNotification('Please sign in with an administrator account.', 'error');
        }
        return;
      }

      try {
        const alumniList = await adminRequest('/admin/students');
        if (active) setAlumniData(alumniList);
      } catch (error) {
        if (active) showNotification(error.message || 'Failed to fetch alumni data', 'error');
        console.error('Error fetching data: ', error);
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Notification handler
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('All Departments');
    setSelectedYear('All Years');
    setSelectedStatus("all");
    setselectedSector("All");
    setCurrentPage(1);
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
      const createdRecord = await adminRequest('/admin/students', {
        method: 'POST',
        body: JSON.stringify(newAlumni),
      });
      setAlumniData(prev => [...prev, createdRecord]);
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
      await adminRequest(`/admin/students/${encodeURIComponent(editAlumni.id)}`, {
        method: 'PATCH',
        body: JSON.stringify(editAlumni),
      });
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
        await adminRequest(`/admin/students/${encodeURIComponent(id)}`, { method: 'DELETE' });
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
          adminRequest(`/admin/students/${encodeURIComponent(id)}`, { method: 'DELETE' })
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
      // Select only the rows visible on the current page,
      // not every member across all pages.
      const pageIds = currentRecords.map(item => item.id);
      setSelectedRows(new Set(pageIds));
    } else {
      setSelectedRows(new Set());
    }
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
    if (modalType === 'settings') {
      setRecordsPerPageDraft(recordsPerPage);
    }
    if (modalType === 'edit' && alumni) {
      setEditAlumni(alumni);
    }
    if (modalType === 'view' && alumni) {
      setViewAlumni(alumni);
      setEditAlumni(alumni); // pre-fill edit modal for the in-detail Edit action
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const saveSettings = () => {
    // Apply the chosen "records per page" value
    setRecordsPerPage(Number(recordsPerPageDraft));
    setCurrentPage(1);
    setActiveModal(null);
    // Show a fresh green success popup with a tick
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
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
      alumni.verified === (selectedStatus === "true");
    
    const matchesSector =
      selectedSector === "All" ||
      alumni.EmployeeSector === selectedSector;
    
    return matchesSearch && matchesDept && matchesYear && matchStatus && matchesSector;
  });

  // export the selected alumni (excel,csv ,pdf files)
  // when an explicit dataset is passed (e.g. from the Records modal) it is used,
  // otherwise the current table selection is used, falling back to all alumni.

  const handleExportCSV = (explicitData) => {
    const data = explicitData || getSelectedAlumni(alumniData, selectedRows);
    exportToCSV(data.length ? data : alumniData);
  };

  const handleExportExcel = (explicitData) => {
    const data = explicitData || getSelectedAlumni(alumniData, selectedRows);
    exportToExcel(data.length ? data : alumniData);
  };

  const handleExportPDF = (explicitData) => {
    const data = explicitData || getSelectedAlumni(alumniData, selectedRows);
    exportToPDF(data.length ? data : alumniData);
  };
  

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAlumni.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAlumni.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Jump-to-page logic with edge-case handling
  const handleJumpToPage = (e) => {
    e.preventDefault();
    const parsed = parseInt(jumpPage, 10);

    // Ignore empty / non-numeric input
    if (isNaN(parsed) || parsed < 1) {
      setJumpPage('');
      return;
    }

    // Clamp to the actual last page:
    // - if the user types 100 but there are only 25 pages, go to page 25
    // - if they type 0 or negative, treat as page 1
    const target = Math.min(parsed, totalPages);
    paginate(target);
    setJumpPage('');
  };

  const handleJumpInputChange = (e) => {
    // Only allow digits — no minus signs, no letters, no dots
    const value = e.target.value.replace(/\D/g, '');
    setJumpPage(value);
  };

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

  // Use the actual pass-out years from the database when available,
  // otherwise fall back to a hardcoded list of the last 20 years.
  const yearOptions = passoutYears.length ? passoutYears : years;

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
    <div className='admin-dashboard-container'>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-logo">ALUMNI</span>
            <span className="sidebar-logo-sub">Management</span>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Close menu">
            <FiX size={22} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active">
              <a href="#" className="nav-link">
                <FiGrid className="nav-icon" />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={() => openModal('records')}>
                <FiUsers className="nav-icon" />
                <span>Alumni Records</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={() => openModal('settings')}>
                <FiSettings className="nav-icon" />
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
            <button className="sidebar-toggle header-menu-toggle" onClick={toggleSidebar} aria-label="Open menu">
              <FiMenu size={22} />
            </button>
            <h1 className="page-title">Alumni Management</h1>
          </div>
          <div className="header-right">
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search alumni..." 
                className="search-input" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <a href="/"><img src={iarcell} alt="IAR Cell IIT Palakkad" className="iarcell-logo" /></a>
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
            <div className="action-group-grid">
              {/* CELL 1: ADD */}
              <button className="btn btn-primary" onClick={() => openModal('add')}>
                <FiPlus className="btn-icon" />
                Add Alumni
              </button>

              {/* CELL 2: UPDATE */}
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
                <FiEdit2 className="btn-icon" />
                Update Selected
              </button>

              {/* CELL 3: DELETE */}
              <button
                className="btn btn-danger"
                onClick={deleteSelected}
                disabled={selectedRows.size === 0}
              >
                <FiTrash2 className="btn-icon" />
                {selectedRows.size > 0 ? `Delete (${selectedRows.size})` : 'Delete'}
              </button>

              {/* CELL 4: EXPORT GROUP (kept horizontal) */}
              <div className="export-buttons-group">
                <button className="btn btn-export-small btn-export-csv" onClick={handleExportCSV}>
                  <FiFileText className="btn-icon" />
                  CSV
                </button>
                <button className="btn btn-export-small btn-export-excel" onClick={handleExportExcel}>
                  <FiDownload className="btn-icon" />
                  Excel
                </button>
                <button className="btn btn-export-small btn-export-pdf" onClick={handleExportPDF}>
                  <FiFile className="btn-icon" />
                  PDF
                </button>
              </div>
            </div>
          </div>
          {/* FILTERS */}
          <div className="table-controls">
            <div className="filter-row">
              <select 
                className="filter-select" 
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option>All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                className='filter-select'
                value={selectedSector}
                onChange={(e) => {
                  setselectedSector(e.target.value);
                  setCurrentPage(1);
                }}>
                
                <option value="All">All Sectors</option>
                <option value="Private">Private</option>
                <option value="Government">Government</option>
                <option value="Startup">Startup</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Higher Studies">Higher Studies</option>

              </select>


              <select 
                className="filter-select" 
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option>All Years</option>
                {passoutYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <select
                className='filter-select'
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
              ><option value="all">All Status</option>
                <option value="true">Verified</option>
                <option  value="false">Not Verified</option>

              </select>
            </div>
            {hasActiveFilters && (
              <button className="btn btn-danger remove-filters-btn" onClick={clearFilters}>
                <FiFilter className="btn-icon" />
                Remove Filters
              </button>
            )}
          </div>
        </div>

        
        {/* ----------------------stats------------------------ */}

          <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Alumni</h3>
            <p>{totalAlumni}</p>
          </div>

          <div className="stat-card verified">
            <h3>Verified</h3>
            <p>{verifiedCount}</p>
          </div>

          {/* <div className="stat-card ctc">
            <h3>Average CTC</h3>
            <p>₹{avgCTC} LPA</p>
          </div> */}
          <div className="stat-card sector">
          <h3>Sector Distribution</h3>

          <div className="sector-list">
            {Object.entries(sectorStats).map(([sector, count]) => (
              <div key={sector} className="sector-row">
                <span>{sector}</span>
                <span className="sector-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
       

        {/* ----------------------------- Alumni Table */ }
        <div className="table-container">
          <div className="table-wrapper">
            <table className="alumni-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={
                        currentRecords.length > 0 &&
                        currentRecords.every(item => selectedRows.has(item.id))
                      }
                      ref={(el) => {
                        if (el) {
                          const someSelected = currentRecords.some(item => selectedRows.has(item.id));
                          const allSelected = currentRecords.length > 0 &&
                            currentRecords.every(item => selectedRows.has(item.id));
                          el.indeterminate = someSelected && !allSelected;
                        }
                      }}
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
                      <td>{alumni.Name}</td>
                      <td>{alumni.Email}</td>
                      <td><span className={`dept-badge ${getDepartmentClass(alumni.Department)}`}>{alumni.Department ?alumni.Department :alumni.Deparment} </span></td>
                      <td>{alumni.YearOfPassOut}</td>
                      <td>{alumni.Designation || '-'}</td>
                      <td>{alumni.Organisation || '-'}</td>
                      <td>{alumni.verified ? 'Yes' : 'No'}</td>
                      <td>
                        <div className="action-buttons-cell">
                          <button 
                            className="btn-icon-small view-btn" 
                            onClick={() => openModal('view', alumni)}
                            aria-label="View alumni details"
                          >
                            <FiEye />
                          </button>
                          <button 
                            className="btn-icon-small delete-btn" 
                            onClick={() => deleteAlumni(alumni.id)}
                            aria-label="Delete alumni"
                          >
                            <FiTrash2 />
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
                  <FiChevronLeft />
                  Previous
                </button>
                
                <button 
                  className="pagination-btn" 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <FiChevronRight />
                </button>

                <div className="pagination-jump">
                  <span className="jump-label">Go to</span>
                  <form className="jump-form" onSubmit={handleJumpToPage}>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="jump-input"
                      placeholder="Page #"
                      value={jumpPage}
                      onChange={handleJumpInputChange}
                    />
                    <button type="submit" className="jump-go-btn">Go</button>
                  </form>
                </div>
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
              <button className="modal-close" onClick={closeModal} aria-label="Close">
                <FiX />
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
                      {yearOptions.map(year => (
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
              <button className="btn btn-secondary" onClick={closeModal}>
                <FiX className="btn-icon" />
                Cancel
              </button>
              <button className="btn btn-primary" onClick={addAlumni}>
                <FiPlus className="btn-icon" />
                Add Alumni
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Alumni Details Modal (read-only) */}
      {activeModal === 'view' && viewAlumni && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal modal-view">
            <div className="modal-header">
              <h2>Alumni Details</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Close">
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile-card">
                <div className="view-profile-header">
                  <div className="view-avatar">{getInitials(viewAlumni.Name)}</div>
                  <div className="view-header-info">
                    <h3>{viewAlumni.Name}</h3>
                    <p className="view-subtitle">
                      {viewAlumni.Department || viewAlumni.Deparment || '-'}
                      {viewAlumni.YearOfPassOut ? ` · Class of ${viewAlumni.YearOfPassOut}` : ''}
                    </p>
                    {viewAlumni.verified && <span className="view-verified-badge">✓ Verified</span>}
                  </div>
                </div>

                <div className="view-section">
                  <h4 className="view-section-title">Personal Details</h4>
                  <div className="view-grid">
                    <ViewDetail label="Campus ID" value={viewAlumni.CampusID} />
                    <ViewDetail label="Full Name" value={viewAlumni.Name} />
                    <ViewDetail label="Email" value={viewAlumni.Email} />
                    <ViewDetail label="Gender" value={viewAlumni.Gender} />
                    <ViewDetail label="Date of Birth" value={viewAlumni.DateOfBirth} />
                    <ViewDetail label="Contact Number 1" value={viewAlumni.ContactNumber1} />
                    <ViewDetail label="Contact Number 2" value={viewAlumni.ContactNumber2} />
                    <ViewDetail label="WhatsApp Number" value={viewAlumni.WhatsAppNumber} />
                    <ViewDetail label="Country Code" value={viewAlumni.CountryCode} />
                    <ViewDetail label="LinkedIn Profile" value={viewAlumni.LinkedinProfile} />
                    <ViewDetail label="Department" value={viewAlumni.Department || viewAlumni.Deparment} />
                    <ViewDetail label="Degree Program" value={viewAlumni.Degree} />
                    <ViewDetail label="Graduation Year" value={viewAlumni.YearOfPassOut} />
                    <ViewDetail label="Hostel" value={viewAlumni.Hostel} />
                    <ViewDetail label="Permanent Address" value={viewAlumni.PermanentAddress} />
                    <ViewDetail label="Awards" value={viewAlumni.Awards} />
                  </div>
                </div>

                <div className="view-section">
                  <h4 className="view-section-title">Professional Details</h4>
                  <div className="view-grid">
                    <ViewDetail label="Job Title" value={viewAlumni.Designation} />
                    <ViewDetail label="Company" value={viewAlumni.Organisation} />
                    <ViewDetail label="Location" value={viewAlumni.Current_Location} />
                    <ViewDetail label="Employee Sector" value={viewAlumni.EmployeeSector} />
                    <ViewDetail label="Current CTC" value={viewAlumni.CurrentCTC} />
                  </div>
                </div>

                <div className="view-section">
                  <h4 className="view-section-title">Campus Placement Details</h4>
                  <div className="view-grid">
                    <ViewDetail label="Placed" value={viewAlumni.CampusPlacement?.Placed ? 'Yes' : 'No'} />
                    <ViewDetail label="Company" value={viewAlumni.CampusPlacement?.Company} />
                    <ViewDetail label="Role" value={viewAlumni.CampusPlacement?.Role} />
                    <ViewDetail label="Package" value={viewAlumni.CampusPlacement?.Package} />
                    <ViewDetail label="Year" value={viewAlumni.CampusPlacement?.Year} />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                <FiX className="btn-icon" />
                Close
              </button>
              <button className="btn btn-primary" onClick={() => openModal('edit', viewAlumni)}>
                <FiEdit2 className="btn-icon" />
                Edit Details
              </button>
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
              <button className="modal-close" onClick={closeModal} aria-label="Close">
                <FiX />
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
                      {yearOptions.map(year => (
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
              <button className="btn btn-secondary" onClick={closeModal}>
                <FiX className="btn-icon" />
                Cancel
              </button>
              <button className="btn btn-primary" onClick={updateAlumni}>
                <FiCheck className="btn-icon" />
                Update Alumni
              </button>
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
              <button className="modal-close" onClick={closeModal} aria-label="Close">
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="records-section">
                <h3>Export Options</h3>
                <div className="export-buttons">
                  <button className="btn btn-export-small btn-export-csv" onClick={() => handleExportCSV(alumniData)}>
                    <FiFileText className="btn-icon" />
                    CSV
                  </button>
                  <button className="btn btn-export-small btn-export-excel" onClick={() => handleExportExcel(alumniData)}>
                    <FiDownload className="btn-icon" />
                    Excel
                  </button>
                  <button className="btn btn-export-small btn-export-pdf" onClick={() => handleExportPDF(alumniData)}>
                    <FiFile className="btn-icon" />
                    PDF
                  </button>
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
                  <button className="btn btn-action-import">
                    <FiUpload className="btn-icon" />
                    Import from File
                  </button>
                  <p className="help-text">Supported formats: CSV, Excel (.xlsx, .xls)</p>
                </div>
              </div>
              <div className="records-section">
                <h3>Data Management</h3>
                <div className="data-actions">
                  <button className="btn btn-action-backup">
                    <FiHardDrive className="btn-icon" />
                    Backup Data
                  </button>
                  <button className="btn btn-action-restore">
                    <FiRotateCcw className="btn-icon" />
                    Restore Data
                  </button>
                  <button className="btn btn-action-clear">
                    <FiTrash2 className="btn-icon" />
                    Clear All Data
                  </button>
                </div>
              </div>
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
              <button className="modal-close" onClick={closeModal} aria-label="Close">
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="settings-section">
                <h3>General Settings</h3>
                <div className="setting-item">
                  <label htmlFor="recordsPerPage">Records per page</label>
                  <select id="recordsPerPage" value={recordsPerPageDraft} onChange={(e) => setRecordsPerPageDraft(Number(e.target.value))}>
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
              <button className="btn btn-secondary" onClick={closeModal}>
                <FiX className="btn-icon" />
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveSettings}>
                <FiCheck className="btn-icon" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Saved popup - small green box with tick */}
      {settingsSaved && (
        <div className="settings-saved-popup">
          <FiCheck className="settings-saved-tick" />
          <span className="settings-saved-text">Settings saved</span>
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

const ViewDetail = ({ label, value }) => {
  const display = value == null || value === '' ? '—' : (typeof value === 'object' ? JSON.stringify(value) : String(value));
  return (
    <div className="view-detail">
      <span className="view-detail-label">{label}</span>
      <span className="view-detail-value">{display}</span>
    </div>
  );
};

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map(p => p[0].toUpperCase()).join('');
  return initials || '?';
};

export default AdminDashboard;
