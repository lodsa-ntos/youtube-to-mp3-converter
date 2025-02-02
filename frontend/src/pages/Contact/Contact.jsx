import React from "react";
import { BsGithub } from "react-icons/bs";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="container-contacts">
      <div className="card-contact1">
        <h3 className="title-contact-us">Contact us</h3>
        <p className="intro-contact-txt">Do you have any questions, suggestions or problems? <br />Get in touch with us!
          We're always looking to improve your experience. 
          Feel free to send us a message using the form on the right.<br /><br />
        </p>

        <p className="support-txt">
          <span className="technical-support-txt">Technical Support </span>
          <br />Need help with conversion? Send us a message.<br />
          <br /><span className="suggestions-feedback-txt">Suggestions and Feedback </span>
          <br /> Your opinion is important for improving the service.<br />
          <br /> <span className="report-problem-txt">Report a Problem </span>
          <br />Found an error? Let us know so we can fix it.
        </p>

        <a
          className="github-link"
          href="https://github.com/lodsa-ntos/youtube-to-mp3-converter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="github-space">
            <div className="github-icon-container">
              <BsGithub className="github-icon"/> 
            </div>
              <p className="contribute-subtitle">Contribute on GitHub</p>
          </div>
        </a>
        
        <p className="open-source-github-txt">
          Our project is open-source! If you want to help with development, check out our repository on GitHub. 🚀
        </p>
      </div>


      <div className="card-contact2">
          <div className="contact-content-form">
            <div className="container-cell">
              <div className="container-name">
                <p className="title-name">Name</p>
                <input className="input-name" id="name_id" name="Name" placeholder="Lod Carter"></input>
              </div>
              <div className="container-email">
                <p className="title-email">E-mail</p>
                <input className="input-email" id="email_id" name="E-mail" placeholder="example@youremail.com"></input>
              </div>
              <div className="container-phone">
                <p className="title-phone">Phone</p>
                <input className="input-phone" id="phone_id" name="Phone" placeholder="123 456 7890"></input>
              </div>
              <div className="container-subject">
                <p className="title-subject">Subject</p>
                <input className="input-subject" id="subject_id" name="Subject" placeholder="Ex: Careers"></input>
              </div>
              <div className="container-message">
                <p className="title-message">Message</p>
                <textarea className="input-message" id="message_id" placeholder="Type your message here..."></textarea>
              </div>
              <input type="submit" className="send-message-bnt" id="button_id" value={"Send Message"}></input>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Contact;