/**
 * Vital for any browser tests making use of experimental chromium features
 */
import { app } from "electron";
app.commandLine.appendSwitch("--enable-experimental-web-platform-features");
