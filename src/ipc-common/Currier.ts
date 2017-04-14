import { IMessage } from "../ipc-common/messages/Message";

type IpcEvent = Electron.IpcMainEvent | Electron.IpcRendererEvent;

/**
 * Curries additional arguments to supply controller, and protects global scope by removing `this` context
 * @param controller - Controller to curry `args` to
 * @param args - Added arguments to curry into controller
 */
export function curry<T extends IMessage>(controller: Function, ...args: any[]): (event: IpcEvent, message: T) => void {
    return controller.bind(undefined, ...args);
}
