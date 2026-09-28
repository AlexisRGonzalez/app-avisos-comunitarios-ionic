import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonThumbnail, IonLabel, 
  IonNote, IonButton, IonIcon, IonFab, IonFabButton,
  AlertController // <--- IMPORTANTE PARA LA ALERTA
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, trashOutline } from 'ionicons/icons';
import { PublicacionesService } from '../services/publicaciones';
import { Publicacion } from '../models/publicacion';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonList, IonItem, IonThumbnail, IonLabel, 
    IonNote, IonButton, IonIcon, IonFab, IonFabButton,
    CommonModule, RouterModule
  ],
})
export class HomePage implements OnInit {
  publicaciones: Publicacion[] = [];

  constructor(
    private pubService: PublicacionesService,
    private alertCtrl: AlertController // se inyecta el controlador
  ) {
    addIcons({ add, trashOutline });
  }

  ngOnInit() {
    this.cargarLista();
  }

  ionViewWillEnter() {
    this.cargarLista();
  }

  cargarLista() {
    this.publicaciones = this.pubService.getPublicaciones();
  }

  // FUNCIÓN PARA LA ALERTA DE CONFIRMACIÓN
  async confirmarEliminacion(pub: Publicacion) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Seguro que quieres borrar tú aviso: "${pub.titulo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.pubService.borrarPublicacion(pub.titulo);
            this.cargarLista(); // Refresca la pantalla
          }
        }
      ]
    });
    await alert.present();
  }
}
