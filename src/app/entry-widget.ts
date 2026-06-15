import { autostartJugru } from "./init/autostart";
import { registerGlobal } from "./init/register-global";

export { mount, mountWidget } from "@/modules/widget";
export type { WidgetInstance, WidgetOptions } from "@/modules/widget";

registerGlobal();
autostartJugru();
