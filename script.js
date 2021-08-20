// Cibler les élements

const recipeCard = document.getElementById('recipeCard');
const ingredientList = document.getElementById('ingredientList');
const applianceList = document.getElementById('applianceList');
const ustensilsList = document.getElementById('ustensilsList');
const nodeSelectedTags = document.querySelector(".selectedTags");
const searchMain = document.getElementById('search');
const searchByTagIngredient = document.getElementById('ingredients');
const searchByTagAppliance = document.getElementById('appliance');
const searchByTagUstensil = document.getElementById('ustensils');

let recipes = [];
let recipesFiltred = [];
let recipesIngredients = [];  
let recipesApplliances = [];
let recipesUstensils = [];
let reinitialisedRecipes = [];
let reinitialisedIngredients = [];
let reinitialisedAppliances= [];
let reinitialisedUstensils = [];
let tagsSelectedIngredientLabel = [];
let tagsSelectedApplianceLabel = [];
let tagsSelectedUstensilLabel = [];
let action = "add";

// // API REQUEST
const fetchRecipes = async() => {

    recipes = await fetch('./json/recipes.json').then(res => res.json());
    reinitialisedRecipes = [...recipes];
    recipesIngredientsArray();
    recipesAppliancesArray();
    recipesUstensilsArray();
    showRecipes();
};
fetchRecipes();


// Filtrer les recttes par rapport à la recherche principal.
let searchMainValue = "";
searchMain.addEventListener("input", () => {
    searchMainValue = searchMain.value.toLowerCase();
    if (searchMainValue.length >= 3) {
        recipesFiltred = reinitialisedRecipes.filter(recipe => (
            recipe.name.toLowerCase().includes(searchMainValue)
            ||
            recipe.description.toLowerCase().includes(searchMainValue)
            || 
            recipe.ingredients
                .some(ingredientsObject => ingredientsObject.ingredient.toLowerCase().includes(searchMainValue))
        ))
        recipes = recipesFiltred;
    } else {
        recipes = reinitialisedRecipes;
    }
    showRecipes();
    recipesIngredientsArray();
    recipesAppliancesArray();
    recipesUstensilsArray();
})

// Filter les recettes par rapport aux tags.
const filterRecipesByTags = (tagLabel, type, action) => {
    if ( action == "add") {
        if (type == "ingredients") {
            tagsSelectedIngredientLabel.push(tagLabel.toLowerCase());
        } else if (type == "appareils") {
            tagsSelectedApplianceLabel.push(tagLabel.toLowerCase());
        } else if (type == "ustensils") {
            tagsSelectedUstensilLabel.push(tagLabel.toLowerCase());
        }
    } else if ( action == "remove") {
        if (type == "ingredients") {
            tagsSelectedIngredientLabel = tagsSelectedIngredientLabel.filter(tag => tag !== tagLabel.toLowerCase());
        } else if (type == "appareils") {
            tagsSelectedApplianceLabel = tagsSelectedApplianceLabel.filter(tag => tag !== tagLabel.toLowerCase());
        } else if (type == "ustensils") {
            tagsSelectedUstensilLabel = tagsSelectedUstensilLabel.filter(tag => tag !== tagLabel.toLowerCase());
        }
    }
    recipes = reinitialisedRecipes.filter(recipe => (
        tagsSelectedIngredientLabel.every(tag => recipe.ingredients.some(ingredientsObject =>  ingredientsObject.ingredient.toLowerCase().includes(tag)
        ))
        &&
        tagsSelectedApplianceLabel.every(tag => recipe.appliance.toLowerCase().includes(tag))
        &&
        tagsSelectedUstensilLabel.every(tag => recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(tag)))
    ))
    showRecipes();
    recipesIngredientsArray();
    recipesAppliancesArray();
    recipesUstensilsArray();
}


// Récupérer le tableau des ingrédients.
const recipesIngredientsArray = () => {
    // Regrouper tous les ingredients dans un tableau.
    recipesIngredients = recipes.map(recipe => recipe.ingredients
                            .map(ingredientsObject => ingredientsObject.ingredient))
                            .flat();
    // Retirer les doublons 
    recipesIngredients = recipesIngredients.filter( (ele,pos)=>recipesIngredients.indexOf(ele) == pos);
    // Trier le tableau par ordre alphabétique. 
    recipesIngredients = recipesIngredients.sort((a, b) => {
        return a.localeCompare(b);
    }) 
    // Filtrer les ingredients si un tag est sélectionné.
    if (tagsSelectedIngredientLabel.length > 0) {
        tagsSelectedIngredientLabel.forEach(tagLabel => {
            recipesIngredients = recipesIngredients.filter(ingredient => 
                ingredient.toLowerCase() !== tagLabel);
        })
    }
    reinitialisedIngredients = [...recipesIngredients];    
    showIngredients();
}
// Récupérer le tableau des appareils.
const recipesAppliancesArray = () => {
    // Regrouper tous les appareils dans un tableau.
    recipesAppliances = recipes.map(recipe => recipe.appliance);
    // Retirer les doublons
    recipesAppliances = recipesAppliances.filter( (ele,pos)=>recipesAppliances.indexOf(ele) == pos);
    // Trier le tableau par ordre alphabétique.
    recipesAppliances = recipesAppliances.sort((a, b) => {
        return a.localeCompare(b);
    })
    // Filtrer les appareils si un tag est sélectionné.
    if (tagsSelectedApplianceLabel.length > 0) {
        tagsSelectedApplianceLabel.forEach(tagLabel => {
            recipesAppliances = recipesAppliances.filter(appliance => 
                appliance.toLowerCase() !== tagLabel);
        })
    }
    reinitialisedAppliances = [...recipesAppliances];
    showAppliances();              
}
// Récupérer le tableau des ustensiles.
const recipesUstensilsArray = () => {
    // Regrouper tous les appareils dans un tableau.
    recipesUstensils = recipes.map(recipe => recipe.ustensils).flat();
    // Retirer les doublons
    recipesUstensils = recipesUstensils.filter( (ele,pos)=>recipesUstensils.indexOf(ele) == pos);
    // Trier le tableau par ordre alphabétique.
    recipesUstensils = recipesUstensils.sort((a, b) => {
        return a.localeCompare(b);
    })
    // Filtrer les ustensils si un tag est sélectionné
    if (tagsSelectedUstensilLabel.length > 0) {
        tagsSelectedUstensilLabel.forEach(tagLabel => {
            recipesUstensils = recipesUstensils.filter(ustensil => 
                ustensil.toLowerCase() !== tagLabel);
        })
    }
    reinitialisedUstensils = [...recipesUstensils];
    showUstensils();              
}


// Filtrer les ingredients par rapport à la recherche ingrédient. 
let searchByTagIngredientValue = "";
searchByTagIngredient.addEventListener("input", () => {
    searchByTagIngredientValue = searchByTagIngredient.value.toLowerCase();

    recipesIngredients = reinitialisedIngredients
                            .filter(recipesIngredient => recipesIngredient.toLowerCase().includes(searchByTagIngredientValue));
    showIngredients();
})
// Filtrer les appareils par rapport à la recherche appareil.
let searchByTagApplianceValue = "";
searchByTagAppliance.addEventListener("input", () => {
    searchByTagApplianceValue = searchByTagAppliance.value.toLowerCase();

    recipesAppliances = reinitialisedAppliances
                            .filter(recipesAppliance => recipesAppliance.toLowerCase().includes(searchByTagApplianceValue));
    showAppliances();
})
// Filtrer les ustensils par rapport à la recherche ustensil.
let searchByTagUstensilValue = ""; 
searchByTagUstensil.addEventListener("input", () => {
    searchByTagUstensilValue = searchByTagUstensil.value.toLowerCase();

    recipesUstensils = reinitialisedUstensils
                            .filter(recipesUstensil => recipesUstensil.toLowerCase().includes(searchByTagUstensilValue));
    showUstensils();
})


// Ouvrir ou fermer le filtre par Ingredient, Appareil ou Ustensiles
const filterContainer = document.querySelectorAll(".filters-bloc");
const toggleBtnsFilter = (e) => {
    filterContainer.forEach(element => {
        if (element.contains(e.target)) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
            searchByTagIngredient.value = "";
            searchByTagAppliance.value = "";
            searchByTagUstensil.value = ""; 
        }
    });
} 
document.body.addEventListener("click",toggleBtnsFilter);

// Afficher et supprimer le tagSelected.
let tagsSelected = [];
const addTag = (tag, type) => {
    if (type == "ingredients") {
        tagsSelected.push({label:tag, background:"#3282F7", type:"ingredients"});
    } else if (type == "appareils") {
        tagsSelected.push({label:tag, background:"#68D9A4", type:"appareils"});
    } else if (type == "ustensils") {
        tagsSelected.push({label:tag, background:"#ED6454", type:"ustensils"});
    }
    nodeSelectedTags.innerHTML = (
        tagsSelected
            .map(tagSelected => (
                `
                <span class="tag" style="background:${tagSelected.background};">${tagSelected.label}</span>
                `
           )).join('')
    )
    const tagsDisplayed = document.querySelectorAll(".tag")
    tagsDisplayed.forEach(tag => {
        tag.addEventListener("click", () => {
            // Supprimer le tag et appeler la fonction "filterRecipesByTags" pour refiltrer les recettes 
            tag.remove();
            tagsSelected.forEach(tagSelected => {
                if (tagSelected.label == tag.innerText && tagSelected.type == "ingredients") {
                    filterRecipesByTags(tag.innerText, "ingredients", "remove");
                } else if (tagSelected.label == tag.innerText && tagSelected.type == "appareils") {
                    filterRecipesByTags(tag.innerText, "appareils", "remove");
                } else if (tagSelected.label == tag.innerText && tagSelected.type == "ustensils") {
                    filterRecipesByTags(tag.innerText, "ustensils", "remove");
                }
            })
            tagsSelected = tagsSelected.filter(tagSelected => tagSelected.label !== tag.innerText);
            // Vider le champs de la recherche principal si tous les tags sont supprimés.
            if (tagsSelectedIngredientLabel.length === 0 && tagsSelectedApplianceLabel.length === 0 && tagsSelectedUstensilLabel.length === 0) {
                searchMain.value = "";
            }
        });
    });
}


// Afficher la liste des ingredients
const showIngredients = () => {    
    recipesIngredientsHtml = recipesIngredients 
                                .map(ingredient => (
                                `
                                <li class="li-ingredient">${ingredient}</li>
                                
                                ` 
                                )).join('');
    ingredientList.innerHTML = (
        recipesIngredientsHtml
    )      
    // récupérer l'ingredient cliquer et l'ajouter au tableau tagsSelected
    const tags = document.querySelectorAll(".filters-bloc li.li-ingredient");
    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            addTag(tag.innerText, "ingredients");
            filterRecipesByTags(tag.innerText, "ingredients", "add");
        });
    });
}



// Afficher la liste des appareils
const showAppliances = () => {
    recipesAppliancesHtml = recipesAppliances
                                .map(appliance => (
                                    `
                                    <li class="li-appliance">${appliance}</li>
                                    `
                                )).join('');
    applianceList.innerHTML = (
        recipesAppliancesHtml
    )
    // récupérer l'appareil cliquer et l'ajouter au tableau tagsSelected
    const tags = document.querySelectorAll(".filters-bloc li.li-appliance");
    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            addTag(tag.innerText, "appareils");
            filterRecipesByTags(tag.innerText, "appareils", "add");
        });
    });
}


// Afficher la liste des ustensiles
const showUstensils = () => {
    recipesUstensilsHtml =  recipesUstensils
                                .map(ustensil => (
                                    `
                                    <li class="li-ustensil">${ustensil}</li>
                                    `
                                )).join("");
    ustensilsList.innerHTML = (
        recipesUstensilsHtml
    )
    // récupérer l'ustensil cliquer et l'ajouter au tableau tagsSelected
    const tags = document.querySelectorAll(".filters-bloc li.li-ustensil");
    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            addTag(tag.innerText, "ustensils");
            filterRecipesByTags(tag.innerText, "ustensils", "add");
        });
    });
}


// Afficher les recettes.
const showRecipes = () => {
    recipeCard.innerHTML = recipes.length > 0 ? (
        recipes
            .map(recipe => (
                `
                <li class="card" id="${recipe.id}">
                    <div class="card__header"></div>
                    <div class="card__content">
                        <div class="card__content__heading">
                            <h2 class="title">${recipe.name}</h2>
                            <span class="time">${recipe.time} min</span>
                        </div>
                        <div class="card__content__text">
                            <ul class="ingredients">
                            ${recipe.ingredients.map(ingredientObject => (
                                `
                                <li><strong>${ingredientObject.ingredient} ${ingredientObject.quantity ? ':' : ''}</strong> ${ingredientObject.quantity ? ingredientObject.quantity : ''} ${ingredientObject.unit || ''}</li>
                                
                                `
                            )).join('')}
                                
                            </ul>
                            <p class="preparation">
                                ${recipe.description.substr(0, 182)} ${recipe.description.length > 182 ? ' ...' : ''}
                            </p>
                        </div>
                    </div>
                </li>
                `
            )).join('')
    ) : "<p>L’interface affiche : aucune recette ne correspond à votre critère.... vous pouvez chercher 'tarte aux pommes', 'poisson', etc.</p>";
};