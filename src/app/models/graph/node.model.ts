import {AbstractResultData} from '../query-result.model';

export class GraphNode {
    id?: { '@type': string, '@value': any } | any;
    type?: string;
    uuid?: string;
    label?: string;
    radius?: number;
    data?: AbstractResultData | string;
    x?: number;
    y?: number;
    vy?: number;
    vx?: number;
}
