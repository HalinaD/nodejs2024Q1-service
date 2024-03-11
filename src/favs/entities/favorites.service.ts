import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly dbService: DbService) {}

  getAllFavorites() {
    return {
      artists: this.dbService.artists.filter((artist) =>
        this.dbService.favorites.artists.includes(artist.id),
      ),
      albums: this.dbService.albums.filter((album) =>
        this.dbService.favorites.albums.includes(album.id),
      ),
      tracks: this.dbService.tracks.filter((track) =>
        this.dbService.favorites.tracks.includes(track.id),
      ),
    };
  }

  addTrackToFavorites(trackId: string) {
    const track = this.dbService.tracks.find((track) => track.id === trackId);
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }
    this.dbService.favorites.tracks.push(trackId);
    return { message: 'Track added to favorites' };
  }

  deleteTrackFromFavorites(trackId: string) {
    const index = this.dbService.favorites.tracks.findIndex(
      (id) => id === trackId,
    );
    if (index === -1) {
      throw new NotFoundException('Track not found in favorites');
    }
    this.dbService.favorites.tracks.splice(index, 1);
    return { message: 'Track removed from favorites' };
  }

  addAlbumToFavorites(albumId: string) {
    const album = this.dbService.albums.find((album) => album.id === albumId);
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }
    this.dbService.favorites.albums.push(albumId);
    return { message: 'Album added to favorites' };
  }

  deleteAlbumFromFavorites(albumId: string) {
    const index = this.dbService.favorites.albums.findIndex(
      (id) => id === albumId,
    );
    if (index === -1) {
      throw new NotFoundException('Album not found in favorites');
    }
    this.dbService.favorites.albums.splice(index, 1);
    return { message: 'Album removed from favorites' };
  }

  addArtistToFavorites(artistId: string) {
    const artist = this.dbService.artists.find(
      (artist) => artist.id === artistId,
    );
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }
    this.dbService.favorites.artists.push(artistId);
    return { message: 'Artist added to favorites' };
  }

  deleteArtistFromFavorites(artistId: string) {
    const index = this.dbService.favorites.artists.findIndex(
      (id) => id === artistId,
    );
    if (index === -1) {
      throw new NotFoundException('Artist not found in favorites');
    }
    this.dbService.favorites.artists.splice(index, 1);
    return { message: 'Artist removed from favorites' };
  }
}
