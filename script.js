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
        } else {
            element.classList.remove('active')
        }
    });
} 
document.body.addEventListener("click",toggleBtnsFilter);


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

const removeTag = (tag) => {
    console.log(tag,tagsSelected)
    tagsSelected = tagsSelected.filter(tagSelected => tagSelected.label !== tag.innerText) 
    console.log("new",tagsSelected)
    tagsSelected.map(tagSelected => (
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
const showIngredients = async() => {
    await fetchRecipes();
    ingredientList.innerHTML = (
            // .map sur les recttes filtrées
            recipes
                .map(recipe => (
                    recipe.ingredients
                    .map(ingredientObject => (
                        `
                        <li class="li-ingredient">${ingredientObject.ingredient}</li>
                       
                        `
                    )).join('')
                )).join('')// retirer les doublons des ingredients
        )

        // récupérer l'ingredient cliquer et l'ajouter au tableau tagsSelected
        const tags = document.querySelectorAll(".filters-bloc li.li-ingredient");
        tags.forEach(tag => {
            tag.addEventListener("click", () => {
                addTag(tag.innerText, "ingredients");
                tag.remove()
            });
        });
}
showIngredients();


// Afficher la liste des appareils
const showAppliance = async() => {
    await fetchRecipes();

    applianceList.innerHTML = (
        
        recipes
            .map(recipe => (
                `
                <li class="li-appliance">${recipe.appliance}</li>
                `
            )).join('')
    )
    // récupérer l'ingredient cliquer et l'ajouter au tableau tagsSelected
    const tags = document.querySelectorAll(".filters-bloc li.li-appliance");
    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            addTag(tag.innerText, "appareils");
            tag.remove()
        });
    });
}
showAppliance();

// Afficher la liste des ustensiles
const showUstensils = async() => {
    await fetchRecipes();

    ustensilsList.innerHTML = (
        
        recipes
            .map(recipe => (
                recipe.ustensils.map(element => (
                `
                <li class="li-ustensil">${element}</li>
                `
                )).join('')
            )).join('')
    )
    // récupérer l'ingredient cliquer et l'ajouter au tableau tagsSelected
    const tags = document.querySelectorAll(".filters-bloc li.li-ustensil");
    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            addTag(tag.innerText, "ustensils");
            tag.remove()
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

