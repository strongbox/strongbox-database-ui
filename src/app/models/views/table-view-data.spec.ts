import {plainToClass} from 'class-transformer';

import {QueryResponse} from '../query-result.model';
import {TableViewData} from './table-view-data';

describe('TableViewData', () => {
    it('should convert valid cypher response 1', () => {
        const queryResponse = plainToClass(QueryResponse, JSON.parse(validCypherResponse1));
        const converted = new TableViewData(queryResponse);
        console.log(queryResponse, converted);

        expect(converted).toBeTruthy();
        expect(converted.columns.size).toBe(14);
        expect(converted.data.length).toBe(10);
    });

    it('should convert valid cypher response 2', () => {
        const queryResponse = plainToClass(QueryResponse, JSON.parse(validCypherResponse2));
        const converted = new TableViewData(queryResponse);
        console.log(queryResponse, converted);

        expect(converted).toBeTruthy();
        expect(converted.columns.size).toBe(2);
        expect(converted.data.length).toBe(3);
    });

    /**
     * TODO: Currently not supported.
     */
    it('should not convert gremlin response', () => {
        const queryResponse = plainToClass(QueryResponse, JSON.parse(validGremlinResponse));
        const converted = new TableViewData(queryResponse);
        console.log(queryResponse, converted);

        expect(converted).toBeTruthy();
        expect(converted.columns.size).toBe(0);
        expect(converted.data.length).toBe(0);
    });
});

/* tslint:disable:max-line-length */
const validCypherResponse1 = '{"requestId":"9bf813ce-e399-4019-b0dd-3027ed3ad8be","status":{"message":"","code":200,"attributes":{"@type":"g:Map","@value":["host","/127.0.0.1:53250"]}},"result":{"data":{"@type":"g:List","@value":[{"@type":"g:Map","@value":["p",{"@type":"g:Map","@value":["github","fuss86","_type","node","name","Przemyslaw Fusik","_id",{"@type":"g:Int64","@value":8432},"_label","Person"]},"r",{"@type":"g:Map","@value":["_type","relationship","_outV",{"@type":"g:Int64","@value":8432},"_id",{"@type":"janusgraph:RelationIdentifier","@value":{"relationId":"4ri-6i8-glx-9o0"}},"_inV",{"@type":"g:Int64","@value":12528},"_label","CONTRIBUTES_TO"]},"pr",{"@type":"g:Map","@value":["_type","node","name","Strongbox","_id",{"@type":"g:Int64","@value":12528},"_label","Project"]}]},{"@type":"g:Map","@value":["p",{"@type":"g:Map","@value":["github","carlspring","_type","node","name","Martin Todorov","_id",{"@type":"g:Int64","@value":4240},"_label","Person"]},"r",{"@type":"g:Map","@value":["_type","relationship","_outV",{"@type":"g:Int64","@value":4240},"_id",{"@type":"janusgraph:RelationIdentifier","@value":{"relationId":"1zm-39s-glx-9o0"}},"_inV",{"@type":"g:Int64","@value":12528},"_label","CONTRIBUTES_TO"]},"pr",{"@type":"g:Map","@value":["_type","node","name","Strongbox","_id",{"@type":"g:Int64","@value":12528},"_label","Project"]}]},{"@type":"g:Map","@value":["p",{"@type":"g:Map","@value":["github","test","_type","node","name","Test User","_id",{"@type":"g:Int64","@value":4312},"_label","Person"]},"r",{"@type":"g:Map","@value":["_type","relationship","_outV",{"@type":"g:Int64","@value":4312},"_id",{"@type":"janusgraph:RelationIdentifier","@value":{"relationId":"1zv-3bs-glx-9o0"}},"_inV",{"@type":"g:Int64","@value":12528},"_label","CONTRIBUTES_TO"]},"pr",{"@type":"g:Map","@value":["_type","node","name","Strongbox","_id",{"@type":"g:Int64","@value":12528},"_label","Project"]}]},{"@type":"g:Map","@value":["p",{"@type":"g:Map","@value":["github","steve-todorov","_type","node","name","Steve Todorov","_id",{"@type":"g:Int64","@value":4200},"_label","Person"]},"r",{"@type":"g:Map","@value":["_type","relationship","_outV",{"@type":"g:Int64","@value":4200},"_id",{"@type":"janusgraph:RelationIdentifier","@value":{"relationId":"1zh-38o-glx-9o0"}},"_inV",{"@type":"g:Int64","@value":12528},"_label","CONTRIBUTES_TO"]},"pr",{"@type":"g:Map","@value":["_type","node","name","Strongbox","_id",{"@type":"g:Int64","@value":12528},"_label","Project"]}]},{"@type":"g:Map","@value":["p",{"@type":"g:Map","@value":["github","sbespalov","_type","node","name","Sergey Bespalov","_id",{"@type":"g:Int64","@value":4336},"_label","Person"]},"r",{"@type":"g:Map","@value":["_type","relationship","_outV",{"@type":"g:Int64","@value":4336},"_id",{"@type":"janusgraph:RelationIdentifier","@value":{"relationId":"55q-3cg-glx-9o0"}},"_inV",{"@type":"g:Int64","@value":12528},"_label","CONTRIBUTES_TO"]},"pr",{"@type":"g:Map","@value":["_type","node","name","Strongbox","_id",{"@type":"g:Int64","@value":12528},"_label","Project"]}]},{"@type":"g:Map","@value":["p",{"@type":"g:Map","@value":["github","fuss86","_type","node","name","Przemyslaw Fusik","_id",{"@type":"g:Int64","@value":8432},"_label","Person"]},"r",{"@type":"g:Map","@value":["_type","relationship","_outV",{"@type":"g:Int64","@value":8432},"_id",{"@type":"janusgraph:RelationIdentifier","@value":{"relationId":"odxcu-6i8-glx-3bc"}},"_inV",{"@type":"g:Int64","@value":4296},"_label","CONTRIBUTES_TO"]},"pr",{"@type":"g:Map","@value":["_type","node","name","test","_id",{"@type":"g:Int64","@value":4296},"_label","Project"]}]},{"@type":"g:Map","@value":["p",{"@type":"g:Map","@value":["github","carlspring","_type","node","name","Martin Todorov","_id",{"@type":"g:Int64","@value":4240},"_label","Person"]},"r",{"@type":"g:Map","@value":["_type","relationship","_outV",{"@type":"g:Int64","@value":4240},"_id",{"@type":"janusgraph:RelationIdentifier","@value":{"relationId":"odxci-39s-glx-3bc"}},"_inV",{"@type":"g:Int64","@value":4296},"_label","CONTRIBUTES_TO"]},"pr",{"@type":"g:Map","@value":["_type","node","name","test","_id",{"@type":"g:Int64","@value":4296},"_label","Project"]}]},{"@type":"g:Map","@value":["p",{"@type":"g:Map","@value":["github","test","_type","node","name","Test User","_id",{"@type":"g:Int64","@value":4312},"_label","Person"]},"r",{"@type":"g:Map","@value":["_type","relationship","_outV",{"@type":"g:Int64","@value":4312},"_id",{"@type":"janusgraph:RelationIdentifier","@value":{"relationId":"odxcr-3bs-glx-3bc"}},"_inV",{"@type":"g:Int64","@value":4296},"_label","CONTRIBUTES_TO"]},"pr",{"@type":"g:Map","@value":["_type","node","name","test","_id",{"@type":"g:Int64","@value":4296},"_label","Project"]}]},{"@type":"g:Map","@value":["p",{"@type":"g:Map","@value":["github","steve-todorov","_type","node","name","Steve Todorov","_id",{"@type":"g:Int64","@value":4200},"_label","Person"]},"r",{"@type":"g:Map","@value":["_type","relationship","_outV",{"@type":"g:Int64","@value":4200},"_id",{"@type":"janusgraph:RelationIdentifier","@value":{"relationId":"odxcd-38o-glx-3bc"}},"_inV",{"@type":"g:Int64","@value":4296},"_label","CONTRIBUTES_TO"]},"pr",{"@type":"g:Map","@value":["_type","node","name","test","_id",{"@type":"g:Int64","@value":4296},"_label","Project"]}]},{"@type":"g:Map","@value":["p",{"@type":"g:Map","@value":["github","sbespalov","_type","node","name","Sergey Bespalov","_id",{"@type":"g:Int64","@value":4336},"_label","Person"]},"r",{"@type":"g:Map","@value":["_type","relationship","_outV",{"@type":"g:Int64","@value":4336},"_id",{"@type":"janusgraph:RelationIdentifier","@value":{"relationId":"odxr2-3cg-glx-3bc"}},"_inV",{"@type":"g:Int64","@value":4296},"_label","CONTRIBUTES_TO"]},"pr",{"@type":"g:Map","@value":["_type","node","name","test","_id",{"@type":"g:Int64","@value":4296},"_label","Project"]}]}]},"meta":{"@type":"g:Map","@value":[]}}}';
const validCypherResponse2 = '{"requestId":"0b562bd2-93a9-4a22-a878-a3c56d940e5e","status":{"message":"","code":200,"attributes":{"@type":"g:Map","@value":["host","/127.0.0.1:32800"]}},"result":{"data":{"@type":"g:List","@value":[{"@type":"g:Map","@value":["label","Company","count",{"@type":"g:Int64","@value":1}]},{"@type":"g:Map","@value":["label","Person","count",{"@type":"g:Int64","@value":5}]},{"@type":"g:Map","@value":["label","Project","count",{"@type":"g:Int64","@value":2}]}]},"meta":{"@type":"g:Map","@value":[]}}}';
const validGremlinResponse = '{"requestId":"868829d5-b726-443e-a5ff-f3e5b7748767","status":{"message":"","code":200,"attributes":{"@type":"g:Map","@value":["host","/127.0.0.1:41694"]}},"result":{"data":{"@type":"g:List","@value":[{"@type":"g:Vertex","@value":{"id":{"@type":"g:Int64","@value":12528},"label":"Project","properties":{"name":[{"@type":"g:VertexProperty","@value":{"id":{"@type":"janusgraph:RelationIdentifier","@value":{"relationId":"4da-9o0-dfp"}},"value":"Strongbox","label":"name"}}]}}},{"@type":"g:Vertex","@value":{"id":{"@type":"g:Int64","@value":4296},"label":"Project","properties":{"name":[{"@type":"g:VertexProperty","@value":{"id":{"@type":"janusgraph:RelationIdentifier","@value":{"relationId":"17d-3bc-dfp"}},"value":"test","label":"name"}}]}}}]},"meta":{"@type":"g:Map","@value":[]}}}';
