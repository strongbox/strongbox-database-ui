import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import * as d3 from 'd3';
import {QueryResponse} from '../../../../../../models/query-result.model';
import {GraphViewData} from '../../../../../../models/views/graph-view-data';
import {GraphLink} from '../../../../../../models/graph/link.model';
import {GraphNode} from '../../../../../../models/graph/node.model';

@Component({
    selector: 'app-console-query-result-graph-view',
    templateUrl: './console-query-result-graph-view.component.html',
    styleUrls: ['./console-query-result-graph-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsoleQueryResultGraphViewComponent implements OnInit, OnDestroy, AfterContentInit {

    @Input()
    result: QueryResponse = null;

    graph: GraphViewData = new GraphViewData();

    graphWidth;
    graphHeight;

    @ViewChild('graphContainer', {static: true})
    graphContainer!: ElementRef;

    canvas: any = null;
    context: any = null;
    simulation: any = null;
    transform: any = null;
    zoomBehavior: any = null;
    data: any = null;

    readonly defaultCircleRadius = 10;

    constructor(private chgRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        // Disable NgZone/Change Detection for better performance (but be sure to call this.chgRef.detectChanges() when this is needed)
        this.chgRef.detach();
        // Set data
        this.graph = new GraphViewData(this.result);
    }

    ngOnDestroy(): void {
        // destroy simulation
        if (this.simulation !== null) {
            this.simulation.stop();
        }
    }

    ngAfterContentInit(): void {
        if (this.isGraphViewAvailable() === false) {
            this.chgRef.detectChanges();
            return;
        }

        try {
            this.initCanvas();
            this.initD3();
            this.chgRef.detectChanges();
        } catch (e) {
            // stop simulation immediately
            if (this.simulation !== null) {
                this.simulation.stop();
            }
            console.error(e);
        }
    }

    isGraphViewAvailable(): boolean {
        return this.getData() !== null && this.getData().nodes.size > 0;
    }

    getData() {
        return this.graph;
    }

    getBoundingContainerRect(): ClientRect | DOMRect {
        return (this.graphContainer.nativeElement as HTMLElement).getBoundingClientRect();
    }

    fillColor(d: any) {
        const fill = d3.scaleOrdinal(d3.schemeCategory10);
        return fill(d.group);
    }

    initCanvas() {
        // Set graph height and width based on the bounding container.
        this.graphHeight = this.getBoundingContainerRect().height;
        this.graphWidth = this.getBoundingContainerRect().width + 30;

        this.canvas = d3.select('#graphContainer')
                        .append('canvas')
                        .attr('height', this.graphHeight)
                        .attr('width', this.graphWidth)
                        .attr('background', 'hsla(210, 30%, 20%, 1)')
        ;

        this.context = this.canvas.node().getContext('2d');
    }

    initD3() {
        // Transformation
        this.transform = d3.zoomIdentity;

        // Force simulation
        this.simulation = d3.forceSimulation()
                            .force('center', d3.forceCenter(this.graphWidth / 2, this.graphHeight / 2))
                            .force('x', d3.forceX())
                            .force('y', d3.forceY())
                            .force('charge', d3.forceManyBody().strength(-100).theta(0.7))
                            .force(
                                'link',
                                d3.forceLink()
                                  .distance((d: GraphLink) => {
                                      const label = this.shortenLabel(d.label);
                                      if (label !== null && label.length > 20) {
                                          return 260;
                                      }
                                      return 150;
                                  })
                                  .strength(1)
                                  .id((d: GraphNode | any) => d.id)
                            )
                            .alphaTarget(0) // stop moving particles after alphaDecay
                            .alphaDecay(0.015);

        // Tick simulation to update render
        this.simulation.nodes(Array.from(this.getData().nodes.values())).on('tick', () => this.render());

        // Force edge links
        this.simulation.force('link').links(this.getData().links);

        // Drag & Zoom support
        this.canvas
            .call(this.onDragHandler())
            .call(this.onZoomHandler())
        ;
    }

    draggedSubject() {
        return () => {
            const x = this.transform.invertX(d3.event.x);
            const y = this.transform.invertY(d3.event.y);

            // An additional offset is needed to help dragging nodes when the nodes are smaller (zoomed out).
            const offset = 150;

            let index: number;
            let node: GraphNode;
            for ([index, node] of this.getData().nodes.entries() as any) {
                const dx = x - node.x;
                const dy = y - node.y;

                if (dx * dx + dy * dy < (this.defaultCircleRadius * this.defaultCircleRadius + offset)) {
                    node.x = this.transform.applyX(node.x);
                    node.y = this.transform.applyY(node.y);
                    return node;
                }
            }
        };
    }

    onDragHandler() {
        return d3.drag()
                 .subject(this.draggedSubject())
                 .on('start', (node: any) => {
                     if (!d3.event.active) {
                         this.simulation.alphaTarget(0.3).restart();
                     }
                     d3.event.subject.fx = this.transform.invertX(d3.event.x);
                     d3.event.subject.fy = this.transform.invertY(d3.event.y);
                 })
                 .on('drag', (node: any) => {
                     d3.event.subject.fx = this.transform.invertX(d3.event.x);
                     d3.event.subject.fy = this.transform.invertY(d3.event.y);
                 })
                 .on('end', (node: any) => {
                     if (!d3.event.active) {
                         this.simulation.alphaTarget(0);
                     }
                     d3.event.subject.fx = null;
                     d3.event.subject.fy = null;
                 });
    }

    zoom(type: 'in' | 'out' | 'reset') {
        if (this.canvas) {
            const transition = this.canvas.transition().duration(750);
            if (type === 'in') {
                transition.call(this.zoomBehavior.scaleBy, 2);
            } else if (type === 'out') {
                transition.call(this.zoomBehavior.scaleBy, 0.5);
            } else {
                transition.call(
                    this.zoomBehavior.transform,
                    d3.zoomIdentity,
                    d3.zoomTransform(this.canvas.node()).invert([this.graphWidth / 2, this.graphHeight / 2]),
                );
            }
        }
    }

    onZoomHandler() {
        return this.zoomBehavior = d3.zoom()
                                     .scaleExtent([1 / 10, 4])
                                     .duration(750)
                                     .on('zoom', () => {
                                         this.transform = d3.event.transform;
                                         this.render();
                                     });
    }

    render() {
        this.context.save();
        this.context.clearRect(0, 0, this.graphWidth, this.graphHeight);

        // setup background color.
        this.context.globalAlpha = 1;
        this.context.fillStyle = 'hsla(210, 30%, 20%, 1)'; // $header-nav-background
        this.context.fillRect(0, 0, this.graphWidth, this.graphHeight);

        // setup zoom / scale
        this.context.translate(this.transform.x, this.transform.y);
        this.context.scale(this.transform.k, this.transform.k);

        // Draw links
        this.getData().links.forEach((d: any, i: number) => this.drawLink(d, i));

        // Draw nodes
        this.getData().nodes.forEach((d: any, i: number) => this.drawNode(d, i));

        this.context.restore();
    }

    shortenLabel(label: string = null): string {
        if (!label) {
            return null;
        }

        // limit label length
        if (label.length > 30) {
            label = label.substr(0, 30) + '...';
        }

        return label;
    }

    drawNode(d: GraphNode, i: number) {
        const radius = this.defaultCircleRadius + (d.hasOwnProperty('radius') ? d.radius : 0);

        // render the node
        this.context.beginPath();
        this.context.arc(d.x, d.y, radius, 0, 2 * Math.PI, true);
        this.context.fillStyle = this.fillColor(d);
        this.context.fill();

        // render a small white stroke around the node.
        this.context.lineWidth = 0.8;
        this.context.strokeStyle = '#E8E8E8'; // d3.rgb(this.fillColor(d.group)).brighter(1);
        this.context.stroke();

        // render a label to the node
        const label = this.shortenLabel(d.label);
        if (label !== null) {
            this.context.fillStyle = 'rgba(255,255,255,0.7)';
            this.context.zIndex = 9;
            this.context.fillText(label, d.x + radius + 8, d.y - 4);
            this.context.font = '100 Arial';
            this.context.fillText('#' + d.id['@value'], d.x + radius + 8, d.y + 9);
        }
    }

    drawLink(d: GraphLink, i: number) {
        if (d === null || d.source === null || d.source === undefined || d.target === null || d.target === undefined) {
            return;
        }

        // bezier curve settings
        const cpx1 = d.source.x + 25;
        const cpy1 = d.source.y + 30;
        const cpx2 = d.target.x - 25;
        const cpy2 = d.target.y + 30;
        const x = d.target.x + 5;
        const y = d.target.y;

        // render path
        this.context.beginPath();
        this.context.moveTo(d.source.x, d.source.y);
        this.context.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y);
        this.context.lineWidth = 0.6;
        this.context.strokeStyle = '#546e7a';
        this.context.stroke();

    }
}

