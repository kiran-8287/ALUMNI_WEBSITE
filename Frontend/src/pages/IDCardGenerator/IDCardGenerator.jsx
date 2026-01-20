import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import IDCardForm from '../../components/IDCardGenerator/IDCardForm';
import './IDCardGeneratorPage.css';

const IDCardGeneratorPage = () => {
  return (
    <div className="id-card-page">
      <Navbar />
      <div className="id-card-header">
        <div className="container">
          <h1>Alumni Reunion ID Card Generator</h1>
          <p>Generate your digital ID card for IIT Palakkad Alumni Reunion 2024</p>
        </div>
      </div>
      
      <div className="container">
        <IDCardForm />
      </div>
      
      <Footer />
    </div>
  );
};

export default IDCardGeneratorPage;