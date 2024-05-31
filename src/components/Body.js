import RestaurantCard, { withPromtedLabel } from "./RestaurantCard"; // Importing RestaurantCard component and a higher-order component withPromtedLabel
import { useState, useEffect, useContext } from "react"; // Importing hooks from React
import Shimmer from "./Shimmer"; // Importing Shimmer component (likely a loading placeholder)
import { Link } from "react-router-dom"; // Importing Link component from react-router-dom for navigation
import useOnlineStatus from "../utils/useOnlineStatus"; // Importing custom hook to check online status
import UserContext from "../utils/UserContext"; // Importing UserContext for managing user context
import cors from 'cors';
const Body = () => {
  // Local state variables
  const [listOfRestaurants, setListOfRestraunt] = useState([]); // State for the list of restaurants
  const [filteredRestaurant, setFilteredRestaurant] = useState([]); // State for the filtered list of restaurants
  const [searchText, setSearchText] = useState(""); // State for search input text

  const RestaurantCardPromoted = withPromtedLabel(RestaurantCard); // Creating a new component with promotional label

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchData(); // Fetch restaurant data when component mounts
  }, []);

  // Function to fetch restaurant data from API
  const fetchData = async () => {
    const data = await fetch(
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=18.5912716&lng=73.73890899999999&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
    );

    const json = await data.json(); // Parse the JSON data
    
    // Update state with the fetched data using optional chaining
    setListOfRestraunt(
      json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
    setFilteredRestaurant(
      json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
  };

  const onlineStatus = useOnlineStatus(); // Use custom hook to check online status

  // Render offline message if the user is offline
  if (onlineStatus === false)
    return (
      <h1>
        Looks like you're offline!! Please check your internet connection;
      </h1>
    );

  const { loggedInUser, setUserName } = useContext(UserContext); // Use UserContext to get and set the logged-in user's name

  // Render Shimmer component while data is loading, otherwise render the main content
  return listOfRestaurants.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="body">
      <div className="filter flex">
        <div className="search m-4 p-4">
          <input
            type="text"
            data-testid="searchInput"
            className="border border-solid border-black"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value); // Update search text state
            }}
          />
          <button
            className="px-4 py-2 bg-green-100 m-4 rounded-lg"
            onClick={() => {
              // Filter the restaurant cards based on search text and update the UI
              const filteredRestaurant = listOfRestaurants.filter((res) =>
                res.info.name.toLowerCase().includes(searchText.toLowerCase())
              );

              setFilteredRestaurant(filteredRestaurant); // Update filtered restaurant state
            }}
          >
            Search
          </button>
        </div>
        <div className="search m-4 p-4 flex items-center">
          <button
            className="px-4 py-2 bg-gray-100 rounded-lg"
            onClick={() => {
              // Filter the list to show only top-rated restaurants
              const filteredList = listOfRestaurants.filter(
                (res) => res.info.avgRating > 4
              );
              setFilteredRestaurant(filteredList); // Update filtered restaurant state
            }}
          >
            Top Rated Restaurants
          </button>
        </div>
        <div className="search m-4 p-4 flex items-center">
          <label>UserName : </label>
          <input
            className="border border-black p-2"
            value={loggedInUser} // Display the logged-in user's name
            onChange={(e) => setUserName(e.target.value)} // Update the user's name
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        {filteredRestaurant.map((restaurant) => (
          <Link
            key={restaurant?.info.id}
            to={"/restaurants/" + restaurant?.info.id} // Link to the restaurant's detail page
          >
            {restaurant?.info.promoted ? (
              <RestaurantCardPromoted resData={restaurant?.info} /> // Render promoted restaurant card
            ) : (
              <RestaurantCard resData={restaurant?.info} /> // Render regular restaurant card
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Body; // Exporting the Body component
