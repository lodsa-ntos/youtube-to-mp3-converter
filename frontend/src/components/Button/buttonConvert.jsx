import React from "react";
import "./buttonConvert.css";

const ButtonConvert = () => {
  return (
    <React.Fragment>
    <div className="container-box">
      <div className="box">
        <input className="link-box" type="text" placeholder="Please paste the YouTube video URL here..."></input>
      </div>
    </div>

    {/* Spacing between link box and button */}
    <div className="spacing-between-link-box-btn"></div>
    
    <div className="container-btn">
      <button className="convert-btn" type="submit">Convert</button>
    </div>
    
    </React.Fragment>
  );
};

export default ButtonConvert;
