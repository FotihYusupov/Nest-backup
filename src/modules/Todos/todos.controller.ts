import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
  Param,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('user')
  findOne(@Request() req: Request & { user: { id: string } }) {
    return this.todosService.findUserTodos(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Request() req: Request & { user: { id: string } }) {
    return this.todosService.create({ ...createTodoDto, user: req.user.id });
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param() id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }
}
