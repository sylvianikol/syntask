import { User } from "../user/user.model";
import { Priority } from "./enum/priority.enum";
import { Status } from "./enum/status.enum";

export class Task {
    
    constructor(
        public id: string,
        public title: string, 
        public description: string, 
        public priority: Priority,
        public status: Status,
        public createdOn: Date,
        public developer: User, 
        public completed: boolean
    ) {}
}