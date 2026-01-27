import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(dto: CreateAddressDto) {
    const address = this.addressRepository.create(dto);
    return this.addressRepository.save(address);
  }

  async findAll() {
    return this.addressRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const address = await this.addressRepository.findOne({ 
      where: { id },
      relations: ['user'],
    });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async update(id: number, dto: UpdateAddressDto) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) throw new NotFoundException('Address not found');

    Object.assign(address, dto);
    return this.addressRepository.save(address);
  }

  async remove(id: number) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) throw new NotFoundException('Address not found');

    await this.addressRepository.remove(address);
    return { message: `Address ${id} deleted successfully` };
  }
}

