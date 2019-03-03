const states = {
    ON: "ON",
    STOPPED: "STOPPED",
    DISPOSED: "DISPOSED"
};

export default class Observer {
    constructor({type, callback, unbind}){
        if (typeof unbind !== "function"){
            throw new Error("Illegal Argument: unbind needs to be a function.");
        }

        if (typeof callback !== "function"){
            throw new Error("Illegal Argument: callback needs to be a function.");
        }

        this.type = type;
        this.callback = callback;
        this.unbind = unbind;
        this.state = states.ON;
    }

    isType(event){
        return this.type === event.type || event.type == null;
    }

    willNotify(event){
        return this.isType(event) && this.state == state.ON;
    }

    notify(event){
        if (this.willNotify(event)){
            this.callback(event);
        }
    }

    stop(){
        if (this.state === states.ON){
            this.state = states.STOPPED;
        }
    }

    start(){
        if (this.state === states.STOPPED){
            this.state = states.ON;
        }
    }

    dispose(){
        if (this.state !== states.DISPOSED){
            this.state = states.DISPOSED;
            this.unbind();
        }
    }
}