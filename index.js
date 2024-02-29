import { error } from 'console';
import fs from 'fs/promises';

class Pokemon {

    constructor(name, type, weight, height, dexNumber, sprite) {
        this.name = name
        this.type = type
        this.weight = weight
        this.height = height
        this.dexNumber = dexNumber
        this.sprite = sprite
    }
}

const urlPokemons = 'https://pokeapi.co/api/v2/pokemon?limit=151';

const fetchPokemonsURL = async () => {
    const pokemons = await fetch(urlPokemons);
    const data = await pokemons.json();
    return data;
}

const fetchAllPokemons = async () => {
    const urls = await fetchPokemonsURL();
    const promises = urls.results.map(url => {
        return fetch(url.url)
            .then(res => res.json())
            .then(data => data)
            .catch(error => console.error(error));
    });
    const data = await Promise.all(promises)
        .then(data => { return data });
    let pokemons = [];
    for (let pokemon of data) {
        pokemons.push(new Pokemon(
            pokemon.name,
            pokemon.types.map(type => type.type.name),
            pokemon.weight,
            pokemon.height,
            pokemon.id,
            pokemon.sprites.front_default
        ))
    }
    return pokemons;
}

const writeFile = async () => {
    const pokemons = await fetchAllPokemons();
    try {
        await fs.writeFile('pokemons.json', JSON.stringify(pokemons, null, 2));
    } catch (error) {
        console.error(error);
    }
}

writeFile();

