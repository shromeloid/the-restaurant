import { useState, useEffect } from "react";
import { getAccounts, getContract, getBookings, getBookingsArray, createBooking } from "../modul/services";
import Spinner from "../modul/spinner";
import "../styles/loader.css";
import { WalCon } from "./wallet";

const MAX_BOOKINGS = 15;


export function Booking () {
    const [numberOfGuests, setNumberOfGuests] = useState('');
    const [name, setName] = useState('');  
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [restaurantId, setrestaurantId] = useState(1);

    const [web3Ready, setWeb3Ready] = useState(false);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

    const [bookings, setBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [originalBookings, setOriginalBookings] = useState([]);
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

      useEffect(() => {
        const checkBtn = document.getElementById("check-btn");

       
      }, [numberOfGuests, date, time]);
    
    const handleNumberOfGuestsChange = (e) => {
        setNumberOfGuests(e.target.value);
      };
    
    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert('Please select a future date');
            setDate('');
            return;
        }

        setDate(selectedDate.toISOString().split('T')[0]);

        const date = e.target.value;
        setSelectedDate(date);
    };
    
    const handleTimeChange = (e) => {
        setTime(e.target.value);
      };

    const handlerestaurantIdChange = (e) => {
            setrestaurantId(e.target.value);
        };

    const handleBooking = async (e) => {
        setIsLoading(true)
        e.preventDefault();

        const bookingsAtTime = bookings.filter((booking) => booking.time === time && booking.date === selectedDate);
        if (bookingsAtTime.length >= MAX_BOOKINGS) {
            alert(`Sorry, all tables at ${time}:00 on ${selectedDate} are fully booked. Please choose another time.`);
            setIsLoading(false)
            return;
        }

        const bookingData = {
            numberOfGuests,
            name,
            date,
            time,
            restaurantId,
        };
        setNumberOfGuests("");
        setName("");
        setDate("");
        setTime("");
        setrestaurantId("");
        await openBookingForm(bookingData);
    };

    const openBookingForm = async (bookingData) => {
        const bookingConfirmed = window.confirm("Booking available. Do you want to proceed?");
        if (!bookingConfirmed) {
            setIsLoading(false)
            return;
        }

            try {
                
                if (account === null || account === undefined) {
                    alert("Metamask not connected. Please connect Metamask.");
                    setIsLoading(false);
                    return;
                }
            } catch (err) {
                console.error(err);
                alert("Error connecting to Metamask. Please try again later.");
                setIsLoading(false);
                return
            }



        const bookingInfo = {};
        const inputForm = `
            <form>
                <label for="name">Name:</label><br>
                <input type="text" id="name" name="name" required placeholder="Your Name" pattern="[a-zA-ZåäöÅÄÖ]+ [a-zA-ZåäöÅÄÖ]+" title="Please enter your first and last name. Name field should only contain letters"><br>
                <label for="email">Email:</label><br>
                <input type="email" id="email" name="email" required placeholder="name@example.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" title="Please use the following format: name@example.xx"><br>
                <label for="phone">Phone number:</label><br>
                <input type="tel" id="phone" name="phone" required placeholder="12345678" pattern="[\+0-9]{8,12}" title="Please enter 8-12 digits. Only numbers and country code is allowed in this field"><br>
                <input type="checkbox" id="GDPRbox" name="GDPRbox" required>
                <label for="GDPRbox">By checking this box, you agree to our <a href="https://example.com/terms">GDPR policies</a>.</label>
                <input type="submit" id="book-now-btn" value="Book now"><br>
                <button type="button" id="cancel-btn">Cancel</button>
            </form>
        `;
        const popup = window.open("", "Booking Form", "width=400,height=400");
        popup.document.write(inputForm);

        const form = popup.document.querySelector("form");
        const cancelBtn = popup.document.getElementById("cancel-btn");
        const GDPR = popup.document.getElementById("GDPRbox");
        const bookNowBtn = popup.document.getElementById("book-now-btn");

        GDPR.addEventListener("change", () => {
           
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            bookingInfo.name = popup.document.getElementById("name").value;
            bookingInfo.email = popup.document.getElementById("email").value;
            bookingInfo.phone = popup.document.getElementById("phone").value;

            try {
                if (contract) {
                    await createBooking(  
                        bookingData.numberOfGuests,
                        bookingInfo.name,
                        bookingData.date,
                        bookingData.time,
                        bookingData.restaurantId,)

                    popup.alert("Booking successful!");
                    getAllBookings();
                }
            } catch (err) {
                console.error(err);
                popup.alert("Booking failed. Please try again later.");
            }
            popup.close();
        });
        cancelBtn.addEventListener("click", () => {
            setIsLoading(false)
            popup.close();
        });
        popup.addEventListener("unload", () => {
            window.location.reload();
        });
    };

    if (isLoading) {
        return <Spinner />;
      };

      return (
        <>
          <h1>Book a table</h1>
          <form onSubmit={handleBooking}>
            <label>
              Number of guests:
              <select value={numberOfGuests} onChange={handleNumberOfGuestsChange} required>
                <option value="">Guests</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
              </select>
            </label>
            <label>
              Date:
              <input type="date" value={date} onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} required />
            </label>
            <label>
              Time:
              <select value={time} onChange={handleTimeChange} required>
                <option value="">Select a time</option>
                <option value={18}>18</option>
                <option value={21}>21</option>
              </select>
            </label>
            <button type="submit" id="check-btn" >Check availability</button>
          </form>
        </>
      );
      
}