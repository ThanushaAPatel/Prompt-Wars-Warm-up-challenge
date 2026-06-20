// Robust recipe database for MoodMeal including Snacks, Beverages, and Kids Sections
const recipes = [
  // BREAKFASTS
  {
    id: "b1",
    name: "Golden Turmeric Oatmeal",
    type: "breakfast",
    prepTime: 15,
    baseCost: 2.5,
    protein: 12,
    carbs: 45,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free"],
      mood: ["stressed", "low-energy", "under-the-weather"],
      weather: ["cold", "rainy"],
      dosha: ["vata", "kapha"],
      occasion: ["busy-workday", "rest-day"],
      exercise: ["cardio", "rest"]
    },
    nutritionNotes: "High fiber oats with complex carbs. Grounding and offers slow-release stamina.",
    ayurvedicNotes: "Warming and grounding. Ideal for Vata and Kapha; Pitta should reduce ginger.",
    ingredients: [
      { name: "Rolled Oats", amount: "1/2 cup", category: "pantry", basePrice: 0.5 },
      { name: "Almond Milk", amount: "1 cup", category: "dairy-free", basePrice: 0.8 },
      { name: "Turmeric Powder", amount: "1/2 tsp", category: "spices", basePrice: 0.1 },
      { name: "Ginger (grated)", amount: "1/2 tsp", category: "produce", basePrice: 0.2 },
      { name: "Maple Syrup", amount: "1 tbsp", category: "pantry", basePrice: 0.4 },
      { name: "Chia Seeds", amount: "1 tsp", category: "pantry", basePrice: 0.5 }
    ],
    instructions: [
      "Combine rolled oats, almond milk, turmeric, and ginger in a small saucepan.",
      "Bring to a gentle boil, then simmer for 5-7 minutes until oats are soft and creamy.",
      "Stir in maple syrup and transfer to a serving bowl.",
      "Top with chia seeds and serve hot."
    ],
    substitutions: {
      "Almond Milk": [
        { name: "Water", priceDiff: -0.8, macroDiff: "-1g Protein, -40kcal", tag: "cheaper" },
        { name: "Soy Milk", priceDiff: -0.2, macroDiff: "+6g Protein, higher thickness", tag: "high-protein" }
      ],
      "Maple Syrup": [
        { name: "Stevia Drops", priceDiff: 0.1, macroDiff: "Sugar-free (Diabetic friendly)", tag: "diabetic" },
        { name: "Honey", priceDiff: -0.1, macroDiff: "Warming, anti-microbial", tag: "ayurvedic" }
      ]
    }
  },
  {
    id: "b2",
    name: "Hydrating Tropical Chia Pudding",
    type: "breakfast",
    prepTime: 10,
    baseCost: 3.5,
    protein: 8,
    carbs: 32,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free", "gluten-free"],
      mood: ["low-energy", "lazy", "stressed"],
      weather: ["hot", "humid"],
      dosha: ["pitta"],
      occasion: ["busy-workday", "traveling"],
      exercise: ["yoga", "rest"]
    },
    nutritionNotes: "Hydrating, high in soluble fiber and omega-3s. Ideal clean pre-yoga energy.",
    ayurvedicNotes: "Cooling and soothing. Perfect for Pitta, especially in hot weather.",
    ingredients: [
      { name: "Chia Seeds", amount: "3 tbsp", category: "pantry", basePrice: 1.0 },
      { name: "Coconut Milk", amount: "1 cup", category: "dairy-free", basePrice: 1.2 },
      { name: "Fresh Mango (diced)", amount: "1/2 cup", category: "produce", basePrice: 0.8 },
      { name: "Mint Leaves", amount: "A few", category: "produce", basePrice: 0.1 },
      { name: "Coconut Flakes", amount: "1 tbsp", category: "pantry", basePrice: 0.4 }
    ],
    instructions: [
      "Whisk chia seeds and coconut milk together in a jar or bowl.",
      "Let sit for 5 minutes, stir again to prevent clumping, then refrigerate for at least 2 hours (or overnight).",
      "Stir well and top with fresh mango cubes, mint, and coconut flakes before serving."
    ],
    substitutions: {
      "Coconut Milk": [
        { name: "Almond Milk", priceDiff: -0.4, macroDiff: "Lower fat and calories", tag: "lighter" }
      ],
      "Fresh Mango": [
        { name: "Frozen Berries", priceDiff: -0.3, macroDiff: "Lower glycemic load", tag: "diabetic" }
      ]
    }
  },
  {
    id: "b3",
    name: "Spiced Scrambled Tofu / Eggs",
    type: "breakfast",
    prepTime: 12,
    baseCost: 2.8,
    protein: 25,
    carbs: 10,
    tags: {
      dietary: ["vegetarian", "eggetarian", "gluten-free"],
      mood: ["motivated", "celebratory"],
      weather: ["cold", "humid", "rainy"],
      dosha: ["vata", "kapha"],
      occasion: ["workout-day", "busy-workday"],
      exercise: ["gym", "cardio"]
    },
    nutritionNotes: "Excellent high-protein, low-glycemic breakfast. Promotes lean muscle repair.",
    ayurvedicNotes: "Warming and grounding. Excellent for Vata and Kapha to kickstart metabolism.",
    ingredients: [
      { name: "Organic Tofu or Eggs", amount: "1 block or 2 eggs", category: "proteins", basePrice: 1.5 },
      { name: "Spinach", amount: "1 cup", category: "produce", basePrice: 0.5 },
      { name: "Cumin Powder", amount: "1/2 tsp", category: "spices", basePrice: 0.1 },
      { name: "Ghee or Olive Oil", amount: "1 tbsp", category: "fats", basePrice: 0.3 },
      { name: "Tomatoes (chopped)", amount: "1/2 cup", category: "produce", basePrice: 0.4 }
    ],
    instructions: [
      "Heat ghee or olive oil in a skillet over medium heat.",
      "Crumble tofu (or whisk eggs) and add to the skillet.",
      "Add cumin powder, chopped tomatoes, and cook for 5 minutes, stirring frequently.",
      "Toss in spinach leaves and cook until just wilted. Serve hot."
    ],
    substitutions: {
      "Organic Tofu or Eggs": [
        { name: "Chickpea Flour (for Besan Chilla)", priceDiff: -0.8, macroDiff: "Lower protein (-10g), higher fiber", tag: "vegan-cheaper" }
      ],
      "Ghee or Olive Oil": [
        { name: "Coconut Oil", priceDiff: 0.0, macroDiff: "Lighter fat profiles", tag: "vegan" }
      ]
    }
  },
  {
    id: "b4",
    name: "Simple Avocado Toast with Chili Flakes",
    type: "breakfast",
    prepTime: 8,
    baseCost: 3.2,
    protein: 9,
    carbs: 38,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free"],
      mood: ["lazy", "low-energy", "stressed"],
      weather: ["hot", "humid", "cold"],
      dosha: ["vata", "pitta"],
      occasion: ["busy-workday", "traveling"],
      exercise: ["yoga", "rest"]
    },
    nutritionNotes: "Rich in heart-healthy monounsaturated fats and fiber. Good balanced slow energy.",
    ayurvedicNotes: "Nourishing and moistening. Calms Vata and Pitta; Kapha should use sparingly.",
    ingredients: [
      { name: "Whole Grain Bread", amount: "2 slices", category: "bakery", basePrice: 0.8 },
      { name: "Avocado", amount: "1 whole", category: "produce", basePrice: 1.5 },
      { name: "Lemon Juice", amount: "1 tsp", category: "produce", basePrice: 0.2 },
      { name: "Red Chili Flakes", amount: "A pinch", category: "spices", basePrice: 0.1 },
      { name: "Sea Salt", amount: "A pinch", category: "spices", basePrice: 0.1 },
      { name: "Pumpkin Seeds", amount: "1 tbsp", category: "pantry", basePrice: 0.5 }
    ],
    instructions: [
      "Toast bread slices to your desired crispness.",
      "Mash avocado in a small bowl with lemon juice and a pinch of sea salt.",
      "Spread evenly over toast, sprinkle with red chili flakes and pumpkin seeds, and enjoy."
    ],
    substitutions: {
      "Whole Grain Bread": [
        { name: "Gluten-Free Bread", priceDiff: 0.6, macroDiff: "Gluten-free, similar macros", tag: "gluten-free" }
      ],
      "Avocado": [
        { name: "Hummus", priceDiff: -0.8, macroDiff: "Lower fat, higher protein", tag: "cheaper" }
      ]
    }
  },

  // LUNCHES
  {
    id: "l1",
    name: "Cooling Mung Dal Kitchari",
    type: "lunch",
    prepTime: 25,
    baseCost: 3.0,
    protein: 15,
    carbs: 55,
    tags: {
      dietary: ["vegetarian", "gluten-free"],
      mood: ["under-the-weather", "stressed", "low-energy"],
      weather: ["hot", "humid", "rainy"],
      dosha: ["vata", "pitta", "kapha"],
      occasion: ["rest-day", "busy-workday"],
      exercise: ["yoga", "rest"]
    },
    nutritionNotes: "Extremely easy to digest, complete protein, gut-healing, and restorative.",
    ayurvedicNotes: "Tridoshic (balances Vata, Pitta, and Kapha). The ultimate Ayurvedic healing food.",
    ingredients: [
      { name: "Split Yellow Mung Dal", amount: "1/2 cup", category: "pantry", basePrice: 0.8 },
      { name: "Basmati Rice", amount: "1/2 cup", category: "pantry", basePrice: 0.6 },
      { name: "Ghee", amount: "1 tbsp", category: "dairy", basePrice: 0.4 },
      { name: "Fennel & Cumin seeds", amount: "1/2 tsp each", category: "spices", basePrice: 0.2 },
      { name: "Cilantro (chopped)", amount: "1/4 cup", category: "produce", basePrice: 0.3 },
      { name: "Zucchini (diced)", amount: "1/2 cup", category: "produce", basePrice: 0.7 }
    ],
    instructions: [
      "Rinse rice and mung dal thoroughly until the water runs clear.",
      "Heat ghee in a pot, add cumin seeds and fennel powder until fragrant.",
      "Stir in rice, dal, zucchini, and add 4 cups of water.",
      "Bring to a boil, then cover and simmer on low for 20-25 minutes until porridge-like.",
      "Garnish with fresh cilantro."
    ],
    substitutions: {
      "Ghee": [
        { name: "Coconut Oil", priceDiff: -0.1, macroDiff: "Vegan, cooling for Pitta", tag: "vegan" }
      ],
      "Basmati Rice": [
        { name: "Quinoa", priceDiff: 0.4, macroDiff: "+4g Protein, lower glycemic load", tag: "diabetic-muscle" }
      ]
    }
  },
  {
    id: "l2",
    name: "Mediterranean Chickpea Salad",
    type: "lunch",
    prepTime: 12,
    baseCost: 2.7,
    protein: 14,
    carbs: 42,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free", "gluten-free"],
      mood: ["lazy", "stressed", "low-energy"],
      weather: ["hot", "humid"],
      dosha: ["pitta"],
      occasion: ["busy-workday", "traveling"],
      exercise: ["yoga", "rest"]
    },
    nutritionNotes: "High fiber and plant protein. Refreshing, hydrating, and low glycemic load.",
    ayurvedicNotes: "Extremely cooling and refreshing. Balances Pitta. Too cooling for Vata in winter.",
    ingredients: [
      { name: "Canned Chickpeas", amount: "1 can", category: "pantry", basePrice: 0.8 },
      { name: "Cucumber (diced)", amount: "1 cup", category: "produce", basePrice: 0.6 },
      { name: "Cherry Tomatoes", amount: "1/2 cup", category: "produce", basePrice: 0.7 },
      { name: "Olive Oil", amount: "1 tbsp", category: "fats", basePrice: 0.3 },
      { name: "Lemon Juice & Mint", amount: "1 tbsp", category: "produce", basePrice: 0.3 }
    ],
    instructions: [
      "Rinse and drain the chickpeas.",
      "Toss chickpeas, cucumber, cherry tomatoes, and mint together in a salad bowl.",
      "Drizzle with olive oil and fresh lemon juice. Season with a pinch of salt and pepper."
    ],
    substitutions: {
      "Canned Chickpeas": [
        { name: "Dry Chickpeas (boiled)", priceDiff: -0.5, macroDiff: "Saves money, identical macros", tag: "cheaper" }
      ],
      "Olive Oil": [
        { name: "Tahini", priceDiff: 0.2, macroDiff: "Creamier fat, adds calcium", tag: "richer" }
      ]
    }
  },
  {
    id: "l3",
    name: "Warming Sweet Potato & Lentil Soup",
    type: "lunch",
    prepTime: 25,
    baseCost: 3.2,
    protein: 16,
    carbs: 58,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free", "gluten-free"],
      mood: ["under-the-weather", "stressed", "low-energy"],
      weather: ["cold", "rainy"],
      dosha: ["vata", "kapha"],
      occasion: ["rest-day", "traveling"],
      exercise: ["cardio", "rest"]
    },
    nutritionNotes: "Rich in beta-carotene and complex carbohydrates. Incredibly warming and grounding for endurance recovery.",
    ayurvedicNotes: "Sweet potatoes are grounding for Vata. Lentils are spiced to prevent Kapha stagnation.",
    ingredients: [
      { name: "Red Lentils", amount: "1/2 cup", category: "pantry", basePrice: 0.6 },
      { name: "Sweet Potato (cubed)", amount: "1 medium", category: "produce", basePrice: 0.9 },
      { name: "Onion & Garlic", amount: "1/2 cup chopped", category: "produce", basePrice: 0.4 },
      { name: "Olive Oil", amount: "1 tbsp", category: "fats", basePrice: 0.3 },
      { name: "Ginger Powder & Cumin", amount: "1/2 tsp each", category: "spices", basePrice: 0.2 },
      { name: "Vegetable Broth", amount: "2 cups", category: "pantry", basePrice: 0.8 }
    ],
    instructions: [
      "Sauté chopped onion and garlic in olive oil in a pot until translucent.",
      "Add ginger, cumin, sweet potato cubes, and red lentils. Stir for 2 minutes.",
      "Pour in vegetable broth, bring to a boil, then cover and cook on medium-low for 20 minutes.",
      "Blend partially with an immersion blender for a creamy texture, or serve chunky."
    ],
    substitutions: {
      "Sweet Potato": [
        { name: "Carrots", priceDiff: -0.4, macroDiff: "Lower carbs (-20g), lower calorie", tag: "weight-loss" }
      ],
      "Vegetable Broth": [
        { name: "Water + Bouillon Cube", priceDiff: -0.6, macroDiff: "Saves cost, higher sodium", tag: "cheaper" }
      ]
    }
  },
  {
    id: "l4",
    name: "Protein-Packed Quinoa Power Bowl",
    type: "lunch",
    prepTime: 20,
    baseCost: 4.2,
    protein: 30,
    carbs: 48,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free", "gluten-free"],
      mood: ["motivated", "celebratory"],
      weather: ["hot", "humid", "cold"],
      dosha: ["pitta", "kapha"],
      occasion: ["workout-day", "busy-workday"],
      exercise: ["gym", "cardio"]
    },
    nutritionNotes: "Excellent balance of plant protein and fiber. Ideal gym/recovery fuel.",
    ayurvedicNotes: "A dry and light bowl, balancing for Kapha. Pitta benefits from cooling avocado topping.",
    ingredients: [
      { name: "Quinoa", amount: "1/2 cup", category: "pantry", basePrice: 0.8 },
      { name: "Tempeh or Edamame", amount: "1/2 cup", category: "proteins", basePrice: 1.8 },
      { name: "Broccoli Florets", amount: "1 cup", category: "produce", basePrice: 0.6 },
      { name: "Tahini", amount: "1 tbsp", category: "pantry", basePrice: 0.5 },
      { name: "Lemon Juice", amount: "1 tbsp", category: "produce", basePrice: 0.2 },
      { name: "Pumpkin Seeds", amount: "1 tbsp", category: "pantry", basePrice: 0.3 }
    ],
    instructions: [
      "Cook quinoa in water (1:2 ratio) for 15 minutes.",
      "Steam broccoli florets and pan-sear tempeh with a splash of soy sauce.",
      "Assemble quinoa, broccoli, and tempeh in a bowl.",
      "Whisk tahini and lemon juice with 1 tbsp water to make a dressing, drizzle over, and top with pumpkin seeds."
    ],
    substitutions: {
      "Tempeh or Edamame": [
        { name: "Tofu", priceDiff: -0.6, macroDiff: "Slightly less protein (-5g), cheaper", tag: "cheaper" },
        { name: "Boiled Eggs", priceDiff: -0.8, macroDiff: "High protein, non-vegan option", tag: "eggetarian" }
      ],
      "Broccoli": [
        { name: "Spinach", priceDiff: -0.2, macroDiff: "Higher iron, lower prep time", tag: "lazy" }
      ]
    }
  },

  // DINNERS
  {
    id: "d1",
    name: "Spiced Turmeric Fish / Tofu Curry",
    type: "dinner",
    prepTime: 25,
    baseCost: 5.5,
    protein: 36,
    carbs: 38,
    tags: {
      dietary: ["vegetarian", "vegan", "non-vegetarian", "lactose-free", "gluten-free"],
      mood: ["under-the-weather", "stressed", "low-energy"],
      weather: ["cold", "rainy", "humid"],
      dosha: ["vata", "kapha"],
      occasion: ["rest-day", "busy-workday"],
      exercise: ["gym", "rest"]
    },
    nutritionNotes: "Rich in anti-inflammatory turmeric. Fish adds high levels of Omega-3s. Fantastic muscle repair.",
    ayurvedicNotes: "Deeply warming, nourishing, and digestive. Pacifies Vata and Kapha.",
    ingredients: [
      { name: "White Fish or Firm Tofu", amount: "150g", category: "proteins", basePrice: 2.8 },
      { name: "Coconut Milk (canned)", amount: "1/2 cup", category: "dairy-free", basePrice: 0.8 },
      { name: "Ginger & Garlic (minced)", amount: "1 tbsp", category: "produce", basePrice: 0.3 },
      { name: "Turmeric & Curry Powder", amount: "1/2 tsp each", category: "spices", basePrice: 0.2 },
      { name: "Spinach", amount: "1 cup", category: "produce", basePrice: 0.5 },
      { name: "Basmati Rice", amount: "1/2 cup", category: "pantry", basePrice: 0.6 },
      { name: "Coconut Oil", amount: "1 tbsp", category: "fats", basePrice: 0.3 }
    ],
    instructions: [
      "Sauté ginger, garlic, and curry spices in coconut oil in a pan until fragrant.",
      "Pour in coconut milk and bring to a simmer.",
      "Add fish cubes or tofu cubes. Simmer gently for 8-10 minutes until cooked through.",
      "Stir in spinach until wilted. Serve hot over cooked basmati rice."
    ],
    substitutions: {
      "White Fish or Firm Tofu": [
        { name: "Chickpeas", priceDiff: -2.0, macroDiff: "Lower protein (-15g), higher fiber, cheaper", tag: "vegan-cheaper" }
      ],
      "Coconut Milk": [
        { name: "Vegetable Broth", priceDiff: -0.5, macroDiff: "Much lower fat and calorie count", tag: "weight-loss" }
      ]
    }
  },
  {
    id: "d2",
    name: "Hearty Lentil Shepherd's Pie",
    type: "dinner",
    prepTime: 40,
    baseCost: 4.8,
    protein: 20,
    carbs: 65,
    tags: {
      dietary: ["vegetarian", "vegan", "eggetarian", "gluten-free", "lactose-free"],
      mood: ["stressed", "low-energy", "celebratory"],
      weather: ["cold", "rainy"],
      dosha: ["vata", "kapha"],
      occasion: ["rest-day"],
      exercise: ["cardio", "rest"]
    },
    nutritionNotes: "Dense in complex carbohydrates for glycogen load, high in folate, potassium, and magnesium.",
    ayurvedicNotes: "Substantial, warm, and highly grounding. Perfect for calming Vata hyper-activity.",
    ingredients: [
      { name: "Brown Lentils", amount: "1/2 cup", category: "pantry", basePrice: 0.6 },
      { name: "Potatoes (for mash)", amount: "2 large", category: "produce", basePrice: 0.8 },
      { name: "Mixed Vegetables (peas/carrots)", amount: "1 cup", category: "produce", basePrice: 0.9 },
      { name: "Olive Oil or Butter", amount: "2 tbsp", category: "fats", basePrice: 0.5 },
      { name: "Tomato Paste", amount: "2 tbsp", category: "pantry", basePrice: 0.4 },
      { name: "Vegetable Broth", amount: "1 cup", category: "pantry", basePrice: 0.6 },
      { name: "Almond Milk", amount: "1/4 cup", category: "dairy-free", basePrice: 0.2 }
    ],
    instructions: [
      "Boil potatoes until soft, mash with olive oil/butter, almond milk, and a pinch of salt.",
      "Cook brown lentils. In a separate pan, sauté mixed vegetables with tomato paste, then add cooked lentils and vegetable broth. Simmer for 10 minutes.",
      "Transfer lentil mixture to a baking dish, spread mashed potatoes on top.",
      "Bake at 200°C (400°F) for 20 minutes until potato tips are golden brown."
    ],
    substitutions: {
      "Potatoes": [
        { name: "Mashed Cauliflower", priceDiff: 0.4, macroDiff: "Much lower carb (-35g) & calories", tag: "diabetic-weightloss" }
      ],
      "Brown Lentils": [
        { name: "Minced Chicken", priceDiff: 1.5, macroDiff: "Higher protein (+12g), non-vegetarian", tag: "non-vegetarian" }
      ]
    }
  },
  {
    id: "d3",
    name: "Summer Vegetable & Chickpea Pasta",
    type: "dinner",
    prepTime: 20,
    baseCost: 3.5,
    protein: 24,
    carbs: 68,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free"],
      mood: ["lazy", "celebratory", "motivated"],
      weather: ["hot", "humid"],
      dosha: ["pitta"],
      occasion: ["busy-workday", "rest-day"],
      exercise: ["cardio", "gym"]
    },
    nutritionNotes: "Excellent for carb loading. Using chickpea/whole wheat pasta provides clean long-lasting fuel.",
    ayurvedicNotes: "Cooling and sweet properties. Perfect for soothing Pitta in summer.",
    ingredients: [
      { name: "Whole Wheat Pasta", amount: "100g", category: "pantry", basePrice: 0.6 },
      { name: "Zucchini & Asparagus", amount: "1 cup chopped", category: "produce", basePrice: 1.5 },
      { name: "Olive Oil", amount: "1.5 tbsp", category: "fats", basePrice: 0.4 },
      { name: "Fresh Basil & Parsley", amount: "1/4 cup", category: "produce", basePrice: 0.5 },
      { name: "Garlic", amount: "2 cloves", category: "produce", basePrice: 0.1 },
      { name: "Lemon Zest", amount: "1 tsp", category: "produce", basePrice: 0.2 },
      { name: "Pine Nuts", amount: "1 tbsp", category: "pantry", basePrice: 0.8 }
    ],
    instructions: [
      "Cook pasta in salted boiling water according to package instructions.",
      "Sauté minced garlic, zucchini, and asparagus in olive oil until tender-crisp.",
      "Toss the drained pasta with vegetables, chopped basil, parsley, lemon zest, and toasted pine nuts.",
      "Drizzle with a little raw olive oil and serve."
    ],
    substitutions: {
      "Whole Wheat Pasta": [
        { name: "Chickpea Pasta", priceDiff: 0.8, macroDiff: "Higher protein (+10g), gluten-free", tag: "high-protein-gf" },
        { name: "Zucchini Noodles", priceDiff: -0.2, macroDiff: "Ultra-low carb (-50g), lighter", tag: "weight-loss" }
      ],
      "Pine Nuts": [
        { name: "Sunflower Seeds", priceDiff: -0.6, macroDiff: "Cheaper option, similar texture", tag: "cheaper" }
      ]
    }
  },
  {
    id: "d4",
    name: "Spiced Chickpea and Spinach Rice Bowl",
    type: "dinner",
    prepTime: 18,
    baseCost: 2.8,
    protein: 15,
    carbs: 58,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free", "gluten-free"],
      mood: ["lazy", "low-energy", "stressed"],
      weather: ["hot", "humid", "cold", "rainy"],
      dosha: ["vata", "pitta", "kapha"],
      occasion: ["busy-workday", "traveling"],
      exercise: ["yoga", "rest"]
    },
    nutritionNotes: "Sattvic, highly balanced, high-fiber, and gentle on the stomach. Perfect after light movement like yoga.",
    ayurvedicNotes: "Comforting, warm, and highly balanced. Tridoshic when cooked with cumin and coriander.",
    ingredients: [
      { name: "Canned Chickpeas", amount: "1 can", category: "pantry", basePrice: 0.8 },
      { name: "Spinach", amount: "2 cups", category: "produce", basePrice: 0.8 },
      { name: "Basmati Rice", amount: "1/2 cup", category: "pantry", basePrice: 0.6 },
      { name: "Cumin & Coriander Powder", amount: "1/2 tsp each", category: "spices", basePrice: 0.2 },
      { name: "Coconut Oil", amount: "1 tbsp", category: "fats", basePrice: 0.3 },
      { name: "Lemon Juice", amount: "1 tsp", category: "produce", basePrice: 0.1 }
    ],
    instructions: [
      "Cook basmati rice.",
      "Heat coconut oil in a pan, add cumin and coriander. Add drained chickpeas and sauté for 5 minutes.",
      "Toss in spinach, letting it wilt. Stir in lemon juice.",
      "Serve the spiced chickpeas and spinach over the warm rice."
    ],
    substitutions: {
      "Basmati Rice": [
        { name: "Cauliflower Rice", priceDiff: 0.5, macroDiff: "Low carb (-45g), diabetic-friendly", tag: "diabetic" }
      ],
      "Canned Chickpeas": [
        { name: "Black Beans", priceDiff: 0.1, macroDiff: "Similar profile, richer in antioxidants", tag: "variety" }
      ]
    }
  },

  // HEALTHY SNACKS
  {
    id: "s1",
    name: "Crispy Roasted Chickpeas",
    type: "snack",
    prepTime: 20,
    baseCost: 1.2,
    protein: 7,
    carbs: 18,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free", "gluten-free"],
      mood: ["lazy", "motivated"],
      weather: ["cold", "rainy", "hot"],
      dosha: ["vata", "kapha"],
      exercise: ["gym", "cardio", "rest"]
    },
    nutritionNotes: "Perfect plant-based protein snack. Crunchy, satisfying, and high in fiber.",
    ayurvedicNotes: "A dry and light snack, excellent for Kapha. Vata should enjoy with a drizzle of olive oil.",
    ingredients: [
      { name: "Canned Chickpeas", amount: "1/2 can", category: "pantry", basePrice: 0.4 },
      { name: "Olive Oil", amount: "1 tsp", category: "fats", basePrice: 0.1 },
      { name: "Smoked Paprika & Cumin", amount: "1/4 tsp each", category: "spices", basePrice: 0.2 }
    ],
    instructions: [
      "Rinse and dry chickpeas completely with a towel.",
      "Toss with olive oil and spices.",
      "Roast or air fry at 200°C for 15-20 minutes until crispy."
    ]
  },
  {
    id: "s2",
    name: "Apple Slices with Creamy Sun Butter",
    type: "snack",
    prepTime: 5,
    baseCost: 1.5,
    protein: 5,
    carbs: 22,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free", "gluten-free"],
      mood: ["stressed", "lazy", "low-energy"],
      weather: ["hot", "humid"],
      dosha: ["pitta", "vata"],
      exercise: ["yoga", "rest"]
    },
    nutritionNotes: "Healthy fats from seeds paired with natural fiber from apples. Stabilizes blood sugar.",
    ayurvedicNotes: "Sweet, cooling, and grounding. Excellent for calming Pitta and grounding Vata.",
    ingredients: [
      { name: "Fresh Apple", amount: "1 medium", category: "produce", basePrice: 0.6 },
      { name: "Sunflower Seed Butter", amount: "1.5 tbsp", category: "pantry", basePrice: 0.9 }
    ],
    instructions: [
      "Slice the apple into thin wedges.",
      "Serve alongside sunflower seed butter for dipping."
    ]
  },

  // BEVERAGES (COLD DRINKS & BEVERAGES)
  {
    id: "v1",
    name: "Cooling Cucumber Mint Infusion",
    type: "beverage",
    prepTime: 5,
    baseCost: 1.0,
    protein: 1,
    carbs: 6,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free", "gluten-free"],
      mood: ["stressed", "lazy", "low-energy"],
      weather: ["hot", "humid"],
      dosha: ["pitta"],
      exercise: ["yoga", "rest"]
    },
    nutritionNotes: "Highly hydrating, packed with electrolytes and cooling properties.",
    ayurvedicNotes: "Deeply cooling and refreshing. Specifically designed to alleviate excess Pitta heat.",
    ingredients: [
      { name: "Cucumber slices", amount: "1/4 cup", category: "produce", basePrice: 0.2 },
      { name: "Fresh Mint", amount: "A small bunch", category: "produce", basePrice: 0.2 },
      { name: "Lime Juice", amount: "1 tbsp", category: "produce", basePrice: 0.2 },
      { name: "Coconut Water", amount: "1 cup", category: "dairy-free", basePrice: 0.4 }
    ],
    instructions: [
      "Muddle cucumber and mint in a glass.",
      "Add lime juice and coconut water.",
      "Stir well, chill or add ice, and drink."
    ]
  },
  {
    id: "v2",
    name: "Spiced Turmeric Ashwagandha Latte",
    type: "beverage",
    prepTime: 8,
    baseCost: 1.6,
    protein: 4,
    carbs: 10,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free", "gluten-free"],
      mood: ["under-the-weather", "stressed", "low-energy"],
      weather: ["cold", "rainy"],
      dosha: ["vata", "kapha"],
      exercise: ["rest"]
    },
    nutritionNotes: "Anti-inflammatory golden milk. Adaptogenic ashwagandha supports stress reduction.",
    ayurvedicNotes: "Highly warming, grounding, and nerve-soothing. Ideal bedtime drink for Vata.",
    ingredients: [
      { name: "Almond Milk", amount: "1 cup", category: "dairy-free", basePrice: 0.8 },
      { name: "Turmeric & Ginger Powder", amount: "1/2 tsp total", category: "spices", basePrice: 0.2 },
      { name: "Ashwagandha Powder", amount: "1/4 tsp", category: "spices", basePrice: 0.3 },
      { name: "Maple Syrup", amount: "1 tsp", category: "pantry", basePrice: 0.3 }
    ],
    instructions: [
      "Heat almond milk in a small pan until hot.",
      "Whisk in turmeric, ginger, ashwagandha, and maple syrup.",
      "Froth and serve warm."
    ]
  },

  // KIDS SPECIALTIES
  {
    id: "k1",
    name: "Growing-Toddler Banana Oat Bites",
    type: "kids-snack",
    prepTime: 12,
    baseCost: 1.0,
    protein: 4,
    carbs: 22,
    kidsAgeMin: 1,
    kidsAgeMax: 4,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free", "gluten-free"],
      mood: ["lazy", "stressed"],
      weather: ["cold", "hot", "humid", "rainy"],
      dosha: ["vata", "kapha"],
      exercise: ["rest"]
    },
    nutritionNotes: "Toddler stage (1-4). Soft chew, high potassium and dietary fiber. Ideal for developing motors.",
    ayurvedicNotes: "Sweet, soft, and easy to digest. Calming and grounding.",
    ingredients: [
      { name: "Ripe Banana", amount: "1 whole", category: "produce", basePrice: 0.3 },
      { name: "Rolled Oats", amount: "1/2 cup", category: "pantry", basePrice: 0.4 },
      { name: "Cinnamon", amount: "A pinch", category: "spices", basePrice: 0.1 },
      { name: "Maple Syrup", amount: "1 tsp", category: "pantry", basePrice: 0.2 }
    ],
    instructions: [
      "Mash ripe banana thoroughly in a bowl.",
      "Mix in rolled oats, cinnamon, and maple syrup.",
      "Shape into small toddler-sized round bites.",
      "Bake at 180°C for 10-12 minutes until set."
    ]
  },
  {
    id: "k2",
    name: "Monster Green Vitamin Smoothie",
    type: "kids-snack",
    prepTime: 5,
    baseCost: 1.5,
    protein: 6,
    carbs: 26,
    kidsAgeMin: 5,
    kidsAgeMax: 8,
    tags: {
      dietary: ["vegan", "vegetarian", "eggetarian", "lactose-free", "gluten-free"],
      mood: ["motivated", "lazy"],
      weather: ["hot", "humid", "cold"],
      dosha: ["pitta"],
      exercise: ["rest"]
    },
    nutritionNotes: "Child stage (5-8). Sneaks in iron-rich spinach sweetened with mango. Promotes immune response.",
    ayurvedicNotes: "Cooling and highly refreshing. Easy way to balance kids' metabolic fire.",
    ingredients: [
      { name: "Baby Spinach", amount: "1/2 cup", category: "produce", basePrice: 0.3 },
      { name: "Mango slices (frozen)", amount: "1/2 cup", category: "produce", basePrice: 0.5 },
      { name: "Soy Milk", amount: "1 cup", category: "dairy-free", basePrice: 0.5 },
      { name: "Hemp Seeds", amount: "1 tsp", category: "pantry", basePrice: 0.2 }
    ],
    instructions: [
      "Place spinach, frozen mango, soy milk, and hemp seeds into a blender.",
      "Blend on high speed until completely smooth and green.",
      "Serve immediately in a colorful cup with a straw."
    ]
  },
  {
    id: "k3",
    name: "Brain-Boosting Carrot Apple Muffin",
    type: "kids-snack",
    prepTime: 25,
    baseCost: 1.4,
    protein: 5,
    carbs: 30,
    kidsAgeMin: 9,
    kidsAgeMax: 12,
    tags: {
      dietary: ["vegetarian", "eggetarian", "lactose-free"],
      mood: ["comfort", "celebratory"],
      weather: ["cold", "rainy"],
      dosha: ["vata", "kapha"],
      exercise: ["rest"]
    },
    nutritionNotes: "Tween stage (9-12). Beta-carotene from carrots, antioxidants from apples, and healthy brain fats.",
    ayurvedicNotes: "Warm, sweet, and grounding. Calms hyper-active minds.",
    ingredients: [
      { name: "Grated Carrots", amount: "1/4 cup", category: "produce", basePrice: 0.3 },
      { name: "Apple puree", amount: "1/4 cup", category: "produce", basePrice: 0.3 },
      { name: "Oat Flour", amount: "1/2 cup", category: "pantry", basePrice: 0.4 },
      { name: "Egg", amount: "1 whole", category: "proteins", basePrice: 0.3 },
      { name: "Coconut Oil", amount: "1 tbsp", category: "fats", basePrice: 0.1 }
    ],
    instructions: [
      "Preheat oven to 180°C and line muffin tins.",
      "Whisk egg, grated carrots, apple puree, and melted coconut oil.",
      "Fold in oat flour until blended.",
      "Spoon into cups and bake for 18-20 minutes."
    ]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = recipes;
} else {
  window.MoodMealRecipes = recipes;
}
