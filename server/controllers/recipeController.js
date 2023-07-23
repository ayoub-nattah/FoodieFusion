// Crée une connexion à la base de données
require('../models/database');

// pour interagir avec les classes de la base de données
const Category = require('../models/Category');

// pour interagir avec les recettes de la base de données
const Recipe = require('../models/Recipe');

/**
 * GET /
 * Homepage 
*/

// Renders the homepage view with information on the latest and popular recipes, as well as different recipe categories.
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 6;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
    const morocco = await Recipe.find({ 'category': 'Morocco' }).limit(limitNumber);
    const turkey = await Recipe.find({ 'category': 'Turkey' }).limit(limitNumber);




    const food = { latest,morocco, thai, american, chinese,turkey };

    res.render('index', { title: 'Foodie Fusion - Home', categories, food } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
 
}

//  Renders the contact view
exports.contact = (req, res) => {
  try {
    // Add logic for handling the '/contact' route here
    // For example, you can render the contact form
    res.render('contact', { title: 'Foodie Fusion - Contact' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occurred' });
  }
};

// Renders the about view.
exports.about = (req, res) => {
  try {
    // Add logic for handling the '/contact' route here
    // For example, you can render the contact form
    res.render('about', { title: 'Foodie Fusion - about' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occurred' });
  }
};

/**
 * GET /categories
 * Categories 
*/

// Renders the categories view with all available recipe categories.
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Foodie Fusion - Categoreis', categories } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /categories/:id
 * Categories By Id
*/

// Renders the categories view with recipes belonging to a specific category.
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Foodie Fusion - Categoreis', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /recipe/:id
 * Recipe 
*/

// Renders the recipe view with details on a specific recipe
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Foodie Fusion - Recipe', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * POST /search
 * Search 
*/

// Performs a search query on the database and renders the search results view.
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Foodie Fusion - Search', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
  
}

/**
 * GET /explore-latest
 * Explplore Latest 
*/

// Renders the explore-latest view with the latest added recipes.
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Foodie Fusion - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 



/**
 * GET /explore-random
 * Explore Random as JSON
*/

//  Retrieves a random recipe and renders it in the explore-random view.
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Foodie Fusion - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /submit-recipe
 * Submit Recipe
*/

exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Foodie Fusion - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/

//  Renders the submit-recipe view with a form to submit a new recipe
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}




// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();


/**
 * Dummy Data Example 
*/

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();


// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();




// for add recepe in category

// {
//   "_id": "6485e995a9e416f897636761",
//   "name": "Moroccan Lamb Tajine",
//   "description": "This Moroccan Lamb Tajine recipe is a traditional Moroccan dish known for its rich flavors and tender meat. The succulent lamb is marinated in a blend of aromatic spices, including cumin, coriander, paprika, and cinnamon, which infuse the meat with a delightful taste. The tajine is slow-cooked to perfection with a medley of vegetables such as onions, carrots, and potatoes, allowing the flavors to meld together beautifully. The result is a tender and fragrant lamb dish that is sure to impress. Serve this Moroccan Lamb Tajine with warm, crusty bread or steamed couscous for a complete and satisfying meal.",
//   "email": "nattah@raddy.co.uk",
//   "ingredients": [
//     "2 lbs (900g) lamb shoulder, cut into chunks",
//     "2 onions, sliced",
//     "4 carrots, peeled and sliced",
//     "2 potatoes, peeled and cut into chunks",
//     "3 garlic cloves, minced",
//     "2 teaspoons ground cumin",
//     "2 teaspoons ground coriander",
//     "1 teaspoon sweet paprika",
//     "1/2 teaspoon ground cinnamon",
//     "1/4 teaspoon ground turmeric",
//     "1 cup chicken or vegetable broth",
//     "2 tablespoons olive oil",
//     "Salt and pepper to taste",
//     "Fresh cilantro or parsley for garnish"
//   ],
//   "category": "Morocco", 
//   "image": "tajin.jpg"
// }




