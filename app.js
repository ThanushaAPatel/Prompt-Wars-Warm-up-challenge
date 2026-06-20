// MoodMeal Main Application Controller (Fully Optimized, Fast, Nav, Index, Snacks, Kids Corner & Breathing Widget)

const app = {
  // 1. Application State
  state: {
    onboarding: {
      dietaryPattern: 'vegetarian',
      goal: 'general',
      allergies: [],
      conditions: [],
      budget: 20,
      city: 'New York',
      ayurvedicEnabled: false,
      ayurvedicDosha: 'vata',
      kidsEnabled: false,
      kidsAge: 6
    },
    checkIn: {
      mood: 'stressed',
      occasion: 'busy-workday',
      activity: 'gym'
    },
    weather: {
      temp: 20,
      description: 'Clear Sky (Default)',
      isRainy: false,
      icon: '☀️'
    },
    weatherOverrideActive: false,
    currentPlan: null,
    swappedIngredients: {},
    excludeRecipeIds: [],
    checkedGroceries: {},
    activeTab: 'meals',
    
    // Breathing Exercise State
    breathingActive: false,
    breathingTimer: null,

    // Playlist Player State
    playlist: {
      isPlaying: false,
      currentTrackIndex: 0,
      progress: 0,
      timer: null
    },
    
    // Kids Chef Level State
    kidsTastingScore: 0,
    kidsChefStars: 0,
    kidsChefLevel: '🌱 Novice Helper'
  },

  // 2. Initializer
  init() {
    this.setupEventListeners();
    this.setupPillSelectors();
    this.loadStateFromLocalStorage();
    
    // Set initial view
    this.showOnboarding();
    
    this.fetchWeather(this.state.onboarding.city);
  },

  // 3. Cache Storage Sync
  loadStateFromLocalStorage() {
    const saved = localStorage.getItem('moodmeal_state_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.onboarding) this.state.onboarding = { ...this.state.onboarding, ...parsed.onboarding };
        if (parsed.checkIn) this.state.checkIn = { ...this.state.checkIn, ...parsed.checkIn };
        
        // Restore controls
        document.getElementById('goal-select').value = this.state.onboarding.goal;
        document.getElementById('budget-input').value = this.state.onboarding.budget;
        document.getElementById('city-input').value = this.state.onboarding.city;
        
        const kidsToggle = document.getElementById('kids-toggle');
        kidsToggle.checked = this.state.onboarding.kidsEnabled;
        this.toggleKidsLayer(this.state.onboarding.kidsEnabled);
        document.getElementById('kids-age-select').value = this.state.onboarding.kidsAge;

        const ayurToggle = document.getElementById('ayurvedic-toggle');
        ayurToggle.checked = this.state.onboarding.ayurvedicEnabled;
        this.toggleAyurvedicLayer(this.state.onboarding.ayurvedicEnabled);

        this.syncPillSelections();
      } catch (e) {
        console.error("Local storage load error", e);
      }
    }
  },

  saveStateToLocalStorage() {
    localStorage.setItem('moodmeal_state_v4', JSON.stringify({
      onboarding: this.state.onboarding,
      checkIn: this.state.checkIn
    }));
  },

  syncPillSelections() {
    document.querySelectorAll('#diet-pill-grid .pill-option').forEach(p => {
      p.classList.toggle('selected', p.dataset.value === this.state.onboarding.dietaryPattern);
    });

    document.querySelectorAll('#allergy-pill-grid .pill-option').forEach(p => {
      p.classList.toggle('selected', this.state.onboarding.allergies.includes(p.dataset.value));
    });

    document.querySelectorAll('#condition-pill-grid .pill-option').forEach(p => {
      p.classList.toggle('selected', this.state.onboarding.conditions.includes(p.dataset.value));
    });

    document.querySelectorAll('#dosha-pill-grid .pill-option').forEach(p => {
      p.classList.toggle('selected', p.dataset.value === this.state.onboarding.ayurvedicDosha);
    });

    document.querySelectorAll('#activity-pill-grid .pill-option').forEach(p => {
      p.classList.toggle('selected', p.dataset.value === this.state.checkIn.activity);
    });

    document.querySelectorAll('#mood-picker .mood-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.value === this.state.checkIn.mood);
    });

    document.querySelectorAll('#occasion-pill-grid .pill-option').forEach(p => {
      p.classList.toggle('selected', p.dataset.value === this.state.checkIn.occasion);
    });
  },

  // 4. View routing
  showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    // Highlight Nav links
    const btnPref = document.getElementById('nav-pref-btn');
    const btnCheckin = document.getElementById('nav-checkin-btn');
    const btnDash = document.getElementById('nav-dash-btn');

    btnPref.classList.remove('active');
    btnCheckin.classList.remove('active');
    btnDash.classList.remove('active');

    if (viewId === 'view-onboarding') btnPref.classList.add('active');
    if (viewId === 'view-checkin') btnCheckin.classList.add('active');
    if (viewId === 'view-results') btnDash.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  showOnboarding() {
    this.showView('view-onboarding');
  },

  showCheckIn() {
    this.showView('view-checkin');
    this.fetchWeather(this.state.onboarding.city);
  },

  showResultsView() {
    if (!this.state.currentPlan) {
      this.runRecommendation();
    }
    this.showView('view-results');
    this.switchTab('meals');
  },

  resetToHome() {
    if (this.state.currentPlan) {
      this.showResultsView();
    } else {
      this.showCheckIn();
    }
  },

  showCheckInOrResults() {
    if (this.state.currentPlan) {
      this.showResultsView();
    } else {
      this.showCheckIn();
    }
  },

  // Scroll index anchor
  scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      document.querySelectorAll('.index-nav-link').forEach(link => link.classList.remove('active'));
      
      const linkId = id === 'meal-breakfast' ? 'idx-b' :
                     id === 'meal-lunch' ? 'idx-l' :
                     id === 'meal-dinner' ? 'idx-d' :
                     id === 'meal-snack' ? 'idx-s' :
                     id === 'meal-beverage' ? 'idx-v' : 'idx-k';
      
      const activeLink = document.getElementById(linkId);
      if (activeLink) activeLink.classList.add('active');
    }
  },

  // Toggle tab panel views
  switchTab(tabName) {
    this.state.activeTab = tabName;
    
    const tabMealsBtn = document.getElementById('tab-meals-btn');
    const tabGroceryBtn = document.getElementById('tab-grocery-btn');
    const contentMeals = document.getElementById('tab-meals-content');
    const contentGrocery = document.getElementById('tab-grocery-content');
    const indexSidebar = document.getElementById('dashboard-nav-index');
    const copyListBtn = document.getElementById('copy-grocery-btn');
    const rerollBtn = document.getElementById('reroll-plan-btn');

    if (tabName === 'meals') {
      tabMealsBtn.classList.add('active');
      tabGroceryBtn.classList.remove('active');
      contentMeals.classList.add('active');
      contentGrocery.classList.remove('active');
      if (indexSidebar) indexSidebar.style.display = 'block';
      if (copyListBtn) copyListBtn.style.display = 'none';
      if (rerollBtn) rerollBtn.style.display = 'block';
    } else {
      tabMealsBtn.classList.remove('active');
      tabGroceryBtn.classList.add('active');
      contentMeals.classList.remove('active');
      contentGrocery.classList.add('active');
      if (indexSidebar) indexSidebar.style.display = 'none';
      if (copyListBtn) copyListBtn.style.display = 'block';
      if (rerollBtn) rerollBtn.style.display = 'none';
    }
  },

  // 5. Selectors & Pill Event Bindings
  setupEventListeners() {
    const allergyInput = document.getElementById('custom-allergy-input');
    allergyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = allergyInput.value.trim().toLowerCase();
        if (val && !this.state.onboarding.allergies.includes(val)) {
          this.state.onboarding.allergies.push(val);
          
          const pill = document.createElement('div');
          pill.className = 'pill-option selected';
          pill.dataset.value = val;
          pill.textContent = `❌ ${val}`;
          pill.onclick = () => {
            this.state.onboarding.allergies = this.state.onboarding.allergies.filter(a => a !== val);
            pill.remove();
          };
          
          document.getElementById('allergy-pill-grid').appendChild(pill);
          allergyInput.value = '';
        }
      }
    });
  },

  setupPillSelectors() {
    const handlePillClick = (gridId, isMulti, callback) => {
      document.getElementById(gridId).addEventListener('click', (e) => {
        const pill = e.target.closest('.pill-option, .mood-card');
        if (!pill) return;

        const value = pill.dataset.value;
        const parent = pill.parentElement;

        if (!isMulti) {
          parent.querySelectorAll('.pill-option, .mood-card').forEach(p => p.classList.remove('selected'));
          pill.classList.add('selected');
          callback(value);
        } else {
          pill.classList.toggle('selected');
          const selected = Array.from(parent.querySelectorAll('.pill-option.selected')).map(p => p.dataset.value);
          callback(selected);
        }
      });
    };

    handlePillClick('diet-pill-grid', false, (val) => {
      this.state.onboarding.dietaryPattern = val;
    });

    handlePillClick('allergy-pill-grid', true, (arr) => {
      const custom = this.state.onboarding.allergies.filter(a => !['nuts', 'dairy', 'gluten', 'soy'].includes(a));
      this.state.onboarding.allergies = [...arr, ...custom];
    });

    handlePillClick('condition-pill-grid', true, (arr) => {
      this.state.onboarding.conditions = arr;
    });

    handlePillClick('dosha-pill-grid', false, (val) => {
      this.state.onboarding.ayurvedicDosha = val;
    });

    handlePillClick('activity-pill-grid', false, (val) => {
      this.state.checkIn.activity = val;
    });

    handlePillClick('mood-picker', false, (val) => {
      this.state.checkIn.mood = val;
    });

    handlePillClick('occasion-pill-grid', false, (val) => {
      this.state.checkIn.occasion = val;
    });
  },

  toggleAyurvedicLayer(enabled) {
    this.state.onboarding.ayurvedicEnabled = enabled;
    const subform = document.getElementById('ayurvedic-subform');
    subform.style.display = enabled ? 'block' : 'none';
  },

  toggleKidsLayer(enabled) {
    this.state.onboarding.kidsEnabled = enabled;
    const subform = document.getElementById('kids-subform');
    subform.style.display = enabled ? 'block' : 'none';
  },

  toggleWeatherOverride() {
    this.state.weatherOverrideActive = !this.state.weatherOverrideActive;
    const box = document.getElementById('weather-override-fields');
    box.style.display = this.state.weatherOverrideActive ? 'block' : 'none';
    
    if (this.state.weatherOverrideActive) {
      document.getElementById('override-temp').value = Math.round(this.state.weather.temp);
      document.getElementById('override-rain').value = this.state.weather.isRainy ? 'rainy' : 'dry';
    }
  },

  handleWeatherOverrideChange() {
    if (!this.state.weatherOverrideActive) return;
    
    const temp = parseFloat(document.getElementById('override-temp').value);
    const rain = document.getElementById('override-rain').value;
    
    this.state.weather.temp = temp;
    this.state.weather.isRainy = (rain === 'rainy');
    
    if (this.state.weather.isRainy) {
      this.state.weather.description = "Rainy Spell (Override)";
      this.state.weather.icon = "🌧️";
    } else if (temp > 28) {
      this.state.weather.description = "Hot & Sunny (Override)";
      this.state.weather.icon = "☀️";
    } else if (temp < 12) {
      this.state.weather.description = "Cold & Frosty (Override)";
      this.state.weather.icon = "❄️";
    } else {
      this.state.weather.description = "Mild Weather (Override)";
      this.state.weather.icon = "⛅";
    }

    this.updateWeatherUI();
  },

  // 6. Weather Forecast Fetch
  async fetchWeather(cityName) {
    if (this.state.weatherOverrideActive) return;

    const displayTemp = document.getElementById('weather-display-temp');
    const displayDesc = document.getElementById('weather-display-desc');
    const displayIcon = document.getElementById('weather-display-icon');

    try {
      displayDesc.textContent = `Finding ${cityName}...`;
      
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found");
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather) {
        throw new Error("Current weather failed");
      }

      const temp = weatherData.current_weather.temperature;
      const code = weatherData.current_weather.weathercode;
      
      let description = "Clear skies";
      let icon = "☀️";
      let isRainy = false;

      if ([1, 2, 3].includes(code)) {
        description = "Partly Cloudy";
        icon = "⛅";
      } else if ([45, 48].includes(code)) {
        description = "Foggy weather";
        icon = "🌫️";
      } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
        description = "Rain showers";
        icon = "🌧️";
        isRainy = true;
      } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
        description = "Snowy conditions";
        icon = "❄️";
        isRainy = true;
      } else if ([95, 96, 99].includes(code)) {
        description = "Thunderstorms";
        icon = "⛈️";
        isRainy = true;
      }

      this.state.weather = {
        temp,
        description: `${description} in ${name}, ${country}`,
        isRainy,
        icon
      };

      this.updateWeatherUI();

    } catch (e) {
      console.warn("Open-Meteo fallback:", e.message);
      const month = new Date().getMonth();
      const isWinterish = [11, 0, 1].includes(month);
      
      this.state.weather = {
        temp: isWinterish ? 10 : 22,
        description: `Mild (Offline fallback for ${cityName})`,
        isRainy: false,
        icon: "⛅"
      };
      
      this.updateWeatherUI();
    }
  },

  updateWeatherUI() {
    document.getElementById('weather-display-temp').textContent = `${Math.round(this.state.weather.temp)}°C`;
    document.getElementById('weather-display-desc').textContent = this.state.weather.description;
    document.getElementById('weather-display-icon').textContent = this.state.weather.icon;
  },

  // 7. Onboarding Form Action
  saveOnboarding(event) {
    if (event) event.preventDefault();

    this.state.onboarding.budget = parseFloat(document.getElementById('budget-input').value) || 20;
    this.state.onboarding.city = document.getElementById('city-input').value.trim() || 'New York';
    this.state.onboarding.kidsEnabled = document.getElementById('kids-toggle').checked;
    this.state.onboarding.kidsAge = parseInt(document.getElementById('kids-age-select').value) || 6;
    
    this.saveStateToLocalStorage();
    this.showCheckIn();
  },

  skipOnboarding() {
    this.showCheckIn();
  },

  // 8. Recommendation Trigger (Speed Optimized: 200ms delay instead of 1.5s)
  generatePlan(event) {
    if (event) event.preventDefault();

    const loader = document.getElementById('loading-overlay');
    loader.classList.add('active');

    // Instant/Near-instant feedback to user
    setTimeout(() => {
      this.state.swappedIngredients = {};
      this.state.checkedGroceries = {};
      
      this.runRecommendation();
      
      loader.classList.remove('active');
      this.showView('view-results');
      this.switchTab('meals');
    }, 200);
  },

  regeneratePlan() {
    const loader = document.getElementById('loading-overlay');
    loader.classList.add('active');

    if (this.state.currentPlan) {
      if (this.state.currentPlan.breakfast) this.state.excludeRecipeIds.push(this.state.currentPlan.breakfast.id);
      if (this.state.currentPlan.lunch) this.state.excludeRecipeIds.push(this.state.currentPlan.lunch.id);
      if (this.state.currentPlan.dinner) this.state.excludeRecipeIds.push(this.state.currentPlan.dinner.id);
      if (this.state.currentPlan.snack) this.state.excludeRecipeIds.push(this.state.currentPlan.snack.id);
      if (this.state.currentPlan.beverage) this.state.excludeRecipeIds.push(this.state.currentPlan.beverage.id);
      if (this.state.currentPlan.kidsMeal) this.state.excludeRecipeIds.push(this.state.currentPlan.kidsMeal.id);
      
      if (this.state.excludeRecipeIds.length > 9) {
        this.state.excludeRecipeIds = this.state.excludeRecipeIds.slice(-6);
      }
    }

    setTimeout(() => {
      this.state.swappedIngredients = {};
      this.state.checkedGroceries = {};
      this.runRecommendation();
      loader.classList.remove('active');
    }, 200);
  },

  runRecommendation() {
    const inputs = {
      dietaryPattern: this.state.onboarding.dietaryPattern,
      allergies: this.state.onboarding.allergies,
      conditions: this.state.onboarding.conditions,
      budget: this.state.onboarding.budget,
      goal: this.state.onboarding.goal,
      ayurvedicEnabled: this.state.onboarding.ayurvedicEnabled,
      ayurvedicDosha: this.state.onboarding.ayurvedicDosha,
      mood: this.state.checkIn.mood,
      weather: this.state.weather,
      occasion: this.state.checkIn.occasion,
      activity: this.state.checkIn.activity,
      kidsEnabled: this.state.onboarding.kidsEnabled,
      kidsAge: this.state.onboarding.kidsAge
    };

    const plan = window.MoodMealEngine.generateMealPlan(inputs, this.state.excludeRecipeIds);
    this.state.currentPlan = plan;

    this.renderMealPlan();
    this.renderGroceryListAndBudget();
    this.renderHarmonyScore();
    this.renderPlaylistPlayer();
  },

  // 9. UI Rendering - Meal Plan Cards
  renderMealPlan() {
    this.renderMealCardSlot('breakfast', 'breakfast-slot');
    this.renderMealCardSlot('lunch', 'lunch-slot');
    this.renderMealCardSlot('dinner', 'dinner-slot');
    this.renderMealCardSlot('snack', 'snack-slot');
    this.renderMealCardSlot('beverage', 'beverage-slot');

    const kidsDiv = document.getElementById('meal-kids');
    const kidsIdxLi = document.getElementById('idx-kids-container');
    
    if (this.state.onboarding.kidsEnabled && this.state.currentPlan.kidsMeal) {
      kidsDiv.style.display = 'block';
      kidsIdxLi.style.display = 'block';
      this.renderMealCardSlot('kidsMeal', 'kids-slot', true);
    } else {
      kidsDiv.style.display = 'none';
      kidsIdxLi.style.display = 'none';
    }

    document.getElementById('advisor-reasoning-text').textContent = this.state.currentPlan.whySummary;
  },

  renderMealCardSlot(planField, slotId, isKids = false) {
    const slot = document.getElementById(slotId);
    slot.innerHTML = '';

    const recipe = this.state.currentPlan[planField];
    if (!recipe) {
      slot.innerHTML = `<div style="padding:1rem; color:var(--text-muted);">No matching dish found.</div>`;
      return;
    }

    // Cost Adjustment
    let costAdjustment = 0;
    recipe.ingredients.forEach(ing => {
      const swapKey = `${recipe.id}_${ing.name}`;
      if (this.state.swappedIngredients[swapKey]) {
        costAdjustment += this.state.swappedIngredients[swapKey].priceDiff;
      }
    });
    const adjustedCost = Math.max(0, recipe.baseCost + costAdjustment);

    // Macros
    let proteinAdjust = 0;
    let carbsAdjust = 0;
    recipe.ingredients.forEach(ing => {
      const swapKey = `${recipe.id}_${ing.name}`;
      const swap = this.state.swappedIngredients[swapKey];
      if (swap && swap.macroDiff) {
        const diffs = this.getMacroDiffs(swap.macroDiff);
        proteinAdjust += diffs.pDiff;
        carbsAdjust += diffs.cDiff;
      }
    });

    const finalProtein = Math.max(0, recipe.protein + proteinAdjust);
    const finalCarbs = Math.max(0, recipe.carbs + carbsAdjust);

    const card = document.createElement('div');
    card.className = `meal-card ${isKids ? 'kids-card' : ''}`;

    let headerTagText = recipe.type;
    if (isKids) {
      headerTagText = `👶 Kids Corner (Age ${this.state.onboarding.kidsAge})`;
    }

    // Unique Feature 2: Kids Tasks suggestions injected inside card body
    let kidsTaskBox = "";
    if (isKids) {
      const age = this.state.onboarding.kidsAge;
      let taskText = "Let them help set the table.";
      if (age <= 4) taskText = "🥣 Mashed banana: let toddler mash with a baby fork.";
      else if (age <= 8) taskText = "🥬 Washing spinach: let child rinse leaves under cold water.";
      else if (age <= 12) taskText = "⚖️ Measuring ingredients: let tween weigh oat flour and hemp seeds.";

      kidsTaskBox = `
        <div style="background-color:var(--accent-blue-light); border-left:3px solid var(--accent-blue); padding:0.6rem; border-radius:0 var(--border-radius-sm) var(--border-radius-sm) 0; font-size:0.85rem; margin-top:0.75rem; color:var(--text-main);">
          <strong>Parent-Child Activity:</strong> ${taskText}
        </div>
      `;
    }

    card.innerHTML = `
      <div class="meal-header">
        <span class="meal-tag ${isKids ? 'kids-tag' : ''}">${headerTagText}</span>
        <span style="font-weight:700; color:var(--primary); font-size:1.1rem;">$${adjustedCost.toFixed(2)}</span>
      </div>
      <div class="meal-body">
        <h3 class="meal-title brand-font">${recipe.name}</h3>
        
        <div class="meal-meta">
          <span>⏱️ ${recipe.prepTime} mins</span>
          <span style="color: var(--accent-green); font-weight:600;">💪 ${finalProtein}g Protein / ${finalCarbs}g Carbs</span>
        </div>
        
        <div class="meal-why">
          <strong>Advisor:</strong> ${this.getAdvisorCommentary(planField, recipe)}
        </div>
        
        <div class="meal-notes">
          <p><strong>Nutritionist Note:</strong> ${recipe.nutritionNotes}</p>
          ${this.state.onboarding.ayurvedicEnabled && recipe.ayurvedicNotes ? 
            `<p style="color:var(--secondary); font-weight:600;"><strong>Ayurvedic Insight:</strong> ${recipe.ayurvedicNotes}</p>` : ''}
        </div>
        ${kidsTaskBox}
        ${isKids ? `
        <div class="kids-tasting-box" style="margin-top: 1rem; border-top: 1.5px dashed var(--accent-blue); padding-top: 1rem;">
          <strong style="color: var(--accent-blue); display: block; font-size: 0.9rem; margin-bottom: 0.5rem;">🧒 Kid's Tasting Review:</strong>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
            <button class="tasting-btn ${this.state.kidsTastingScore === 1 ? 'selected' : ''}" onclick="app.rateKidsMeal(1)" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; border-radius: 12px; border: 1.5px solid var(--border-color); background-color: var(--bg-surface); cursor: pointer; display: flex; align-items: center; gap: 0.3rem;">🤢 Meh</button>
            <button class="tasting-btn ${this.state.kidsTastingScore === 3 ? 'selected' : ''}" onclick="app.rateKidsMeal(3)" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; border-radius: 12px; border: 1.5px solid var(--border-color); background-color: var(--bg-surface); cursor: pointer; display: flex; align-items: center; gap: 0.3rem;">😐 Okay</button>
            <button class="tasting-btn ${this.state.kidsTastingScore === 5 ? 'selected' : ''}" onclick="app.rateKidsMeal(5)" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; border-radius: 12px; border: 1.5px solid var(--border-color); background-color: var(--bg-surface); cursor: pointer; display: flex; align-items: center; gap: 0.3rem;">😋 Yummy!</button>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; background-color: white; padding: 0.5rem 0.75rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
            <span>👨‍🍳 Chef Level: <strong style="color: var(--accent-blue);">${this.state.kidsChefLevel}</strong></span>
            <span>⭐ Stars: <strong>${this.state.kidsChefStars}</strong></span>
          </div>
        </div>
        ` : ''}
      </div>
      <div class="meal-footer">
        <button class="btn btn-secondary btn-sm" onclick="app.openRecipeModal('${planField}')">📖 Cooking Steps</button>
        <button class="btn btn-sm" onclick="app.rerollSingleMealSlot('${planField}')" style="background-color:var(--secondary); box-shadow:none;">🔄 Swap Dish</button>
      </div>
    `;

    slot.appendChild(card);
  },

  getAdvisorCommentary(planField, recipe) {
    if (planField === 'kidsMeal') {
      const age = this.state.onboarding.kidsAge;
      if (age <= 4) return "Toddler chewable! Low sodium, easy shapes, and designed to support tiny hand coordination.";
      if (age <= 8) return "Sneaked veggie power! Delicious sweet profile hides vitamin-dense spinach and healthy seed fats.";
      return "Tween focus booster! Whole foods loaded with beta-carotene and plant carbs to fuel their high energy studies.";
    }

    if (planField === 'snack') {
      return "Wholesome snack. Perfect to tide you over between main courses and keep blood sugar completely stable.";
    }

    if (planField === 'beverage') {
      const temp = this.state.weather.temp;
      if (temp > 25) return "Cooling beverage. Hydrates cells and cools down core temperature in hot weather.";
      return "Warming blend. Revitalizes core digestion and keeps your body cozy and immune active.";
    }

    return this.getMoodCommentary(planField, recipe);
  },

  getMoodCommentary(planField, recipe) {
    const mood = this.state.checkIn.mood;
    const witticisms = {
      stressed: {
        breakfast: "Slow down and chew this. It's a calming oat-based nutrient shield against your hectic inbox.",
        lunch: "Screen down, spoon up. This digestion-friendly fuel is designed to bring you back to center.",
        dinner: "The workday stress ends here. Enjoy this warm, grounding dinner to lower cortisol levels."
      },
      'low-energy': {
        breakfast: "Ultra low prep, high vitality return. Let's wake up your engine gently.",
        lunch: "Light and energy-sustaining. Avoids the heavy carb-coma so you stay awake.",
        dinner: "Minimum kitchen time required. Feed your body, rest your feet."
      },
      celebratory: {
        breakfast: "Start the day with a delicious celebration of life! Nourishing and colorful.",
        lunch: "Rich in flavor, vibrant in texture. Live a little with this awesome feast.",
        dinner: "Gourmet wellness capped off. Treat yourself to wholesome goodness."
      },
      lazy: {
        breakfast: "Practically makes itself in one bowl. Delicious breakfast, no dishes.",
        lunch: "Quick chop and stir. You'll be eating in under 12 minutes.",
        dinner: "One-pot or simple pan operation. Easy cleanup so you can get back to relaxing."
      },
      motivated: {
        breakfast: "Power fuel for a high-intensity morning. Clean energy for the go-getter.",
        lunch: "Sustained-release calories to lock in your afternoon flow.",
        dinner: "High nutrient density to feed the champion after a highly productive day."
      },
      'under-the-weather': {
        breakfast: "Gentle on sensitive stomachs. Warm, soothing, and packed with anti-inflammatory turmeric.",
        lunch: "Nourishing, liquid comfort to help your immune system rest and recover.",
        dinner: "Warm bowl of healing goodness. Sip, wrap in a blanket, sleep well."
      }
    };

    return witticisms[mood]?.[planField] || "A nutritious, comforting meal designed to keep your energies balanced.";
  },

  getMacroDiffs(text) {
    let pDiff = 0;
    let cDiff = 0;
    if (!text) return { pDiff, cDiff };
    const clean = text.toLowerCase();
    
    const protMatch = clean.match(/([+-]\d+)\s*g\s*protein/);
    if (protMatch) {
      pDiff = parseInt(protMatch[1]);
    }
    
    const carbMatch = clean.match(/([+-]\d+)\s*g\s*carb/);
    if (carbMatch) {
      cDiff = parseInt(carbMatch[1]);
    } else {
      const carbMatch2 = clean.match(/carb\s*\(\s*([+-]\d+)\s*g\s*\)/);
      if (carbMatch2) {
        cDiff = parseInt(carbMatch2[1]);
      }
    }
    return { pDiff, cDiff };
  },

  rerollSingleMealSlot(planField) {
    const currentRecipe = this.state.currentPlan[planField];
    if (!currentRecipe) return;

    const allRecipes = window.MoodMealRecipes || [];
    let targetType = currentRecipe.type;
    let candidates = allRecipes.filter(r => r.type === targetType && r.id !== currentRecipe.id);
    
    if (planField === 'kidsMeal') {
      const age = this.state.onboarding.kidsAge;
      candidates = candidates.filter(r => age >= r.kidsAgeMin && age <= r.kidsAgeMax);
    }

    const diet = this.state.onboarding.dietaryPattern;
    const compatible = candidates.filter(r => {
      const recipeDiets = r.tags.dietary || [];
      if (diet === 'vegan' && !recipeDiets.includes('vegan')) return false;
      if (diet === 'vegetarian' && !recipeDiets.includes('vegetarian') && !recipeDiets.includes('vegan')) return false;
      if (diet === 'eggetarian' && !recipeDiets.includes('eggetarian') && !recipeDiets.includes('vegetarian') && !recipeDiets.includes('vegan')) return false;
      return true;
    });

    if (compatible.length === 0) {
      alert("No other compatible alternative dishes found.");
      return;
    }

    const nextRecipe = compatible[Math.floor(Math.random() * compatible.length)];
    this.state.currentPlan[planField] = nextRecipe;
    
    // Clear old swaps
    Object.keys(this.state.swappedIngredients).forEach(key => {
      if (key.startsWith(currentRecipe.id + "_")) {
        delete this.state.swappedIngredients[key];
      }
    });

    this.renderMealPlan();
    this.renderGroceryListAndBudget();
    this.renderHarmonyScore();
  },

  // 10. Grocery & Sidebar Calculations
  renderGroceryListAndBudget() {
    const listContainer = document.getElementById('grocery-list-container');
    listContainer.innerHTML = '';

    const finalGroceryItems = [];
    const selectedRecipes = [
      this.state.currentPlan.breakfast,
      this.state.currentPlan.lunch,
      this.state.currentPlan.dinner,
      this.state.currentPlan.snack,
      this.state.currentPlan.beverage
    ].filter(Boolean);

    if (this.state.onboarding.kidsEnabled && this.state.currentPlan.kidsMeal) {
      selectedRecipes.push(this.state.currentPlan.kidsMeal);
    }

    // Baseline macros
    let totalBaseProtein = selectedRecipes.reduce((sum, r) => sum + r.protein, 0);
    let totalBaseCarbs = selectedRecipes.reduce((sum, r) => sum + r.carbs, 0);

    selectedRecipes.forEach(recipe => {
      recipe.ingredients.forEach(originalIng => {
        const swapKey = `${recipe.id}_${originalIng.name}`;
        const swap = this.state.swappedIngredients[swapKey];
        
        if (swap) {
          finalGroceryItems.push({
            name: swap.name,
            amount: originalIng.amount,
            category: originalIng.category,
            basePrice: originalIng.basePrice + swap.priceDiff,
            originalName: originalIng.name,
            recipeId: recipe.id,
            // Swap allowed again on the original list options! (BUG FIX)
            substitutions: recipe.substitutions?.[originalIng.name] || [],
            isSwapped: true,
            swapInfo: swap
          });

          if (swap.macroDiff) {
            const diffs = this.getMacroDiffs(swap.macroDiff);
            totalBaseProtein += diffs.pDiff;
            totalBaseCarbs += diffs.cDiff;
          }

        } else {
          finalGroceryItems.push({
            name: originalIng.name,
            amount: originalIng.amount,
            category: originalIng.category,
            basePrice: originalIng.basePrice,
            originalName: originalIng.name,
            recipeId: recipe.id,
            substitutions: recipe.substitutions?.[originalIng.name] || [],
            isSwapped: false
          });
        }
      });
    });

    // Merge duplicates
    const mergedGroceries = {};
    finalGroceryItems.forEach(item => {
      const key = item.name.toLowerCase();
      if (mergedGroceries[key]) {
        mergedGroceries[key].basePrice += item.basePrice;
        mergedGroceries[key].amount = addQuantities(mergedGroceries[key].amount, item.amount);
      } else {
        mergedGroceries[key] = { ...item };
      }
    });

    const items = Object.values(mergedGroceries);

    // Group categories
    const categories = {};
    items.forEach(item => {
      const cat = item.category || 'other';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(item);
    });

    // Render lists
    Object.keys(categories).forEach(cat => {
      const catBox = document.createElement('div');
      catBox.className = 'grocery-category-box';
      const catIcons = {
        produce: '🥬', pantry: '🥫', dairy: '🧀', 'dairy-free': '🥛',
        proteins: '🍗', spices: '🧂', fats: '🥑', bakery: '🍞'
      };
      const icon = catIcons[cat.toLowerCase()] || '🛒';
      
      catBox.innerHTML = `
        <div class="category-title">${icon} ${cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
        <ul class="grocery-list-items">
          ${categories[cat].map(item => {
            const itemKey = item.name.toLowerCase();
            const isChecked = !!this.state.checkedGroceries[itemKey];
            const swapButton = item.substitutions && item.substitutions.length > 0 ? 
              `<button class="btn btn-secondary btn-sm" onclick="app.openSwapModal('${item.recipeId}', '${escapeHtml(item.originalName)}')" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; border-radius: 4px; box-shadow: none;">🔄 Swap</button>` : '';

            return `
              <li class="grocery-item ${isChecked ? 'checked' : ''}" data-item-name="${itemKey}">
                <div class="grocery-item-details">
                  <div class="checkbox-container ${isChecked ? 'checked' : ''}" onclick="app.toggleGroceryCheck('${escapeHtml(itemKey)}')"></div>
                  <span class="item-name">${item.name} <span class="item-amount">(${item.amount})</span></span>
                  ${item.isSwapped ? `<span class="sub-option-badge" style="font-size:0.65rem; background-color:var(--accent-green);">Swapped</span>` : ''}
                </div>
                <div class="grocery-item-actions">
                  <span class="item-price">$${item.basePrice.toFixed(2)}</span>
                  ${swapButton}
                </div>
              </li>
            `;
          }).join('')}
        </ul>
      `;
      listContainer.appendChild(catBox);
    });

    const totalCost = items.reduce((sum, item) => sum + item.basePrice, 0);
    this.updateBudgetFeasibility(totalCost);
    this.updateFitnessMacrosUI(totalBaseProtein, totalBaseCarbs);
  },

  // Unique Feature 3: Copy grocery checklist to clipboard
  copyGroceryList() {
    const listItems = [];
    document.querySelectorAll('.grocery-item').forEach(item => {
      const nameText = item.querySelector('.item-name').textContent;
      const priceText = item.querySelector('.item-price').textContent;
      const isChecked = item.classList.contains('checked') ? ' [x] ' : ' [ ] ';
      listItems.push(`${isChecked} ${nameText} - ${priceText}`);
    });

    const textList = `🥘 MoodMeal Shopping List:\n=======================\n${listItems.join('\n')}\n\nGenerated by MoodMeal AI.`;
    
    navigator.clipboard.writeText(textList).then(() => {
      const copyBtn = document.getElementById('copy-grocery-btn');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "Copied! ✓";
      copyBtn.style.backgroundColor = "var(--accent-green-light)";
      copyBtn.style.color = "var(--accent-green)";
      
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.backgroundColor = "";
        copyBtn.style.color = "";
      }, 2000);
    }).catch(err => {
      alert("Failed to copy text. Please try again.");
    });
  },

  toggleGroceryCheck(name) {
    this.state.checkedGroceries[name] = !this.state.checkedGroceries[name];
    this.renderGroceryListAndBudget();
  },

  updateFitnessMacrosUI(proteinGrams, carbsGrams) {
    const activity = this.state.checkIn.activity || 'rest';
    const targets = {
      gym: { protein: 70, carbs: 120, title: "🏋️ Gym Targets", msg: "Weights/Gym active. High protein targeted for muscle recovery." },
      yoga: { protein: 30, carbs: 80, title: "🧘 Yoga Targets", msg: "Yoga active. Low glycemic, light sattvic ingredients." },
      cardio: { protein: 50, carbs: 150, title: "🏃 Cardio Targets", msg: "Cardio active. High carbohydrate glycogen levels prioritized." },
      rest: { protein: 50, carbs: 100, title: "🛋️ Rest Targets", msg: "Rest active. Maintenance diet macros configured." }
    };

    const target = targets[activity];
    document.getElementById('exercise-sidebar-title').innerHTML = target.title;
    
    const pPercent = Math.min(100, (proteinGrams / target.protein) * 100);
    document.getElementById('protein-total-val').textContent = `${proteinGrams}g / ${target.protein}g`;
    document.getElementById('protein-progress-fill').style.width = `${pPercent}%`;

    const cPercent = Math.min(100, (carbsGrams / target.carbs) * 100);
    document.getElementById('carbs-total-val').textContent = `${carbsGrams}g / ${target.carbs}g`;
    document.getElementById('carbs-progress-fill').style.width = `${cPercent}%`;

    const feedbackBox = document.getElementById('macro-target-feedback');
    let extraFeedback = "";
    if (activity === 'gym' && pPercent < 100) {
      extraFeedback = "<br>💡 Tip: Swap Almond Milk for Soy Milk to add +6g Protein!";
    }
    feedbackBox.innerHTML = `<strong>${target.msg}</strong>${extraFeedback}`;
    
    feedbackBox.style.color = pPercent >= 100 && cPercent >= 100 ? 'var(--accent-green)' : 'var(--text-muted)';
    feedbackBox.style.backgroundColor = pPercent >= 100 && cPercent >= 100 ? 'var(--accent-green-light)' : 'var(--secondary-light)';
    feedbackBox.style.borderColor = pPercent >= 100 && cPercent >= 100 ? 'hsl(142, 30%, 82%)' : 'hsl(42, 30%, 86%)';
  },

  updateBudgetFeasibility(totalCost) {
    const limit = this.state.onboarding.budget;
    const variance = totalCost - limit;
    
    const totalCostSpan = document.getElementById('budget-total-cost');
    const statusTextDiv = document.getElementById('budget-status-text');
    const meterCircle = document.getElementById('budget-meter-circle');
    const limitVal = document.getElementById('budget-limit-val');
    const varianceVal = document.getElementById('budget-variance-val');
    const warningContainer = document.getElementById('budget-warning-container');

    totalCostSpan.textContent = `$${totalCost.toFixed(2)}`;
    limitVal.textContent = `$${limit.toFixed(2)}`;
    varianceVal.textContent = (variance >= 0 ? '+' : '') + `$${variance.toFixed(2)}`;

    warningContainer.innerHTML = '';
    warningContainer.style.display = 'none';

    if (totalCost <= limit) {
      statusTextDiv.className = 'budget-status-pill status-under';
      statusTextDiv.textContent = '🎉 Within Budget';
      meterCircle.className = 'budget-meter under-budget';
      const autoOptBtn = document.getElementById('auto-optimize-btn');
      if (autoOptBtn) autoOptBtn.style.display = 'none';
    } else {
      statusTextDiv.className = 'budget-status-pill status-over';
      statusTextDiv.textContent = '⚠️ Over Budget';
      meterCircle.className = 'budget-meter over-budget';
      const autoOptBtn = document.getElementById('auto-optimize-btn');
      if (autoOptBtn) autoOptBtn.style.display = 'flex';

      const suggestions = [];
      const selectedRecipes = [
        this.state.currentPlan.breakfast,
        this.state.currentPlan.lunch,
        this.state.currentPlan.dinner,
        this.state.currentPlan.snack,
        this.state.currentPlan.beverage
      ].filter(Boolean);

      if (this.state.onboarding.kidsEnabled && this.state.currentPlan.kidsMeal) {
        selectedRecipes.push(this.state.currentPlan.kidsMeal);
      }

      selectedRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
          const swapKey = `${recipe.id}_${ing.name}`;
          const isCurrentlySwapped = !!this.state.swappedIngredients[swapKey];
          
          if (!isCurrentlySwapped && recipe.substitutions && recipe.substitutions[ing.name]) {
            recipe.substitutions[ing.name].forEach(sub => {
              if (sub.priceDiff < 0) {
                suggestions.push({
                  recipeId: recipe.id,
                  recipeName: recipe.name,
                  ingredientName: ing.name,
                  swapTo: sub.name,
                  saving: Math.abs(sub.priceDiff),
                  text: `Swap <strong>${ing.name}</strong> for <strong>${sub.name}</strong> in the ${recipe.name} to save $${Math.abs(sub.priceDiff).toFixed(2)}.`
                });
              }
            });
          }
        });
      });

      if (suggestions.length > 0) {
        warningContainer.style.display = 'block';
        suggestions.sort((a, b) => b.saving - a.saving);
        
        const warningBox = document.createElement('div');
        warningBox.className = 'budget-warning-text';
        warningBox.innerHTML = `
          <strong>Suggested Swaps to Balance Budget:</strong>
          <ul style="margin-top:0.4rem; padding-left:1.1rem; text-align:left; font-size:0.78rem;">
            ${suggestions.slice(0, 3).map(s => `
              <li style="margin-bottom:0.4rem;">
                ${s.text} <button class="btn btn-secondary btn-sm" onclick="app.executeBudgetSwap('${s.recipeId}', '${escapeHtml(s.ingredientName)}', '${escapeHtml(s.swapTo)}', ${-s.saving})" style="padding:0.15rem 0.4rem; font-size:0.7rem; box-shadow:none; line-height:1; display:inline-block; margin-left:0.25rem;">Apply</button>
              </li>
            `).join('')}
          </ul>
        `;
        warningContainer.appendChild(warningBox);
      }
    }
  },

  executeBudgetSwap(recipeId, ingredientName, swapTo, priceDiff) {
    const swapKey = `${recipeId}_${ingredientName}`;
    const allRecipes = window.MoodMealRecipes || [];
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const subList = recipe.substitutions?.[ingredientName] || [];
    const subObj = subList.find(s => s.name === swapTo) || { name: swapTo, priceDiff, macroDiff: "Cost-reduction swap", tag: "cheaper" };

    this.state.swappedIngredients[swapKey] = subObj;

    this.renderMealPlan();
    this.renderGroceryListAndBudget();
    this.renderHarmonyScore();
  },

  // 11. Recipe detail modals
  openRecipeModal(planField) {
    const recipe = this.state.currentPlan[planField];
    if (!recipe) return;

    document.getElementById('recipe-modal-title').textContent = recipe.name;
    document.getElementById('recipe-modal-prep').textContent = `⏱️ ${recipe.prepTime} mins preparation`;
    
    let costAdjustment = 0;
    recipe.ingredients.forEach(ing => {
      const swapKey = `${recipe.id}_${ing.name}`;
      if (this.state.swappedIngredients[swapKey]) {
        costAdjustment += this.state.swappedIngredients[swapKey].priceDiff;
      }
    });
    document.getElementById('recipe-modal-cost').textContent = `💰 $${(recipe.baseCost + costAdjustment).toFixed(2)}`;

    // Macros
    let proteinAdjust = 0;
    let carbsAdjust = 0;
    recipe.ingredients.forEach(ing => {
      const swapKey = `${recipe.id}_${ing.name}`;
      const swap = this.state.swappedIngredients[swapKey];
      if (swap && swap.macroDiff) {
        const diffs = this.getMacroDiffs(swap.macroDiff);
        proteinAdjust += diffs.pDiff;
        carbsAdjust += diffs.cDiff;
      }
    });
    document.getElementById('recipe-modal-macros').textContent = `💪 ${recipe.protein + proteinAdjust}g P / ${recipe.carbs + carbsAdjust}g C`;

    document.getElementById('recipe-modal-nut').textContent = recipe.nutritionNotes;
    
    const ayurText = document.getElementById('recipe-modal-ayur');
    if (this.state.onboarding.ayurvedicEnabled && recipe.ayurvedicNotes) {
      ayurText.style.display = 'block';
      ayurText.textContent = `Ayurvedic Insight: ${recipe.ayurvedicNotes}`;
    } else {
      ayurText.style.display = 'none';
    }

    // Ingredients
    const ingList = document.getElementById('recipe-modal-ingredients');
    ingList.innerHTML = '';
    recipe.ingredients.forEach(ing => {
      const li = document.createElement('li');
      const swapKey = `${recipe.id}_${ing.name}`;
      const swap = this.state.swappedIngredients[swapKey];
      
      if (swap) {
        li.innerHTML = `
          <span>
            <strong style="text-decoration: line-through; color: var(--text-muted); font-weight:normal;">${ing.name}</strong> 
            ➡️ <span style="font-weight:600; color:var(--accent-green);">${swap.name}</span>
          </span>
          <span style="color:var(--text-muted); font-size:0.85rem;">(${ing.amount})</span>
        `;
      } else {
        li.innerHTML = `
          <span>${ing.name}</span>
          <span style="color:var(--text-muted); font-size:0.85rem;">(${ing.amount})</span>
        `;
      }
      ingList.appendChild(li);
    });

    // Instructions
    const instList = document.getElementById('recipe-modal-instructions');
    instList.innerHTML = '';
    recipe.instructions.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      instList.appendChild(li);
    });

    document.getElementById('recipe-modal').classList.add('active');
  },

  closeRecipeModal() {
    document.getElementById('recipe-modal').classList.remove('active');
  },

  // 12. Substitutions
  openSwapModal(recipeId, ingredientName) {
    const allRecipes = window.MoodMealRecipes || [];
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const subs = recipe.substitutions?.[ingredientName] || [];
    if (subs.length === 0) return;

    document.getElementById('swap-target-name').textContent = ingredientName;
    const container = document.getElementById('swap-options-container');
    container.innerHTML = '';

    const originalCard = document.createElement('div');
    originalCard.className = 'sub-option-card';
    const isOriginalSelected = !this.state.swappedIngredients[`${recipeId}_${ingredientName}`];
    if (isOriginalSelected) {
      originalCard.style.borderColor = 'var(--primary)';
      originalCard.style.backgroundColor = 'var(--primary-light)';
    }
    
    originalCard.innerHTML = `
      <div class="sub-option-info">
        <div class="sub-option-name">
          Original: ${ingredientName}
          ${isOriginalSelected ? `<span class="sub-option-badge">Current</span>` : ''}
        </div>
        <div class="sub-option-desc">Default ingredient settings.</div>
      </div>
      <div class="sub-option-price">$0.00</div>
    `;
    originalCard.onclick = () => {
      delete this.state.swappedIngredients[`${recipeId}_${ingredientName}`];
      this.closeSwapModal();
      this.renderMealPlan();
      this.renderGroceryListAndBudget();
    };
    container.appendChild(originalCard);

    // Substitutions
    subs.forEach(sub => {
      const card = document.createElement('div');
      card.className = 'sub-option-card';
      
      const currentSwap = this.state.swappedIngredients[`${recipeId}_${ingredientName}`];
      const isSelected = currentSwap && currentSwap.name === sub.name;
      if (isSelected) {
        card.style.borderColor = 'var(--primary)';
        card.style.backgroundColor = 'var(--primary-light)';
      }

      const priceSign = sub.priceDiff > 0 ? '+' : '';
      const priceColor = sub.priceDiff > 0 ? 'var(--primary)' : 'var(--accent-green)';
      
      card.innerHTML = `
        <div class="sub-option-info">
          <div class="sub-option-name">
            ${sub.name}
            ${isSelected ? `<span class="sub-option-badge">Current</span>` : ''}
            <span class="sub-option-badge" style="background-color: var(--text-muted); font-size:0.65rem;">${sub.tag}</span>
          </div>
          <div class="sub-option-desc">${sub.macroDiff}</div>
        </div>
        <div class="sub-option-price" style="color: ${priceColor}">${priceSign}$${sub.priceDiff.toFixed(2)}</div>
      `;
      card.onclick = () => {
        this.state.swappedIngredients[`${recipeId}_${ingredientName}`] = sub;
        this.closeSwapModal();
        this.renderMealPlan();
        this.renderGroceryListAndBudget();
      };
      container.appendChild(card);
    });

    document.getElementById('swap-modal').classList.add('active');
  },

  closeSwapModal() {
    document.getElementById('swap-modal').classList.remove('active');
  },

  // Unique Feature 4: Mindful Eating 4-7-8 Breathing Guide
  toggleBreathingExercise() {
    const box = document.getElementById('breathing-exercise-box');
    const toggleBtn = document.getElementById('breathing-toggle-btn');
    const circle = document.getElementById('breathing-circle-inner');
    const statusText = document.getElementById('breathing-status-text');
    const instructions = document.getElementById('breathing-instructions');

    if (this.state.breathingActive) {
      // STOP
      this.state.breathingActive = false;
      clearInterval(this.state.breathingTimer);
      box.style.display = 'none';
      toggleBtn.textContent = 'Start 4-7-8 Breath';
      toggleBtn.classList.remove('btn-secondary');
      circle.className = 'breathing-circle';
      return;
    }

    // START
    this.state.breathingActive = true;
    box.style.display = 'block';
    toggleBtn.textContent = 'Stop Exercise 🛑';
    toggleBtn.classList.add('btn-secondary');

    let count = 0;
    const runCycle = () => {
      // 4s Inhale
      circle.className = 'breathing-circle inhale';
      statusText.textContent = 'Inhale 🌬️';
      instructions.textContent = 'Breathe in slowly through your nose... [4 seconds]';
      
      // 7s Hold
      setTimeout(() => {
        if (!this.state.breathingActive) return;
        circle.className = 'breathing-circle hold';
        statusText.textContent = 'Hold ⏳';
        instructions.textContent = 'Hold your breath. Keep your shoulders relaxed... [7 seconds]';
      }, 4000);

      // 8s Exhale
      setTimeout(() => {
        if (!this.state.breathingActive) return;
        circle.className = 'breathing-circle exhale';
        statusText.textContent = 'Exhale 🍃';
        instructions.textContent = 'Sigh out completely through your mouth... [8 seconds]';
      }, 11000);
    };

    runCycle();
    
    // Cycle runs every 19 seconds (4 + 7 + 8)
    this.state.breathingTimer = setInterval(() => {
      if (this.state.breathingActive) {
        runCycle();
        count++;
        if (count >= 3) { // Stop after 3 cycles (approx 1 minute)
          this.toggleBreathingExercise();
          alert("Nervous system calmed. You are ready to prepare your meal mindfully!");
        }
      }
    }, 19000);
  },

  executeAutoBudgetOptimization() {
    if (!this.state.currentPlan) return;
    
    const selectedRecipes = [
      this.state.currentPlan.breakfast,
      this.state.currentPlan.lunch,
      this.state.currentPlan.dinner,
      this.state.currentPlan.snack,
      this.state.currentPlan.beverage
    ].filter(Boolean);

    if (this.state.onboarding.kidsEnabled && this.state.currentPlan.kidsMeal) {
      selectedRecipes.push(this.state.currentPlan.kidsMeal);
    }

    let appliedCount = 0;

    selectedRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const swapKey = `${recipe.id}_${ing.name}`;
        const isCurrentlySwapped = !!this.state.swappedIngredients[swapKey];
        
        if (!isCurrentlySwapped && recipe.substitutions && recipe.substitutions[ing.name]) {
          let cheapestSub = null;
          recipe.substitutions[ing.name].forEach(sub => {
            if (sub.priceDiff < 0) {
              if (!cheapestSub || sub.priceDiff < cheapestSub.priceDiff) {
                cheapestSub = sub;
              }
            }
          });

          if (cheapestSub) {
            this.state.swappedIngredients[swapKey] = cheapestSub;
            appliedCount++;
          }
        }
      });
    });

    if (appliedCount > 0) {
      this.renderMealPlan();
      this.renderGroceryListAndBudget();
      this.renderHarmonyScore();
      alert(`Applied ${appliedCount} cost-saving swaps! Check your updated shopping list.`);
    } else {
      alert("No additional cost-saving swaps available.");
    }
  },

  rateKidsMeal(score) {
    this.state.kidsTastingScore = score;
    
    if (score === 5) {
      this.state.kidsChefStars += 5;
    } else if (score === 3) {
      this.state.kidsChefStars += 2;
    } else {
      this.state.kidsChefStars += 1;
    }
    
    const stars = this.state.kidsChefStars;
    if (stars >= 25) this.state.kidsChefLevel = '🎓 Executive Kid Chef';
    else if (stars >= 15) this.state.kidsChefLevel = '🍳 Expert Stirrer';
    else if (stars >= 8) this.state.kidsChefLevel = '🔪 Veggie Slicer';
    else if (stars >= 3) this.state.kidsChefLevel = '🥣 Master Masher';
    else this.state.kidsChefLevel = '🌱 Novice Helper';
    
    this.renderMealPlan();
  },

  renderHarmonyScore() {
    if (!this.state.currentPlan) return;

    const plan = this.state.currentPlan;
    const userInputs = {
      mood: this.state.checkIn.mood,
      activity: this.state.checkIn.activity,
      weather: this.state.weather,
      ayurvedicEnabled: this.state.onboarding.ayurvedicEnabled,
      ayurvedicDosha: this.state.onboarding.ayurvedicDosha
    };

    const selectedRecipes = [
      plan.breakfast,
      plan.lunch,
      plan.dinner,
      plan.snack,
      plan.beverage
    ].filter(Boolean);

    if (this.state.onboarding.kidsEnabled && plan.kidsMeal) {
      selectedRecipes.push(plan.kidsMeal);
    }

    let matchCountActivity = 0;
    let matchCountMood = 0;
    let matchCountWeather = 0;
    let matchCountDosha = 0;

    selectedRecipes.forEach(recipe => {
      const recipeExercises = recipe.tags.exercise || [];
      if (userInputs.activity === 'gym' && (recipe.protein >= 20 || recipeExercises.includes('gym'))) matchCountActivity++;
      if (userInputs.activity === 'yoga' && (recipe.tags.dosha?.length > 0 || recipeExercises.includes('yoga'))) matchCountActivity++;
      if (userInputs.activity === 'cardio' && (recipe.carbs >= 45 || recipeExercises.includes('cardio'))) matchCountActivity++;

      const recipeMoods = recipe.tags.mood || [];
      if (recipeMoods.includes(userInputs.mood)) matchCountMood++;

      const recipeWeather = recipe.tags.weather || [];
      const temp = userInputs.weather.temp;
      if (temp > 25 && recipeWeather.includes('hot')) matchCountWeather++;
      if (temp < 15 && recipeWeather.includes('cold')) matchCountWeather++;
      if (userInputs.weather.isRainy && recipeWeather.includes('rainy')) matchCountWeather++;

      if (userInputs.ayurvedicEnabled && userInputs.ayurvedicDosha) {
        if (recipe.tags.dosha?.includes(userInputs.ayurvedicDosha.toLowerCase())) matchCountDosha++;
      }
    });

    let score = 70;
    score += (matchCountActivity * 5);
    score += (matchCountMood * 4);
    score += (matchCountWeather * 3);
    score += (matchCountDosha * 2);

    score = Math.min(99, Math.max(70, score));

    const fill = document.getElementById('harmony-gauge-fill');
    const valText = document.getElementById('harmony-score-val');
    const breakdown = document.getElementById('harmony-breakdown-details');

    if (fill && valText) {
      valText.textContent = `${score}%`;
      const offset = 264 - (264 * score) / 100;
      fill.style.strokeDashoffset = offset;
    }

    if (breakdown) {
      breakdown.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
          <span>🏃 Workout Compatibility</span>
          <strong>${Math.min(100, Math.round((matchCountActivity / selectedRecipes.length) * 100))}%</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
          <span>🧠 Mood Balance</span>
          <strong>${Math.min(100, Math.round((matchCountMood / selectedRecipes.length) * 100))}%</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
          <span>⛅ Weather Thermal Balance</span>
          <strong>${Math.min(100, Math.round((matchCountWeather / selectedRecipes.length) * 100))}%</strong>
        </div>
        ${userInputs.ayurvedicEnabled ? `
        <div style="display:flex; justify-content:space-between;">
          <span>🕉️ Dosha (${userInputs.ayurvedicDosha.toUpperCase()}) Affinity</span>
          <strong>${Math.min(100, Math.round((matchCountDosha / selectedRecipes.length) * 100))}%</strong>
        </div>
        ` : ''}
      `;
    }
  },

  getPlaylistForMood(mood) {
    const tracks = {
      stressed: [
        { title: "Sandalwood Incense Breath", artist: "Himalayan Flutes", duration: "4:20" },
        { title: "Gentle Rain Reflection", artist: "Zen Garden Spa", duration: "3:45" }
      ],
      'low-energy': [
        { title: "Morning Sunrays", artist: "Citrus Acoustic Duo", duration: "3:10" },
        { title: "Sparkling Water Beats", artist: "Vibe Reviver", duration: "2:55" }
      ],
      celebratory: [
        { title: "Avocado Salsa Shuffle", artist: "The Kitchen Congas", duration: "4:05" },
        { title: "Pan Sizzle Funk", artist: "Gastronomy Groove", duration: "3:30" }
      ],
      lazy: [
        { title: "Slow Drip Espresso", artist: "Coffee Shop Lo-Fi", duration: "3:15" },
        { title: "Baking Sheets Warmth", artist: "Chill Cook", duration: "3:00" }
      ],
      motivated: [
        { title: "Fast-Paced Veggie Chop", artist: "Techno Chef", duration: "3:50" },
        { title: "High Fire Simmer", artist: "Energy Kitchen", duration: "4:15" }
      ],
      'under-the-weather': [
        { title: "Eucalyptus Warm Tea", artist: "Cozy Jazz Quartet", duration: "4:40" },
        { title: "Steam Inhalation Comfort", artist: "Acoustic Rain", duration: "3:25" }
      ]
    };
    return tracks[mood] || [
      { title: "Culinary Harmony", artist: "MoodMeal Ensemble", duration: "3:30" },
      { title: "Spiceland Waltz", artist: "Ayurveda Lounge", duration: "4:00" }
    ];
  },

  renderPlaylistPlayer() {
    const mood = this.state.checkIn.mood || 'stressed';
    const tracks = this.getPlaylistForMood(mood);
    
    if (!this.state.playlist.isPlaying) {
      const idx = this.state.playlist.currentTrackIndex;
      const track = tracks[idx] || tracks[0];
      
      document.getElementById('music-title').textContent = track.title;
      document.getElementById('music-artist').textContent = track.artist;
      document.getElementById('music-time-total').textContent = track.duration;
      document.getElementById('music-time-curr').textContent = '0:00';
      document.getElementById('music-progress').style.width = '0%';
    }
  },

  toggleMusic() {
    const playBtn = document.getElementById('music-play-toggle');
    const vinyl = document.getElementById('music-vinyl-disc');
    const eq = document.getElementById('music-eq');
    
    if (this.state.playlist.isPlaying) {
      this.state.playlist.isPlaying = false;
      if (playBtn) playBtn.textContent = '▶️';
      if (vinyl) vinyl.classList.remove('spinning');
      if (eq) eq.classList.remove('active');
      clearInterval(this.state.playlist.timer);
    } else {
      this.state.playlist.isPlaying = true;
      if (playBtn) playBtn.textContent = '⏸️';
      if (vinyl) vinyl.classList.add('spinning');
      if (eq) eq.classList.add('active');
      
      const mood = this.state.checkIn.mood || 'stressed';
      const tracks = this.getPlaylistForMood(mood);
      const track = tracks[this.state.playlist.currentTrackIndex] || tracks[0];
      
      const parts = track.duration.split(':');
      const totalSecs = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      
      this.state.playlist.timer = setInterval(() => {
        this.state.playlist.progress += 1;
        if (this.state.playlist.progress >= totalSecs) {
          this.state.playlist.progress = 0;
          this.nextTrack();
          return;
        }
        
        const currMins = Math.floor(this.state.playlist.progress / 60);
        const currSecs = this.state.playlist.progress % 60;
        document.getElementById('music-time-curr').textContent = `${currMins}:${currSecs < 10 ? '0' : ''}${currSecs}`;
        
        const pct = (this.state.playlist.progress / totalSecs) * 100;
        document.getElementById('music-progress').style.width = `${pct}%`;
      }, 1000);
    }
  },

  nextTrack() {
    const mood = this.state.checkIn.mood || 'stressed';
    const tracks = this.getPlaylistForMood(mood);
    
    this.state.playlist.currentTrackIndex = (this.state.playlist.currentTrackIndex + 1) % tracks.length;
    this.state.playlist.progress = 0;
    
    if (this.state.playlist.isPlaying) {
      clearInterval(this.state.playlist.timer);
      this.state.playlist.isPlaying = false;
      this.toggleMusic();
    } else {
      this.renderPlaylistPlayer();
    }
  },

  prevTrack() {
    const mood = this.state.checkIn.mood || 'stressed';
    const tracks = this.getPlaylistForMood(mood);
    
    this.state.playlist.currentTrackIndex = (this.state.playlist.currentTrackIndex - 1 + tracks.length) % tracks.length;
    this.state.playlist.progress = 0;
    
    if (this.state.playlist.isPlaying) {
      clearInterval(this.state.playlist.timer);
      this.state.playlist.isPlaying = false;
      this.toggleMusic();
    } else {
      this.renderPlaylistPlayer();
    }
  },

  seekMusic(event) {
    const bar = event.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const pct = clickX / rect.width;
    
    const mood = this.state.checkIn.mood || 'stressed';
    const tracks = this.getPlaylistForMood(mood);
    const track = tracks[this.state.playlist.currentTrackIndex] || tracks[0];
    
    const parts = track.duration.split(':');
    const totalSecs = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    
    this.state.playlist.progress = Math.floor(pct * totalSecs);
    
    const currMins = Math.floor(this.state.playlist.progress / 60);
    const currSecs = this.state.playlist.progress % 60;
    document.getElementById('music-time-curr').textContent = `${currMins}:${currSecs < 10 ? '0' : ''}${currSecs}`;
    document.getElementById('music-progress').style.width = `${pct * 100}%`;
  }
};

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
