import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateArtistDto } from '../dto/createArtist.dto';
import { UpdateArtistDto } from '../dto/updateArtist.dto';
import { ArtistService } from './artist.service';
import { validate } from 'uuid';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid artist ID', HttpStatus.BAD_REQUEST);
    }
    return this.artistService.findOne(id);
  }

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    if (!name || !grammy) {
      throw new HttpException(
        'Name and grammy are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  async updateArtist(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    if (!validate(id)) {
      throw new HttpException('Invalid artist ID', HttpStatus.BAD_REQUEST);
    }
    const { name, grammy } = updateArtistDto;
    if (!name || typeof grammy !== 'boolean') {
      throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    }
    return this.artistService.updateArtist(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid artist ID', HttpStatus.BAD_REQUEST);
    }
    return this.artistService.remove(id);
  }
}
