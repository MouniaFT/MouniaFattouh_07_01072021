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



let searchMainValue = "";
let searchByTagIngredientValue = "";
let searchByTagApplianceValue = "";
let searchByTagUstensilValue = "";

let recipes = [];
let recipesFiltred = [];
let recipesIngredients = [];  
let recipesApplliances = [];
let recipesUstensils = [];
let reinitialisedRecipes = [];
let reinitialisedIngredients = [];
let reinitialisedAppliances= [];
let reinitialisedUstensils = [];

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
        return a.localeCompare(b)
    })     
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
        return a.localeCompare(b)
    })
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
        return a.localeCompare(b)
    })
    reinitialisedUstensils = [...recipesUstensils];
    showUstensils();              
}


// Filtrer les ingredients par rapport à la recherche ingrédient. 
searchByTagIngredient.addEventListener("input", () => {
    searchByTagIngredientValue = searchByTagIngredient.value.toLowerCase();

    recipesIngredients = reinitialisedIngredients
                            .filter(recipesIngredient => recipesIngredient.toLowerCase().includes(searchByTagIngredientValue));
    showIngredients();
})
// Filtrer les ingredients par rapport à la recherche appareil. 
searchByTagAppliance.addEventListener("input", () => {
    searchByTagApplianceValue = searchByTagAppliance.value.toLowerCase();

    recipesAppliances = reinitialisedAppliances
                            .filter(recipesAppliance => recipesAppliance.toLowerCase().includes(searchByTagApplianceValue));
    showAppliances();
})
// Filtrer les ingredients par rapport à la recherche ustensil. 
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
            element.classList.add('active')
            
        } else {
            element.classList.remove('active')
        }
    });
} 
document.body.addEventListener("click",toggleBtnsFilter);

// Afficher le tag 
let tagsSelected = []
const addTag = (tag, type) => {
    if (type == "ingredients") {
        tagsSelected.push({label:tag, background:"#3282F7"});
    } else if (type == "appareils"){
        tagsSelected.push({label:tag, background:"#68D9A4"});
    } else if (type == "ustensils") {
        tagsSelected.push({label:tag, background:"#ED6454"});
    }
    
    // Afficher le tag 
    nodeSelectedTags.innerHTML = (
        tagsSelected
            .map(tagSelected => (
                `
                <span class="tag" style="background:${tagSelected.background};">${tagSelected.label}</span>
                `
           )).join('')
    )
    console.log(tagsSelected)
    showRecipes();
    const test = document.querySelectorAll(".tag")
    test.forEach(tag => {
        tag.addEventListener("click", function() {
            removeTag(this)
        });

    });
    
}

//Supprimer le tag 
const removeTag = (tag) => {
    tagsSelected = tagsSelected.filter(tagSelected => tagSelected.label !== tag.innerText) 

    tagsSelected
        .map(tagSelected => (
        `
        <span class="tag" style="background:${tagSelected.background};">${tagSelected.label}</span>
        `
    ));
    tag.remove()
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
            tag.remove()// supprimer le tag afficher de la liste des ingredients
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
            tag.remove()// supprimer le tag afficher de la liste des appareils
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
            tag.remove()// supprimer le tag afficher de la liste des ustensiles
        });
    });
}




// Afficher les cards de recettes 
const showRecipes = () => {
    recipeCard.innerHTML = (
            // recette filtrer 
            recipes
                .map(recipe => (
                    `
                    <li class="card">
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