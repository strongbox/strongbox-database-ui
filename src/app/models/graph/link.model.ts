import {GraphNode} from './node.model';

export class GraphLink {
    id: any;
    uuid?: string;
    label?: string;
    source: GraphNode;
    target: GraphNode;
    data?: { _id: any; _type: 'node' | 'relationship'; _label: string; [key: string]: any; } | string;
    x?: number;
    y?: number;
}
