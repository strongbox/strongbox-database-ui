import {Expose, plainToClass, Transform, Type} from 'class-transformer';

import {QueryInterface} from './query.model';

export class QueryResponse {
    requestId: string;
    query: QueryInterface;

    @Type(() => Result)
    result: Result;

    status: {
        attributes: Map<string, any>,
        code: number,
        message?: string
    };

    isSuccess() {
        return this.status.code >= 200 && this.status.code < 300;
    }
}

export class Result {
    meta: any;
    data: any;
}

export interface AbstractResultData {
    _id: any;
    _type: 'node' | 'relationship';
    _label?: string;

    [key: string]: any;
}
