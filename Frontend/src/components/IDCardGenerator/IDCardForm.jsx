import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import CameraCapture from './CameraCapture';
import './IDCardGenerator.css';

// Helper function to get cropped image
const getCroppedImg = (image, crop, fileName) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!image || !crop.width || !crop.height) {
    return Promise.reject(new Error('Invalid image or crop'));
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      blob.name = fileName;
      resolve(blob);
    }, 'image/jpeg', 0.9);
  });
};

const IDCardForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    institute: 'IIT Palakkad',
    rollNumber: '',
    mobileNumber: '',
    yearOfPassout: '',
    department: '',
    degree: ''
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [idCardUrl, setIdCardUrl] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 0,
    y: 0
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target.result);
        setShowCropModal(true);
        // Reset crop when new image is loaded
        setCrop({
          unit: '%',
          width: 50,
          height: 50,
          x: 25,
          y: 25
        });
      };
      reader.onerror = () => {
        alert('Error reading file. Please try another image.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    setShowCamera(true);
  };

  const handleCameraCapture = (file) => {
    setShowCamera(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
      setShowCropModal(true);
      // Reset crop when new image is loaded
      setCrop({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !completedCrop || !completedCrop.width || !completedCrop.height) {
      alert('Please select a crop area first');
      return;
    }

    setIsCropping(true);
    try {
      console.log('Starting crop process...');
      const croppedImageBlob = await getCroppedImg(
        imgRef.current,
        completedCrop,
        'cropped.jpg'
      );
      
      console.log('Image cropped successfully');
      const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
      setPhotoPreview(croppedImageUrl);
      setPhoto(croppedImageBlob);
      setShowCropModal(false);
      setOriginalImage(null);
      setCompletedCrop(null);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Error cropping image. Please try again. ' + error.message);
    } finally {
      setIsCropping(false);
    }
  };

  const generateIDCard = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 650;
    canvas.height = 420;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle background pattern
    ctx.fillStyle = '#f8f9fa';
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < canvas.height; j += 20) {
        if ((i + j) % 40 === 0) {
          ctx.fillRect(i, j, 2, 2);
        }
      }
    }

    // Main border
    ctx.strokeStyle = '#2c5aa0';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    // Inner border
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // IIT PKD Header with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#2c5aa0');
    gradient.addColorStop(1, '#1e3d6f');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 70);

    // Institute Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Arial", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('INDIAN INSTITUTE OF TECHNOLOGY PALAKKAD', canvas.width / 2, 30);
    ctx.font = 'bold 16px "Arial", sans-serif';
    ctx.fillText('ALUMNI REUNION 2025', canvas.width / 2, 55);

    // Photo area - larger and square
    const photoX = 40;
    const photoY = 90;
    const photoWidth = 140;
    const photoHeight = 160;

    if (photoPreview) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw photo background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
        
        // Draw photo with border
        ctx.strokeStyle = '#2c5aa0';
        ctx.lineWidth = 2;
        ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);

        // Calculate dimensions to fill the square area while maintaining aspect ratio
        const scale = Math.max(photoWidth / img.width, photoHeight / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = photoX + (photoWidth - width) / 2;
        const y = photoY + (photoHeight - height) / 2;
        
        ctx.drawImage(img, x, y, width, height);

        drawUserDetails(ctx, photoX + photoWidth + 20);
        
        // Convert to data URL and set state
        const dataUrl = canvas.toDataURL('image/png');
        setIdCardUrl(dataUrl);
      };
      img.onerror = () => {
        console.error('Error loading photo for ID card');
        drawUserDetails(ctx, photoX + photoWidth + 20);
        const dataUrl = canvas.toDataURL('image/png');
        setIdCardUrl(dataUrl);
      };
      img.src = photoPreview;
    } else {
      // Placeholder if no photo
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
      ctx.strokeStyle = '#dee2e6';
      ctx.lineWidth = 2;
      ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);
      
      ctx.fillStyle = '#6c757d';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('NO PHOTO', photoX + photoWidth/2, photoY + photoHeight/2);
      
      drawUserDetails(ctx, photoX + photoWidth + 20);
      
      // Convert to data URL and set state
      const dataUrl = canvas.toDataURL('image/png');
      setIdCardUrl(dataUrl);
    }

    function drawUserDetails(ctx, startX) {
      // User details with better layout
      ctx.fillStyle = '#2c5aa0';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('ALUMNI ID CARD', startX, 110);

      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      
      const details = [
        `Name: ${formData.name.toUpperCase()}`,
        `Roll No: ${formData.rollNumber}`,
        `Department: ${formData.department}`,
        `Degree: ${formData.degree}`,
        `Passout Year: ${formData.yearOfPassout}`,
        `Mobile: ${formData.mobileNumber}`
      ];

      details.forEach((detail, index) => {
        ctx.fillText(detail, startX, 140 + (index * 28));
      });

      // Institute logo area (placeholder)
      ctx.fillStyle = '#e9ecef';
      ctx.fillRect(startX, 300, 120, 40);
      ctx.fillStyle = '#6c757d';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('IIT PKD LOGO', startX + 60, 320);

      // Footer
      ctx.fillStyle = '#2c5aa0';
      ctx.fillRect(0, canvas.height - 35, canvas.width, 35);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Official Alumni ID Card - Valid for Alumni Reunion 2025', canvas.width / 2, canvas.height - 15);
    }
  };

  const downloadIDCard = () => {
    if (idCardUrl) {
      const link = document.createElement('a');
      link.download = `IITPKD_Alumni_ID_${formData.name.replace(/\s+/g, '_')}.png`;
      link.href = idCardUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cancelCrop = () => {
    setShowCropModal(false);
    setOriginalImage(null);
    setCompletedCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

const onImageLoad = (e) => {
  const { width, height } = e.currentTarget;
  
  // For rectangular crop (better for face photos)
  const cropWidth = width * 0.7;  // 70% of image width
  const cropHeight = cropWidth * (4/3); // 4:3 aspect ratio
  
  const x = (width - cropWidth) / 2;
  const y = (height - cropHeight) / 2;
  
  setCrop({
    unit: 'px',
    width: cropWidth,
    height: cropHeight,
    x,
    y
  });
  
  setCompletedCrop({
    unit: 'px',
    width: cropWidth,
    height: cropHeight,
    x,
    y
  });
};

  return (
    <div className="id-card-generator">
      {/* Crop Modal */}
      {showCropModal && (
        <div className="crop-modal">
          <div className="crop-modal-content">
            <div className="crop-modal-header">
              <h3>Crop Your Photo</h3>
              <p>Drag the corners to adjust the crop area</p>
            </div>
            
            <div className="crop-container">
              {originalImage && (
                <ReactCrop
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  minWidth={100}
                  minHeight={100}
                  keepSelection={true}
                >
                  <img
                    ref={imgRef}
                    src={originalImage}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    style={{ maxWidth: '100%', maxHeight: '400px' }}
                  />
                </ReactCrop>
              )}
            </div>

            <div className="crop-modal-actions">
              <button 
                className="cancel-crop-btn" 
                onClick={cancelCrop}
                disabled={isCropping}
              >
                Cancel
              </button>
              <button 
                className="apply-crop-btn" 
                onClick={handleCropComplete}
                disabled={isCropping || !completedCrop}
              >
                {isCropping ? 'Processing...' : 'Use This Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture 
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <div className="id-card-form">
        <h2>Generate Alumni ID Card</h2>
        
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label>Roll Number:</label>
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            placeholder="Enter your roll number"
            required
          />
        </div>

        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="Enter your mobile number"
          />
        </div>

        <div className="form-group">
          <label>Year of Passout:</label>
          <input
            type="number"
            name="yearOfPassout"
            value={formData.yearOfPassout}
            onChange={handleChange}
            placeholder="e.g., 2020"
            min="1900"
            max="2030"
          />
        </div>

        <div className="form-group">
          <label>Department:</label>
          <select name="department" value={formData.department} onChange={handleChange}>
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Chemical Engineering">Chemical Engineering</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Humanities">Humanities</option>
          </select>
        </div>

        <div className="form-group">
          <label>Degree:</label>
          <select name="degree" value={formData.degree} onChange={handleChange}>
            <option value="">Select Degree</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="PhD">PhD</option>
            <option value="MSc">MSc</option>
            <option value="MA">MA</option>
          </select>
        </div>

        {/* Photo Upload Section */}
        <div className="form-group">
          <label>Profile Photo:</label>
          <div className="photo-upload-section">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
              id="photo-upload"
            />
            
            <div className="photo-buttons">
              <button 
                type="button" 
                className="upload-btn"
                onClick={() => document.getElementById('photo-upload').click()}
              >
                📁 Upload Photo
              </button>
              <button 
                type="button" 
                className="camera-btn"
                onClick={handleTakePhoto}
              >
                📷 Take Photo
              </button>
            </div>

            {photoPreview && (
              <div className="photo-preview">
                <div className="preview-label">Photo Preview:</div>
                <img src={photoPreview} alt="Preview" className="square-preview" />
                <button 
                  type="button" 
                  className="remove-photo-btn"
                  onClick={removePhoto}
                >
                  🗑️ Remove Photo
                </button>
              </div>
            )}

            <p className="photo-help-text">
              📸 Recommended: Square photo, 5MB max, JPG/PNG format
            </p>
          </div>
        </div>

        <button 
          className="generate-btn"
          onClick={generateIDCard}
          disabled={!formData.name || !formData.rollNumber}
        >
          🎫 Generate ID Card
        </button>
      </div>

      {idCardUrl && (
        <div className="id-card-preview">
          <h3>Your ID Card Preview</h3>
          <div className="preview-container">
            <img src={idCardUrl} alt="Generated ID Card" className="id-card-image" />
            <button className="download-btn" onClick={downloadIDCard}>
              ⬇️ Download ID Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDCardForm;