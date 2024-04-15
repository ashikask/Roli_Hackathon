import { ServiceOptions, RoliClient } from "roli-client";
import { Endpoint, Session } from "roli-client";
export declare class GatewayApi extends Endpoint {
    constructor(primaryKey: string);
    getSession(userName: string): Promise<GatewaySession>;
}
export declare class GatewaySession extends Session {
    constructor(sessionId: string);
    tell(message: string): Promise<Promise<string>>;
    transcribeAudio(audioUrl: string): Promise<Promise<string>>;
}

export declare function createRoliClient(options?: ServiceOptions) : RoliClient;
