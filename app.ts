function Logger(logString: string) {
    return function (constructor: Function) {
        console.log(logString);
        console.log(constructor);
    };
}

const WithTemplate = (template: string, hookId: string) => {
    return function <T extends { new(...args: any[]): { name: string } }>(originalConstructor: T) {
        return class extends originalConstructor {
            constructor(..._: any[]) {
                super();
                console.log('Rendering Template');
                const hookElem = document.getElementById(hookId);
                if (hookElem) {
                    hookElem.innerHTML = template;
                    hookElem.querySelector('h1')!.textContent = this.name;
                }
            }
        }
    }
}

@Logger('LOGGING')
@WithTemplate('<h1>My Person Object</h1>', "app")
class Person {
    name = 'Karl';

    constructor() {
        console.log('Creating person object...');
    }
}


const pers = new Person();

console.log(pers);

function PropertyLog(target: any, propertyName: string | Symbol) {
    console.log('Property Decorator!')
    console.log(target, propertyName);
}

function AccessorLog(target: any, name: string, descriptor: PropertyDescriptor) {
    console.log('Accessor decorator');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function MethodLog(target: any, name: string | Symbol, descriptor: PropertyDescriptor) {
    console.log('Method decorator!');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function ArgumentLog(target: any, name: string | Symbol, position: number) {
    console.log('Argument decorator!');
    console.log(target);
    console.log(name);
    console.log(position);
}

class Product {
    private _price: number;
    @PropertyLog
    title: string;

    constructor(t: string, p: number) {
        this._price = p;
        this.title = t;
    }

    @AccessorLog
    set price(p: number) {
        if (p > 0) {
            this._price = p;
        }
    }

    @MethodLog
    getPriceWithTax(@ArgumentLog tax: number): number {
        return this._price * (1 + tax);
    }
}

const p1 = new Product('Book', 19);
const p2 = new Product('Book 2', 291);

class Printer {
    message = 'This works!';

    @AutoBind
    showMessage() {
        console.log(this.message);
    }
}

function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return originalMethod.bind(this);
        }
    };
    return adjDescriptor;
}

const p = new Printer();

const button = document.querySelector('button')!;
button.addEventListener('click', p.showMessage);
interface ValidatorConfig {
    [property: string]: {
        [validatableProp: string]: string[]; // ['required', 'positive']
    };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'required']
    };
}

function PositiveNumber(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'positive']
    };
}

function validate(obj: any) {
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    let isValid = true;
    if(objValidatorConfig) {
        for (const prop in objValidatorConfig) {
            for (const validator of objValidatorConfig[prop]) {
                switch (validator) {
                    case 'required':
                        isValid = isValid && !!obj[prop];
                        break;
                    case 'positive':
                        isValid = isValid && obj[prop] > 0;
                        break;
                }
            }
        }
    }
    return isValid;
}

class Course {
    @Required
    title: string;
    @PositiveNumber
    price: number;

    constructor(t: string, p: number) {
        this.title = t;
        this.price = p;
    }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', event => {
    event.preventDefault();
    const titleEl = document.getElementById('title') as HTMLInputElement;
    const priceEl = document.getElementById('price') as HTMLInputElement;

    const title = titleEl.value;
    const price = +priceEl.value;

    const createdCourse = new Course(title, price);

    if (!validate(createdCourse)) {
        alert('Invalid input, please try again!');
        return;
    }

    console.log(createdCourse);
});