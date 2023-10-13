import { createBrowserRouter } from "react-router-dom";
import { Home } from "./components/home";
import { Booking } from "./components/booking";
import { Contact } from "./components/contact";
import { Layout } from "./components/Layout";
import { Admin } from "./components/admin";
import { EditBooking } from "./components/editBooking";
import App from "./App";
import BookingForm from "./components/bookingData";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
        index: true,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/booking",
        element: <Booking />,
      },
      {
        path: "/admin/edit-booking/:id",
        element: <EditBooking />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/booking/form",
        element: <BookingForm />,
      }
    ],
  },
]);