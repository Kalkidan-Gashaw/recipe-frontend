import React, { useState } from "react";

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      alert("Please enter some ingredients.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecipe(data.recipe);
      } else {
        setRecipe(`Error: ${data.error || "Failed to generate recipe."}`);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setRecipe("Error: Unable to connect to the server.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>AI Recipe Generator</h1>

      <textarea
        rows={4}
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Enter ingredients separated by commas (e.g., chicken, rice, broccoli)"
        style={{
          width: "100%",
          padding: "0.75rem",
          marginBottom: "1rem",
          borderRadius: "0.5rem",
          border: "1px solid #ccc",
          fontSize: "1rem",
        }}
      />

      <button
        onClick={generateRecipe}
        disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        {loading ? "Generating..." : "Generate Recipe"}
      </button>

      <div style={{ marginTop: "2rem" }}>
        <h2>Generated Recipe</h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#f8f8f8",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          {recipe || "Your recipe will appear here."}
        </pre>
      </div>
    </div>
  );
};

export default RecipeGenerator;
