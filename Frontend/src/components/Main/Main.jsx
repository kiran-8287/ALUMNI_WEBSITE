import React, { useEffect, useState } from 'react';
import '../Main/Main.css';
import messagesData from '../../data/messages.json';
import TestimonialSlider from './TestimonialSlider';
import MessageWithReadMore from '../MessageWithReadMore/MessageWithReadMore';

function Main() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(messagesData.messages);
  }, []);

  return (
  <>
    <section className="refer1 enhanced-section">
      {messages.map((msg, idx) => (
        <div key={idx} className="message-card fade-in">
          
          <div className="card-header">
            <div className="image-wrapper">
              <img src={msg.image} alt={msg.name} className="DEAN enhanced-img" />
            </div>

            <div className="DirectorMessage">
              <p className="role-text">{msg.role.toUpperCase()}</p>
              <h2 className="name-text">{msg.name}</h2>
              <p className="profession-text">{msg.title}</p>
            </div>
          </div>

          <div className="card-body">
            <MessageWithReadMore 
              paragraphs={msg.paragraphs} 
              role={msg.role} 
            />
          </div>

        </div>
      ))}
    </section>
  </>
);


  // return (
  //   <>
  //     <section className="refer1">
    
  //       {messages.map((msg, idx) => (
  //         <div key={idx} className="message-block">
  //           <div className="name">
  //             <img src={msg.image} alt={msg.name} className="DEAN" />
  //             <div className="DirectorMessage">
  //               <hr className="length" />
  //               <p className="headfont"><span>{msg.role.toUpperCase()}</span></p>
  //               <hr />
  //               <p className="namefont">
  //                 {msg.name}<br />
  //                 <span className="profession">{msg.title}</span>
  //               </p>
  //             </div>
  //           </div>

  //           <MessageWithReadMore paragraphs={msg.paragraphs} role={msg.role} />
  //         </div>
  //       ))}
  //     </section>
  //     {/* <TestimonialSlider /> */}
  //   </>
  // );
}

export default Main;
