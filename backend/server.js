import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import cors from "cors";

const app = express();
const port = 5000;

// Convert the file URL to the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB using Mongoose (replace 'your_mongodb_uri' with your actual MongoDB URI)
mongoose.connect("mongodb://0.0.0.0:27017/ieee", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB!");
});

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads")); // Save uploaded files to the 'public/uploads' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Create Mongoose Schema and Model for Events
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  imageUrl: { type: String },
});

const Event = mongoose.model("Event", eventSchema);

// Create Mongoose Schema and Model for Galleries
const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  images: [{ type: String }],
});

const Gallery = mongoose.model("Gallery", gallerySchema);

// Enable CORS for all routes
app.use(cors());

// Parse JSON and URL-encoded bodies for incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(join(__dirname, "uploads")));

// API endpoints for handling events
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.post("/events", upload.single("imageFile"), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const imageUrl = req.file
      ? `http://localhost:5000/${req.file.filename}`
      : "";
    const event = new Event({ title, description, date, imageUrl });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

app.put("/events/:id", upload.single("imageFile"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;
    const imageUrl = req.file
      ? `http://localhost:5000/${req.file.filename}`
      : "";
    const event = await Event.findByIdAndUpdate(
      id,
      { title, description, date, imageUrl },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
});

app.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Delete the associated image from the server
    if (event.imageUrl) {
      const imagePath = path.join(
        __dirname,
        "uploads",
        path.basename(event.imageUrl)
      );
      fs.unlinkSync(imagePath);
    }

    res.json({ message: "Event and associated image deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete event and associated image" });
  }
});

// API endpoints for handling galleries
app.get("/galleries", async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch galleries" });
  }
});

app.post("/galleries", upload.array("images"), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const images = req.files.map(
      (file) => `http://localhost:5000/${file.filename}`
    );
    const gallery = new Gallery({ title, description, date, images });
    await gallery.save();
    res.status(201).json(gallery);
  } catch (error) {
    res.status(500).json({ error: "Failed to create gallery" });
  }
});

app.put("/galleries/:id", upload.array("images"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;
    const images = req.files.map(
      (file) => `http://localhost:5000/${file.filename}`
    );
    const gallery = await Gallery.findByIdAndUpdate(
      id,
      { title, description, date, images },
      { new: true }
    );
    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: "Failed to update gallery" });
  }
});

app.delete("/galleries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByIdAndDelete(id);
    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    // Delete the associated images from the server
    for (const imageUrl of gallery.images) {
      const imagePath = path.join(
        __dirname,
        "uploads",
        path.basename(imageUrl)
      );
      fs.unlinkSync(imagePath);
    }

    res.json({ message: "Gallery and associated images deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete gallery and associated images" });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
