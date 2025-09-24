// ContactPage.jsx
import React from 'react';
import './contact.css';
import contacts from '../../data/contacts.json';

const ContactCard = ({ person }) => (
  <div className="contact-card">
    <div className="card-image">
      <img src={person.image} alt={person.name} />
    </div>
    <div className="card-content">
      <h3>{person.name}</h3>
      <p className="title">{person.title}</p>
      {person.department && <p>{person.department}</p>}
      {person.role && <p>{person.role}</p>}
      {person.address && <p>{person.address}</p>}
      {person.email && (
        <p className="email">
          <i className="fas fa-envelope"></i> {person.email}
        </p>
      )}
      {person.phone && (
        <p className="phone">
          <i className="fas fa-phone"></i> {person.phone}
        </p>
      )}
      {person.mobile && (
        <p className="mobile">
          <i className="fas fa-mobile-alt"></i> {person.mobile}
        </p>
      )}
      {person.linkedin && (
        <p className="title">
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
            Linkedin
          </a>
        </p>
      )}
    </div>
  </div>
);

const ContactPage = () => {
  return (
    <div>
      {/* Faculty / Office Address */}
      <div className="contact-section">
        <h1 className="section-title">Office Representatives</h1>

        <div className="contact-cards">
          {contacts.faculty.map((person, idx) => (
            <ContactCard key={idx} person={person} />
          ))}
        </div>
      </div>

      {/* Student Team (Head + Core) */}
      <div className="contact-section">
        <h1 className="section-title">Student Team</h1>
        <div className="contact-cards">
          {contacts.studentHead.map((person, idx) => (
            <ContactCard key={idx} person={person} />
          ))}
          {contacts.coreTeam.map((person, idx) => (
            <ContactCard key={idx} person={person} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
