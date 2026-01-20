import React, { useRef, useState, useEffect } from 'react';
import './IDCardGenerator.css';

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' for front camera, 'environment' for back

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      stopCamera(); // Stop any existing stream
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please check permissions and make sure no other app is using the camera.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and trigger callback
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        onCapture(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="camera-modal-overlay">
      <div className="camera-modal">
        <div className="camera-header">
          <h3>Take Your Photo</h3>
          <button onClick={handleClose} className="close-camera-btn">✕</button>
        </div>
        
        <div className="camera-preview">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="camera-video"
          />
          <div className="camera-frame">
            <div className="frame-guide"></div>
          </div>
        </div>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <div className="camera-controls">
          <button onClick={switchCamera} className="switch-camera-btn">
            🔄 Switch Camera
          </button>
          <button onClick={capturePhoto} className="capture-btn">
            📸 Capture
          </button>
          <button onClick={handleClose} className="cancel-camera-btn">
            Cancel
          </button>
        </div>

        <div className="camera-instructions">
          <p>• Position your face in the frame</p>
          <p>• Ensure good lighting</p>
          <p>• Look straight at the camera</p>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;