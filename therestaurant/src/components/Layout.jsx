import { Navigation } from "./navigation";
import { Outlet } from "react-router-dom";
import cryptoKantarellen from "../img/cryptoKantarellen.jpg";


export function Layout() {
  const layoutStyles = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px"
    
  };

  
  const headerStyles = {
    backgroundColor: "#f1f1f1",
    padding: "20px",
    marginBottom: "20px"
    
  };

  const mainStyles = {
    minHeight: "calc(100vh - 200px)",
    backgroundImage: `url(${cryptoKantarellen})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    textShadow: "2px 2px 2px black",

  };

  const footerStyles = {
    backgroundColor: "#f1f1f1",
    padding: "20px",
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    color: "gray"
  };

  const smallScreenStyles = {
    padding: "0 10px"
  };

  return (
    <>
      <header style={headerStyles}>
        <Navigation />
      </header>
      <main style={{ ...layoutStyles, ...mainStyles }}>
        <Outlet />

      </main>
      <footer style={footerStyles}>
        © Kantarellen, 2023
      </footer>
      <style>
        {`@media screen and (max-width: 600px) {
          main {
            padding: 0 10px;
            
          }
        }`}
      </style>
    </>
  );
}