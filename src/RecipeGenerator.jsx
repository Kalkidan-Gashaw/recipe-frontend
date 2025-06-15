import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Styled-components definitions for a Dark Theme
const Container = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #282c34;
  color: #e0e0e0;
  border-radius: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #61dafb;
  font-size: 2.5rem;
  font-weight: 700;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  color: #61dafb;
  font-size: 1.8rem;
  font-weight: 600;
  border-bottom: 2px solid #444;
  padding-bottom: 0.5rem;
  margin-top: 2rem;
`;

const Alert = styled.div`
  color: #ffcccc;
  background-color: #4a1c1c;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  border: 1px solid #721c24;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.6rem;
  font-weight: bold;
  color: #e0e0e0;
  font-size: 1.1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 2px solid rgb(67, 115, 129);
  background-color: transparent;
  color: #e0e0e0;
  font-size: 1rem;
  box-sizing: border-box;
  resize: vertical;
  &:focus {
    border-color: #61dafb;
    box-shadow: 0 0 0 0.2rem rgba(121, 186, 204, 0.5);
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 2px solid rgb(67, 115, 129);
  background-color: transparent;
  color:rgb(255, 254, 254);
  font-size: 1rem;
  &:focus {
    border-color: #61dafb;
    box-shadow: 0 0 0 0.2rem rgba(97, 218, 251, 0.5);
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${({ disabled }) => (disabled ? "#555" : "#61dafb")};
  color: ${({ disabled }) => (disabled ? "#bbb" : "#282c34")};
  border: none;
  border-radius: 0.75rem;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-size: 1.1rem;
  margin-bottom: 2rem;
  transition: background-color 0.3s ease, transform 0.1s ease, color 0.3s ease;
  &:hover:not(:disabled) {
    background-color: #21a1f1;
    transform: translateY(-2px);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Card = styled.div`
  background-color: ${(props) => props.bgColor || "#3a3f47"};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  margin-top: ${(props) => props.mt || "0"};
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`;

const CheckedList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  color: #e0e0e0;
  line-height: 1.7;
  li {
    margin-bottom: 0.7rem;
    font-size: 1.05rem;
    position: relative;
    padding-left: 1.5rem;
    &:before {
      content: "✓";
      color: #61dafb;
      position: absolute;
      left: 0;
    }
  }
`;

const OrderedList = styled.ol`
  padding-left: 1.8rem;
  color: #e0e0e0;
  line-height: 1.7;
  counter-reset: step-counter;
  li {
    margin-bottom: 1rem;
    font-size: 1.05rem;
    position: relative;
    counter-increment: step-counter;
    &:before {
      content: counter(step-counter);
      color: #61dafb;
      position: absolute;
      left: -1.8rem;
      background-color: #4a4f59;
      border-radius: 50%;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    dietaryPreferences: [],
    cuisines: [],
  });
  const [selectedDiet, setSelectedDiet] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("http://localhost:8000/recipe-options");
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        const data = await response.json();
        setOptions(data);
        if (data.dietaryPreferences.length > 0) {
          setSelectedDiet(data.dietaryPreferences[0]);
        }
        if (data.cuisines.length > 0) {
          setSelectedCuisine(data.cuisines[0]);
        }
      } catch (e) {
        console.error("Failed to fetch options:", e);
        setOptionsError("Could not load options. Using default values.");
        setOptions({
          dietaryPreferences: [
            "None",
            "Vegan",
            "Vegetarian",
            "Gluten-Free",
            "Keto",
          ],
          cuisines: [
            "Any",
            "Italian",
            "Indian",
            "Mexican",
            "Chinese",
            "Mediterranean",
          ],
        });
        setSelectedDiet("None");
        setSelectedCuisine("Any");
      } finally {
        setOptionsLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      alert("Please enter some ingredients to generate a recipe.");
      return;
    }
    setLoading(true);
    setRecipe(null);
    try {
      const res = await fetch("http://localhost:8000/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          dietaryPreference: selectedDiet,
          cuisine: selectedCuisine,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setRecipe({
          error: data.error || "Failed to generate recipe. Please try again.",
        });
      } else {
        const cleanIngredients = Array.isArray(data.recipe?.ingredients)
          ? data.recipe.ingredients
              .map((ing) => ing.replace(/^[•*-\s\d.]+/, "").trim())
              .filter((ing) => ing)
          : [];

        const cleanInstructions = Array.isArray(data.recipe?.instructions)
          ? data.recipe.instructions
              .map((step) => step.replace(/^[•*-\s\d.]+/, "").trim())
              .filter((step) => step)
          : [];

        setRecipe({
          ingredients: cleanIngredients,
          instructions: cleanInstructions,
        });
      }
    } catch (e) {
      console.error("Error generating recipe:", e);
      setRecipe({
        error: "Unable to connect to the server. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (optionsLoading) {
    return (
      <Container>
        <p
          style={{ textAlign: "center", fontSize: "1.2rem", color: "#e0e0e0" }}
        >
          Loading recipe options...
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <Title>AI Recipe Generator</Title>
      {optionsError && <Alert>{optionsError}</Alert>}

      <Card bgColor="#3a3f47">
        <FormGroup>
          <Label htmlFor="ingredients-textarea">Ingredients:</Label>
          <Textarea
            id="ingredients-textarea"
            rows={4}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="chicken, rice, ginger, garlic"
          />
        </FormGroup>
        <FormGroup style={{ display: "flex", gap: "1.5rem" }}>
          <div style={{ flex: 1 }}>
            <Label htmlFor="dietary-select">Dietary Preference:</Label>
            <Select
              id="dietary-select"
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
            >
              {options.dietaryPreferences.map((o) => (
                <option key={o} value={o} style={{ color: "black" }}>
                  {o}
                </option>
              ))}
            </Select>
          </div>
          <div style={{ flex: 1 }}>
            <Label htmlFor="cuisine-select">Cuisine:</Label>
            <Select
              id="cuisine-select"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
            >
              {options.cuisines.map((o) => (
                <option key={o} value={o} style={{ color: "black" }}>
                  {o}
                </option>
              ))}
            </Select>
          </div>
        </FormGroup>
        <Button onClick={generateRecipe} disabled={loading}>
          {loading ? "Generating Recipe..." : "Generate Recipe"}
        </Button>
      </Card>

      {recipe ? (
        recipe.error ? (
          <Alert>{recipe.error}</Alert>
        ) : (
          <>
            <Card bgColor="#4a4f59" mt="1.5rem">
              <SectionTitle as="h3">🍎 Ingredients</SectionTitle>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <CheckedList>
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </CheckedList>
              ) : (
                <p style={{ textAlign: "center", color: "#bbb" }}>
                  No ingredients listed for this recipe.
                </p>
              )}
            </Card>
            <Card bgColor="#4a4f59" mt="1.5rem">
              <SectionTitle as="h3">📋 Instructions</SectionTitle>
              {recipe.instructions && recipe.instructions.length > 0 ? (
                <OrderedList>
                  {recipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </OrderedList>
              ) : (
                <p style={{ textAlign: "center", color: "#bbb" }}>
                  No instructions provided for this recipe.
                </p>
              )}
            </Card>
          </>
        )
      ) : (
        <p
          style={{ textAlign: "center", color: "#e0e0e0", marginTop: "2rem" }}
        ></p>
      )}
    </Container>
  );
}

export default RecipeGenerator;
