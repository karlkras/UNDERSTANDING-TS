// Project type
enum ProjectStatus {
    active,
    finished
}
class Project {
    id: string;
    constructor(public title: string,
                public description: string,
                public people: number,
                public status: ProjectStatus) {
        this.id = Math.random().toString();
    }
}

//listener type
type Listener = (items: Project[]) => void;

// state management class
class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
    }

    public static getInstance() {
        if(!this.instance) {
            this.instance = new ProjectState();
        }
        return this.instance;
    }

    addListener(listenerFn: Listener) {
        this.listeners = [...this.listeners, listenerFn];
    }

    public addProject(title: string, description: string, numOfPeople: number) {
        this.projects = [...this.projects, new Project(title,
            description,
            numOfPeople,
            ProjectStatus.active)];
        this.listeners.forEach( (aListenerFn) => {
            aListenerFn(this.projects.slice());
        });
    }
}

const projectState = ProjectState.getInstance();

// validation.
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

const validate = (validateInput: Validatable): boolean => {
    let isValid = true;
    if(validateInput.required) {
        isValid = isValid && validateInput.value.toString().trim().length !== 0;
    }
    if(validateInput.minLength != null
        && typeof validateInput.value === "string" ){
        isValid = isValid && validateInput.value.trim().length >= validateInput.minLength;
    }
    if(validateInput.maxLength != null &&
        typeof validateInput.value === "string" ){
        isValid = isValid && validateInput.value.trim().length <= validateInput.maxLength;
    }

    if(validateInput.min != null
        && typeof validateInput.value === "number" ){
        isValid = isValid && validateInput.value >=  validateInput.min;
    }

    if(validateInput.max != null
        && typeof validateInput.value === "number" ){
        isValid = isValid && validateInput.value <=  validateInput.max;
    }

    return isValid;
}

// autobind decorator
function Autobind(target: any,
                  _methodName: string,
                  descriptor: PropertyDescriptor) {
    const orgMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            return orgMethod.bind(this);
        }
    };
    return adjDescriptor;
}

// ProjectList Class
class ProjectList {
    templateElm: HTMLTemplateElement;
    hostElem: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: Project[] = [];

    constructor(private type: 'active' | 'finished') {
        this.templateElm = document.getElementById('project-list')! as HTMLTemplateElement;
        const importedNode = document.importNode( this.templateElm.content, true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.hostElem = document.getElementById('app')! as HTMLDivElement;
        this.element.id = `${this.type}-projects`;
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter( prj => {
                if(this.type === 'active') {
                    return prj.status === ProjectStatus.active;
                } else {
                    return prj.status === ProjectStatus.finished;
                }
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });

        this.attach();
        this.renderContent();
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLDListElement;
        this.assignedProjects.forEach( aProject => {
            const listItem = document.createElement('li');
            listItem.textContent = aProject.title;
            listEl.appendChild(listItem);
        });

    }

    private renderContent() {
        this.element.querySelector('ul')!.id = `${this.type}-projects-list`;
        this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()}  PROJECTS`;
    }

    private attach() {
        this.hostElem.insertAdjacentElement('beforeend', this.element);
    }

}

class ProjectInput {
    templateElm: HTMLTemplateElement;
    hostElem: HTMLDivElement;
    element: HTMLFormElement;
    titleElem: HTMLInputElement;
    descriptionElem: HTMLInputElement;
    peopleElem: HTMLInputElement;

    constructor() {
        this.templateElm = document.getElementById('project-input')! as HTMLTemplateElement;
        const importedNode = document.importNode( this.templateElm.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.hostElem = document.getElementById('app')! as HTMLDivElement;

        this.titleElem = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionElem = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleElem = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();

        this.renderProjectForm(this.element);
    }

    private clearInputs = () => {
        this.titleElem.value = '';
        this.descriptionElem.value = '';
        this.peopleElem.value = '';
    }

    private gatherUserInput = (): [string, string, number]  | void => {
        const enteredTitle = this.titleElem.value;
        const enteredDescription = this.descriptionElem.value;
        const enteredPeople = this.peopleElem.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 7
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 5
        }
        if(
            validate(titleValidatable) &&
            validate(descriptionValidatable) &&
            validate(peopleValidatable)
        ) {
            return [enteredTitle,enteredDescription, +enteredPeople];
        } else {
            alert ('Invalid input, try again');alert ('Invalid input, try again');
            return;
        }
    }


    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)) {
            const [title, desc,people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }

    private configure() {
        this.hostElem.addEventListener('submit', this.submitHandler);
    }

    private renderProjectForm(theForm: HTMLFormElement) {
        theForm.id = 'user-input';
        this.hostElem.insertAdjacentElement('afterbegin', theForm);
    }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');

