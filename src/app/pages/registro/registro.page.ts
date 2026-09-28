import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonItem, IonLabel, 
  IonInput, IonTextarea, IonButton, IonIcon,
  IonNote, NavController, ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, add, saveOutline } from 'ionicons/icons';
import { Camera, CameraResultType } from '@capacitor/camera'; // Importación de Cámara
import { Publicacion } from '../../models/publicacion';
import { PublicacionesService } from '../../services/publicaciones';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonButtons, IonBackButton, IonItem, IonLabel, 
    IonInput, IonTextarea, IonButton, IonIcon, 
    IonNote, CommonModule, FormsModule
  ]
})
export class RegistroPage {

  nuevaPub: Publicacion = {
    titulo: '',
    descripcion: '',
    fecha: new Date(),
    foto: '' // Aquí se guardará la imagen capturada
  };

  constructor(
    private pubService: PublicacionesService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    // Registramos los iconos necesarios
    addIcons({ camera, add, saveOutline });
  }

  async guardar() {
  
    if (this.nuevaPub.titulo.length < 5 || this.nuevaPub.descripcion.length < 20) {
      this.presentToast("Por favor, cumple con el largo mínimo de los campos");
      return;
    }

    // Guardar en el servicio
    this.pubService.addPublicacion({ ...this.nuevaPub });
    
    const toast = await this.toastCtrl.create({
      message: 'Publicación guardada con éxito',
      duration: 2000,
      color: 'success'
    });
    toast.present();
    
    this.navCtrl.back(); // Volver al Home
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  // --- Lógica de la Cámara Activada ---
  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });

      if (image.dataUrl) {
        this.nuevaPub.foto = image.dataUrl; // Se asigna la foto al objeto
      }
    } catch (error) {
      console.log("El usuario canceló la cámara", error);
    }
  }
}