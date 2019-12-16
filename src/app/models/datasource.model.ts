export enum ConnectionProtocolEnum {
    WS,
    WSS,
    HTTP,
    HTTPS
}

export enum GremlinVersionEnum {
    VER_3_2,
    VER_3_3
}

export class DataSource {
    label: string;
    host: string;
    port = 8182;
    protocol: ConnectionProtocolEnum = ConnectionProtocolEnum.WS;
    gremlinVersion: GremlinVersionEnum = GremlinVersionEnum.VER_3_3;
    contextPath = '/gremlin'; // must include leading slash but exclude ending slash.
}
