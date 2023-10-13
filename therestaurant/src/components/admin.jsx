import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAccounts, getContract, getBookings, getBookingsArray, removeBookingService } from "../modul/services";
import { Booking } from "./booking";
import "../styles/admin.css";
import Spinner from "../modul/spinner";
import "../styles/loader.css";


export function Admin() {
  const [bookings, setBookings] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchTime, setSearchTime] = useState("");
  const [originalBookings, setOriginalBookings] = useState([]);
  const [web3Ready, setWeb3Ready] = useState(false);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    async function initWeb3() {
      
        setAccount(await getAccounts());
       
        setContract(await getContract()); 

        setWeb3Ready(true);
    }

    initWeb3();
  }, [contract]);

  async function getAllBookings() {
    try {
      if (contract) {
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
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (web3Ready) {
      getAllBookings();
    }
  }, [web3Ready]);

  function handleSearchSubmit(event) {
    event.preventDefault();
  
    // Check if date and time fields are both filled
    if (searchDate === "" || searchTime === "") {
      alert("Please fill in both date and time fields.");
      return;
    }
  
    // Filter original bookings by search date and time
    const filteredBookings = originalBookings.filter(
      (booking) =>
        booking.date === searchDate && booking.time === searchTime
    );
  
    setBookings(filteredBookings);
  }
  
  function handleSearchReset() {
    // Reset search form and display all bookings
    setSearchDate("");
    setSearchTime("");
    setBookings(originalBookings); // reset to original bookings
  }

 async function removeBooking(bookingId) {
  setIsLoading(true)
  try {
    await removeBookingService(bookingId)
    await getAllBookings()
  } catch (error) {
    console.error(error)
    setIsLoading(false)
  }
  setIsLoading(false)
}

  if (isLoading) {
    return <Spinner />;
  };
  return (
    <div className = "adminPage">
      <h1>Search bookings</h1>
      <form onSubmit={handleSearchSubmit} className="adminForm">
        <label>
          Date:
          <input
            type="date"
            value={searchDate}
            onChange={(event) => setSearchDate(event.target.value)}
          />
        </label>
        <label>
        Time:
        <select value={searchTime} onChange={(event) => setSearchTime(event.target.value)}>
          <option value="">Select a time</option>
          <option value="18">18</option>
          <option value="21">21</option>
        </select>
      </label>
        <button type="submit">Search</button>
        <button type="button" onClick={handleSearchReset}>Reset</button>
      </form>
      <div>
      <h2>Bookings</h2>
      <ul className="bookingslist">
      {bookings.map((booking) => (
        <li key={booking.id}>
          Name: {booking.name} Time: {booking.time} Date: {booking.date} Guests: {booking.numberOfGuests}
          <Link to={`/admin/edit-booking/${booking.id}`}>Edit</Link>
          <button type="button" onClick={() => removeBooking(booking.id)}>Remove</button>
        </li>
      ))}
</ul>
</div>
        <Booking />
    </div>
  );
}

