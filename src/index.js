// write your code here
const spiceUrl = "http://localhost:3000/spiceblends";
const ingredientsUrl = "http://localhost:3000/ingredients";
const spiceGallery = document.getElementById( "spice-images" );
const spiceView = document.getElementById( "spice-blend-detail" );
const updateSpiceForm = document.getElementById( "update-form" );
const newIngredientForm = document.getElementById( "ingredient-form" );

function fetchAllSpices() {
    fetch( spiceUrl )
        .then( response => response.json() )
        .then( spiceData => {
            spiceData.forEach( spice => renderSpice( spice ) );
            showSpice( spiceData[ 0 ].id );
        } );
}

function renderSpice( spice ) {
    const thisSpiceImage = document.createElement( "img" );
    thisSpiceImage.dataset.id = spice.id;
    thisSpiceImage.src = spice.image;
    spiceGallery.append( thisSpiceImage );
}

function showSpice( spiceId ) {
    fetch( `${ spiceUrl }/${ spiceId }?_embed=ingredients` )
        .then( response => response.json() )
        .then( thisSpiceData => {
            spiceView.dataset.id = thisSpiceData.id;
            const thisSpiceImage = spiceView.querySelector( "img.detail-image" );
            thisSpiceImage.src = thisSpiceData.image;
            thisSpiceImage.alt = thisSpiceData.title;
            const thisSpiceTitle = spiceView.querySelector( "h2.title" );
            thisSpiceTitle.textContent = thisSpiceData.title;
            const thisSpiceIngredients = spiceView.querySelector( "div.ingredients-container" ).querySelector( "ul.ingredients-list" );
            thisSpiceIngredients.innerHTML = "";
            thisSpiceData.ingredients.forEach( ingredient => {
                const thisIngredient = document.createElement( "li" );
                thisIngredient.textContent = ingredient.name;
                thisSpiceIngredients.append( thisIngredient );
            } );
            updateSpiceForm.dataset.id = thisSpiceData.id;
            updateSpiceForm.elements.title.value = thisSpiceData.title;
            newIngredientForm.dataset.id = thisSpiceData.id;
        } );
}

function updateSpiceTitle( formSubmission ) {
    formSubmission.preventDefault();
    const spiceToUpdateId = formSubmission.target.dataset.id;
    fetch( `${ spiceUrl }/${ spiceToUpdateId }`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify( { title: formSubmission.target.elements.title.value } ) } )
        .then( response => response.json() )
        .then( updatedSpiceData => {
            spiceView.querySelector( "h2.title" ).textContent = updatedSpiceData.title;
        } );
}

function addIngredient( formSubmission ) {
    formSubmission.preventDefault();
    const spiceToAddToId = formSubmission.target.dataset.id;
    fetch( ingredientsUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify( {
        name: formSubmission.target.elements.name.value,
        spiceblendId: parseInt( spiceToAddToId )
    } ) } )
        .then( response => response.json() )
        .then( newIngredientData => {
            const newIngredientListItem = document.createElement( "li" );
            newIngredientListItem.textContent = newIngredientData.name;
            spiceView.querySelector( "div.ingredients-container" ).querySelector( "ul.ingredients-list" ).append( newIngredientListItem );
        } );
}

document.addEventListener( "DOMContentLoaded", () => {
    fetchAllSpices();
    spiceGallery.addEventListener( "click", spiceClick => {
        if ( spiceClick.target.tagName === "IMG" ) { showSpice( spiceClick.target.dataset.id ); }
    } );
    updateSpiceForm.addEventListener( "submit", updateSpiceTitle );
    newIngredientForm.addEventListener( "submit", addIngredient );
} );