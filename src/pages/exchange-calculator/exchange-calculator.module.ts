import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExchangeCalculatorPage } from './exchange-calculator';

@NgModule({
  declarations: [
    ExchangeCalculatorPage,
  ],
  imports: [
    IonicPageModule.forChild(ExchangeCalculatorPage),
  ],
})
export class ExchangeCalculatorPageModule {}
