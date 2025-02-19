import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Post()
  async createTask(
    @Body() body: { title: string; description: string | null },
  ) {
    return this.tasksService.createTask(body.title, body.description);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() body: { completed: boolean },
  ) {
    return this.tasksService.updateTask(parseInt(id), body.completed);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(parseInt(id));
  }
}
