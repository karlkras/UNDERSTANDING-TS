"use strict";
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
var Role;
(function (Role) {
    Role[Role["ADMIN"] = 0] = "ADMIN";
    Role[Role["READ_ONLY"] = 1] = "READ_ONLY";
    Role[Role["AUTHOR"] = 2] = "AUTHOR";
})(Role || (Role = {}));
const person = {
    name: "KarlKras",
    age: 62,
    hobbies: ['Sports', 'Cooking'],
    role: Role.ADMIN
};
//console.log(combine("32", 33));
//# sourceMappingURL=union.js.map