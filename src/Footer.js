import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <>
      <footer className="footer">
        <p className="footer-link">
          Curated with{" "}
          <span role="img" aria-label="heart-emoji">
            ❤️
          </span>{" "}
          by{" "}
          <a
            href="https://github.com/rahul-kabra"
            target="_blank"
            rel="noreferrer noopener"
          >
            Rahul
          </a>
        </p>
      </footer>
    </>
  );
}

export default Footer;