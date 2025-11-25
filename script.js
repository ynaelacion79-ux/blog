// Navigation between sections
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".content-section");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("data-target");

    // Toggle active nav
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    // Show section
    sections.forEach(section => {
      section.classList.remove("active");
      if (section.id === target) {
        section.classList.add("active");
      }
    });
  });
});

// Category buttons
const categoryBtns = document.querySelectorAll(".category-btn");

categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    // TODO: Filter recipes by category if needed
  });
});

const recipes = {
  "Adobo": {
    ingredients: ["1 kg chicken or pork", "1/2 cup soy sauce", "1/2 cup vinegar", "1 head garlic, minced", "2 bay leaves", "1 tsp peppercorns", "1 cup water", "Salt and pepper to taste"],
    steps: ["Combine meat, soy sauce, vinegar, garlic, bay leaves, and peppercorns in a pot.", "Marinate for at least 30 minutes.", "Bring to a boil, then simmer for 30-40 minutes until meat is tender.", "Add water if needed. Season with salt and pepper.", "Serve hot with rice."]
  },
  "Chop Suey": {
    ingredients: ["2 tbsp oil", "1 onion, sliced", "2 cloves garlic, minced", "1 cup chicken breast, sliced", "1 cup mixed vegetables", "1 tbsp oyster sauce", "1/2 cup water", "Salt and pepper to taste"],
    steps: ["Heat oil in a pan. Sauté onion and garlic.", "Add chicken and cook until no longer pink.", "Add vegetables and stir-fry for 3-5 minutes.", "Add oyster sauce and water. Simmer until veggies are tender.", "Season with salt and pepper. Serve hot."]
  },
  "Halo-Halo": {
    ingredients: ["Shaved ice", "Sweetened beans", "Nata de coco", "Jackfruit", "Leche flan", "Ube halaya", "Evaporated milk", "Sugar", "Ice cream (optional)"],
    steps: ["In a tall glass, layer sweetened beans, nata de coco, jackfruit, and other desired ingredients.", "Add shaved ice on top.", "Pour evaporated milk and sugar over the ice.", "Top with leche flan, ube halaya, and ice cream if desired.", "Mix well before eating."]
  },
  "Kare-Kare": {
    ingredients: ["1 kg oxtail", "1/2 cup peanut butter", "1/4 cup bagoong", "1 onion, chopped", "4 cloves garlic, minced", "1/2 tsp pepper", "1/4 tsp salt", "4 cups water", "1 banana flower, sliced (optional)", "1 cup string beans", "1 cup eggplant, sliced", "1/2 cup peanuts, crushed"],
    steps: ["In a pot, boil oxtail until tender. Remove and set aside.", "In the same pot, sauté onion and garlic until fragrant.", "Add peanut butter and bagoong. Mix well.", "Return oxtail to the pot. Add water, pepper, and salt. Simmer for 30 minutes.", "Add banana flower, string beans, and eggplant. Cook until vegetables are tender.", "Serve hot, garnished with crushed peanuts."]
  },
  "Sinigang": {
    ingredients: ["1 kg pork", "8 cups water", "1 onion, quartered", "2 tomatoes, quartered", "1 radish (labanos), sliced", "1 cup string beans", "2-3 green chili peppers", "1/2 cup tamarind paste", "Fish sauce (patis) to taste", "Salt and pepper to taste", "2 green onions, chopped"],
    steps: ["In a pot, combine pork, water, onion, and tomatoes. Bring to a boil.", "Add radish and green chili peppers. Simmer for 10 minutes.", "Stir in tamarind paste and cook for another 5 minutes.", "Add string beans and cook until tender.", "Season with fish sauce, salt, and pepper to taste.", "Serve hot, garnished with green onions."]
  },
  "Lechon Kawali": {
    ingredients: ["1 kg pork belly", "4 cups water", "1 onion, quartered", "4 cloves garlic, crushed", "2 bay leaves", "1 tsp peppercorns", "Salt to taste", "Oil for frying", "Vinegar and soy sauce (for dipping)"],
    steps: ["In a pot, combine pork belly, water, onion, garlic, bay leaves, peppercorns, and salt.", "Bring to a boil, then simmer for 1.5 to 2 hours until pork is tender.", "Remove pork from the pot and let it cool. Reserve the broth for soup.", "Once cool, score the skin of the pork belly and rub with salt.", "Heat oil in a deep pan. Fry the pork belly, skin side down, until the skin is crispy.", "Flip and fry the meat side until golden brown.", "Drain on paper towels. Serve with vinegar and soy sauce dip."]
  },
  "Pancit Canton": {
    ingredients: ["250g egg noodles", "2 tbsp oil", "2 cloves garlic, minced", "1 onion, sliced", "1 cup chicken breast, sliced", "1 cup shrimp, peeled", "1 cup mixed vegetables", "2 tbsp soy sauce", "1 tbsp oyster sauce", "Salt and pepper to taste", "2 green onions, chopped"],
    steps: ["Soak egg noodles in hot water for 10 minutes. Drain and set aside.", "In a pan, heat oil. Sauté garlic and onion until fragrant.", "Add chicken and shrimp. Cook until no longer pink.", "Add mixed vegetables and stir-fry for 3-5 minutes.", "Add soaked noodles, soy sauce, oyster sauce, salt, and pepper. Toss to combine.", "Cook for another 3-5 minutes until noodles are heated through.", "Serve hot, garnished with green onions."]
  },
  "Lumpiang Shanghai": {
    ingredients: ["500g ground pork", "1 small carrot, grated", "2 cloves garlic, minced", "Spring roll wrappers", "Oil for frying"],
    steps: ["Mix pork, carrot, garlic and seasonings; roll in wrappers.", "Deep-fry until golden and crispy.", "Serve with sweet chili or vinegar dip."]
  },
  "Dinakdakan": {
    ingredients: ["500g pork (cheek, ears, belly) — grilled or boiled then charred", "50g pork liver (optional), diced", "1 small red onion, chopped", "3 tbsp mayonnaise (or mashed grilled pork brain for traditional flavor)", "2 tbsp vinegar or calamansi juice", "1-2 Thai chilies, chopped", "Salt and pepper to taste"],
    steps: ["Grill or boil then char the pork pieces; chop into bite-size pieces.", "If using liver, sauté briefly until cooked and dice.", "Mix pork with onion, mayonnaise (or mashed brain), vinegar/calamansi and chilies.", "Season with salt and pepper. Serve warm or at room temperature."]
  },
  "Tocino": {
    ingredients: ["500g pork shoulder, sliced", "1/2 cup brown sugar", "2 tbsp salt", "2 tbsp pineapple juice (optional)", "1 tsp garlic powder", "Pinch of curing salt (optional)", "Black pepper to taste"],
    steps: ["Mix sugar, salt, pineapple juice, garlic powder and curing salt (if using) to make marinade.", "Coat pork slices in the marinade and refrigerate for 8–12 hours or overnight.", "Pan-fry slices over medium heat (no oil) until caramelized and cooked through. Serve with garlic rice."]
  },
  "Sisig": {
    ingredients: ["500g pork (boiled belly, ears; or lechon kawali), chopped", "100g pork liver, diced (optional)", "1 small red onion, chopped", "2 tbsp soy sauce or patis", "2-3 tbsp calamansi or lemon juice", "1-2 Thai chilies, chopped", "2 tbsp mayonnaise (optional)", "Salt and pepper to taste"],
    steps: ["Char or fry the pork pieces until crispy, then chop finely.", "Sauté liver (if using) and mix with pork, add soy/patis and onions; cook briefly.", "Finish with calamansi, chilies and mayo (if desired). Serve on a sizzling plate and squeeze more calamansi before eating."]
  },
  "Lomi": {
    ingredients: ["250g fresh lomi (thick egg) noodles", "200g pork, sliced", "100g shrimp, peeled", "1 cup cabbage, sliced", "2 cloves garlic, minced", "1 small onion, chopped", "4 cups chicken broth", "2 tbsp cornstarch + water (slurry)", "2 eggs, beaten", "Salt and pepper to taste"],
    steps: ["Sauté garlic, onion and pork until lightly browned.", "Add broth and bring to a boil; add noodles and cook until nearly done.", "Stir in vegetables, then add cornstarch slurry to thicken to a stew-like consistency.", "Slowly stir in beaten eggs and shrimp until cooked. Season and serve hot."]
  },
  "Pancit Habhab": {
    ingredients: ["250g miki or rice noodles", "200g pork (minced or sliced)", "1 small carrot, julienned", "1/2 cup cabbage, shredded", "2 cloves garlic, minced", "1 small onion, chopped", "2 tbsp soy sauce or patis", "Banana leaf (optional, for serving)"],
    steps: ["Sauté garlic and onion, cook pork until done.", "Add carrots and cabbage; stir-fry briefly.", "Add noodles and soy/patis; toss until noodles absorb flavors and are cooked.", "Serve traditionally on banana leaf and eat by hand (habhab)."]
  },
  "Laing": {
    ingredients: ["200g dried taro leaves (dried gabi leaves)", "2 cups coconut milk", "150g pork or shrimp (optional)", "1 onion, chopped", "3 cloves garlic, minced", "2-3 red chilies, sliced", "2 tbsp shrimp paste (bagoong) or salt"],
    steps: ["Sauté garlic and onion; add pork or shrimp if using and cook through.", "Pour in coconut milk and simmer; add chilies.", "Add dried taro leaves in batches, simmer on low until leaves are tender and coconut milk reduces. Season with bagoong to taste."]
  },
  "Arroz Caldo": {
    ingredients: ["1 cup glutinous rice or regular rice", "500g chicken pieces (preferably thigh)", "1 thumb ginger, julienned", "4 cloves garlic, minced", "1 onion, chopped", "6 cups chicken broth", "Fish sauce, salt and pepper to taste", "Fried garlic, chopped scallions and calamansi for topping"],
    steps: ["Sauté garlic, onion and ginger until fragrant.", "Add chicken and rice; stir to coat and toast rice lightly.", "Pour in broth and simmer, stirring occasionally, until rice breaks down and porridge reaches desired thickness.", "Season with fish sauce. Serve topped with fried garlic, scallions and a squeeze of calamansi."]
  },
  "Hanging Rice (Puso)": {
    ingredients: ["2 cups glutinous rice", "2.5 cups water or coconut milk", "1 tsp salt", "Coconut leaves (for wrapping)", "String or twine"],
    steps: ["Rinse rice and cook with water/coconut milk until tender, stirring occasionally.", "Fold coconut leaves into a heart or pyramid shape.", "Fill leaves with cooked rice, fold edges to seal, and tie with string.", "Steam for 10-15 minutes until firm. Serve hot as an accompanying staple."]
  },
  "Chicken Halang-Halang": {
    ingredients: ["500g chicken breast, sliced into long pieces", "2 onions, sliced lengthwise", "2 red bell peppers, sliced lengthwise", "2 tbsp soy sauce", "1 tbsp vinegar", "4 cloves garlic, minced", "1 tbsp butter or oil", "Salt and pepper to taste"],
    steps: ["Thread chicken, onion and peppers alternately on skewers.", "Mix soy sauce, vinegar, garlic, salt and pepper for marinade.", "Brush skewers with marinade and grill over charcoal or under oven broiler until cooked through.", "Baste frequently with butter or oil while grilling."]
  },
  "La Paz Batchoy": {
    ingredients: ["400g miki or egg noodles", "200g pork innards (liver, heart, kidney), diced", "100g pork shoulder, sliced", "50g chicharrón (crispy pork skin), crushed", "1 onion, chopped", "4 cloves garlic, minced", "6 cups pork or chicken broth", "Fish sauce, salt and pepper to taste", "Boiled eggs, sliced (for topping)", "Green onions, chopped (for garnish)"],
    steps: ["Sauté garlic and onion; add pork shoulder and cook until lightly browned.", "Add pork innards and cook until cooked through, about 5-10 minutes.", "Add broth and bring to a boil; add noodles and cook until tender.", "Season with fish sauce, salt and pepper. Serve topped with chicharrón, eggs and green onions."]
  },
  "Binakol": {
    ingredients: ["500g fresh fish (grouper or any firm white fish), whole or cut into large pieces", "2 cups coconut water", "1 thumb ginger, sliced", "1 onion, quartered", "2 green chili peppers", "Fish sauce to taste", "Salt and pepper", "Banana leaves (for wrapping)"],
    steps: ["Place fish on banana leaves, add ginger, onion and chili peppers inside and around.", "Pour coconut water over the fish.", "Fold banana leaves to enclose, securing with toothpicks or string.", "Steam or boil for 30-40 minutes until fish is cooked through. Season with fish sauce."]
  },
  "Chicken Inasal": {
    ingredients: ["1 kg chicken, cut into pieces", "1/2 cup vinegar", "4 cloves garlic, minced", "1 tbsp turmeric powder (or ginger-turmeric paste)", "2 tbsp soy sauce", "1 tbsp brown sugar", "2 tbsp oil", "Salt and pepper to taste", "Calamansi and salt for serving"],
    steps: ["Mix vinegar, garlic, turmeric, soy sauce, sugar, oil, salt and pepper to make marinade.", "Marinate chicken for at least 30 minutes (preferably 2 hours).", "Grill over charcoal or under broiler until cooked through and slightly charred, basting with marinade.", "Serve hot with calamansi and salt for squeezing."]
  },
  "Diwal (Angel Wings Clam)": {
    ingredients: ["500g small clams (diwal), cleaned and shelled", "3 tbsp butter", "6 cloves garlic, minced", "1/4 cup white wine or vinegar", "2 tbsp fish sauce", "Red chili flakes (optional)", "Salt and pepper to taste", "Parsley, chopped (optional)"],
    steps: ["Heat butter in a pan, sauté garlic until fragrant.", "Add clams and cook for 2-3 minutes, stirring occasionally.", "Pour wine/vinegar and fish sauce; cook for another 3-5 minutes until clams open.", "Season with salt, pepper and chili flakes. Garnish with parsley and serve hot with rice."]
  }
};

