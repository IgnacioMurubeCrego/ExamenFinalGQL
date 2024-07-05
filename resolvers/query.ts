import { Character } from "../types.ts";
import { GraphQLError } from "graphql";

export const Query = {

  character : async (_: unknown, args: { id: string }): Promise<Character> => {
  const url : URL = new URL(`https://rickandmortyapi.com/api/character/${args.id}`);
  const character : Character | void = await fetch(url).then(response => {

    if(!response.ok){
      return response.text().then(text => {
        throw new GraphQLError(`Error: ${response.status} ${text}`);
      });
    }
    return response.json();
  }).then((data) => {

    const character : Character = {
      id: data.id.toString(),
      name: data.name,
      status: data.status,
      species: data.species,
      type: data.type,
      gender: data.gender,
      origin: data.origin,
      location: data.location,
      image: data.image,
      episode: data.episode,
      created: data.created,
    }
    return character;

  }).catch(error => { console.error(`Request Failed:`,error.message)});
  if(!character){
    throw new GraphQLError(`No character found with id: ${args.id}.`);
  }
  return character;
  },

  charactersByIds : async (_: unknown, args: { ids: string[] }): Promise<Character[] | void> => {
    const urls : URL[] = args.ids.map((id) => { return new URL(`https://rickandmortyapi.com/api/character/${id}`)});
    const characters : Character[] | void = [];
     urls.map(async (url : URL) => {
      await fetch(url).then(response => {

        if(!response.ok){
          return response.text().then(text => {
            throw new GraphQLError(`Error: ${response.status} ${text}`);
          });
        }
        return response.json();
      }).then((data) => {
    
        const character : Character = {
          id: data.id.toString(),
          name: data.name,
          status: data.status,
          species: data.species,
          type: data.type,
          gender: data.gender,
          origin: data.origin,
          location: data.location,
          image: data.image,
          episode: data.episode,
          created: data.created,
        }
        characters.push(character);
    
      }).catch(error => { console.error(`Request Failed:`,error.message)});
      
    });
    return characters;
  }
  
};
