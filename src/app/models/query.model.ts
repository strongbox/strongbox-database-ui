import {Transform} from 'class-transformer';

export const UUID4 = () => {
    /* tslint:disable */
    // Timestamp
    let d = new Date().getTime();
    // Time in microseconds since page-load or 0 if unsupported
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // random number between 0 and 16
        let r = Math.random() * 16;
        // Use timestamp until depleted
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        }
        // Use microseconds since page-load if supported
        else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    /* tslint:enable */
};


export enum QueryTypeEnum {
    CYPHER,
    GREMLIN
}

export interface QueryInterface {
    getRequestId(): string;

    getProcessor(): string;

    getQuery(): string;
}

export abstract class AbstractQueryRequest implements QueryInterface {
    protected requestId: string;
    protected processor: string;
    protected op = 'eval';

    @Transform((m: Map<string, any>) => {
        return [...m.entries()].reduce((obj, [key, value]) => (obj[key] = value, obj), {});
    }, {toPlainOnly: true})
    protected args: Map<string, any> = new Map<string, any>();

    constructor(processor: string) {
        this.processor = processor;
        this.setArg('bindings', {});
    }

    setArg(key, value) {
        this.args.set(key, value);
    }

    deleteArg(key: string): void {
        if (this.args.has(key)) {
            this.args.delete(key);
        }
    }

    hasArg(key: string): boolean {
        return this.args.has(key);
    }

    getArg(key): any | null {
        if (this.hasArg(key)) {
            return this.args.get(key);
        }

        return null;
    }

    getRequestId(): string {
        return this.requestId;
    }

    getProcessor(): string {
        return this.processor;
    }

    getQuery(): string {
        return this.getArg('gremlin');
    }
}

export class GremlinQueryRequest extends AbstractQueryRequest {
    constructor(query: string) {
        super('');
        this.setArg('language', 'gremlin-groovy');
        this.setArg('gremlin', query.trim());
    }
}

export class CypherQueryRequest extends AbstractQueryRequest {
    constructor(query: string) {
        super('cypher');
        this.setArg('gremlin', query.trim());
    }
}
