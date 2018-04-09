import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoutitesPage } from './favoutites';

@NgModule({
  declarations: [
    FavoutitesPage,
  ],
  imports: [
    IonicPageModule.forChild(FavoutitesPage),
  ],
})
export class FavoutitesPageModule {}
