import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'ordenItems'
})
export class OrdenItemsPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    return items.sort( (a,b) => {
      if(a.tipo === 'ingreso'){
        return -1;
      }else if(a.tipo === 'egreso'){
        return 1;
      }
    });
  }

}
