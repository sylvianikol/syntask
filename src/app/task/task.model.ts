import { User } from "../user/user.model";
import { Priority } from "./enum/priority.enum";

export class Task {
    
    constructor(
        public id: string,
        public title: string, 
        public description: string, 
        public priority: Priority,
        public status: string,
        public createdOn: Date,
        public developer: User, 
        public completed: boolean
    ) {}
}