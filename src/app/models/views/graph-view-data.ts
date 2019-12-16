import {GraphNode} from '../graph/node.model';
import {GraphLink} from '../graph/link.model';
import {QueryResponse} from '../query-result.model';
import {UUID4} from '../query.model';

/**
 * This class expects to receive a {@link QueryResponse} which is then going to be transformed into a structure
 * that can be displayed as a graph.
 */
export class GraphViewData {
    readonly nodes: Map<any, GraphNode> = new Map();
    readonly links: GraphLink[] = [];

    private queuedLinks: any[] = [];

    constructor(response: QueryResponse = null) {
        if (response !== null && response.result.data !== null) {
            this.processData(response.result.data);
        }
    }

    /**
     * Process the response.result.data
     *
     * @param resultData response.result.data
     */
    protected processData(resultData: any) {
        // process nodes
        for (const [rowIndex, rowRecord] of resultData['@value'].entries()) {
            if (rowRecord['@type'] === 'g:Map') {
                this.processNodes(rowIndex, rowRecord['@value']);
            }
        }

        // process links
        this.processLinksQueue();
    }

    /**
     * We process the nodes first and add all relationships to a queue to be processed later.
     * The reason for this is because the link's source and target properties must be a GraphNode.
     *
     * @param rowIndex number
     * @param rowValue any
     */
    protected processNodes(rowIndex, rowValue) {
        const obj = this.convertArrayToObject(rowValue);
        for (const [key, data] of Object.entries(obj)) {
            // non-aliased return
            if (data.hasOwnProperty('_type')) {
                if (data._type === 'node') {
                    const graphNode = new GraphNode();
                    if (data.hasOwnProperty('_id')) {
                        graphNode.id = data._id;
                    } else {
                        // generate one so that we can add it to the map.
                        graphNode.id = 'autogen-' + UUID4();
                    }
                    graphNode.label = data._label;
                    graphNode.data = data;
                    this.nodes.set(JSON.stringify(graphNode.id), graphNode);
                } else if (data._type === 'relationship') {
                    this.queuedLinks.push(data);
                }
            }
        }
    }

    protected processLinksQueue() {
        this.queuedLinks.forEach((data) => {
            const graphLink = new GraphLink();
            graphLink.id = data._id;
            graphLink.label = data._label;
            graphLink.data = data;
            graphLink.source = this.nodes.get(JSON.stringify(data._inV));
            graphLink.target = this.nodes.get(JSON.stringify(data._outV));
            this.links.push(graphLink);
        });

        // cleanup.
        this.queuedLinks = null;
    }

    protected convertArrayToObject(data: any[]): object {
        const obj = {};

        for (let i = 0; i < data.length; i = i + 2) {
            const columnKey = data[i];
            let columnValue = data[(i + 1)];

            if (columnValue.hasOwnProperty('@value') && Array.isArray(columnValue['@value'])) {
                columnValue = this.convertArrayToObject(columnValue['@value']);
            }

            obj[columnKey] = columnValue;
        }

        return obj;
    }
}
