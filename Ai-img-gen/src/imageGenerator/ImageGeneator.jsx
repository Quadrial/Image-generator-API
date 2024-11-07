import { useState, useEffect } from "react";
import axios from "axios";
import defaultimg from "../assets/images/12345.svg";

export const ImageGeneator = () => {
  const [text, setText] = useState(""); // State for the input text
  const [generating, setGenerating] = useState(false); // Flag for image generation
  const [image, setImage] = useState(null); // Generated image
  const invokeUrl = "http://localhost:5000/generate-img";

  // Load last input from localStorage when the component mounts
  useEffect(() => {
    const savedText = localStorage.getItem("lastInput"); // Get the last input from localStorage
    if (savedText) {
      setText(savedText); // Set the last input in state
    }
  }, []);

  const generateImage = async () => {
    const payload = {
      text_prompts: [
        { text: text, weight: 1 },
        { text: "", weight: -1 },
      ],
      cfg_scale: 5,
      sampler: "K_EULER_ANCESTRAL",
      seed: 0,
      steps: 25,
    };

    try {
      setGenerating(true);
      // Keep the previous image unless the new one is successfully generated
      const res = await axios.post(invokeUrl, payload);
      const imageData = res.data.artifacts[0]?.base64;

      if (imageData) {
        setImage(`data:image/jpeg;base64,${imageData}`);
      } else {
        console.error("Image data missing from response");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleInput = (e) => {
    const newText = e.target.value;
    setText(newText);

    // Save the current input in localStorage
    localStorage.setItem("lastInput", newText);
  };

  // Handle 'Enter' key press to trigger image generation
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      generateImage();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10 gap-8 md:border px-4 sm:px-8 md:px-12 lg:px-20">
      {/* Header Section */}
      <div className="text-center text-[40px] md:text-[50px] lg:text-[80px]">
        Ai image <span className="text-pink-600">generator</span>
      </div>

      {/* Image Section */}
      <figure className="flex flex-col">
        <img
          className="generated-image w-[250px] sm:w-[350px] md:w-[400px] lg:w-[518px] h-auto object-cover"
          src={generating ? defaultimg : image || defaultimg}
          alt="Generated or default"
        />
      </figure>

      {/* Input & Button Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 bg-slate-500 w-full max-w-[500px] md:max-w-[800px] h-auto md:h-[95px] rounded-[50px] p-4">
        <input
          onChange={handleInput} // Update text and save to localStorage
          onKeyDown={handleKeyPress} // Trigger image generation on 'Enter'
          type="text"
          className="bg-transparent outline-none border-none w-full md:w-[70%] h-[45px] md:h-full text-[16px] md:text-[18px] px-4"
          placeholder="Describe what you want to see"
          value={text} // Controlled input
        />
        <button
          onClick={generateImage}
          className="flex items-center justify-center w-full md:w-[250px] h-[45px] md:h-full rounded-[50px] bg-pink-700 cursor-pointer text-white"
        >
          {generating ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
};
