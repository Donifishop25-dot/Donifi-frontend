import React from "react";

export default function Contact() {
  return (
    <div className="container my-5 p-4 rounded-3 bg-white shadow-sm">
      <h3>Contact Us</h3>
      <p className="text-muted">Have a question, partnership idea, or want to be featured? Fill out the form and our team will get in touch.</p>
      <form className="contact-form" onSubmit={(e)=>{ e.preventDefault(); alert("Thanks — form submission simulated."); e.currentTarget.reset(); }}>
        <div className="mb-3"><label className="form-label">Full name</label><input className="form-control" placeholder="Enter your name" required /></div>
        <div className="mb-3"><label className="form-label">Email</label><input className="form-control" type="email" placeholder="you@example.com" required /></div>
        <div className="mb-3"><label className="form-label">Phone</label><input className="form-control" placeholder="+91 98765 43210" /></div>
        <div className="mb-3"><label className="form-label">Company</label><input className="form-control" placeholder="Company name" /></div>
        <div className="mb-3"><label className="form-label">Message</label><textarea className="form-control" rows="4" placeholder="Tell us about your request" required /></div>
        <div className="d-flex gap-2"><button className="btn btn-gold" type="submit">Send Message</button><button type="reset" className="btn btn-outline-gold">Reset</button></div>
      </form>
      {/* <div className="contact-info p-4 rounded-3 mt-4" style={{ border: "1px solid rgba(240,180,41,0.06)" }}>
        <h5>Reach out directly</h5>
        <p className="text-muted">Email: </p>
        <p className="text-muted">Phone: </p>
        <div className="map-placeholder my-3 rounded-2"><div className="map-fake"></div></div>
        <p className="small text-muted">We respect your privacy. We will never share your information without consent.</p>
      </div> */}
    </div>
  );
}
