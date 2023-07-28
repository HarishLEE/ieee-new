import React, { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

const useCreateForm = (initialState) => {
  const [formState, setFormState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormState((prevState) => ({
      ...prevState,
      images: [...prevState.images, file],
    }));
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  return { formState, handleChange, handleImageUpload, resetForm };
};

const AdminDashboard = () => {
  const [galleries, setGalleries] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedContent, setSelectedContent] = useState("events");
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);
  const [isEditingGallery, setIsEditingGallery] = useState(false);
  const [editedGallery, setEditedGallery] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchGalleries();
  }, []);

  // Fetch all events from the server
  const fetchEvents = async () => {
    try {
      const response = await axios.get("/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  // Fetch all galleries from the server
  const fetchGalleries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/galleries");
      setGalleries(response.data);
    } catch (error) {
      console.error("Failed to fetch galleries:", error);
    }
  };

  const handleEditEvent = (eventId, updatedEvent) => {
    const updatedEvents = events.map((event) =>
      event.id === eventId ? updatedEvent : event
    );
    setEvents(updatedEvents);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/events/${eventId}`);
      const filteredEvents = events.filter((event) => event.id !== eventId);
      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditGallery = (galleryId, updatedGallery) => {
    const updatedGalleries = galleries.map((gallery) =>
      gallery.id === galleryId ? updatedGallery : gallery
    );
    setGalleries(updatedGalleries);
  };

  const handleDeleteGallery = async (galleryId) => {
    try {
      await axios.delete(`/galleries/${galleryId}`);
      const filteredGalleries = galleries.filter(
        (gallery) => gallery.id !== galleryId
      );
      setGalleries(filteredGalleries);
    } catch (error) {
      console.error("Error deleting gallery:", error);
    }
  };

  const handleActivateEditEvent = (event) => {
    setIsEditingEvent(true);
    setEditedEvent(event);
  };

  const handleCancelEditEvent = () => {
    setIsEditingEvent(false);
    setEditedEvent(null);
  };

  const handleActivateEditGallery = (gallery) => {
    setIsEditingGallery(true);
    setEditedGallery(gallery);
  };

  const handleCancelEditGallery = () => {
    setIsEditingGallery(false);
    setEditedGallery(null);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-1/4 min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        <ul className="space-y-4">
          <li
            className={`cursor-pointer ${
              selectedContent === "events" ? "text-blue-400" : ""
            }`}
            onClick={() => setSelectedContent("events")}
          >
            Events
          </li>
          <li
            className={`cursor-pointer ${
              selectedContent === "galleries" ? "text-blue-400" : ""
            }`}
            onClick={() => setSelectedContent("galleries")}
          >
            Galleries
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        {selectedContent === "events" ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Events</h2>
            {isEditingEvent ? (
              <UpdateEventForm
                event={editedEvent}
                handleCancelEditEvent={handleCancelEditEvent}
                fetchEvents={fetchEvents}
                onUpdate={handleEditEvent}
              />
            ) : (
              <CreateEventForm fetchEvents={fetchEvents} />
            )}
            <EventList
              events={events}
              handleActivateEdit={handleActivateEditEvent}
              handleDeleteEvent={handleDeleteEvent}
              handleEditEvent={handleEditEvent}
            />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Galleries</h2>
            {isEditingGallery ? (
              <UpdateGalleryForm
                gallery={editedGallery}
                handleCancelEditGallery={handleCancelEditGallery}
                fetchGalleries={fetchGalleries}
                onUpdate={handleEditGallery}
              />
            ) : (
              <CreateGalleryForm fetchGalleries={fetchGalleries} />
            )}
            <GalleryList
              galleries={galleries}
              handleActivateEdit={handleActivateEditGallery}
              handleDeleteGallery={handleDeleteGallery}
              handleEditGallery={handleEditGallery}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const CreateEventForm = ({ fetchEvents }) => {
  const initialState = {
    title: "",
    description: "",
    date: "",
    imageFile: null,
  };

  const [formState, setFormState] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormState((prevState) => ({
      ...prevState,
      imageFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formState.title || !formState.date) {
        setError("Title and Date are required fields.");
        return;
      }
      setError(""); // Clear any previous errors

      const formData = new FormData();
      formData.append("title", formState.title);
      formData.append("description", formState.description);
      formData.append("date", formState.date);
      formData.append("imageFile", formState.imageFile);

      await axios.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchEvents();
      setFormState(initialState);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Create New Event</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formState.title}
            onChange={handleChange}
            required
            placeholder="Enter the event title"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Event Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formState.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Enter a description for the event"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows="4"
        />
      </div>
      <div>
        <label
          htmlFor="imageFile"
          className="block text-sm font-medium text-gray-700"
        >
          Event Image <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="imageFile"
          name="imageFile"
          onChange={handleImageUpload}
          accept=".jpg,.jpeg,.png,.gif"
          className="w-full py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div>
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Event
        </button>
      </div>
    </form>
  );
};

const CreateGalleryForm = ({ fetchGalleries }) => {
  const initialState = {
    title: "",
    description: "",
    date: "",
    images: [],
  };

  const [formState, setFormState] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    setFormState((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formState.title ||
        !formState.date ||
        formState.images.length === 0
      ) {
        setError("Title, Date, and at least one Image are required fields.");
        return;
      }
      setError(""); // Clear any previous errors

      const formData = new FormData();
      formData.append("title", formState.title);
      formData.append("description", formState.description);
      formData.append("date", formState.date);

      for (let i = 0; i < formState.images.length; i++) {
        formData.append("images", formState.images[i]);
      }

      await axios.post("/galleries", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchGalleries();
      setFormState(initialState);
    } catch (error) {
      console.error("Failed to create gallery:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Create New Gallery</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Gallery Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formState.title}
            onChange={handleChange}
            required
            placeholder="Enter the gallery title"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Gallery Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formState.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Enter a description for the gallery"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows="4"
        />
      </div>
      <div>
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700"
        >
          Gallery Images <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="images"
          name="images"
          onChange={handleImageUpload}
          multiple
          accept=".jpg,.jpeg,.png,.gif"
          className="w-full py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div>
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Gallery
        </button>
      </div>
    </form>
  );
};

const EventList = ({ events, handleEditEvent, handleDeleteEvent }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEvents = events.filter((event) => {
    return event.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleEditEventClick = (eventId) => {
    setEditingEventId(eventId);
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
  };

  const handleUpdateEvent = (updatedEvent) => {
    handleEditEvent(editingEventId, updatedEvent);
    setEditingEventId(null);
  };

  const handleDeleteEventClick = async (eventId) => {
    try {
      await axios.delete(`/events/${eventId}`);
      handleDeleteEvent(eventId);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Event List</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filteredEvents.map((event) =>
          editingEventId === event.id ? (
            <div key={event.id} className="border rounded p-4">
              <UpdateEventForm
                event={event}
                onUpdate={handleUpdateEvent}
                onCancel={handleCancelEdit}
              />
            </div>
          ) : (
            <div key={event.id} className="border rounded p-4">
              <h2 className="text-xl font-bold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-4">Date: {event.date}</p>
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-40 object-cover mb-4"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditEventClick(event.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEventClick(event._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const GalleryList = ({ galleries, handleEditGallery, handleDeleteGallery }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGalleryId, setEditingGalleryId] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredGalleries = galleries.filter((gallery) => {
    return gallery.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleEditGalleryClick = (galleryId) => {
    setEditingGalleryId(galleryId);
  };

  const handleCancelEdit = () => {
    setEditingGalleryId(null);
  };

  const handleUpdateGallery = (updatedGallery) => {
    handleEditGallery(editingGalleryId, updatedGallery);
    setEditingGalleryId(null);
  };

  const handleDeleteGalleryClick = async (galleryId) => {
    try {
      await axios.delete(`/galleries/${galleryId}`);
      handleDeleteGallery(galleryId);
    } catch (error) {
      console.error("Error deleting gallery:", error);
    }
  };

  console.log(galleries);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gallery List</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search galleries..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filteredGalleries.map((gallery) =>
          editingGalleryId === gallery.id ? (
            <div key={gallery.id} className="border rounded p-4">
              <UpdateGalleryForm
                gallery={gallery}
                onUpdate={handleUpdateGallery}
                onCancel={handleCancelEdit}
              />
            </div>
          ) : (
            <div key={gallery.id} className="border rounded p-4">
              <h2 className="text-xl font-bold mb-2">{gallery.title}</h2>
              <p className="text-gray-600 mb-4">Date: {gallery.date}</p>
              <img
                src={`${gallery.images[0]}`}
                alt={gallery.title}
                className="w-full h-40 object-cover mb-4"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditGalleryClick(gallery.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGalleryClick(gallery._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const UpdateEventForm = ({ event, onUpdate, onCancel }) => {
  const [formState, setFormState] = useState({
    title: event.title,
    description: event.description,
    date: event.date,
    imageFile: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormState((prevState) => ({
      ...prevState,
      imageFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formState.title || !formState.date) {
        setError("Title and Date are required fields.");
        return;
      }
      setError(""); // Clear any previous errors

      const formData = new FormData();
      formData.append("title", formState.title);
      formData.append("description", formState.description);
      formData.append("date", formState.date);
      formData.append("imageFile", formState.imageFile);

      console.log("Title:", formState.title);
      console.log("Description:", formState.description);
      console.log("Date:", formState.date);
      console.log("Image File:", formState.imageFile);

      // Logging FormData contents using `entries()`
      for (const [key, value] of formData.entries()) {
        console.log(key, ":", value);
      }

      await axios.put(`/events/${event._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUpdate(formState); // Pass the updated data to the parent component
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Update Event</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formState.title}
            onChange={handleChange}
            required
            placeholder="Enter the event title"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Event Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formState.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Enter a description for the event"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows="4"
        />
      </div>
      <div>
        <label
          htmlFor="imageFile"
          className="block text-sm font-medium text-gray-700"
        >
          Event Image
        </label>
        <input
          type="file"
          id="imageFile"
          name="imageFile"
          onChange={handleImageUpload}
          accept=".jpg,.jpeg,.png,.gif"
          className="w-full py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div>
        <button
          type="submit"
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Event
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const UpdateGalleryForm = ({ gallery, onUpdate, onCancel }) => {
  const [formState, setFormState] = useState({
    title: gallery.title,
    description: gallery.description,
    date: gallery.date,
    images: gallery.images,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    setFormState((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formState.title ||
        !formState.date ||
        formState.images.length === 0
      ) {
        setError("Title, Date, and at least one Image are required fields.");
        return;
      }
      setError(""); // Clear any previous errors

      const formData = new FormData();
      formData.append("title", formState.title);
      formData.append("description", formState.description);
      formData.append("date", formState.date);

      for (let i = 0; i < formState.images.length; i++) {
        formData.append("images", formState.images[i]);
      }

      await axios.put(`/galleries/${gallery._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUpdate(formState); // Pass the updated data to the parent component
    } catch (error) {
      console.error("Failed to update gallery:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Update Gallery</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Gallery Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formState.title}
            onChange={handleChange}
            required
            placeholder="Enter the gallery title"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Gallery Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formState.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Enter a description for the gallery"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows="4"
        />
      </div>
      <div>
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700"
        >
          Gallery Images
        </label>
        <input
          type="file"
          id="images"
          name="images"
          onChange={handleImageUpload}
          multiple
          accept=".jpg,.jpeg,.png,.gif"
          className="w-full py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div>
        <button
          type="submit"
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Gallery
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminDashboard;
