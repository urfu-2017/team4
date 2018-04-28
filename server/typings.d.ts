declare module 'base64-stream' {
    export function encode(): any;
}

declare module 'jsonrpc-lite' {
    export interface JsonRpcObject {
        jsonrpc: '2.0';
        serialize(): JsonRpcObject;
    }

    interface RequestObject extends JsonRpcObject {
        id: string;
        method: string;
        params?: Record<string, any>;
    }

    interface NotificationObject extends JsonRpcObject {
        method: string;
        params?: Record<string, any>;
    }

    interface SuccessObject extends JsonRpcObject {
        id: string;
        result: any;
    }

    interface ErrorObject extends JsonRpcObject {
        id: string;
        error: any;
    }

    interface JsonRpcParsed {
        type: 'request' | 'notification' | 'success' | 'error' | 'invalid';
        payload: RequestObject & NotificationObject & SuccessObject & ErrorObject;
    }

    export class JsonRpcError extends Error {
        public static invalidRequest(data: any): JsonRpcError;
        public static methodNotFound(data: any): JsonRpcError;
        public static invalidParams(data: any): JsonRpcError;
        public static internalError(data: any): JsonRpcError;
        public static parseError(data: any): JsonRpcError;

        constructor(message: string, code: number, data?: any);
    }

    export function request(
        id: string,
        method: string,
        params?: Record<string, any>
    ): RequestObject;

    export function notification(method: string, params?: Record<string, any>): NotificationObject;
    export function success(id: string, result: any): SuccessObject;
    export function error(id: string, error: JsonRpcError): ErrorObject;
    export function parse(message: any): JsonRpcParsed;
    export function parseObject(object: object): JsonRpcParsed;
}
