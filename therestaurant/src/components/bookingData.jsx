import React, { useState } from "react";
import {getBookings, getBookingsArray, createBooking} from "../modul/services";

const BookingForm = (bookingData) => {
  const [bookingInfo, setBookingInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [GDPRChecked, setGDPRChecked] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [originalBookings, setOriginalBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGDPRCheck = () => {
    setGDPRChecked(!GDPRChecked);
  };

  async function getAllBookings() {
    try {
      
        const bookingsArray = await getBookings();
        const bookingCount = bookingsArray.length;
        console.log(bookingsArray);
        const bookings = [];
  
        for (let i = 0; i < bookingCount; i++) {
          const booking = await getBookingsArray(bookingsArray[i])
          bookings.push(booking);
        }
  
        setBookings(bookings);
        setOriginalBookings(bookings); // save original bookings

    } catch (err) {
      console.error(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    try {
      
        await createBooking(
          bookingData.numberOfGuests,
          bookingInfo.name,
          bookingData.date,
          bookingData.time,
          bookingData.restaurantId
        );

        alert("Booking successful!");
        getAllBookings();

    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <br />
      <input
        type="text"
        id="name"
        name="name"
        required
        placeholder="Your Name"
        pattern="[a-zA-ZåäöÅÄÖ]+ [a-zA-ZåäöÅÄÖ]+"
        title="Please enter your first and last name. Name field should only contain letters"
        value={bookingInfo.name}
        onChange={(e) =>
          setBookingInfo({ ...bookingInfo, name: e.target.value })
        }
      />
      <br />
      <label htmlFor="email">Email:</label>
      <br />
      <input
        type="email"
        id="email"
        name="email"
        required
        placeholder="name@example.com"
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        title="Please use the following format: name@example.xx"
        value={bookingInfo.email}
        onChange={(e) =>
          setBookingInfo({ ...bookingInfo, email: e.target.value })
        }
      />
      <br />
      <label htmlFor="phone">Phone number:</label>
      <br />
      <input
        type="tel"
        id="phone"
        name="phone"
        required
        placeholder="12345678"
        pattern="[\+0-9]{8,12}"
        title="Please enter 8-12 digits. Only numbers and country code is allowed in this field"
        value={bookingInfo.phone}
        onChange={(e) =>
          setBookingInfo({ ...bookingInfo, phone: e.target.value })
        }
      />
      <br />
      <input
        type="checkbox"
        id="GDPRbox"
        name="GDPRbox"
        checked={GDPRChecked}
        onChange={handleGDPRCheck}
      />
      <label htmlFor="GDPRbox">
        By checking this box, you agree to our{" "}
        <a href="https://example.com/terms">GDPR policies</a>.
      </label>
      <br />
      <input
        type="submit"
        id="book-now-btn"
        value="Book now"
        disabled={!GDPRChecked}
      />
      <br />
      <button type="button" onClick={() => window.close()}>
        Cancel
      </button>
      {formSubmitted && (
        <p>
          Thank you for your booking request! We will get back to you as soon as possible.
    </p>
  )}
</form>
);
};

export default BookingForm;
