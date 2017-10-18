// import {Point} from './point'
// import {areEqualFloats, isZero} from '../util'
// import {GeometryObject} from './geometry-object'
// import {Segment} from './segment'
//
//
// export class Line extends GeometryObject {
//
//   public static AreEqual(line1: Line, line2: Line): boolean {
//     if (!Line.AreParallel(line1, line2)) {
//       return false
//     }
//     if (line1.isVertical() && line2.isVertical()) {
//       const l1 = line1.getGeneralForm()
//       const l2 = line2.getGeneralForm()
//       return areEqualFloats(l1.C / l1.A, l2.C / l2.A)
//     }
//     const l1 = line1.getGeneralForm()
//     const l2 = line2.getGeneralForm()
//     return areEqualFloats(l1.C / l1.B, l2.C / l2.B)
//   }
//
//   public static FromSegmentForm(m: number, n: number): Line {
//     const A = n
//     const B = m
//     const C = -(n * m)
//     return new Line(A, B, C)
//   }
//
//   public static FromExplicitForm(k: number, n: number): Line {
//     const A = k
//     const B = -1
//     const C = n
//     return new Line(A, B, C)
//   }
//
//   public static FromGeneralForm(A: number, B: number, C: number): Line {
//     return new Line(A, B, C)
//   }
//
//   public static FromNormalForm(φ: number, p: number): Line {
//     const A = Math.cos(φ)
//     const B = Math.sin(φ)
//     const C = -p
//     return new Line(A, B, C)
//   }
//
//   public static FromPointAndCoefficient(point: Point, k: number): Line {
//     const n = point.y() - k * point.x()
//     return Line.FromExplicitForm(k, n)
//   }
//
//   public static FromPointAndAngle(point: Point, angleRad: number): Line {
//     if (areEqualFloats(angleRad, Math.PI / 2)) {
//       return Line.VerticalThroughPoint(point)
//     }
//     const k = Math.tan(angleRad)
//     return Line.FromPointAndCoefficient(point, k)
//   }
//
//   public static FromTwoPoints(point1: Point, point2: Point): Line {
//     // TODO: what if two same points are given?
//     const dy = point2.y() - point1.y()
//     const dx = point2.x() - point1.x()
//     if (isZero(dx)) {
//       return Line.VerticalThroughPoint(point1)
//     }
//     const k = dy / dx
//     return Line.FromPointAndCoefficient(point1, k)
//   }
//
//   public static FromSegment(segment: Segment): Line {
//     const [point1, point2] = segment.getPoints()
//     return Line.FromTwoPoints(point1, point2)
//   }
//
//   public static HorizontalThroughPoint(point: Point | number): Line {
//     let y: number
//     if (typeof point === 'number') {
//       y = point
//     } else {
//       y = point.getCartesianCoordinates().y
//     }
//     return Line.FromExplicitForm(0, y)
//   }
//
//   public static VerticalThroughPoint(point: Point | number): Line {
//     let x: number
//     if (typeof point === 'number') {
//       x = point
//     } else {
//       x = point.getCartesianCoordinates().x
//     }
//     return Line.FromGeneralForm(1, 0, -x)
//   }
//
//   public static GetAnglesBetween(line1: Line, line2: Line): number[] {
//     if ((line1.isVertical() && line2.isVertical())
//       || (line1.isHorizontal() && line2.isHorizontal())) {
//       return [0, Math.PI]
//     }
//     if ((line1.isVertical() && line2.isHorizontal())
//       || (line1.isHorizontal() && line2.isVertical())) {
//       return [Math.PI / 2, Math.PI / 2]
//     }
//     let k1, k2
//     if (!line1.isVertical()) {
//       k1 = line1.getExplicitForm().k
//     } else {
//       k1 = Infinity
//     }
//     if (!line2.isVertical()) {
//       k2 = line2.getExplicitForm().k
//     } else {
//       k2 = Infinity
//     }
//     return [
//       Math.atan2((k2 - k1), (1 + k1 * k2)),
//       Math.atan2((k1 - k2), (1 + k1 * k2)),
//     ].sort()
//   }
//
//   public static GetDistanceBetweenLineAndPoint(line: Line, point: Point): number {
//     const l = line.getGeneralForm()
//     const num = l.A * point.x() + l.B * point.y() + l.C
//     const den = Math.sqrt(l.A * l.A + l.B * l.B)
//     return Math.abs(num / den)
//   }
//
//   public static GetBisectors(line1: Line, line2: Line): Line[] {
//     const l1 = line1.getGeneralForm()
//     const l2 = line2.getGeneralForm()
//     const sgn1 = Math.sign(l1.C) == 0 ? -1 : Math.sign(l1.C)
//     const sgn2 = Math.sign(l2.C) == 0 ? -1 : Math.sign(l2.C)
//     const sqrt1 = -sgn1 * Math.sqrt(l1.A * l1.A + l1.B * l1.B)
//     const sqrt2 = -sgn2 * Math.sqrt(l2.A * l2.A + l2.B * l2.B)
//     const A1 = (l1.A / sqrt1 + l2.A / sqrt2)
//     const A2 = (l1.A / sqrt1 - l2.A / sqrt2)
//     const B1 = (l1.B / sqrt1 + l2.B / sqrt2)
//     const B2 = (l1.B / sqrt1 - l2.B / sqrt2)
//     const C1 = (l1.C / sqrt1 + l2.C / sqrt2)
//     const C2 = (l1.C / sqrt1 - l2.C / sqrt2)
//     return [new Line(A1, B1, C1), new Line(A2, B2, C2)]
//   }
//
//   public static GetBisector(vertex: Point, arm1: Point, arm2: Point): Line {
//     const line1 = Line.FromTwoPoints(vertex, arm1)
//     const line2 = Line.FromTwoPoints(vertex, arm2)
//     const bisectors = Line.GetBisectors(line1, line2)
//     return bisectors.find(bisector => !bisector.pointsAreOnSameSide(arm1, arm2))
//   }
//
//   public static AreParallel(line1: Line, line2: Line): boolean {
//     if (line1.isVertical() && line2.isVertical()) {
//       return true
//     }
//     if (line1.isVertical() || line2.isVertical()) {
//       // Only one is vertical
//       return false
//     }
//     const k1 = line1.getExplicitForm().k
//     const k2 = line2.getExplicitForm().k
//     return areEqualFloats(k1, k2)
//   }
//
//   public static AreOrthogonal(line1: Line, line2: Line): boolean {
//     if (line1.isVertical() && line2.isHorizontal()) {
//       return true
//     }
//     if (line1.isHorizontal() && line2.isVertical()) {
//       return true
//     }
//     if (line1.isVertical() || line2.isVertical()) {
//       // One is vertical and the other is not horizontal
//       return false
//     }
//     const k1 = line1.getExplicitForm().k
//     const k2 = line2.getExplicitForm().k
//     return areEqualFloats(k1 * k2, -1)
//   }
//
//   public static GetIntersection(line1: Line, line2: Line): Point | null {
//     if (Line.AreParallel(line1, line2)) {
//       return null
//     }
//     const [l1, l2] = [line1, line2].map(line => line.getGeneralForm())
//     if (!isZero(l1.A)) {
//       const yNum = (l1.C * l2.A) / l1.A - l2.C
//       const yDen = l2.B - (l1.B * l2.A) / l1.A
//       const y = yNum / yDen
//       const x = (-l1.C - l1.B * y) / l1.A
//       return Point.FromCartesianCoordinates(x, y)
//     }
//     if (!isZero(l1.B)) {
//       const xNum = (l2.B * l1.C) / l1.B - l2.C
//       const xDen = l2.A - (l2.B * l1.A) / l1.B
//       const x = xNum / xDen
//       const y = (-l1.C - l1.A * x) / l1.B
//       return Point.FromCartesianCoordinates(x, y)
//     }
//   }
//
//   public static ParallelThroughPoint(line: Line, point: Point): Line {
//     if (line.isVertical()) {
//       return Line.VerticalThroughPoint(point)
//     } else if (line.isHorizontal()) {
//       return Line.HorizontalThroughPoint(point)
//     } else {
//       const k = line.getExplicitForm().k
//       return Line.FromPointAndCoefficient(point, k)
//     }
//   }
//
//   public static OrthogonalThroughPoint(line: Line | Segment, point: Point): Line {
//     let _line: any = line // fuck you TS
//     if (_line instanceof Segment) {
//       _line = Line.FromSegment(_line)
//     }
//     if (_line.isVertical()) {
//       return Line.HorizontalThroughPoint(point)
//     } else if (_line.isHorizontal()) {
//       return Line.VerticalThroughPoint(point)
//     } else {
//       const k = _line.getExplicitForm().k
//       const newK = -1 / k
//       return Line.FromPointAndCoefficient(point, newK)
//     }
//   }
//
//   public static X_AXIS: Line = Line.HorizontalThroughPoint(0)
//   public static Y_AXIS: Line = Line.VerticalThroughPoint(0)
//   public static Y_EQUALS_X: Line = Line.FromExplicitForm(1, 0)
//
//   private _A: number
//   private _B: number
//   private _C: number
//
//   protected constructor(A: number, B: number, C: number) {
//     super('line')
//     this._A = A
//     this._B = B
//     this._C = C
//     return this
//   }
//
//   public writeJson() {
//     return {
//       kind: 'line',
//       label: this.label(),
//       color: this.strokeColor(),
//       defaultValue: 'general',
//       value: {
//         'general': this.getGeneralForm(),
//         'explicit': this.getExplicitForm(),
//         'segment': this.getSegmentForm(),
//       },
//     }
//   }
//
//   public readJson(json): this {
//     this._A = json.value['general'].A
//     this._B = json.value['general'].B
//     this._C = json.value['general'].C
//     this.label(json.label)
//     this.strokeColor(json.strokeColor)
//     return this
//   }
//
//   public copyValuesFrom(line: Line): this {
//     const {A, B, C} = line.getGeneralForm()
//     this._A = A
//     this._B = B
//     this._C = C
//     return this
//   }
//
//   protected cloneValues(): this {
//     const {A, B, C} = this.getGeneralForm()
//     return <this>Line.FromGeneralForm(A, B, C)
//   }
//
//   private aIsZero(): boolean {
//     return isZero(this._A)
//   }
//
//   private bIsZero(): boolean {
//     return isZero(this._B)
//   }
//
//   private cIsZero(): boolean {
//     return isZero(this._C)
//   }
//
//   public isHorizontal(): boolean {
//     return this.aIsZero()
//   }
//
//   public isVertical(): boolean {
//     return this.bIsZero()
//   }
//
//   public getGeneralForm(): { A: number, B: number, C: number } {
//     return {A: this._A, B: this._B, C: this._C}
//   }
//
//   public getExplicitForm(): { k: number, n: number } {
//     if (this.bIsZero()) {
//       return null
//     }
//     const k = -this._A / this._B
//     const n = -this._C / this._B
//     return {k, n}
//   }
//
//   public getSegmentForm(): { m: number, n: number } {
//     if (this.aIsZero() || this.bIsZero() || this.cIsZero()) {
//       return null
//     }
//     const m = -this._C / this._A
//     const n = -this._C / this._B
//     return {m, n}
//   }
//
//   // public getNormalForm(): {φ: number, p: number} {
//   //
//   // }
//
//   public getTwoPoints(): Point[] {
//     if (this.isHorizontal()) {
//       return [Line.VerticalThroughPoint(0), Line.VerticalThroughPoint(1)]
//         .map(line => Line.GetIntersection(this, line))
//     } else {
//       return [Line.HorizontalThroughPoint(0), Line.HorizontalThroughPoint(1)]
//         .map(line => Line.GetIntersection(this, line))
//     }
//   }
//
//   protected destructToPoints(): Point[] {
//     return this.getTwoPoints().map(p => p.clone())
//   }
//
//   protected reconstructFromPoints(...points: Point[]): this {
//     const [point1, point2] = points
//     const line = Line.FromTwoPoints(point1, point2)
//     this._A = line._A
//     this._B = line._B
//     this._C = line._C
//     return this
//   }
//
//   private getPointPositionalSign(point: Point): -1 | 0 | 1 {
//     const l = this.getGeneralForm()
//     const p = point.getCartesianCoordinates()
//     const result = l.A * p.x + l.B * p.y + l.C
//     if (isZero(result)) {
//       return 0
//     } else {
//       return result > 0 ? 1 : -1
//     }
//   }
//
//   public pointsAreOnSameSide(point1: Point, point2: Point): boolean {
//     if (this.containsPoint(point1) || this.containsPoint(point2)) {
//       return false
//     }
//     const sidePoint1: number = this.getPointPositionalSign(point1)
//     const sidePoint2: number = this.getPointPositionalSign(point2)
//     return sidePoint1 == sidePoint2
//   }
//
//   public containsPoint(point: Point): boolean {
//     return this.getPointPositionalSign(point) == 0
//   }
//
// }
