export default class StackPool {
    constructor() {
        this._stack = [];
        this.dispatchCenter = new DispatchCenter();
    }

    getStack() {
        return this._stack;
    }
    getLength() {
        return this._stack.length;
    }

    addStack(item) {
        this._stack.push(item);
    }

    concat(arr) {
        this._stack = this._stack.concat(arr);
    }

    delStack(index) {
        if (index) {
            if (typeof index === "number") {
                return this._stack.splice(index, 1);
            }
            return this._stack.splice(this._stack.indexOf(index), 1);
        }
        return this._stack.pop();
    }

    subscribe() {}
}

class DispatchCenter {
    constructor() {
        this._subscriber = [];
    }

    addSubscriber(item) {
        this._subscriber.push(item);
    }

    delSubscriber() {
        if (index) {
            return this._subscriber.splice(index, 1);
        }
        return this._subscriber.pop();
    }

    dispatch(params) {
        this._subscriber.map(fn => fn(params));
    }
}
