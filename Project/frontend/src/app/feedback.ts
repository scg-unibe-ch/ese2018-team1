import {stages} from './feedback.service';

export class Feedback {
  constructor(
    public message: string,
    public level: stages,
    public hidden: boolean
  ){
  }
}
