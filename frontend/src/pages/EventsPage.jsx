import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Function to fetch events data from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/events"); // Assuming your backend server is running on the same host as your frontend
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center py-10">
        Upcoming Events
      </h1>
      <div className="flex flex-wrap justify-center">
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;
