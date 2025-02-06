import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
    providers: [AxiosAdapter], //se importa el adaptador como un provider
    exports: [AxiosAdapter] //se exporta para que pueda usarlo otro modulo que lo necesite
})
export class CommonModule {}
