import "./footer.css";
import logo2 from "../images/LOGO_WATERMARK.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className="footer-container">
      <div>
        <img src={logo2} alt="JoncoMET" className="footer-logo" />
      </div>
      <div className="about-footer">
        <h2>About us</h2>
        <p>
          Step into our authentic clothing shop and experience the finest
          quality fabrics and styles that will stand the test of time.
        </p>
      </div>
      <div className="Contact-footer">
        <h2>Contact us</h2>
        <p>+961 71 958 446</p>
        <br />
        <div className="contact-socials">
          <a
            href="https://www.facebook.com/ZONE.Outlet.0?mibextid=LQQJ4d"
            className="facebook-social"
          >
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
          <a
            href="https://instagram.com/_zone_outlet_?igshid=YmMyMTA2M2Y="
            className="instagram-social"
          >
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
        </div>
      </div>
      <div className="question-footer">
        <h2>Do you have any Questions?</h2>
        <p>
          Our customer service is available from 
          -Monday to Friday from 09.00 to
          21.00 </p>
        <p>  -Saturdays from 10.00 to 17.00 .
        </p>
      </div>
    </div>
  );
};
export { Footer };
