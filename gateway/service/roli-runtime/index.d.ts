/**
 * Creates a universally-unique identification string suitable for creating unique primary keys.
 * @param dashes Whether or not to have dashes.
 */
export declare function createUuid(dashes?: boolean): string;
/**
 * Sessions contain business logic that do model selection and {@link Program} execution.
 */
export declare class Session {
    constructor(sessionId: string);
    get sessionId(): string;
    /**
     * Execute the program, step by step. This may result in multiple calls to the Model.
     * @param program The program to execute.
     */
    execute(program: Program): Promise<void>;
}
/**
 * Endpoints define the interface clients use to talk to the Generative AI Gateway over the Internet.
 * Each unique primaryKey refers to a different stateful Endpoint object on the backend.
 */
export declare class Endpoint {
    constructor(primaryKey: string);
    get primaryKey(): string;
}
/**
 * Events are strongly typed objects you can send from inside your {@link Endpoint}s to all subscribed clients.
 */
export declare class Event {
}
/**
 * Data is like a table in a database. Additional properties in a derived class are written to the database using {@link saveData}. Data objects can be retrieved at runtime using the {@link getData} function.
 */
export declare class Data {
    constructor(primaryKey: string);
    get primaryKey(): string;
}
/**
 * Saves one or more {@link Data} to the service.
 * - All changes made to Data must be saved or reverted by the end of the transaction. Otherwise, the endpoint call will fail with an Engine_UnsavedChanges error.
 * @param data - One or more Data to save.
 * @returns True if there were any changes to save, False otherwise.
 * */
export declare function saveData(...data: Data[]): boolean;
/**
 * Saves one or more {@link Data} and all the Data they reference (the entire tree) to their datastore's.
 * @param dataRoots - One or more Data, along with all the Data they reference, to save.
 * @returns True if there were any changes to save, False otherwise.
 * */
export declare function saveDataGraphs(...dataRoots: Data[]): boolean;
/**
 * Undoes any changes made since the last time a {@link Data}, {@link Endpoint}, or {@link Session} was saved in the current transaction.
 * - Only changes made since the last {@link saveData}/{@link saveDataGraphs} call are reverted.
 * - Only undoes changes made as part of the same transaction, that is, the same endpoint call.
 * - If there hasn't been a saveData/saveDataGraphs call then all changes made since the beginning of the
 * transaction will be reverted. This is always the case for Endpoints since they cannot be saved manually.
 * - This function does not revert any changes made to referenced Data/Endpoints (I.e. It leaves the rest of the object graph alone).
 * @param object - The object to revert.
 * */
export declare function revertObject<T extends Endpoint | Data | Session>(object: T): void;
/**
 * Creates a new {@link Session} instance allowing you to call its methods.
 * @param sessionType The class type that extends Session.
 * @param expireAfterInactivitySeconds How many seconds after the last call is made to the session to automatically delete the session.
 * @param expirationCallback A callback to call right before the session is deleted due to expiration.
 * @returns The Session instance.
 */
export declare function createSession<T extends Session>(sessionType: new (...args: any[]) => T, expireAfterInactivitySeconds?: number, expirationCallback?: (sessionId: string) => void): T;
/**
 * Gets or creates an {@link Endpoint} instance.
 * @param endpointType - The class type that extends Endpoint. (E.g. MyEndpoint)
 * @param primaryKey - The primary key used to uniquely identify the Endpoint instance.
 * @returns The Endpoint instance.
 * */
export declare function getEndpoint<T extends Endpoint>(endpointType: new (primaryKey: string) => T, primaryKey: string): T;
/**
 * Gets an existing {@link Session} instance.
 * @param sessionType - The class type that extends Session. (E.g. MySession)
 * @param sessionId - The session id used to uniquely identify the Session instance.
 * @returns The Session instance.
 * */
export declare function getSession<T extends Session>(sessionType: new (sessionId: string) => T, sessionId: string): T;
/**
 * Gets an existing {@link Data} instance from the service.
 * - New Data instances are not created automatically with this call. You can create new Data instances just like you
 * would any other JavaScript object: E.g. `let player = new Player("Scott")` where `Player` is a service class that
 * extends the Data base class.
 * @param dataType - The class type that extends Data. (E.g. `Player` that extends Data)
 * @param primaryKey - A string that uniquely identifies the Data instance.
 * @returns The Data instance.
 * */
export declare function getData<T extends Data>(dataType: new (...args: any[]) => T, primaryKey: string): T;
/**
 * Permanently deletes a {@link Session}, {@link Endpoint}, or {@link Data} instance from the service. Once it has been deleted it cannot be retrieved.
 * @param object - The Session, Endpoint, or Data object to permanently delete.
 * @param purge - (Optional, default = false) Normal deletion leaves behind a very small marker that prevents deleted endpoint and data instances from being re-created accidentally. Passing true to this argument prevents this marker from being written.
 * For endpoint deletions specifically, careful consideration should be made when setting this to true because it could result in accidental re-creation because endpoints are created-on-first-use.
 * */
export declare function deleteObject<T extends Session | Endpoint | Data>(object: T, purge?: boolean): void;
/**
 * Fires an {@link Event} instance to all clients that are subscribed.
 * - Any {@link Data} or {@link Endpoint}s referred to by properties on the Event that have had changes during the
 * current endpoint method call must be manually saved before calling fireEvent. Otherwise, an exception is thrown.
 * This ensures a consistent state for client-side event subscribers.
 * - Events will not be fired when an endpoint call returns an error or an exception is unhandled by your code.
 * @param source - A reference to an Endpoint or Data which will be used as the source of this event.
 * @param event - The Event object to send to all subscribed clients.
 * */
export declare function fireEvent<TS extends Endpoint | Data, TE extends Event>(source: TS, event: TE): void;
/**
 * Make a POST call to a remote HTTP[S] endpoint
 */
export declare function postHttp(url: string, data?: {}, config?: HttpConfig): Promise<HttpResponse>;
/**
 * Make a PUT call to a remote HTTP[S] endpoint
 */
export declare function putHttp(url: string, data?: {}, config?: HttpConfig): Promise<HttpResponse>;
/**
 * Make a PATCH call to a remote HTTP[S] endpoint
 */
export declare function patchHttp(url: string, data?: {}, config?: HttpConfig): Promise<HttpResponse>;
/**
 * Make a DELETE call to a remote HTTP[S] endpoint
 */
export declare function deleteHttp(url: string, data?: {}, config?: HttpConfig): Promise<HttpResponse>;
/**
 * Make a GET call to a remote HTTP[S] endpoint
 */
export declare function getHttp(url: string, config?: HttpConfig): Promise<HttpResponse>;
/**
 * Make a OPTIONS call to a remote HTTP[S] endpoint
 */
export declare function optionsHttp(url: string, config?: HttpConfig): Promise<HttpResponse>;
export declare class Stack<T> {
    private readonly capacity;
    private readonly storage;
    constructor(capacity?: number, initialValues?: T[]);
    items(): T[];
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
}
/**
 * A single unit of logic that modifies the {@link Program}'s execution state at runtime.
 * Instructions are {@link Prompt}s that have run before.
 * Instructions can be used to demonstrate to the Generative AI what sorts of outputs are expected.
 */
export interface Instruction {
    system?: string;
    user?: string;
    assistant?: string;
}
/**
 * Prompts provide callbacks into the {@link Program}'s execution.
 * A given prompt will only execute once during a {@link Program}'s execution.
 * After a Prompt's assistant callback is called, it becomes an {@link Instruction} as part of the program's execution.
 */
export interface Prompt {
    system?: string;
    user?: string;
    assistant: (response: ChatModelResponse) => string;
}
/**
 * An individual message returned from a Generative AI provider's API.
 */
export interface ChatModelMessage {
    role: "system" | "user" | "assistant";
    content: string;
}
/**
 * Chat models can perform prediction more than once in a single call if the 'n' setting is greater than 1.
 */
export interface ChatModelChoice {
    index: number;
    message: ChatModelMessage;
    finish_reason: string;
}
/**
 * Tracks how much usage your Generative AI provider thinks you've consumed.
 */
export interface ChatModelUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}
/**
 * A response returned as a result of calling a Generative AI provider's API.
 */
export interface ChatModelResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: ChatModelChoice[];
    usage: ChatModelUsage;
}
/**
 * A Step is either an {@link Instruction} or a {@link Prompt}
 */
export declare type Step = Instruction | Prompt;
/**
 * Settings passed to the chat model Generative AI provider with each request.
 * :::note
 * Not all settings are supported by all chat model providers.
 * :::
 * :::tip
 * You can add any additional properties to this object at runtime as needed by your provider.
 * :::
 */
export declare class ChatModelSettings {
    constructor();
    /**
     * Required. Indicates you're calling a chat model.
     * :::note
     * This property is not passed to the Generative AI provider.
     * :::
     */
    kind: 'chat-model';
    /**
     * Optional. Defaults to 0. Number between -2.0 and 2.0. Positive values penalize new tokens based
     * on their existing frequency in the text so far, decreasing the model's likelihood
     * to repeat the same line verbatim.
     */
    frequency_penalty?: number;
    /**
     * Optional. Modify the likelihood of specified tokens appearing in the completion.
     * Accepts an object that maps tokens (specified by their token ID in the tokenizer)
     * to an associated bias value from -100 to 100. Mathematically, the bias is added to the
     * logits generated by the model prior to sampling. The exact effect will vary per model,
     * but values between -1 and 1 should decrease or increase likelihood of selection; values
     * like -100 or 100 should result in a ban or exclusive selection of the relevant token.
     */
    logit_bias?: Map<string, number>;
    /**
     * Optional. Defaults to false. Whether to return log probabilities of the output tokens or not. If true,
     * returns the log probabilities of each output token returned in the content of message.
     */
    logprobs?: boolean;
    /**
     * Optional. An integer between 0 and 5 specifying the number of most likely tokens to
     * return at each token position, each with an associated log probability. logprobs must
     * be set to true if this parameter is used.
     */
    top_logprobs?: number;
    /** Optional. The maximum number of tokens that can be generated in the chat completion.
     * The total length of input tokens and generated tokens is limited by the model's context
     * length.
     */
    max_tokens?: number;
    /** Optional. Defaults to 1. How many chat completion choices to generate for each input message. Note
     * that you will be charged based on the number of generated tokens across all of the
     * choices. Keep n as 1 to minimize costs.*/
    n?: number;
    /**
     * Optional. Defaults to 0. Number between -2.0 and 2.0. Positive values penalize new tokens based on
     * whether they appear in the text so far, increasing the model's likelihood to talk about
     * new topics.
     */
    presence_penalty?: number;
    /**
     * Optional. Defaults to text. Setting to 'json' enables JSON mode, which guarantees the message
     * the model generates is valid JSON. Important: when using JSON mode, you must also instruct
     * the model to produce JSON yourself via a system or user message. Without this, the model
     * may generate an unending stream of whitespace until the generation reaches the token limit,
     * resulting in a long-running and seemingly "stuck" request. Also note that the message
     * content may be partially cut off if finish_reason="length", which indicates the generation
     * exceeded max_tokens or the conversation exceeded the max context length.
     */
    response_format?: 'text' | 'json';
    /**
     * Optional. If specified, our system will make a best effort to sample
     * deterministically, such that repeated requests with the same seed and parameters should
     * return the same result. Determinism is not guaranteed, and you should refer to the
     * system_fingerprint response parameter to monitor changes in the backend.
     */
    seed?: number;
    /** Optional. Up to 4 sequences where the API will stop generating further tokens. */
    stop?: Array<string> | string;
    /** Optional. Defaults to 1. What sampling temperature to use, between 0 and 2. Higher values like 0.8
     * will make the output more random, while lower values like 0.2 will make it more focused
     * and deterministic. We generally recommend altering this or top_p but not both. */
    temperature?: number;
    /**
     * Optional. Defaults to 1. An alternative to sampling with temperature, called nucleus sampling, where the
     * model considers the results of the tokens with top_p probability mass. So 0.1 means only
     * the tokens comprising the top 10% probability mass are considered. We generally recommend
     * altering this or temperature but not both.
     */
    top_p?: number;
    /**
     * Optional. A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.
     */
    user?: string;
}
/**
 * Describes how to communicate with an external Large Language Model API.
 * * Can be registered with the Model Registry using the `roli register-model` SDK command.
 * * Used by {@link Session}s to run {@link Program}s.
 * * Retrieved from the Model Registry at runtime using the {@link getModel} function.
 */
export declare class ModelSpecification {
    /**
     * The name of the model as passed to the Generative AI hosting provider.
     */
    name: string;
    /**
     * The HTTPS URL of the Generative AI hosting provider's API.
     */
    url: string;
    /**
     * The settings object to pass to the Generative AI hosting provider.
     */
    settings: ChatModelSettings;
    /**
     * Optional. The API key authorized to call the Generative AI hosting provider.
     */
    apiKey?: string | undefined | null;
    /**
     * Optional. Additional information to pass to the Generative AI hosting provider's API.
     */
    headers?: {} | undefined | null;
    constructor(name: string, url: string, settings: ChatModelSettings, apiKey?: string | null, headers?: {} | undefined | null);
}
/**
 * A Program is a synchronous execution of {@link Step}s on a Large Language Model.
 *
 * Requirements:
 * 1) At least one step must be a {@link Prompt}.
 * 2) The last step must be a {@link Prompt}.
 */
export declare class Program {
    private readonly _model;
    private readonly _steps;
    get model(): ModelSpecification;
    get steps(): Stack<Step>;
    constructor(model: ModelSpecification, stepOrSteps: Step[] | Step);
}
/**
 * Retrieves a {@link ModelSpecification} instance suitable for execution by a {@link Program} in a {@link Session}.
 * @param key The key used to register the model specification with the Model Registry.
 */
export declare function getModel(key: string): ModelSpecification;
/**
 * Optional configuration object for the *Http function calls.
 */
export declare class HttpConfig {
    baseUrl?: string;
    headers?: {};
    timeout?: number;
}
/**
 * The response object returned by the *Http functions.
 */
export declare class HttpResponse {
    status: number;
    data?: {} | string;
    headers?: {};
}
/**
 * Thrown when any of the *Http functions receive a non-2xx code.
 */
export declare class HttpError {
    status: number;
    headers?: {};
}
