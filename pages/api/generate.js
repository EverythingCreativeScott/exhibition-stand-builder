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
    doubleDecker,
    logoUploaded
  } = data;

  return `
A realistic 3D render of a custom exhibition stand for a company called "${companyname}", designed for a modern event hall. 
The stand features brand colors: ${colors || "not specified"}.
${marketing.length > 0 ? `The layout includes marketing materials such as: ${marketing.join(", ")}.` : ""}
${screens.length > 0 ? `The stand includes display screens such as: ${screens.join(", ")}.` : ""}
${productDisplays.length > 0 ? `Product display areas include: ${productDisplays.join(", ")}.` : ""}
${seating.length > 0 ? `Seating and meeting spaces requested: ${seating.join(", ")}.` : ""}
${lighting ? `Lighting features: ${lighting}.` : ""}
${audio ? `Audio setup and background music: ${audio}.` : ""}
${logoUploaded ? "The company logo is placed prominently at the top of the stand." : ""}
${doubleDecker ? "The stand is a double-decker with an upper floor and staircase, designed like a two-story exhibition booth." : ""}
The stand includes casual, creative furniture like sofas and a modern layout with three demo zones, minimal branding, and realistic lighting. 
Focus on realism, layout clarity, and event hall atmosphere, with only about five people nearby.
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
