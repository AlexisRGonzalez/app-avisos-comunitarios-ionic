import { Injectable } from '@angular/core';
import { Publicacion } from '../models/publicacion';
import { Preferences } from '@capacitor/preferences'; // se importa el almacenamiento

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private listaPublicaciones: Publicacion[] = [];

  constructor() {
    this.cargarDatos(); // Cargamos los datos apenas se cree el servicio
  }

  // Retorna la lista actual
  getPublicaciones() {
    return this.listaPublicaciones;
  }

  // Agrega y guarda permanentemente
  async addPublicacion(nueva: Publicacion) {
    this.listaPublicaciones.unshift(nueva);
    await Preferences.set({
      key: 'mis_avisos',
      value: JSON.stringify(this.listaPublicaciones)
    });
  }

  // Carga los datos desde la memoria del equipo
  async cargarDatos() {
    const { value } = await Preferences.get({ key: 'mis_avisos' });
    if (value) {
      this.listaPublicaciones.splice(0, this.listaPublicaciones.length, ...JSON.parse(value));
    }
  }
  async borrarPublicacion(titulo: string) {
  // Filtramos la lista para quitar la publicación por su título
  this.listaPublicaciones = this.listaPublicaciones.filter(p => p.titulo !== titulo);
  
  // Guardamos la nueva lista sin el elemento borrado en la memoria
  await Preferences.set({
    key: 'mis_avisos',
    value: JSON.stringify(this.listaPublicaciones)
  });
}
}