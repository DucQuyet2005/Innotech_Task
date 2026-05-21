export interface User{
    id:number;
    email:string;
    password:string;
    name:string;
}

export const users:User[]=[];
let nextId=1;
export const getNextId=():number=>{
    return nextId++;
}