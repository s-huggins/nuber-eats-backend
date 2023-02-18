import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly _restaurantService: RestaurantService) {}

  @Query(returns => [Restaurant])
  public restaurants(): Promise<Restaurant[]> {
    return this._restaurantService.getAll();
  }

  @Mutation(returns => Boolean)
  public async createRestaurant(@Args('input') createRestaurantDto: CreateRestaurantDto): Promise<boolean> {
    try {
      await this._restaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation(returns => Boolean)
  public async updateRestaurant(@Args('input') updateRestaurantDto: UpdateRestaurantDto): Promise<boolean> {
    try {
      await this._restaurantService.updateRestaurant(updateRestaurantDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
