// Scoring and Recommendation Engine for MoodMeal (Exercise, Snacks & Kids Sections)
function generateMealPlan(userInputs, excludeIds = []) {
  const allRecipes = window.MoodMealRecipes || [];
  
  if (allRecipes.length === 0) {
    return {
      breakfast: null,
      lunch: null,
      dinner: null,
      snack: null,
      beverage: null,
      kidsMeal: null,
      whySummary: "No recipes loaded. Please check your data.",
      totalCost: 0,
      isOverBudget: false
    };
  }

  // Helper to filter compatible items based on dietary and allergy preferences
  const getCompatibleRecipes = (list) => {
    return list.filter(recipe => {
      if (excludeIds.includes(recipe.id)) {
        return false;
      }

      // Dietary pattern
      const diet = userInputs.dietaryPattern;
      const recipeDiets = recipe.tags.dietary || [];

      if (diet === 'vegan' && !recipeDiets.includes('vegan')) {
        return false;
      }
      if (diet === 'vegetarian' && !recipeDiets.includes('vegetarian') && !recipeDiets.includes('vegan')) {
        return false;
      }
      if (diet === 'eggetarian' && !recipeDiets.includes('eggetarian') && !recipeDiets.includes('vegetarian') && !recipeDiets.includes('vegan')) {
        return false;
      }

      // Allergy check
      const allergies = userInputs.allergies || [];
      const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase());
      
      for (const allergy of allergies) {
        const cleanAllergy = allergy.toLowerCase().trim();
        if (cleanAllergy) {
          if (cleanAllergy === 'gluten' && !recipeDiets.includes('gluten-free')) {
            const hasWheat = recipeIngredients.some(name => name.includes('wheat') || name.includes('bread') || name.includes('pasta'));
            if (hasWheat) return false;
          }
          if ((cleanAllergy === 'lactose' || cleanAllergy === 'dairy') && !recipeDiets.includes('lactose-free')) {
            const hasDairy = recipeIngredients.some(name => name.includes('milk') || name.includes('butter') || name.includes('ghee') || name.includes('cheese'));
            if (hasDairy) return false;
          }
          const hasAllergen = recipeIngredients.some(name => name.includes(cleanAllergy));
          if (hasAllergen) return false;
        }
      }
      return true;
    });
  };

  // Simple heuristic scorer for a list of candidates
  const scoreAndSelect = (candidates, isBeverage = false) => {
    if (candidates.length === 0) return null;

    const scored = candidates.map(recipe => {
      let score = 0;
      
      // Activity
      const activity = userInputs.activity || 'rest';
      const recipeExercises = recipe.tags.exercise || [];
      if (activity === 'gym' && (recipe.protein >= 20 || recipeExercises.includes('gym'))) score += 4.0;
      if (activity === 'yoga' && (recipe.tags.dosha?.length > 0 || recipeExercises.includes('yoga'))) score += 4.0;
      if (activity === 'cardio' && (recipe.carbs >= 45 || recipeExercises.includes('cardio'))) score += 4.0;

      // Mood
      const mood = userInputs.mood;
      const recipeMoods = recipe.tags.mood || [];
      if (mood && recipeMoods.includes(mood)) score += 3.5;

      // Weather
      const temp = userInputs.weather?.temp;
      const isRainy = userInputs.weather?.isRainy;
      const recipeWeather = recipe.tags.weather || [];

      if (temp !== undefined) {
        if (temp > 25) {
          if (recipeWeather.includes('hot')) score += isBeverage ? 6.0 : 3.0;
          if (recipeWeather.includes('cold')) score -= 2.0;
        } else if (temp < 15) {
          if (recipeWeather.includes('cold')) score += isBeverage ? 6.0 : 3.0;
          if (recipeWeather.includes('hot')) score -= 1.5;
        }
      }
      if (isRainy && recipeWeather.includes('rainy')) score += 2.0;

      // Ayurvedic
      if (userInputs.ayurvedicEnabled && userInputs.ayurvedicDosha) {
        const dosha = userInputs.ayurvedicDosha.toLowerCase();
        if (recipe.tags.dosha?.includes(dosha)) score += 2.5;
      }

      return { recipe, score };
    });

    // Sort descending
    scored.sort((a, b) => b.score - a.score);
    
    if (scored.length === 1) return scored[0].recipe;
    return Math.random() < 0.8 ? scored[0].recipe : scored[1].recipe;
  };

  // Filter recipes by type
  const breakfasts = getCompatibleRecipes(allRecipes.filter(r => r.type === 'breakfast'));
  const lunches = getCompatibleRecipes(allRecipes.filter(r => r.type === 'lunch'));
  const dinners = getCompatibleRecipes(allRecipes.filter(r => r.type === 'dinner'));
  const snacks = getCompatibleRecipes(allRecipes.filter(r => r.type === 'snack'));
  const beverages = getCompatibleRecipes(allRecipes.filter(r => r.type === 'beverage'));
  
  // Kids filter
  const kidsCandidates = getCompatibleRecipes(allRecipes.filter(r => {
    if (r.type !== 'kids-snack') return false;
    if (userInputs.kidsEnabled && userInputs.kidsAge !== undefined) {
      const age = parseInt(userInputs.kidsAge);
      return age >= r.kidsAgeMin && age <= r.kidsAgeMax;
    }
    return false;
  }));

  // Recommended items selection
  const breakfast = scoreAndSelect(breakfasts);
  const lunch = scoreAndSelect(lunches);
  const dinner = scoreAndSelect(dinners);
  const snack = scoreAndSelect(snacks);
  const beverage = scoreAndSelect(beverages, true);
  const kidsMeal = userInputs.kidsEnabled ? scoreAndSelect(kidsCandidates) : null;

  // Fallback defaults
  const getFallback = (type) => {
    const list = allRecipes.filter(r => r.type === type);
    return list.length > 0 ? list[0] : null;
  };

  const finalBreakfast = breakfast || getFallback('breakfast');
  const finalLunch = lunch || getFallback('lunch');
  const finalDinner = dinner || getFallback('dinner');
  const finalSnack = snack || getFallback('snack');
  const finalBeverage = beverage || getFallback('beverage');

  // Calculate costs
  const activePlan = [finalBreakfast, finalLunch, finalDinner, finalSnack, finalBeverage];
  if (userInputs.kidsEnabled && kidsMeal) {
    activePlan.push(kidsMeal);
  }

  const selectedRecipes = activePlan.filter(Boolean);
  let totalCost = selectedRecipes.reduce((sum, r) => sum + r.baseCost, 0);

  // Generate Groceries
  const ingredientsMap = {};
  selectedRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ing => {
      const key = ing.name.toLowerCase();
      if (ingredientsMap[key]) {
        ingredientsMap[key].basePrice += ing.basePrice;
        ingredientsMap[key].amount = addQuantities(ingredientsMap[key].amount, ing.amount);
      } else {
        ingredientsMap[key] = {
          name: ing.name,
          amount: ing.amount,
          category: ing.category,
          basePrice: ing.basePrice,
          recipeId: recipe.id,
          substitutions: recipe.substitutions?.[ing.name] || []
        };
      }
    });
  });

  const groceryList = Object.values(ingredientsMap);

  // Reasoning Summary
  let whySummary = "This balanced plan provides stable energy for your day.";
  const moodWord = userInputs.mood || "good";
  const activity = userInputs.activity || 'rest';

  if (activity === 'gym') {
    whySummary = `To fuel your Gym workout, we matched high-protein meals (like scramble and quinoa bowl) with a protein-heavy recovery snack.`;
  } else if (activity === 'yoga') {
    whySummary = `Perfect for your Yoga practice: this plan focuses on light, digestible, and sattvic ingredients paired with a hydrating mint beverage.`;
  } else if (activity === 'cardio') {
    whySummary = `For your Cardio session, we centered complex carbohydrates to build glycogen reserves, along with a clean energy matcha latte.`;
  } else if (userInputs.weather?.temp > 25) {
    whySummary = `Because it's hot today, we've styled cooling main dishes paired with a refreshing, hydrating cucumber-mint cold drink.`;
  } else if (userInputs.weather?.temp < 15) {
    whySummary = `Since it's chilly outside, we selected warming soups and curries, along with an adaptogenic golden turmeric warm latte.`;
  } else if (userInputs.mood) {
    whySummary = `To align with your ${moodWord} mood today, we've styled a comforting plan with wholesome treats.`;
  }

  // Budget
  const limit = userInputs.budget || 20;
  const isOverBudget = totalCost > limit;

  return {
    breakfast: finalBreakfast,
    lunch: finalLunch,
    dinner: finalDinner,
    snack: finalSnack,
    beverage: finalBeverage,
    kidsMeal,
    whySummary,
    groceryList,
    totalCost: parseFloat(totalCost.toFixed(2)),
    isOverBudget,
    budgetLimit: limit
  };
}

function addQuantities(qty1, qty2) {
  if (qty1 === qty2) return qty1;
  const parseQty = (q) => {
    const match = q.match(/^([\d\/\.\s]+)\s*(.*)$/);
    if (!match) return { num: 1, unit: q };
    let numStr = match[1].trim();
    const unit = match[2].trim();
    let num = 0;
    if (numStr.includes('/')) {
      const parts = numStr.split('/');
      num = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
      num = parseFloat(numStr);
    }
    return { num: isNaN(num) ? 1 : num, unit };
  };
  const q1 = parseQty(qty1);
  const q2 = parseQty(qty2);
  if (q1.unit === q2.unit) {
    return `${parseFloat((q1.num + q2.num).toFixed(2))} ${q1.unit}`;
  }
  return `${qty1} + ${qty2}`;
}

// Expose
if (typeof module !== "undefined" && module.exports) {
  module.exports = { generateMealPlan };
} else {
  window.MoodMealEngine = { generateMealPlan };
}
