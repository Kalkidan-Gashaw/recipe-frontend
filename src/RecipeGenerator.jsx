import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import "./RecipeGenerator.css"; // We'll create this file for custom styles

const countries = [
  { value: "Ethiopia", label: "Ethiopia" },
  { value: "Italy", label: "Italy" },
  { value: "Japan", label: "Japan" },
  { value: "India", label: "India" },
  { value: "Mexico", label: "Mexico" },
  { value: "France", label: "France" },
  { value: "China", label: "China" },
  // Users can add more by typing
];

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState("");
  const [country, setCountry] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      alert("Please enter some ingredients.");
      return;
    }
    if (!country.trim()) {
      alert("Please select or enter a country.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, country }),
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
    <div className="container">
      <div className="top">
        <h1>🌍 AI Recipe Generator</h1>

        <CreatableSelect
          className="in"
          classNamePrefix="in"
          options={countries}
          onChange={(selected) => setCountry(selected ? selected.value : "")}
          placeholder="Start typing a country..."
          isClearable
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: "0.5rem",
              borderColor: "#ccc",
              fontSize: "1rem",
              padding: "2px",
              backgroundColor: " #494848",
            }),
          }}
        />

        <textarea
          rows={4}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients separated by commas (e.g., chicken, rice, broccoli)"
          className="custom-textarea"
        />

        <button
          onClick={generateRecipe}
          disabled={loading}
          className="neutral-btn"
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </div>

      {recipe && (
        <div className="recipe-card">
          <h2>🍽️ Your Recipe</h2>
          <div className="recipe-content">
            <div className="recipe-column">
              <h3>🧂 Ingredients</h3>
              <div
                className="ingredients"
                dangerouslySetInnerHTML={{
                  __html:
                    recipe
                      .split(/Instructions:|Steps:/i)[0]
                      .replace(/Ingredients:/i, "")
                      .replace(/\n/g, "<br />")
                      .trim() || "<em>No ingredients found.</em>",
                }}
              />
            </div>
            <div className="recipe-column">
              <h3>👨‍🍳 Instructions</h3>
              <div
                className="instructions"
                dangerouslySetInnerHTML={{
                  __html:
                    recipe
                      .split(/Instructions:|Steps:/i)[1]
                      ?.replace(/\n/g, "<br />")
                      .trim() || "<em>No instructions found.</em>",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;
