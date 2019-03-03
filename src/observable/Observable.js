import Observer from "./Observer";

export default class Observable {
    constructor() {
        this.observers = [];
    }

    notify(event){
        this.observers.forEach((observer)=>{
            observer.notify(event);
        });
    }

    observe(type, callback) {
        const observer = new Observer({
            type,
            callback,
            unbind: () => {
                const index = this.observers.indexOf(observer);

                if (index >= 0) {
                    this.observers.splice(index, 1);
                }
            }
        });

        return observer;
    }
}