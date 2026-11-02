import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './Events.css';
// Event images
import sacAlumnimeet from "../assets/Alumni Reunion/AR 4C.webp";
import alumniPark from '../assets/API 1C.webp';
import fallbackImg from '../assets/iit_pkd.jpg';

const Events = () => {
  const events = [
    {
      id: 1,
      name: "First Alumni Reuniuon",
      route: "/Event1",
      description: "Annual alumni gathering and networking event",
      weekday: "Saturday and Sunday",
      day: "6th and 7th",
      monthYear: "December 2025",
      venue: "IIT Palakkad Campus",
      duration: "2 day event",
      type: "Networking"
    },
    // {
    //   id: 2,
    //   name: "CV Writing Session",
    //   route: "/Event2",
    //   description: "Professional development workshop for students",
    //   weekday: "Saturday",
    //   day: "28",
    //   monthYear: "Sep 2024",
    //   venue: "Seminar Hall A",
    //   duration: "2 hour event",
    //   type: "Workshop"
    // },
    {
      id: 2,
      name: "Alumni Park Inauguration",
      route: "/Event2",
      description: "Alumni Park Inauguration",
      weekday: "Friday",
      day: "18",
      monthYear: "June 2025",
      venue: "Alumni Park",
      duration: "Half day event",
      type: "Inauguration"
    }
  ];

  // Map events to their images (fallback for those without a specific image)
  const eventImages = {
    1: sacAlumnimeet,
    2: alumniPark,
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      filter: 'blur(4px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0, 0, 0.2, 1]
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="events-container">
        <motion.div
          className="events-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
        >
          <h1>Our Events</h1>
          <p>Discover the latest events and activities at IIT PKD</p>
        </motion.div>
        
        <motion.div
          className="events-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {events.map((event) => (
            <motion.div
              key={event.id}
              variants={cardVariants}
              whileHover={{ y: -1}}
              transition={{ duration: 0.3 }}
            >
              <Link to={event.route} className="event-card">
                <div className="event-card-inner">
                  <div className="event-image-col">
                    <img
                      className="event-image"
                      src={eventImages[event.id] || fallbackImg}
                      alt={event.name}
                      loading="lazy"
                    />
                    <div className="event-image-overlay"></div>
                  </div>
                  <div className="event-date-col">
                    <span className="date-weekday">{event.weekday}</span>
                    <span className="date-day">{event.day}</span>
                    <span className="date-monthyear">{event.monthYear}</span>
                  </div>
                  <div className="event-info-col">
                    <span className="event-type-badge">{event.type}</span>
                    <h3 className="event-title">{event.name}</h3>
                    <div className="event-details">
                      <p className="event-venue">
                        <FaMapMarkerAlt className="icon" />
                        {event.venue}
                      </p>
                      <p className="event-desc">{event.description}</p>
                      <p className="event-duration">
                        <FaClock className="icon" />
                        {event.duration}
                      </p>
                    </div>
                    <div className="event-card-footer">
                      <span className="view-details">View Details →</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;