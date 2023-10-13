import { NavLink } from "react-router-dom";
import "../styles/navigation.css"
import { WalCon } from "./wallet";

export const Navigation = () => {
  return (
    <nav>
      <ul className="navMenu">
        <li>
          <NavLink to={"/Home"}>Home</NavLink>
        </li>
        <li>
          <NavLink to={"/booking"}>Booking</NavLink>
        </li>
        <li>
          <NavLink to={"/contact"}>Contact</NavLink>
        </li>
        <li>
        <WalCon/>
        </li>
      </ul>
      

    </nav>
  );
};