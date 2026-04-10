import React, { useState,useEffect } from 'react';
import testimonialsData from '../../data/messages.json';
import './TestimonialSlider.css';

const testimonials = testimonialsData.testimonials || [];

const LeftArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);
const RightArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
);

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false); 
  
const [touchStart, setTouchStart] = useState(null);
const [touchEnd, setTouchEnd] = useState(null);

const minSwipeDistance = 50;

const onTouchStart = (e) => {
  setTouchEnd(null);
  setTouchStart(e.targetTouches[0].clientX);
};

const onTouchMove = (e) => {
  setTouchEnd(e.targetTouches[0].clientX);
};

const onTouchEnd = () => {
  if (!touchStart || !touchEnd) return;
  const distance = touchStart - touchEnd;

  if (distance > minSwipeDistance) next();
  if (distance < -minSwipeDistance) prev();
};

 
  
  const total = testimonials.length;

  if (total === 0) return null;

  const next = () => {
  setExpanded(false); // reset
  setCurrent((prev) => (prev + 1) % total);
};

  const prev = () => {
  setExpanded(false); // reset
  setCurrent((prev) => (prev - 1 + total) % total);
};
  const t = testimonials[current];
  const prevIdx = (current - 1 + total) % total;
  const nextIdx = (current + 1) % total;


  useEffect(() => {
  if (expanded) return; // pause when expanded

  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, 5000); // 4 sec

  return () => clearInterval(interval);
  }, [total, expanded]);

  return (
    <div className="testimonial-slider-section"
    >
      <h2 className="testimonial-title">What our Alumni say</h2>
      <div className="testimonial-title-underline"></div>

  {/* <div className="swipe-hint">← Swipe to explore →</div> */}

      <div className="testimonial-slider"
      onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}>
        {/* Faded previous card */}
        <div className="testimonial-card faded">
          <div className="testimonial-message">"{testimonials[prevIdx].message}"</div>
        </div>
        {/* Main card */}
        <div className="testimonial-card main">
          <span className="testimonial-quote-absolute">”</span>
          <button className="testimonial-arrow left" onClick={prev} aria-label="Previous testimonial"><span className="arrow-inner"><LeftArrow /></span></button>
          <div className="testimonial-content">
            {/* <div className="testimonial-message">"{t.message}"</div>
              */} 
            <div className={`testimonial-message ${expanded ? "expanded" : ""}`}>"{t.message}"</div>

            {t.message.length > 180 && (
              <button
                className="read-more-btn"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? "Read Less" : "Read More"}
              </button>
            )}

            <div className="testimonial-meta">
              <div className="testimonial-name">{t.name}</div>
              <div className="testimonial-year">{t.year}</div>
              <div className="testimonial-job">{t.job}</div>
              <div className="testimonial-gold-line"></div>
            </div>
          </div>
          <button className="testimonial-arrow right" onClick={next} aria-label="Next testimonial"><span className="arrow-inner"><RightArrow /></span></button>
        </div>
        
        {/* Faded next card */}
        <div className="testimonial-card faded">
          <div className="testimonial-message">"{testimonials[nextIdx].message}"</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider; 