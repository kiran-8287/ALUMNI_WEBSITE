import React, { useEffect } from 'react';

import play_icon from '../../assets/play_icon.png';
import pause_icon from '../../assets/pause_icon.png';
import './Image_swap.css';
import Swap from './Swap';

const Image_swap = ({ setimgcount, playstatus, imgcount, setplaystatus }) => {
  

  return (
    
      <div className="full">
        <Swap playstatus={playstatus} imgcount={imgcount} />
        <div className="dot-play">
          <ul className="dots">
            <li onClick={() => setimgcount(0)} className={imgcount === 0 ? 'dot-orange' : 'dot-white'}></li>
            <li onClick={() => setimgcount(1)} className={imgcount === 1 ? 'dot-orange' : 'dot-white'}></li>
            <li onClick={() => setimgcount(2)} className={imgcount === 2 ? 'dot-orange' : 'dot-white'}></li>
          <li onClick={() => setimgcount(3)} className={imgcount === 3 ? 'dot-orange' : 'dot-white'}></li>
          <li onClick={() => setimgcount(4)} className={imgcount === 4 ? 'dot-orange' : 'dot-white'}></li>
          
          </ul>
        </div>
        {/* <div className="play-icon">
          <img onClick={() => setplaystatus(!playstatus)} src={playstatus ? pause_icon : play_icon} alt="play/pause" />
        </div> */}
      </div>
    
  );
};

export default Image_swap;
