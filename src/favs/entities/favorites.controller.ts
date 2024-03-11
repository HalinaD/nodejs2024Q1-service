import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAllFavorites() {
    return this.favoritesService.getAllFavorites();
  }

  @Post('/track/:id')
  async addTrackToFavorites(@Param('id', new ParseUUIDPipe()) trackId: string) {
    if (!trackId) {
      throw new HttpException('Track ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.favoritesService.addTrackToFavorites(trackId);
  }

  @Delete('/track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrackFromFavorites(
    @Param('id', new ParseUUIDPipe()) trackId: string,
  ) {
    if (!trackId) {
      throw new HttpException('Track ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.favoritesService.deleteTrackFromFavorites(trackId);
  }

  @Post('/album/:id')
  async addAlbumToFavorites(@Param('id', new ParseUUIDPipe()) albumId: string) {
    if (!albumId) {
      throw new HttpException('Album ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.favoritesService.addAlbumToFavorites(albumId);
  }

  @Delete('/album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbumFromFavorites(
    @Param('id', new ParseUUIDPipe()) albumId: string,
  ) {
    if (!albumId) {
      throw new HttpException('Album ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.favoritesService.deleteAlbumFromFavorites(albumId);
  }

  @Post('/artist/:id')
  async addArtistToFavorites(
    @Param('id', new ParseUUIDPipe()) artistId: string,
  ) {
    if (!artistId) {
      throw new HttpException('Artist ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.favoritesService.addArtistToFavorites(artistId);
  }

  @Delete('/artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtistFromFavorites(
    @Param('id', new ParseUUIDPipe()) artistId: string,
  ) {
    if (!artistId) {
      throw new HttpException('Artist ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.favoritesService.deleteArtistFromFavorites(artistId);
  }
}
