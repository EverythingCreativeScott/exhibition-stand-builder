import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildPrompt(data) {
const {
  colors,
  marketing = [],
  screens = [],
  productDisplays = [],
  seating = [],
  lighting,
  audio,
  companyname,
  specialties,
  doubleDecker,
} = data;


return `
A realistic 3D render of a custom exhibition stand for a company called "${companyname}", designed for a modern event hall. 
The stand features brand colors: ${colors || "not specified"}.

The stand is designed specifically for a company that specialises in: ${specialties || "general services"}.

${marketing.includes("Printing") ? "Include printed materials such as brochures or flyers." : ""}
${marketing.includes("Merchandise") ? "Include branded merchandise like pens, mugs, or bags." : ""}
${marketing.includes("Digital Advertising") ? "Include digital advertisements displayed on screens." : ""}
${marketing.includes("Promotional Video") ? "Include a looping promotional video." : ""}
${marketing.includes("Event Appointment booking") ? "Include an appointment booking system (digital or paper)." : ""}

${screens.includes("TV Screens / Monitors") ? "Add TV screens or standard monitors for media display." : ""}
${screens.includes("Touchscreens / Interactive Displays") ? "Include interactive touchscreen displays for user engagement." : ""}
${screens.includes("LED Video Walls") ? "Include a large LED video wall for visual impact." : ""}
${screens.includes("iPads / Tablets") ? "Add iPads or tablets placed around the stand." : ""}

${productDisplays.includes("Shelving") ? "Add shelving units for product displays." : ""}
${productDisplays.includes("counters") ? "Include counters to display and demonstrate products." : ""}

${seating.includes("Seating") ? "Add casual seating such as sofas or stools." : ""}
${seating.includes("Meeting Room") ? "Include a semi-private meeting room." : ""}

${lighting === "Yes" ? "Add lighting features to enhance visibility and mood." : ""}
${lighting === "No" ? "Do not include special lighting features." : ""}

${audio === "Yes" ? "Include background music or small speakers for audio." : ""}
${audio === "No" ? "No audio or music features are required." : ""}

${doubleDecker ? "Make the stand a double-decker with stairs to an upper level." : ""}

The stand includes casual, creative, modern layout with three demo zones, minimal branding, and realistic lighting. 
Focus on realism, layout clarity, and event hall atmosphere, with only about four people nearby.
`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  try {
    const data = req.body;
    const prompt = buildPrompt(data);

    console.log("Generated Prompt:\n", prompt);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    // Check if the response has data and URL
    if (!response?.data?.[0]?.url) {
      console.error("No image URL returned from OpenAI.");
      return res.status(500).json({ error: "Failed to generate image. No URL returned." });
    }

    const imageUrl = response.data[0].url;
    res.status(200).json({ imageUrl });

  } catch (err) {
    console.error("OpenAI API error:", err.message || err);
    res.status(500).json({ error: "Image generation failed. Check API key and prompt." });
  }
}
