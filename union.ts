/*const person: {
    name: string;
    age: number;
    hobbies: string[];
    role: [number, string];
} = {
    name: "KarlKras",
    age: 62,
    hobbies: ['Sports', 'Cooking'],
    role: [2, 'author']
};

let myActivities: string[];

myActivities = person.hobbies;*/

//const combine = (input1: string | number, input2: number) => input1 + input2;

enum Role {
    ADMIN,
    READ_ONLY,
    AUTHOR
}

const person = {
    name: "KarlKras",
    age: 62,
    hobbies: ['Sports', 'Cooking'],
    role: Role.ADMIN
};



//console.log(combine("32", 33));