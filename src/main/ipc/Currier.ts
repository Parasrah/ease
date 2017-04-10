export function curry(controller: Function, ...args: any[]) {
    return controller.bind(undefined, ...args);
}
