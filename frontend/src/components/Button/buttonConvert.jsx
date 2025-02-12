import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./buttonConvert.css";

const ButtonConvert = () => {
  const [isValid, setIsValid] = useState(null);
  const [videoUrl, setvideoUrl] = useState("");
  const [status, setStatus] = useState(null);
  const [downloadUrl, setdownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [videoTitle, setvideoTitle] = useState(false);
  const quality = "128";

  const validateLink = (e) => {
    const link = e.target.value.trim();
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

    if (link === "") {
      setIsValid(null);
    } else if (youtubeRegex.test(link)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
    setvideoUrl(link);
  };

  const handleChange = (e) => {
    setvideoUrl(e.target.value);
  };

  const handleInputChange = (e) => {
    validateLink(e);
    handleChange(e);
  };

  const getCsrfToken = async () => {
    try {
       const response = await axios.get("http://192.168.1.3:3000/csrf-token", { withCredentials: true });
    const data = await response.data.csrfToken;
    return data.csrfToken;
    } catch (error) {
      console.error("Error getting CSRF token: ", error);
      return null;
    }
  };

  const handleDownload = async () => {

    try {
      if (!downloadUrl) {
        alert("Download link is not available");
        return;
      }
  
      const csrfToken = await getCsrfToken();

      if (!csrfToken) {
        alert("CSRF token not found!");
        return
      }
      
      await axios.post("http://192.168.1.3:3000/api/link-convert", { videoUrl, quality }, {
        headers: {
          "Content-Type": "application/json",
          // Certifica-se de incluir o token corretamente
          // Ensures to include the token correctly
          "X-CSRF-Token": csrfToken,
        },
        // Garante que os cookies necessários são enviados
        // Ensures that the necessary cookies are sent
       withCredentials: true,
      });
  
      if (!response.ok) throw new Error("Download failed");
      ;
  
      const fullUrl = `http://192.168.1.3:3000/api/downloads/${downloadUrl
        .split("/")
        .pop()}`;
  
      console.log("Download url: ", fullUrl);
  
      const linkDownload = document.createElement("a");
      linkDownload.href = fullUrl; // URL retornada pelo backend | // URL returned by backend
      linkDownload.setAttribute("download", "");
      document.body.appendChild(linkDownload);
      linkDownload.click();
      document.body.removeChild(linkDownload);

    } catch (error) {
      console.error("Error downloading: ", error);
    }
  };

  const handleConvert = async () => {
    if (!videoUrl || !isValid) {
      alert("Please enter a valid Youtube URL.");
      return;
    }

    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

    if (!youtubeRegex.test(videoUrl)) {
      setIsValid(false);
      alert("Invalid YouTube URL. Please enter a correct link.");
      return;
    } else {
      setIsValid(true);
    }

    setIsValid(true);
    setLoading(true);
    setShowResult(false);

    try {
      const response = await axios.post(
        "http://192.168.1.3:3000/api/link-convert",
        { videoUrl, quality }
      );

      if (response.status === 200) {
        console.log("Conversion in progress... Waiting for response...");

        setTimeout(() => {
          setStatus("success");
          setdownloadUrl(response.data.downloadUrl);
          setvideoTitle(response.data.videoTitle || "Unknown Title");
          setShowResult(true);
          setLoading(false);
        }, 2000);
      } else {
        throw new Error("Failed to convert video");
      }
    } catch (error) {
      console.error("Conversion failed: ", error);
      setStatus("error");
      setShowResult(false);
      setLoading(false);
    }
  };

  // Reset para converter outro vídeo
  // Reset to convert another video
  const handleReset = () => {
    setvideoUrl("");
    setStatus(null);
    setdownloadUrl("");
    setShowResult(false);
    setIsValid(null);
    setvideoTitle("");
  };

  return (
    <React.Fragment>
      <div className="container-box">
        {!showResult ? (
          <div className="box">
            <input
              className={`link-box ${
                isValid === true ? "valid" : isValid === false ? "invalid" : ""
              }`}
              type="text"
              autoComplete="off"
              spellCheck="off"
              value={videoUrl}
              onChange={handleInputChange}
              id="input-link"
              placeholder="Please paste the YouTube video URL here..."
            />
            <button className="bnt" onClick={handleConvert} disabled={loading}>
              {loading ? "Converting..." : "Convert"}
            </button>
          </div>
        ) : (
          <div className="result-container">
            {status === "success" && (
              <>
                <h3 className="video-title">{videoTitle}</h3>
                <div className="result-content">
                  <p className="success-message-convert">
                    ✅ Conversion Successful!{" "}
                  </p>
                  <button onClick={handleDownload} className="download-btn">
                    Download MP3
                  </button>
                  <button className="convert-next-btn" onClick={handleReset}>
                    Convert Next 🔄
                  </button>
                </div>
              </>
            )}
            {status === "error" && (
              <p className="error-message-convert">
                {" "}
                ❌ Error processing the request. Try again later.
              </p>
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default ButtonConvert;
