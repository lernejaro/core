// import {GeometryObject} from './geometry-object'
// import {Point} from './point'
// import {Polygon} from './polygon'
// import {Segment} from './segment'
// import {Line} from './line'
//
// // This is used for calculations, not for drawing.
// // To draw a rectangular area, draw a polygon and set its fill color.
// export class RectangularArea extends GeometryObject {
//
//   public static AreEqual(rectangularArea1: RectangularArea,
//                          rectangularArea2: RectangularArea): boolean {
//     const [point11, point12] = rectangularArea1.getPoints()
//     const [point21, point22] = rectangularArea2.getPoints()
//     return Point.AreEqual(point11, point21) && Point.AreEqual(point12, point22)
//   }
//
//   public static FromTwoPoints(point1: Point, point2: Point): RectangularArea {
//     return new RectangularArea(point1.x(), point1.y(), point2.x(), point2.y())
//   }
//
//   protected _point1: Point
//   protected _point2: Point
//
//   protected constructor(x1: number, y1: number, x2: number, y2: number, label?: string) {
//     super('rectangular-area')
//
//     const minX = Math.min(x1, x2)
//     const minY = Math.min(y1, y2)
//     const maxX = Math.max(x1, x2)
//     const maxY = Math.max(y1, y2)
//
//     this._point1 = Point.FromCartesianCoordinates(minX, minY)
//     this._point2 = Point.FromCartesianCoordinates(maxX, maxY)
//     this._label = label
//   }
//
//   public readJson(json): this {
//     this.label(json.label)
//     this.strokeColor(json.strokeColor)
//     const {x1, x2, y1, y2} = json.value['two-points']
//     this._point1 = Point.FromCartesianCoordinates(x1, y1)
//     this._point2 = Point.FromCartesianCoordinates(x2, y2)
//     return this
//   }
//
//   public writeJson() {
//     return {
//       kind: 'point',
//       label: this.label(),
//       color: this.strokeColor(),
//       defaultValue: 'two-points',
//       value: {
//         'two-points': this.getPoints(),
//       },
//     }
//   }
//
//   public getPoints(): Point[] {
//     return [this._point1, this._point2]
//   }
//
//   public copyValuesFrom(rectangularArea: RectangularArea): this {
//     [this._point1, this._point2] = rectangularArea.getPoints().map(ra => ra.clone())
//     return this
//   }
//
//   protected cloneValues(): this {
//     const [point1, point2] = [this._point1.clone(), this._point2.clone()]
//     return <this>RectangularArea.FromTwoPoints(point1, point2)
//   }
//
//   protected destructToPoints(): Point[] {
//     return this.getPoints().map(ra => ra.clone())
//   }
//
//   protected reconstructFromPoints(...points: Point[]): this {
//     [this._point1, this._point2] = points
//     return this
//   }
//
//   public getPolygon(): Polygon {
//     const [A, C] = [this._point1.clone(), this._point2.clone()]
//     const {x: Ax, y: Ay} = A.getCartesianCoordinates()
//     const {x: Cx, y: Cy} = C.getCartesianCoordinates()
//     const B = Point.FromCartesianCoordinates(Cx, Ay)
//     const D = Point.FromCartesianCoordinates(Ax, Cy)
//     return Polygon.FromVertices(A, B, C, D)
//   }
//
//   public getVertices(): Point[] {
//     return this.getPolygon().vertices()
//   }
//
//   public getSegments(): Segment[] {
//     return this.getPolygon().segments()
//   }
//
//   public getLines(): Line[] {
//     return this.getSegments().map(segment => segment.getLine())
//   }
//
//   public getCenterPoint(): Point {
//     const [point1, point2] = this.getPoints()
//     return Point.GetPointBetween(point1, point2)
//   }
//
//   public containsPoint(point: Point): boolean {
//     const center = this.getCenterPoint()
//     return this.getLines().every(line => line.pointsAreOnSameSide(point, center))
//   }
//
//   public pointsLaysOnTheEdge(point: Point): boolean {
//     return this.getLines().some(line => line.containsPoint(point))
//   }
//
//   public containsPointInclusively(point: Point): boolean {
//     return this.containsPoint(point) || this.pointsLaysOnTheEdge(point)
//   }
//
//   public containsSegmentFully(segment: Segment): boolean {
//     return segment.getPoints().every(this.containsPoint.bind(this))
//   }
//
//   public containsSegmentAtLeastPartially(segment: Segment): boolean {
//     return segment.getPoints().some(this.containsPoint.bind(this))
//   }
//
//   public getCapturedSegment(line: Line): Segment | null {
//     const intersections = this.getSegments()
//       .map(segment => Segment.GetIntersectionWithLine(segment, line))
//       .filter(point => point != null)
//
//     if (intersections.length != 2) {
//       return null
//     }
//
//     const [A, B] = intersections
//     return Segment.FromTwoPoints(A, B)
//   }
//
// }
