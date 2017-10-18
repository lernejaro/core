// import {GeometryObject} from './geometry-object'
// import {Point} from './point'
// import {Line} from './line'
// import {RectangularArea} from './rectangular-area'
//
// export class Segment extends GeometryObject {
//
//   public static AreEqual(segment1: Segment, segment2: Segment): boolean {
//     const [point11, point12] = segment1.getPoints()
//     const [point21, point22] = segment2.getPoints()
//     return (Point.AreEqual(point11, point21) && Point.AreEqual(point12, point22))
//       || (Point.AreEqual(point11, point22) && Point.AreEqual(point12, point21))
//   }
//
//   public static FromTwoPoints(point1: Point, point2: Point): Segment {
//     return new Segment(point1, point2)
//   }
//
//   public static FromGeneralForm(x1: number, y1: number, x2: number, y2: number): Segment {
//     const point1 = Point.FromCartesianCoordinates(x1, y1)
//     const point2 = Point.FromCartesianCoordinates(x2, y2)
//     return Segment.FromTwoPoints(point1, point2)
//   }
//
//   public static GetIntersection(segment1: Segment, segment2: Segment): Point | null {
//     const [line1, line2] = [segment1, segment2].map(segment => segment.getLine())
//     const intersection = Line.GetIntersection(line1, line2)
//
//     if (intersection == null) {
//       return null
//     }
//
//     if (segment1.containsPoint(intersection) && segment2.containsPoint(intersection)) {
//       return intersection
//     } else {
//       return null
//     }
//   }
//
//   public static GetIntersectionWithLine(segment1: Segment, line2: Line): Point | null {
//     const line1 = segment1.getLine()
//     const intersection = Line.GetIntersection(line1, line2)
//
//     if (intersection == null) {
//       return null
//     }
//
//     if (segment1.containsPoint(intersection)) {
//       return intersection
//     } else {
//       return null
//     }
//   }
//
//   protected _point1: Point
//   protected _point2: Point
//
//   protected constructor(point1: Point, point2: Point, label?: string) {
//     super('segment')
//     this._point1 = point1
//     this._point2 = point2
//     this._label = label
//   }
//
//   public writeJson() {
//     const [p1, p2] = this.getPoints()
//     const {x1, y1, x2, y2} = {
//       x1: p1.x(),
//       y1: p1.y(),
//       x2: p2.x(),
//       y2: p2.y(),
//     }
//     return {
//       kind: 'segment',
//       label: this.label(),
//       color: this.strokeColor(),
//       defaultValue: 'two-points',
//       value: {
//         'two-points': {x1, y1, x2, y2},
//       },
//     }
//   }
//
//   public readJson(json): this {
//     this.label(json.label)
//     this.strokeColor(json.strokeColor)
//     const x1 = json.value['two-points'].x1
//     const x2 = json.value['two-points'].x2
//     const y1 = json.value['two-points'].y1
//     const y2 = json.value['two-points'].y2
//     this._point1 = Point.FromCartesianCoordinates(x1, y1)
//     this._point2 = Point.FromCartesianCoordinates(x2, y2)
//     return this
//   }
//
//   public copyValuesFrom(segment: Segment): this {
//     [this._point1, this._point2] = segment.getPoints().map(p => p.clone())
//     return this
//   }
//
//   protected cloneValues(): this {
//     const point1 = this._point1.clone()
//     const point2 = this._point2.clone()
//     return <this>Segment.FromTwoPoints(point1, point2)
//   }
//
//   public getPoints(): Point[] {
//     return [this._point1, this._point2]
//   }
//
//   protected destructToPoints(): Point[] {
//     return this.getPoints().map(p => p.clone())
//   }
//
//   protected reconstructFromPoints(...points: Point[]): this {
//     const [point1, point2] = points
//     this._point1 = point1
//     this._point2 = point2
//     return this
//   }
//
//   public getMiddle(): Point {
//     return Point.GetPointBetween(this._point1, this._point2)
//   }
//
//   public getLine(): Line {
//     const points = this.getPoints()
//     return Line.FromTwoPoints(points[0], points[1])
//   }
//
//   public getBisector(): Line {
//     return Line.OrthogonalThroughPoint(this.getLine(), this.getMiddle())
//   }
//
//   public containsPoint(point: Point, inclusively: boolean = false): boolean {
//     const lineContainsPoint = this.getLine().containsPoint(point)
//     if (!lineContainsPoint) {
//       return false
//     }
//
//     if (this.getLine().isHorizontal()) {
//       const minX = Math.min(this._point1.x(), this._point2.x())
//       const maxX = Math.max(this._point1.x(), this._point2.x())
//       if (inclusively) {
//         return minX <= point.x() && point.x() <= maxX
//       } else {
//         return minX < point.x() && point.x() < maxX
//       }
//     }
//
//     if (this.getLine().isVertical()) {
//       const minY = Math.min(this._point1.y(), this._point2.y())
//       const maxY = Math.max(this._point1.y(), this._point2.y())
//       if (inclusively) {
//         return minY <= point.y() && point.y() <= maxY
//       } else {
//         return minY < point.y() && point.y() < maxY
//       }
//     }
//
//     const [point1, point2] = this.getPoints()
//     const rectangularArea = RectangularArea.FromTwoPoints(point1, point2)
//     if (inclusively) {
//       return rectangularArea.containsPointInclusively(point)
//     } else {
//       return rectangularArea.containsPoint(point)
//     }
//   }
//
//   public getIntersectionWithSegment(segment: Segment): Point | null {
//     return Segment.GetIntersection(this, segment)
//   }
//
//   public getIntersectionWithLine(line: Line): Point | null {
//     return Segment.GetIntersectionWithLine(this, line)
//   }
//
// }
