import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAccounts, getContract, getBookingId, editBooking } from "../modul/services";
import Spinner from "../modul/spinner";
import "../styles/loader.css";

export function EditBooking() {
  const { id } = useParams();
  const [booking, setBooking] = useState({ name: "", date: "", time: "", numberOfGuests: "" });
  const [web3Ready, setWeb3Ready] = useState(false);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initWeb3() {
        setAccount(await getAccounts());
       
        setContract(await getContract()); 

      setWeb3Ready(true);
    }
    initWeb3();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      await editBooking(id,
        parseInt(booking.numberOfGuests),
        booking.name,
        booking.date,
        parseInt(booking.time))
  
      window.location.href = "/admin";
    } catch (err) {
      console.error(err);
    }
  
    setIsLoading(false); 
  }

  useEffect(() => {
    async function getBooking() {
      if (web3Ready && contract) {
        try {
          const bookingData = await getBookingId(id);
          setBooking({
            name: bookingData.name,
            date: bookingData.date,
            time: bookingData.time,
            numberOfGuests: bookingData.numberOfGuests
          });
        } catch (err) {
          console.error(err);
        }
      }
    }

    getBooking();
  }, [web3Ready, contract, id]);


  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
      <h2>Edit Booking</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={booking.name}
            required
            onChange={(e) =>
              setBooking({ ...booking, name: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            required
            value={booking.date}
            onChange={(e) =>
              setBooking({ ...booking, date: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="time">Time:</label>
          <select
            id="time"
            value={booking.time}
            required
            onChange={(e) =>
              setBooking({ ...booking, time: e.target.value })
            }
          >
            <option value="">Select a time</option>
            <option value="18">18</option>
            <option value="21">21</option>
          </select>
        </div>
        <div>
          <label htmlFor="numberOfGuests">Number of Guests:</label>
          <input
            type="number"
            id="numberOfGuests"
            required
            value={booking.numberOfGuests}
            onChange={(e) =>
              setBooking({ ...booking, numberOfGuests: e.target.value })
            }
            max="6"
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
      </>
      )}
    </div>
  );
}
