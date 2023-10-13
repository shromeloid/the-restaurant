import React from "react";

export function Contact() {
  const contactStyles = {
    textAlign: "center"
  };

  const addressStyles = {
    fontSize: "1rem"
  };

  return (
    <div style={contactStyles}>
      <p>Contact: Kantarellen@msn.se</p>
      <p style={addressStyles}>Address: Östermalmsgatan 13, Sthlm</p>
    </div>
  );
}
