import { IMessage } from "../../messages/Message";

export function curry<T extends IMessage>(controller: Function, ...args: any[]): (event: Electron.IpcMainEvent, message: T) => void {
    return controller.bind(undefined, ...args);
}
