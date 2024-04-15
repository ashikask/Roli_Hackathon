/*
*  This is an automatically generated file.
*  Please do not modify this directly because any changes you make will be lost.
*  This file can be regenerated via:
*  $ roli generate-client . gateway
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* * --- File Information ---
* * Platform: 2.0.0-20240405102540-managedcloud-debug
* * Tools:    2.0.0-beta.7
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

import {createUuid, Data, Endpoint, Session, Event} from "roli-client";
import {__Session_InternalClient_Key, __Endpoint_InternalClient_Key, TypeRegistryBuilder, internalCreateClient} from "roli-client/internal";

export class GatewayApi extends Endpoint {
    constructor(primaryKey) {
        super(primaryKey);
    }

    async getSession(userName) {
        return await Endpoint[__Endpoint_InternalClient_Key].callEndpointMethod(this, 100, userName);
    }
}

export class GatewaySession extends Session {
    constructor(sessionId) {
        super(sessionId);
    }

    async tell(message) {
        return await Session[__Session_InternalClient_Key].callSessionMethod(this, 100, message);
    }

    async submitTranscription(audioUrl) {
        return await Session[__Session_InternalClient_Key].callSessionMethod(this, 101, audioUrl);
    }

    async pollForTranscription(transcriptId) {
        return await Session[__Session_InternalClient_Key].callSessionMethod(this, 102, transcriptId);
    }

    async transcribeAudio(audioUrl) {
        return await Session[__Session_InternalClient_Key].callSessionMethod(this, 103, audioUrl);
    }
}



export function createRoliClient(options) {
    const registryBuilder = new TypeRegistryBuilder();
    const serviceKey = registryBuilder.registerService('gateway', false, 'w634fy3KYn2tsiqAE9J2SBpLnGK+XOL2+F+v19Sh3FyCEFjLYXstsnGb4r0b0MOMJ3IlmO9JGFvJwLCZyJO3UaqMtJuKMQPdCQ2u18yzbgXkUD6ceQ5oa6d/bKny+jJ5CLPRF+tqYmRzQBWWb0J+7yxHYx+Se+1B6tu0a34x1enDCSchozQQulT4hAcGkezi4dQHi29/sXp2UHTVNKZGxFFlTCXFihVlbBisbSwnz8f5Vf3EfOPPpjmZTQ38B9Vd', '50139', '21');



    registryBuilder.registerEndpoint('GatewayApi', GatewayApi, serviceKey, 1000);
    registryBuilder.registerSession('GatewaySession', GatewaySession, serviceKey, 1001);
    return internalCreateClient(registryBuilder.build(), "https://api.roli.app/", options);
}

