import React, { useState } from 'react';
import './ReachUs.css';

const ReachUs = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const scriptURL = 'https://script.google.com/macros/s/AKfycbxdM_XiIfI9gyJIF5OarBL4tU-qmM0KUigP-AWSlrNFpV3shFK8dYPurpHAeemSKrw/exec';
        const form = new FormData();

        form.append('name', name);
        form.append('email', email);
        form.append('message', message);

        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: form,
            });

            if (response.ok) {
                alert('Your message has been sent successfully!');
                setName('');
                setEmail('');
                setMessage('');
            } else {
                alert('There was an issue sending your message. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    };
    // Publication data
    const footprintsEditions = [
  { id: 1, title: "Edition 1", url: "/footprints/Footprints_Edition1.pdf" },
  { id: 2, title: "Issue 2", url: "/footprints/Footprints_Issue2.pdf" },
  { id: 3, title: "Edition 2", url: "/footprints/Footprints_Edition2.pdf" },
  { id: 4, title: "Edition 3", url: "/footprints/Footprints_Edition3.pdf" },
  { id: 5, title: "Edition 4", url: "/footprints/Footprints_Edition4.pdf" },
  { id: 6, title: "Edition 5", url: "/footprints/Footprints_Edition5.pdf" }
];


    const newsletters = [
        { id: 1, title: "Sahyadri TechXpress ", issue: "Jan 2024", url: "/newsletters/NewsLetters1-issue1.pdf"},
        { id: 2, title: "Sahyadri TechXpress ", issue:"May 2024", url: "/newsletters/NewsLetters1-issue2.pdf"},
        { id: 2, title: "Sahyadri TechXpress", issue: "Sept 2024", url: "/newsletters/NewsLetters1-issue3.pdf"},
        { id: 2, title: "Sahyadri TechXpress ", issue: "Jan 2025", url: "/newsletters/NewsLetters2-issue1.pdf"},
        // { id: 2, title: "Newsletter 2", url: "https://drive.google.com/file/d/1GXC2ERhJ38DMiqiWA1d-XF9nTmi85nuT/view" },
        // { id: 3, title: "Newsletter 3", url: "https://iitpkd.ac.in/sites/default/files/uploads2024/4df4c345-ee1f-49f5-8482-79406745bcb0.pdf" },
        // { id: 4, title: "Newsletter 4", url: "https://iitpkd.ac.in/sites/default/files/uploads2025/cc86e22d-43c4-4c26-939b-ccb5707ffc99.pdf" }
    ];

    return (
        <div className="reach-us-page">
            <div className="reach-us-wrapper">
                <div className="left-panel">
                    <div className="publications-section">
                        <div className="section-header">
                            <h2>Publications</h2>
                            <div className="section-underline"></div>
                        </div>
                     
                        <div className="publication-category">
                            <h3>Newsletters</h3>
                            {/* <h3>Footprints Editions</h3> */}

                            <div className="publication-grid">
                                {newsletters.map(edition => (
                                    <a 
                                        key={edition.id}
                                        href={edition.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="publication-card newsletter"
                                    >
                                       <div className="edition-badge">{edition.issue}</div>
                                        <div className="publication-title">{edition.title}</div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* <div className="publication-category">
                            <h3>Footprints Editions</h3>

                            <div className="publication-grid">
                                {footprintsEditions.map(newsletter => (
                                    <a 
                                        key={newsletter.id}
                                        href={newsletter.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="publication-card newsletter"
                                    >
                                        <div className="publication-title">{newsletter.title}</div>
                                    </a>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>

                <div className="right-panel">
                    <div className="contact-form-container">
                        <div className="form-header">
                            <h2>Get In Touch</h2>
                            <p>Have questions? Reach out to us directly</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="modern-form">
                            <div className="form-input-group">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder=" "
                                />
                                <label>Your Name</label>
                                <div className="input-underline"></div>
                            </div>
                            
                            <div className="form-input-group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder=" "
                                />
                                <label>Email Address</label>
                                <div className="input-underline"></div>
                            </div>
                            
                            <div className="form-input-group textarea-group">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    placeholder=" "
                                    rows="4"
                                />
                                <label>Your Message</label>
                                <div className="input-underline"></div>
                            </div>
                            
                            <button type="submit" className="form-submit-btn">
                                <span>Send Message</span>
                                <div className="arrow-icon">→</div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReachUs;