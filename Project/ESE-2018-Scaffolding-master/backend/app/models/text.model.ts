import {Table, Column, Model} from 'sequelize-typescript';

@Table
export class Text extends Model<Text> {
  @Column
  title!: string;

  @Column
  content!: string;

  @Column
  id!: Number;

  toSimplification(): any {
    return {
      'id': this.id,
      'title': this.title,
      'content': this.content,
    };
  }

  fromSimplification(simplification: any): void {
    this.id = simplification['id'];
    this.title = simplification['title'];
    this.content = simplification['content'];
  }

}
