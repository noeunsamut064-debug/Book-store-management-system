function Contact() {

  return (
    <div className="container mt-5">

      <h1>Contact Us</h1>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Name"
      />

      <input
        type="email"
        className="form-control mb-3"
        placeholder="Email"
      />

      <textarea
        className="form-control mb-3"
        placeholder="Message"
      ></textarea>

      <button className="btn btn-primary">
        Send
      </button>

    </div>
  );
}

export default Contact;