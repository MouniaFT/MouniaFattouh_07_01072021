// Cibler les élements.

const recipeCard = document.getElementById('recipeCard');
const ingredientList = document.getElementById('ingredientList');
const applianceList = document.getElementById('applianceList');
const ustensilsList = document.getElementById('ustensilsList');
const nodeSelectedTags = document.querySelector(".selectedTags");
const searchMain = document.getElementById('search');
const searchIngredient = document.getElementById('ingredients');
const searchAppliance = document.getElementById('appliance');
const searchUstensil = document.getElementById('ustensils');


let recipes = [];
let recipesDisplayed = [];
let recipesFiltered = [];
let searchMainValue ;

// // API REQUEST
const fetchRecipes = async() => {
    recipes = await fetch('./json/recipes.json').then(res => res.json());
    recipesFiltered = [...recipes];
    showRecipes();
};
fetchRecipes();


// Ouvrir ou fermer le filtre par Ingredient, Appareil ou Ustensiles.
const filterContainer = document.querySelectorAll(".filters-bloc");
const toggleBtnsFilter = (e) => {
    filterContainer.forEach(element => {
        if (element.contains(e.target)) {
            element.classList.add('active');

        } else {
            element.classList.remove('active')
            searchIngredient.value = "";
            searchAppliance.value = "";
            searchUstensil.value = "";
            showIngredients();
            showAppliance();
            showUstensils();
        }
    });
}; 
document.body.addEventListener("click",toggleBtnsFilter);


// Ajouter un tag au dessus du filtre ingredients, appareils, ustensils.
let tagsIngredientsSelected = [];
let tagsAppliancesSelected = [];
let tagsUstensilsSelected = [];

const addTag = (tag, type) => {
    if (type == "ingredients") {
        tagsIngredientsSelected.push({label:tag, background:"#3282F7"});
    } else if (type == "appareils") {
        tagsAppliancesSelected.push({label:tag, background:"#68D9A4"});
    } else if (type == "ustensils") {
        tagsUstensilsSelected.push({label:tag, background:"#ED6454"});
    }
    
    // Afficher le tag au dessus du filtre ingredients, appareils, ustensils. 
    const tagsIngredientsHtml = tagsIngredientsSelected 
            .map(tagSelected => (
                `
                <span class="tag" style="background:${tagSelected.background};">${tagSelected.label}</span>
                `
            )).join('');
    const tagsAplliancesHtml = tagsAppliancesSelected 
            .map(tagSelected => (
                `
                <span class="tag" style="background:${tagSelected.background};">${tagSelected.label}</span>
                `
            )).join('');
    const tagsUstensilsHtml = tagsUstensilsSelected 
            .map(tagSelected => (
                `
                <span class="tag" style="background:${tagSelected.background};">${tagSelected.label}</span>
                `
            )).join('');
    nodeSelectedTags.innerHTML = 
            `
            ${tagsIngredientsHtml}
            ${tagsAplliancesHtml}
            ${tagsUstensilsHtml}
            `;
    filtreRecipesByTag();
    showRecipes();
    showIngredients();
    showAppliance();
    showUstensils();
};


// Supprimer le tag sélectionné et filtrer le tableau des tags Selected. 
const removeTag = (tag) => {
    tagsIngredientsSelected = tagsIngredientsSelected.filter(tagSelected => tagSelected.label !== tag.innerText);
    tagsAppliancesSelected = tagsAppliancesSelected.filter(tagSelected => tagSelected.label !== tag.innerText);
    tagsUstensilsSelected = tagsUstensilsSelected.filter(tagSelected => tagSelected.label !== tag.innerText);

    tag.remove();
    if (tagsIngredientsSelected.length === 0  && tagsAppliancesSelected.length === 0 && tagsUstensilsSelected.length === 0) {
         searchMainValue  = "";
         searchMain.value = "";
    }

    recipesFiltered = searchMainValue ? recipes.filter( recipe => (
        recipe.name.toLowerCase().includes(searchMainValue) 
        ||
        recipe.description.toLowerCase().includes(searchMainValue)
        ||
        recipe.ingredients.some(objet => objet.ingredient.toLowerCase().includes(searchMainValue))
    )): recipes;
    filtreRecipesByTag();
    showRecipes();
    showIngredients();
    showAppliance();
    showUstensils();
};


// la recherche principal. 
searchMain.addEventListener("input", () => {
    searchMainValue = searchMain.value.toLowerCase();
    
    if ( searchMainValue.length >= 3 || searchMainValue.length === 0 ) {
        showRecipes();// J'affiche tous les recettes et après je supprime les recettes qui ne correspondent pas à la condition.
        // Filter les recettes par rapport à la valeur de la recherche principal.
        recipes.forEach((recipe) => {
            if ((!recipe.name.toLowerCase().includes(searchMainValue)) && (!recipe.description.toLowerCase().includes(searchMainValue)) && (!recipe.ingredients.some(objet => objet.ingredient.toLowerCase().includes(searchMainValue)))) {
                // Supprimer les recettes qui correspondent pas à la recherche.
                const recipeToRemove = document.getElementById(recipe.id);
                if (recipeToRemove !== null) {
                    document.getElementById('recipeCard').removeChild(recipeToRemove);
                }
            } 
        })
        showIngredients();
        showAppliance();
        showUstensils();
    }  
});


// filtrer les recettes par rapport à la recherche par tag.
const filtreRecipesByTag = () => {
    const tagsIngredientsLabelArray = tagsIngredientsSelected
                            .map(tagSelected => tagSelected.label.toLowerCase());
    const tagsAppliancesLabelArray = tagsAppliancesSelected
                            .map(tagSelected => tagSelected.label.toLowerCase());                     
    const tagsUstensilsLabelArray = tagsUstensilsSelected
                            .map(tagSelected => tagSelected.label.toLowerCase());
    
    let recipesDisplayed = (tagsIngredientsSelected.length > 0 || tagsAppliancesSelected.length > 0 || tagsUstensilsSelected.length > 0)
        ? recipesFiltered 
        : recipes
    
    recipesFiltered = recipesDisplayed.filter(recipe => (
        tagsIngredientsLabelArray.every(tag => recipe.ingredients.some(objet => objet.ingredient.toLowerCase().includes(tag)))
        &&
        tagsAppliancesLabelArray.every(tag => recipe.description.toLowerCase().includes(tag) || recipe.appliance.toLowerCase().includes(tag ))
        &&
        tagsUstensilsLabelArray.every(tag => recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(tag)))
        
    ));
};



//************************  Afficher les recettes  ************************//
const showRecipes = () => {
    let recipesDisplayed = recipesFiltered || recipes;
    recipeCard.innerHTML = (
        recipesDisplayed.length === 0 
            ? `<div>Aucune recette ne correspond à votre critère… vous pouvez
            chercher « tarte aux pommes », « poisson », etc.</div>` 
            : recipesDisplayed
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
    );
};
showRecipes();


//************************  Afficher la liste des ingredients  ************************//
let uniqueIngredientsArray
const showIngredients = () => {
    const searchIngredientValue = searchIngredient.value.toLowerCase();

    recipesFiltered = (tagsIngredientsSelected.length === 0 && tagsAppliancesSelected.length === 0 && tagsUstensilsSelected.length === 0)
    ? recipes
    : recipesFiltered;

    recipesFiltered = searchMainValue && tagsIngredientsSelected.length === 0 && tagsAppliancesSelected.length === 0 && tagsUstensilsSelected.length === 0? recipes.filter( recipe => (
        recipe.name.toLowerCase().includes(searchMainValue) 
        ||
        recipe.description.toLowerCase().includes(searchMainValue)
        ||
        recipe.ingredients.some(objet => objet.ingredient.toLowerCase().includes(searchMainValue))
    )): recipesFiltered;
 
    recipesDisplayed = recipesFiltered ||  recipes ;
    
    uniqueIngredientsArray = recipesDisplayed
        .map(recipe => recipe.ingredients
                        .map(object => object.ingredient)
        )
        .flat();
        
    // retirer les doublons des ingredients + les triés par ordre alphabéthique
    uniqueIngredientsArray = [...new Set(uniqueIngredientsArray)].sort((a, b) => {
        return a.localeCompare(b)
    })
    
    // filter les ingredients par rapport à la recherhe 
    const ingredientsFiltered = uniqueIngredientsArray.filter((ingredient) => {
        return ingredient.toLowerCase().includes(searchIngredientValue) 
    })
   
    let ingredientsDisplayed = searchIngredientValue.length > 0 
        ? ingredientsFiltered 
        : uniqueIngredientsArray;
    
    const ingredientsHtml = // Afficher les ingredients 
    ingredientsFiltered.length === 0 && searchIngredient.value !== ""
        ? `<div>Aucun ingrédient ne correspond à votre recherche</div>`
        : ingredientsDisplayed
        .filter(ingredient => {
            return !tagsIngredientsSelected.map(tag => tag.label.toLowerCase()).includes(ingredient.toLowerCase())
        })
        .map(ingredient => (
            `
            <li class="li-ingredient">${ingredient}</li>
            ` 
        )).join('');
        
    ingredientList.innerHTML = (
        ingredientsHtml
    );
        
    // Récupérer l'ingrédient séléctionné
    const tags = document.querySelectorAll(".filters-bloc li.li-ingredient");
    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            // Afficher le tag et l'ajouter au tableau tagsSelected 
            addTag(tag.innerText, "ingredients");
        });
    });

    // Supprimer le tag sélectionné
    const tagsDisplayed = document.querySelectorAll(".tag");
    tagsDisplayed.forEach(tag => {
        tag.addEventListener("click", () => {
            // Supprimer le tag du tableau tagsSelected 
            removeTag(tag);
        });
    });
}
showIngredients();
searchIngredient.addEventListener("input", showIngredients);




//************************  Afficher la liste des appareils  ************************//
let uniqueAppliancesArray
const showAppliance = () => {
    const searchApplianceValue = searchAppliance.value.toLowerCase();

    recipesFiltered = (tagsIngredientsSelected.length === 0 && tagsAppliancesSelected.length === 0 && tagsUstensilsSelected.length === 0)
    ? recipes
    : recipesFiltered;

    recipesFiltered = searchMainValue && tagsIngredientsSelected.length === 0 && tagsAppliancesSelected.length === 0 && tagsUstensilsSelected.length === 0 ? recipes.filter( recipe => (
        recipe.name.toLowerCase().includes(searchMainValue) 
        ||
        recipe.description.toLowerCase().includes(searchMainValue)
        ||
        recipe.ingredients.some(objet => objet.ingredient.toLowerCase().includes(searchMainValue))
    )): recipesFiltered;

    recipesDisplayed = recipesFiltered === undefined ? recipes : recipesFiltered;
        
    uniqueAppliancesArray = recipesDisplayed
        .map( recipe => recipe.appliance);

    // retirer les doublons des appareils + les triés par ordre alphabéthique
    uniqueAppliancesArray = [...new Set(uniqueAppliancesArray)].sort((a, b) => {
        return a.localeCompare(b)
    })

    // filter les appareils par rapport à la recherhe 
    const appliancesFiltered = uniqueAppliancesArray.filter((appliance) => {
        return appliance.toLowerCase().includes(searchApplianceValue)
    })
   
    let appliancesDisplayed = searchApplianceValue.length > 0
        ? appliancesFiltered
        : uniqueAppliancesArray;
    
    const appliancesHtml = // Afficher les appareils
    appliancesFiltered.length === 0 && searchAppliance.value !== ""
        ? `<div>Aucun appreil ne correspond à votre recherche</div>`
        : appliancesDisplayed
        .filter( appliance => { 
            return !tagsAppliancesSelected.map(tag => tag.label.toLowerCase()).includes(appliance.toLowerCase()) 
        })
        .map(appliance => (
            `
            <li class="li-appliance">${appliance}</li>
            `
        )).join('');
    applianceList.innerHTML = (
        appliancesHtml
    );

    // Récupérer l'appreil séléctionné 
    const tags = document.querySelectorAll(".filters-bloc li.li-appliance");
    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            // Afficher le tag et l'ajouter au tableau tagsSelected 
            addTag(tag.innerText, "appareils");
        });
    });

    // Supprimer le tag sélectionné
    const tagsDisplayed = document.querySelectorAll(".tag");
    tagsDisplayed.forEach(tag => {
        tag.addEventListener("click", () => {
            // Supprimer le tag du tableau tagsSelected 
            removeTag(tag);
        });
    });
}
showAppliance();
searchAppliance.addEventListener("input", showAppliance);




//************************  Afficher la liste des ustensiles  ************************//
let uniqueUstensilsArray;
const showUstensils = () => {
    const searchUstensilValue = searchUstensil.value.toLowerCase();

    recipesFiltered = (tagsIngredientsSelected.length === 0 && tagsAppliancesSelected.length === 0 && tagsUstensilsSelected.length === 0)
    ? recipes
    : recipesFiltered;

    recipesFiltered = searchMainValue && tagsIngredientsSelected.length === 0 && tagsAppliancesSelected.length === 0 && tagsUstensilsSelected.length === 0 ? recipes.filter( recipe => (
        recipe.name.toLowerCase().includes(searchMainValue) 
        ||
        recipe.description.toLowerCase().includes(searchMainValue)
        ||
        recipe.ingredients.some(objet => objet.ingredient.toLowerCase().includes(searchMainValue))
    )): recipesFiltered;

    recipesDisplayed = recipesFiltered === undefined ? recipes : recipesFiltered;

    uniqueUstensilsArray = recipesDisplayed
        .map( recipe => recipe.ustensils)
        .flat()// créer un nouveau tableau avec les éléments des sous-tableaux
    // retirer les doublons des appareils + les triés par ordre alphabéthique
    uniqueUstensilsArray = [...new Set(uniqueUstensilsArray)].sort((a, b) => {
        return a.localeCompare(b)
    })

    // filter les ustensils par rapport à la recherhe 
    const ustensilsFiltered = uniqueUstensilsArray.filter((ustensil) => {
        return ustensil.toLowerCase().includes(searchUstensilValue)
    })

    let ustensilsDisplayed = searchUstensilValue.length > 0 
        ? ustensilsFiltered
        : uniqueUstensilsArray;
            
    const ustensilsHtml = // Afficher les ustensiles 
    ustensilsFiltered.length === 0 && searchUstensil.value !== ""
        ? `<div>Aucun ustensil ne correspond à votre recherche</div>`
        : ustensilsDisplayed
        .filter(ustensil => { 
            return !tagsUstensilsSelected.map(tag => tag.label.toLowerCase()).includes(ustensil.toLowerCase()) 
        })
        .map(ustensil => (
            `
            <li class="li-ustensil">${ustensil}</li>
            `
        )).join("");
    ustensilsList.innerHTML = (
        ustensilsHtml
    );

    // Récupérer l'ustensil séléctionné 
    const tags = document.querySelectorAll(".filters-bloc li.li-ustensil");
    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            // Afficher le tag et l'ajouter au tableau tagsSelected 
            addTag(tag.innerText, "ustensils");
        });
    });

    // Supprimer le tag sélectionné
    const tagsDisplayed = document.querySelectorAll(".tag")
    tagsDisplayed.forEach(tag => {
        tag.addEventListener("click", () => {
            // Supprimer le tag du tableau tagsSelected 
            removeTag(tag);
        });
    });
}
showUstensils();
searchUstensil.addEventListener("input", showUstensils);
