import React from "react";

const EventCard = ({ event }) => {
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
      {/* Event Image */}
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-40 object-cover"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{event.title}</div>
        <p className="text-gray-700 text-base">{event.description}</p>
        {/* Event Date */}
        <p className="text-gray-600 mt-2">Date: {formatDate(event.date)}</p>
      </div>
    </div>
  );
};

export default EventCard;
