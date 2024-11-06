import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post("/generate-img", async (req, res) => {
  const payload = req.body;

  try {
    const response = await axios.post(
      "https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-xl",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // Log the response to inspect the format
    console.log("Backend response:", response.data);

    if (
      response.data &&
      response.data.artifacts &&
      response.data.artifacts[0].base64
    ) {
      res.json(response.data); // Send the base64 image data back to frontend
    } else {
      res
        .status(500)
        .json({ error: "Base64 image data not found in response" });
    }
  } catch (error) {
    console.error(
      "Error in API request:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.detail || "An error occurred",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
