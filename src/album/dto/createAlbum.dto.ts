import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  artistId: string | null;
}