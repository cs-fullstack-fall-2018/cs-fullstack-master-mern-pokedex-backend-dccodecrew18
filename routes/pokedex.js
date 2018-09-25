const express = require('express');
const request = require("request");
const pokeapi = 'https://pokeapi.co/api/v2/pokemon';
const pngLocation = '/images';
const pokeapi300 = 'https://pokeapi.co/api/v2/pokemon/300/';

// Get the references we will need
const router = express.Router();


// We want to add properties to the Pokemon object for it's pokedex id number and local image URL
// Create those properties using id number present in the response returned by pokemon api call
function setPokemons(pokemonList, req) {
    // Build request URI to point to server images
    let port = req.app.settings.port || 3001;
    let baseURI = req.protocol + '://' + req.host + ':' + port;
    //http://localhost:3001

    return pokemonList.map(pokemon => {
        pokemon.id = pokemon.url.substring(34, pokemon.url.length - 1); // Strip of number from end of returned URL to get an 'id' for later
        pokemon.image = `${baseURI}${pngLocation}/${pokemon.id}.png`; // Build a path to our local image since we have the pokedex id
        return pokemon;

        // this part adds id and image to name and url in original array
        // var p = {"name" = "Kevin"]
    });
};

router.get('/300', (req, res) => { // / is the default page for local host
    console.log("This is the 300 endpoint");
    console.log(`Sending a request to ${pokeapi}`);
    request("https://pokeapi.co/api/v2/pokemon/6/", function (err, response, body) {
        if (err) {
            throw err; // If we get an error then bail
        }

        // Use Express to send the JSON back to the client in the web response
        let jsonResp = JSON.parse(body); // Pull out the JSON body so we can add 'image URL' and 'id' before returning to client
        //console.log(setPokemons(jsonResp.results, req)); // Pass just the 'results' portion of the JSON which contains the array of Pokemon and the HTTP request portion to use in an image URL
        res.send(jsonResp);
    });
});

/* GET all the pokemon */
router.get('/', (req, res) => { // / is the default page, so change it !
    console.log("This is the root endpoint.");
    console.log(`Sending a request to ${pokeapi}`);
    request(pokeapi, function (err, response, body) {
        if (err) {
            throw err; // If we get an error then bail
        }

        // Use Express to send the JSON back to the client in the web response
        let jsonResp = JSON.parse(body); // Pull out the JSON body so we can add 'image URL' and 'id' before returning to client
        //console.log(setPokemons(jsonResp.results, req)); // Pass just the 'results' portion of the JSON which contains the array of Pokemon and the HTTP request portion to use in an image URL
        res.send(jsonResp);
    });
});


// Export the routes
module.exports = router;