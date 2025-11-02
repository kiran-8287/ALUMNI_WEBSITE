import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './Events.css';
// Event images
import sacAlumnimeet from '../assets/SACAlumnimeet.png';
import cvWriting from '../assets/CVWritingMitul.png';
import startup1 from '../assets/Building a tech startup 1.png';
import fallbackImg from '../assets/iit_pkd.jpg';

const Events = () => {
  const events = [
    {
      id: 1,
      name: "SAC Alumni Meet",
      route: "/Event1",
      description: "Annual alumni gathering and networking event",
      weekday: "Saturday",
      day: "23",
      monthYear: "Aug 2025",
      venue: "IIT Palakkad Campus",
      duration: "1 day event"
    },
    {
      id: 2,
      name: "CV Writing Session",
      route: "/Event2",
      description: "Professional development workshop for students",
      weekday: "Sunday",
      day: "14",
      monthYear: "Sep 2025",
      venue: "Seminar Hall A",
      duration: "2 hour event"
    },
    {
      id: 3,
      name: "Session on Building a tech startup",
      route: "/Event3",
      description: "Entrepreneurship insights and guidance",
      weekday: "Friday",
      day: "03",
      monthYear: "Oct 2025",
      venue: "Auditorium",
      duration: "Half day event"
    }
  ];

  // Map events to their images (fallback for those without a specific image)
  const eventImages = {
    1: sacAlumnimeet,
    2: cvWriting,
    3: startup1,
  };

  return (
    <div>
      <Navbar />
      <div className="events-container">
        <div className="events-header">
          <h1>Our Events</h1>
          <p>Discover the latest events and activities at IIT PKD</p>
        </div>
        
        <div className="events-grid">
          {events.map((event) => (
            <Link to={event.route} key={event.id} className="event-card">
              <div className="event-card-inner">
                <div className="event-image-col">
                  <img
                    className="event-image"
                    src={eventImages[event.id] || fallbackImg}
                    alt={event.name}
                    loading="lazy"
                  />
                </div>
                <div className="event-info-col">
                  <h3 className="event-title">{event.name}</h3>
                  <p className="event-venue">{event.venue ? `Venue: ${event.venue}` : ''}</p>
                  <p className="event-desc">{event.description}</p>
                  <p className="event-duration">{event.duration}</p>
                  <div className="event-card-footer">
                    <span className="view-details">View Details →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;