import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Todo } from 'src/schemas/Todo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name)
    private readonly todoModel: Model<Todo>,
  ) { }
  async findAll() : Promise<object> {
    return {
      message: 'Successfully fetched all todos',
      data: await this.todoModel.find(),
    }
  }

  async findUserTodos(userId: string): Promise<object> {
    return {
      message: 'Successfully fetched user todos',
      data: await this.todoModel.find({ user: userId }),
    }
  }

  async create(createTodoDto: CreateTodoDto & { user: string }): Promise<object> {
    const createdTodo = await this.todoModel.create(createTodoDto);
    return {
      message: 'Successfully created todo',
      data: createdTodo,
    };
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<object> {
    const updatedTodo = await this.todoModel
      .findByIdAndUpdate(id, updateTodoDto, { new: true });
    return {
      message: 'Successfully updated todo',
      data: updatedTodo,
    };
  }

  async delete(id: string): Promise<object> {
    const deletedTodo = await this.todoModel.findByIdAndDelete(id);
    return {
      message: 'Successfully deleted todo',
      data: deletedTodo,
    };
  }
}
