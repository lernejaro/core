// import {areEqualFloats, cartesianToPolar, polarToCartesian} from '../util'
// import {Matrix} from './matrix'
// // import {Line} from './line'
// import {GeometryObject} from './geometry-object'
// import {Line} from './line'
//
// export class Point extends GeometryObject {
//
//   public static AreEqual(point1: Point, point2: Point): boolean {
//     return areEqualFloats(point1.x(), point2.x())
//       && areEqualFloats(point1.y(), point2.y())
//   }
//
//   public static FromPolarCoordinates(r: number, φ: number, label?: string): Point {
//     const cartesian = polarToCartesian(r, φ)
//     return new Point(cartesian.x, cartesian.y, label)
//   }
//
//   public static FromCartesianCoordinates(x: number, y: number, label?: string): Point {
//     return new Point(x, y, label)
//   }
//
//   public static CENTER: Point = Point.FromCartesianCoordinates(0, 0)
//
//   /**
//    * Works for both regular and homogeneous matrix coordinates.
//    * @param matrix
//    * @param label
//    * @returns {Point}
//    * @constructor
//    */
//   public static FromMatrix(matrix: number[][], label?: string): Point {
//     const x = matrix[0][0]
//     const y = matrix[1][0]
//     let z
//     if (matrix.length == 2) {
//       z = 1
//     } else {
//       z = matrix[2][0]
//     }
//     return new Point(x, y / z, label) // TODO shouldn't it be x / z?
//   }
//
//   public static Negative(point: Point): Point {
//     return new Point(-point.x(), -point.y())
//   }
//
//   public static Add(point1: Point, point2: Point): Point {
//     return new Point(point1.x() + point2.x(), point1.y() + point2.y())
//   }
//
//   public static Subtract(point1: Point, point2: Point): Point {
//     return Point.Add(point1, Point.Negative(point2))
//   }
//
//   public static DotProduct(point1: Point, point2: Point): number {
//     return point1.x() * point2.x() + point1.y() * point2.y()
//   }
//
//   // public static CrossProductLength(point1: Point, point2: Point): number {
//   //
//   // }
//
//   public static GetDistanceBetween(point1: Point, point2: Point): number {
//     const dx = point1.x() - point2.x()
//     const dy = point1.y() - point2.y()
//     return Math.sqrt(dx * dx + dy * dy)
//   }
//
//   public static GetPointAtRatio(point1: Point, point2: Point, m: number, n: number = 1): Point {
//     const x = (n * point1.x() + m * point2.x()) / (m + n)
//     const y = (n * point1.y() + m * point2.y()) / (m + n)
//     return new Point(x, y)
//   }
//
//   public static GetPointBetween(point1: Point, point2: Point): Point {
//     return Point.GetPointAtRatio(point1, point2, 1, 1)
//   }
//
//   public static GetDistanceBetweenLineAndPoint(line: Line, point: Point): number {
//     return Line.GetDistanceBetweenLineAndPoint(line, point)
//   }
//
//   protected _x: number
//   protected _y: number
//
//   protected constructor(x: number, y: number, label?: string) {
//     super('point')
//     this._x = x
//     this._y = y
//     this._label = label
//     return this
//   }
//
//   public writeJson() {
//     return {
//       kind: 'point',
//       label: this.label(),
//       color: this.strokeColor(),
//       defaultValue: 'cartesian',
//       value: {
//         'cartesian': this.getCartesianCoordinates(),
//         'polar': this.getPolarCoordinates(),
//       },
//     }
//   }
//
//   public readJson(json): this {
//     this.x(json.value['cartesian'].x)
//     this.y(json.value['cartesian'].y)
//     this.label(json.label)
//     this.strokeColor(json.strokeColor)
//     return this
//   }
//
//   public x(): number;
//   public x(x: number): this;
//   public x(fn: (x: number) => number): this;
//   public x(x?: number | ((x: number) => number)): this | number {
//     if (x == null) {
//       return this._x
//     } else {
//       if (typeof x === 'number') {
//         this._x = x
//       } else {
//         this._x = x(this._x)
//       }
//       return this
//     }
//   }
//
//   public y(): number;
//   public y(y: number): this;
//   public y(fn: (y: number) => number): this;
//   public y(y?: number | ((y: number) => number)): this | number {
//     if (y == null) {
//       return this._y
//     } else {
//       if (typeof y === 'number') {
//         this._y = y
//       } else {
//         this._y = y(this._y)
//       }
//       return this
//     }
//   }
//
//   public copyValuesFrom(point: Point): this {
//     this._x = point._x
//     this._y = point._y
//     return this
//   }
//
//   protected cloneValues(): this {
//     const {x, y} = this.getCartesianCoordinates()
//     return <this>Point.FromCartesianCoordinates(x, y)
//   }
//
//   public getNonHomogeneousMatrixCoordinates(): [[number], [number]] {
//     return [[this._x], [this._y]]
//   }
//
//   public getHomogeneousMatrixCoordinates(): [[number], [number], [number]] {
//     return [[this._x], [this._y], [1]]
//   }
//
//   public getMatrixCoordinates(homogeneous: boolean = true): number[][] {
//     if (homogeneous) {
//       return this.getHomogeneousMatrixCoordinates()
//     } else {
//       return this.getNonHomogeneousMatrixCoordinates()
//     }
//   }
//
//   public getPolarCoordinates(): { r: number, φ: number } {
//     return cartesianToPolar(this._x, this._y)
//   }
//
//   public getCartesianCoordinates(): Coordinate {
//     return {x: this._x, y: this._y}
//   }
//
//   public translateByPoint(point: Point): this {
//     return this.copyFrom(Point.Add(this, point))
//   }
//
//   public distanceTo(point: Point) {
//     return Point.GetDistanceBetween(this, point)
//   }
//
//   protected destructToPoints(): Point[] {
//     return [this.cloneValues()]
//   }
//
//   protected reconstructFromPoints(...points: Point[]): this {
//     const point = points[0]
//     this._x = point._x
//     this._y = point._y
//     return this
//   }
//
//   protected applyMatrixWithRespectToCenter(matrix: number[][]): this {
//     const [n, m] = Matrix.GetDimensions(matrix)
//     let isHomogeneous: boolean
//     if (n == 2 && m == 2) {
//       isHomogeneous = false
//     } else if (n == 3 && m == 3) {
//       isHomogeneous = true
//     } else {
//       throw `Matrix needs to be 2×2 or 3×3. Given matrix is ${matrix}.`
//     }
//     const matrixCoordinates = this.getMatrixCoordinates(isHomogeneous)
//     const newMatrix = Matrix.Multiply(matrix, matrixCoordinates)
//     const newPoint = Point.FromMatrix(newMatrix)
//     return this.copyFrom(newPoint)
//   }
//
// }
