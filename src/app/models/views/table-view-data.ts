import {QueryResponse} from '../query-result.model';

/**
 * This class expects to receive a {@link QueryResponse} which is then going to be transformed into a structure
 * that can be displayed as a table.
 */
export class TableViewData {
    readonly columns: Set<string> = new Set();

    readonly data: Map<string, any>[] = [];

    constructor(response: QueryResponse) {
        if (response !== null && response.result.data != null) {
            this.data = Array.from({length: response.result.data['@value'].length}, () => new Map<any, any>());
            this.processData(response.result.data);
        }
        // fallback for when query result is `g:Vertex` or something else.
        if (this.columns.size === 0) {
            this.data = [];
        }
    }

    /**
     * Process the response.result.data
     *
     * @param resultData response.result.data
     */
    protected processData(resultData: any) {
        for (const [rowIndex, rowRecord] of resultData['@value'].entries()) {
            if (rowRecord['@type'] === 'g:Map') {
                this.processRow(rowIndex, rowRecord['@value']);
            }
        }
    }

    protected processRow(rowIndex, rowColumns) {
        // each row has a graph value array where the first element is the prefix name of the column and the second is the column value.
        for (let y = 0; y < rowColumns.length; y = y + 2) {
            const columnPrefix = rowColumns[y];
            const columnValue = rowColumns[(y + 1)];

            // handle aliased return types where the value is expected to be string / number / etc (but not an object)
            if (typeof columnValue !== 'object') {
                const columnName = columnPrefix;
                this.columns.add(columnPrefix);
                this.data[rowIndex].set(columnName, columnValue);
            } else {
                // handle non-aliased types return an array of values where N = column name; N+1 = column value.
                const columnGraphValue = columnValue['@value'];
                this.processColumns(rowIndex, columnPrefix, columnGraphValue);
            }
        }
    }

    protected processColumns(rowIndex, columnPrefix, columnGraphValue: [] = []) {
        const obj = this.convertArrayToObject(columnGraphValue);

        if (Object.keys(obj).length === 0) {
            if (typeof columnGraphValue === 'number' || typeof columnGraphValue === 'string') {
                this.columns.add(columnPrefix);
                this.data[rowIndex].set(columnPrefix, columnGraphValue);
            }

            return;
        }

        for (const [columnKey, columnValue] of Object.entries(obj)) {
            const columnName = columnPrefix + '.' + columnKey;

            // we need to add the columnName only for the first row - each next one will have the same
            if (rowIndex === 0) {
                this.columns.add(columnName);
            }

            this.data[rowIndex].set(columnName, columnValue);
        }
    }

    protected convertArrayToObject(data: any[]): any {
        const obj = {};

        for (let i = 0; i < data.length; i = i + 2) {
            const columnKey = data[i];
            const columnValue = data[(i + 1)];
            obj[columnKey] = columnValue;
        }

        return obj;
    }
}
