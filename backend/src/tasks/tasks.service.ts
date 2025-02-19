import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as redis from 'redis';

@Injectable()
export class TasksService {
  private prisma = new PrismaClient();
  private redisClient = redis.createClient({
    url: process.env.REDIS_HOST,
  });

  constructor() {
    this.initialize();
  }

  private async initialize() {
    await this.redisClient.connect();
  }

  async getAllTasks() {
    const cacheKey = 'all-tasks';
    const cachedTasks = await this.redisClient.get(cacheKey);

    if (cachedTasks) {
      return JSON.parse(cachedTasks);
    }

    const tasks = await this.prisma.task.findMany();
    await this.redisClient.setEx(cacheKey, 3600, JSON.stringify(tasks));
    return tasks;
  }

  async createTask(title: string, description: string | null) {
    const task = await this.prisma.task.create({
      data: { title, description },
    });
    await this.redisClient.del('all-tasks');
    return task;
  }

  async updateTask(id: number, completed: boolean) {
    const task = await this.prisma.task.update({
      where: { id },
      data: { completed },
    });
    await this.redisClient.del('all-tasks');
    return task;
  }

  async deleteTask(id: number) {
    const task = await this.prisma.task.delete({ where: { id } });
    await this.redisClient.del('all-tasks');
    return task;
  }
}
