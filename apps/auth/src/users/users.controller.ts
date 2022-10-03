import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProduceMessageDto } from './dto/produce-message.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly entitiesService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.entitiesService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.entitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.entitiesService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entitiesService.remove(+id);
  }

  @Post('message')
  produceMessage(@Body() produceMessageDto: ProduceMessageDto) {
    return this.entitiesService.produceMessage(produceMessageDto);
  }
}
