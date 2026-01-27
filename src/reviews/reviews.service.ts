import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(dto: CreateReviewDto) {
    const review = this.reviewRepository.create(dto);
    return this.reviewRepository.save(review);
  }

  async findAll() {
    return this.reviewRepository.find({ relations: ['user', 'restaurant', 'product'] });
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'restaurant', 'product'],
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: number, dto: UpdateReviewDto) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    Object.assign(review, dto);
    return this.reviewRepository.save(review);
  }

  async remove(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    await this.reviewRepository.remove(review);
    return { message: `Review ${id} deleted successfully` };
  }
}

