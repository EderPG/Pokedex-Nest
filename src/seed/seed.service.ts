import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({}); // delete * from pokemon
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650', //el numero de solicitudes que hara, en este caso 650 pokemon
    );
    const pokemonToInsert: { name: string; no: number }[] = [];
    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/'); // divide la url que nos da en partes para saber que posicion esta el dato necesario
      const no = +segments[segments.length - 2]; //nos da el penultimo valor de nuestro array
      pokemonToInsert.push({ name, no });
      // const pokemon = await this.pokemonModel.create({ name, no });
      // console.log(name, no); //revisar en la consola si esta arrojando los datos que se necesita
    });

    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed executed';
    // return data.results;
  }
}
