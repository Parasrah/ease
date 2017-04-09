export function dispatch(controller: Function, ...args: any[]) {
    return controller.bind(undefined, ...args);
}
