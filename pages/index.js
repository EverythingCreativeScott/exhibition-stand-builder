import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    colors: '',
    marketing: [],
    screens: [],
    productDisplays: [],
    seating: [],
    lighting: '',
    audio: '',
    companyname: '',
	  specialties: '',
    doubleDecker: false,
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      if (name === "doubleDecker") {
        setForm((prev) => ({ ...prev, doubleDecker: checked }));
      } else {
        setForm((prev) => {
          const updatedArray = checked
            ? Array.from(new Set([...(prev[name] || []), value]))
            : prev[name].filter((v) => v !== value);
          return { ...prev, [name]: updatedArray };
        });
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setImageUrl(null);

  try {
    const res = await fetch("/api/generate-stand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API error response:", errorText);
      throw new Error("Image generation failed or timed out.");
    }

    const data = await res.json();
    setImageUrl(data.imageUrl);
  } catch (err) {
    alert("Generation failed — this may be due to a timeout or API error.");
    console.error(err);
  }

  setLoading(false);
};



  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Design Your Exhibition Stand</h1>
      <form onSubmit={handleSubmit}>
        <label>1. What colours would you like to use on your stand?</label><br />
        <input name="colors" onChange={handleChange} style={{ width: "100%", marginBottom: "1rem" }} />

        <label>2. Do you need any marketing material?</label><br />
        {["Printing", "Merchandise", "Digital Advertising", "Promotional Video", "Event Appointment booking"].map(opt => (
          <div key={opt}>
            <label>
              <input type="checkbox" name="marketing" value={opt} onChange={handleChange} /> {opt}
            </label>
          </div>
        ))}

        <label>3. Do you need display screens on your stand?</label><br />
        {["TV Screens / Monitors", "Touchscreens / Interactive Displays", "LED Video Walls", "iPads / Tablets"].map(opt => (
          <div key={opt}>
            <label>
              <input type="checkbox" name="screens" value={opt} onChange={handleChange} /> {opt}
            </label>
          </div>
        ))}

        <label>4. Will you require product display areas?</label><br />
        {["Shelving", "counters"].map(opt => (
          <div key={opt}>
            <label>
              <input type="checkbox" name="productDisplays" value={opt} onChange={handleChange} /> {opt}
            </label>
          </div>
        ))}

        <label>5. Do you need seating or meeting spaces?</label><br />
        {["Seating", "Meeting Room"].map(opt => (
          <div key={opt}>
            <label>
              <input type="checkbox" name="seating" value={opt} onChange={handleChange} /> {opt}
            </label>
          </div>
        ))}

        <label>6. Should the stand include lighting features?</label><br />
        <select name="lighting" onChange={handleChange} style={{ marginBottom: "1rem" }}>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select><br />

        <label>7. Will you need any audio equipment or background music?</label><br />
        <select name="audio" onChange={handleChange} style={{ marginBottom: "1rem" }}>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select><br />

        <label>8. What is your company name?</label><br />
        <input name="companyname" onChange={handleChange} style={{ width: "100%", marginBottom: "1rem" }} />

<label>9. What is your companies key attribute(s)? (maximum of 3)</label><br />
<input
  name="specialties"
  onChange={handleChange}
  placeholder="e.g. Food, Technologies, Hospitality"
  style={{ width: "100%", marginBottom: "1rem" }}
/>


        <label>
          <input type="checkbox" name="doubleDecker" onChange={handleChange} /> Make this a double-decker stand
        </label><br /><br />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "1rem"
          }}
        >
          {loading ? "Generating..." : "Generate Stand"}
        </button>
      </form>

      {imageUrl && (
        <div style={{ marginTop: "2rem" }}>
          <img src={imageUrl} alt="Generated Exhibition Stand" style={{ width: "100%", borderRadius: "10px" }} />
        </div>
      )}
    </div>
  );
}