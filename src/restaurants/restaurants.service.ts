import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly _repository: Repository<Restaurant>
  ) {}

  public getAll(): Promise<Restaurant[]> {
    return this._repository.find();
  }

  public createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const newRestaurant: Restaurant = this._repository.create(createRestaurantDto);
    return this._repository.save(newRestaurant);
  }

  public updateRestaurant({ id, data }: UpdateRestaurantDto) {
    return this._repository.update(id, { ...data });
  }
}
