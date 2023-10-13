import {createRestaurant, restaurantCount, restaurantArray } from "../modul/services";

export function Restaurant() {

  const populateRestaurant = async () => {
    try {
      const indexCount = await restaurantCount();
      if (indexCount === "0") {
        console.log("Creating restaurant...");
        await createRestaurant();
      } else {
        alert("restaurant already created")
        let restaurants = await restaurantArray(indexCount);
        console.log(restaurants);
      }
    } catch (error) {
      console.error(error);
    }
  };

  populateRestaurant();
}
