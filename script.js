// Cibler les élements

const recipeCard = document.getElementById('recipeCard');
const ingredientList = document.getElementById('ingredientList');
const applianceList = document.getElementById('applianceList');
const ustensilsList = document.getElementById('ustensilsList');
const nodeSelectedTags = document.querySelector(".selectedTags");




let recipes;
// // API REQUEST
const fetchRecipes = async() => {

    recipes = await fetch('./json/recipes.json').then(res => res.json());
    
};

// Ouvrir ou fermer le filtre par Ingredient, Appareil ou Ustensiles
const filterContainer = document.querySelectorAll(".filters-bloc");
const toggleBtnsFilter = (e) => {
    filterContainer.forEach(element => {
        if (element.contains(e.target)) {
            element.classList.add('active')
            elem.style.zIndex = 0
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



const renderContent = () => {
    // afficher la liste de recette
    const recipesContent = recipes.map()
}




// Afficher la liste des ingredients
const uniqueIngredientsSet = new Set();
const showIngredients = async() => {
    await fetchRecipes();
        recipes
            .map(recipe => (
                recipe.ingredients
                    // enlever les doublons des ingredients 
                    .filter(ingredientObject => {
                        const isPresentInSet = uniqueIngredientsSet.has(ingredientObject.ingredient);
                        uniqueIngredientsSet.add(ingredientObject.ingredient)
                        
                        return !isPresentInSet;
                    })
            )).join('')  

    ingredientList.innerHTML = (
        [...uniqueIngredientsSet]
            .sort((a, b) => {

                return a.localeCompare(b)
            })
            .map(ingredient => (
                `
                <li class="li-ingredient">${ingredient}</li>
                
                ` 
            )).join('')
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
showIngredients();




// Afficher la liste des appareils
const uniqueAppliancesSet = new Set();
const showAppliance = async() => {
    await fetchRecipes();
        recipes
            // enlever les doublons des appareils 
            .filter( recipe => {
                const isPresentInSet = uniqueAppliancesSet.has(recipe.appliance);
                uniqueAppliancesSet.add(recipe.appliance)
        
                return !isPresentInSet;
            })
    
    applianceList.innerHTML = (
        [...uniqueAppliancesSet]
            .sort((a, b) => {
                    
                return a.localeCompare(b)
            })
            .map(appliance => (
                `
                <li class="li-appliance">${appliance}</li>
                `
            )).join('')
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
showAppliance();




// Afficher la liste des ustensiles
const uniqueUstensilsSet = new Set();
const showUstensils = async() => {
    await fetchRecipes();

        recipes
            .map(recipe => (
                recipe.ustensils
                    // enlever les doublons des ustensiles 
                    .filter( ustensil => {
                        const isPresentInSet = uniqueUstensilsSet.has(ustensil);
                        uniqueUstensilsSet.add(ustensil)
                        
                        return !isPresentInSet;
                    })
            )).join('')

    ustensilsList.innerHTML = (
        [...uniqueUstensilsSet]
            .sort((a, b) => {
                
                return a.localeCompare(b)
            })
            .map(ustensil => (
                `
                <li class="li-ustensil">${ustensil}</li>
                `
            )).join("")
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
showUstensils();




// Afficher les cards de recettes 
const showRecipes = async() => {
    await fetchRecipes();
    

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
showRecipes();







const filterRecipes = () => {
    // 1 : utiliser .filter pour filtrer les recettes
    const recipesFiltered = recipes.filter(recipe => {
    // 2 : vérifier que la valeur du champ de recherche correspond
    // 3 : vérifier que les tags ingredient corresponds aux ingredients de la recette
    // 4 : 
    // return isMatchingSearch && isMatchingTagIngredient && isMatchingTagAppareil && isMatchingTagUstensile
    })
}

