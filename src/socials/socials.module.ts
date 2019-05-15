import { HttpModule, Module } from '@nestjs/common';
import { FacebookService } from './facebook.service';

@Module({
  exports: [FacebookService],
  imports: [HttpModule],
  providers: [FacebookService],
})
export class SocialsModule {}
