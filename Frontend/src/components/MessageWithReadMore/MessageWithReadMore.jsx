import React, { useState } from 'react';
import './MessageWithReadMore.css';

function MessageWithReadMore({ paragraphs, role }) {
  const [expanded, setExpanded] = useState(false);
  
  // Special handling for Director's message with complete content
  const fullDirectorMessage = [
    "Dear Alumni,",
    "As IIT Palakkad celebrates a decade of growth, innovation, and academic excellence, we take this opportunity to extend our heartfelt gratitude for your invaluable contributions. Your achievements, both personal and professional, are a source of great pride and reflect the strong foundation we have built together. Each milestone you reach embodies the spirit of excellence and curiosity that defines IIT Palakkad.",
    "Whether you were part of our pioneering cohorts or are a recent graduate, you remain an integral part of our ever-growing community. Your experiences and successes not only inspire current students but also shape the future of our institution. We deeply value the bond we share with you and are committed to strengthening this connection in the years to come.",
    "As we mark this significant milestone, we invite you to stay engaged with the institute. Your insights, mentorship, and support play a crucial role in our collective journey forward. Together, we can continue to create a legacy of innovation, collaboration, and societal impact.",
    "Thank you for being a part of this remarkable journey. We look forward to your continued association and to celebrating many more achievements together."
  ];
  
  // Special handling for Dean's message with complete content
  const fullDeanMessage = [
    "Dear Student,",
    "It's wonderful to see you visiting your alma mater's alumni website. I hope it brings back fond memories of some of the best years of your life. That's why I've chosen to address you as 'student' rather than 'alumnus' - because that's who you were then, and in many ways, who you will always be to us.",
    "I'm sure you've been keeping up with IIT Palakkad's growth and staying in touch with your favorite teachers and staff. If not, why not surprise them with an email today? I assure you, it will make their day. And when you get the chance, do visit the campus. Your classrooms, hostels, grounds, and favorite hangout spots are always open to you.",
    "You can also engage more actively with our current students - your juniors - by sharing stories about life after graduation, offering advice on making the most of campus life, and imparting insights on what truly matters in life. If you have a story to tell, we would love to hear it! Please reach out to the IAR Cell or Alumni Relations Office. You can also take the engagement further and mentor a few of our students whose aspirations resonate with yours.",
    "On a more formal note, keeping your profile updated with our Alumni Relations Office helps us stay connected. Your achievements give meaning to the work we do, and we take immense pride in celebrating them.",
    "Looking forward to hearing from you,",
    "Warm regards",
    "Deepak Rajendraprasad",
    "Dean (Student Affairs)"
  ];
  const fullFicMessage= [
  "Dear Alumni and Well-Wishers,",
  "Greetings from IIT Palakkad!",
  "As one of the youngest IITs, we take immense pride in our growing alumni network, which is an integral part of our journey. Your achievements and contributions across diverse fields inspire our students and strengthen the legacy of IIT Palakkad.",
  "The International and Alumni Relations Office is dedicated to fostering lifelong connections between the institute and its graduates. We strive to create a vibrant community where alumni can engage with their alma mater, mentor students, collaborate on research and industry projects, and contribute to the institute’s continued growth.",
  "Through various initiatives, events, and networking opportunities, we aim to celebrate your successes, keep you informed about institute developments, and facilitate meaningful interactions.",
  "Whether you are a recent graduate or a seasoned professional, we invite you to stay connected, share your experiences, and continue to be a part of IIT Palakkad’s ever-expanding global family.",
  "We look forward to strengthening our bond with each of you. Stay engaged, stay inspired!",
  "Warm regards,",
  "Dr Subrahmanyam Mula"
]


  const isDirectorMessage = role === "Director's Message";
  const isDeanMessage = role === "Dean Students' Message";
  const isFicMessage = role === "Faculty-in-Charge Message";
  
  let messageParagraphs, shortMessage, needsReadMore;
  
  if (isDirectorMessage) {
    messageParagraphs = fullDirectorMessage;
    shortMessage = fullDirectorMessage.slice(0, 2);
    needsReadMore = true;
  } else if (isDeanMessage) {
    messageParagraphs = fullDeanMessage;
    shortMessage = fullDeanMessage.slice(0, 3);
    needsReadMore = true;
  }
  else if (isFicMessage) {
    messageParagraphs = fullFicMessage;
    shortMessage = fullFicMessage.slice(0, 4);
    needsReadMore = true;
  } else {
    messageParagraphs = paragraphs;
    shortMessage = paragraphs;
    needsReadMore = false;
  }
  
  return (
    <div className="message">
      {(expanded ? messageParagraphs : shortMessage).map((p, i) => (
        <p key={i} className="paragraph">{p}</p>
      ))}
      
      {needsReadMore && (
        <button 
          className={`read-more-btn director-btn`}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
      
      <br /><br />
      <hr />
    </div>
  );
}

export default MessageWithReadMore;
