import { RESTAURANT_ABI, RESTAURANT_ADDRESS } from "./../config";
import web3 from "web3";

let contract = undefined;
let account = undefined;


export async function getAccounts() {

    await window.ethereum.enable();

        // Create web3 instance
        const web3Instance = new web3(window.ethereum);

        // Set web3 provider to the default account
        web3Instance.eth.defaultAccount = (await web3Instance.eth.getAccounts())[0];
        account = web3Instance.eth.defaultAccount 

    return web3Instance.eth.defaultAccount
  }

  export async function getContract() {

    await window.ethereum.enable();

        // Create web3 instance
        const web3Instance = new web3(window.ethereum);

        contract = new web3Instance.eth.Contract(
            RESTAURANT_ABI,
            RESTAURANT_ADDRESS
          );
          
    return contract
  }


  export async function getBookings() {
    const bookingsArray = await contract.methods.getBookings(1).call();
    return bookingsArray
  }

  export async function getBookingsArray(bookingIndex) {
    let bookingsArray = await contract.methods.bookings(bookingIndex).call();
    return bookingsArray
  }

  export async function getBookingId(bookingId) {
    const id = await contract.methods.bookings(bookingId).call();
    return id;
  }


  export async function editBooking(id, numberOfGuests, name, date, time) {
    console.log(account);
  let editBooking = await contract.methods.editBooking(id, numberOfGuests, name, date , time).send({ from: account });
        return  editBooking
        }

  export async function removeBookingService(bookingId) {
    let removeBooking = await contract.methods.removeBooking(bookingId).send({ from: account })
    return removeBooking
  }

  export async function createRestaurant() {
      let restaurant = await contract.methods.createRestaurant("Kantarellen").send({ from: account })
      return restaurant
  };

  export async function restaurantCount() {
    let restaurantCount = await  contract.methods.restaurantCount().call();
    return restaurantCount;
};

  export async function restaurantArray(indexCount) {
    let restaurantArray = contract.methods.restaurants(indexCount).call();
    return restaurantArray
  }


  export async function createBooking(numberOfGuests, name, date, time, restaurantId) {
    let createBooking =  await contract.methods.createBooking(numberOfGuests, name, date, time, restaurantId).send({ from: account });
    return createBooking
  }

 
  
  
