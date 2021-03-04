import { User } from "./user.model";

export class Task {
    
    constructor(
        public id: string,
        public title: string, 
        public description: string, 
        public priority: string,
        public createdOn: Date,
        public developer: User, 
        public completed: boolean
    ) {}
}