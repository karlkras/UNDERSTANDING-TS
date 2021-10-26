"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
function Logger(logString) {
    return function (constructor) {
        console.log(logString);
        console.log(constructor);
    };
}
const WithTemplate = (template, hookId) => {
    return function (originalConstructor) {
        return class extends originalConstructor {
            constructor(..._) {
                super();
                console.log('Rendering Template');
                const hookElem = document.getElementById(hookId);
                if (hookElem) {
                    hookElem.innerHTML = template;
                    hookElem.querySelector('h1').textContent = this.name;
                }
            }
        };
    };
};
let Person = class Person {
    constructor() {
        this.name = 'Karl';
        console.log('Creating person object...');
    }
};
Person = __decorate([
    Logger('LOGGING'),
    WithTemplate('<h1>My Person Object</h1>', "app")
], Person);
const pers = new Person();
console.log(pers);
function PropertyLog(target, propertyName) {
    console.log('Property Decorator!');
    console.log(target, propertyName);
}
function AccessorLog(target, name, descriptor) {
    console.log('Accessor decorator');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}
function MethodLog(target, name, descriptor) {
    console.log('Method decorator!');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}
function ArgumentLog(target, name, position) {
    console.log('Argument decorator!');
    console.log(target);
    console.log(name);
    console.log(position);
}
class Product {
    constructor(t, p) {
        this._price = p;
        this.title = t;
    }
    set price(p) {
        if (p > 0) {
            this._price = p;
        }
    }
    getPriceWithTax(tax) {
        return this._price * (1 + tax);
    }
}
__decorate([
    PropertyLog
], Product.prototype, "title", void 0);
__decorate([
    AccessorLog
], Product.prototype, "price", null);
__decorate([
    MethodLog,
    __param(0, ArgumentLog)
], Product.prototype, "getPriceWithTax", null);
const p1 = new Product('Book', 19);
const p2 = new Product('Book 2', 291);
class Printer {
    constructor() {
        this.message = 'This works!';
    }
    showMessage() {
        console.log(this.message);
    }
}
__decorate([
    AutoBind
], Printer.prototype, "showMessage", null);
function AutoBind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return originalMethod.bind(this);
        }
    };
    return adjDescriptor;
}
const p = new Printer();
const button = document.querySelector('button');
button.addEventListener('click', p.showMessage);
const registeredValidators = {};
function Required(target, propName) {
    var _a, _b;
    registeredValidators[target.constructor.name] = Object.assign(Object.assign({}, registeredValidators[target.constructor.name]), { [propName]: [...((_b = (_a = registeredValidators[target.constructor.name]) === null || _a === void 0 ? void 0 : _a[propName]) !== null && _b !== void 0 ? _b : []), 'required'] });
}
function PositiveNumber(target, propName) {
    var _a, _b;
    registeredValidators[target.constructor.name] = Object.assign(Object.assign({}, registeredValidators[target.constructor.name]), { [propName]: [...((_b = (_a = registeredValidators[target.constructor.name]) === null || _a === void 0 ? void 0 : _a[propName]) !== null && _b !== void 0 ? _b : []), 'positive'] });
}
function validate(obj) {
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    let isValid = true;
    if (objValidatorConfig) {
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
    constructor(t, p) {
        this.title = t;
        this.price = p;
    }
}
__decorate([
    Required
], Course.prototype, "title", void 0);
__decorate([
    PositiveNumber
], Course.prototype, "price", void 0);
const courseForm = document.querySelector('form');
courseForm.addEventListener('submit', event => {
    event.preventDefault();
    const titleEl = document.getElementById('title');
    const priceEl = document.getElementById('price');
    const title = titleEl.value;
    const price = +priceEl.value;
    const createdCourse = new Course(title, price);
    if (!validate(createdCourse)) {
        alert('Invalid input, please try again!');
        return;
    }
    console.log(createdCourse);
});
//# sourceMappingURL=app.js.map