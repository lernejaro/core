// import {GeometryObject} from './geometry-object'
// import {Point} from './point'
// import {areEqualFloats, isZero} from '../util'
// import {Line} from './line'
// import {Matrix} from './matrix'
//
// export interface EllipseGeneralForm {
//   A: number, B: number, C: number, D: number, E: number, F: number
// }
//
// export class Ellipse extends GeometryObject {
//
//   public static AreEqual(ellipse1: Ellipse, ellipse2: Ellipse): boolean {
//     const {A: A1, B: B1, C: C1, D: D1, E: E1, F: F1} = ellipse1.getGeneralForm()
//     const {A: A2, B: B2, C: C2, D: D2, E: E2, F: F2} = ellipse2.getGeneralForm()
//     return areEqualFloats(A1, A2)
//       && areEqualFloats(B1, B2)
//       && areEqualFloats(C1, C2)
//       && areEqualFloats(D1, D2)
//       && areEqualFloats(E1, E2)
//       && areEqualFloats(F1, F2)
//   }
//
//   /**
//    * (x/a)² + (y/b)² = 1
//    * @param a
//    * @param b
//    * @returns {Ellipse}
//    * @constructor
//    */
//   public static FromCanonicalForm(a: number, b: number): Ellipse {
//     if (isZero(a) || isZero(b)) {
//       throw new Error(`a or b cannot be equal to 0. Given values: a = ${a}, b = ${b}`)
//     }
//     const [A, C, F] = [b ** 2, a ** 2, -(a ** 2 * b ** 2)]
//     return Ellipse.FromGeneralForm(A, 0, C, 0, 0, F)
//   }
//
//   /**
//    * Ax² + Bxy + Cy² + Dx + Et + F = 0
//    *
//    * @param A Coefficient of x²
//    * @param B Coefficient of xy
//    * @param C Coefficient of y²
//    * @param D Coefficient of x
//    * @param E Coefficient of y
//    * @param F Coefficient of 1
//    * @returns {Ellipse}
//    * @constructor
//    */
//   public static FromGeneralForm(A: number,
//                                 B: number,
//                                 C: number,
//                                 D: number,
//                                 E: number,
//                                 F: number): Ellipse {
//     const something = new Ellipse(A, B, C, D, E, F)
//     if (something.isEllipse()) {
//       return something
//     } else {
//       throw new Error(`Parameters [A, B, C, D, E, F] = ` +
//         `[${A}, ${B}, ${C}, ${D}, ${E}, ${F}] do not form an ellipse`)
//     }
//   }
//
//
//   public static FromMatrix(matrix: number[][]): Ellipse {
//     if (areEqualFloats(matrix[0][1], matrix[1][0])
//       && areEqualFloats(matrix[0][2], matrix[2][0])
//       && areEqualFloats(matrix[1][2], matrix[2][1])) {
//       const A = matrix[0][0]
//       const B = 2 * matrix[0][1]
//       const C = matrix[1][1]
//       const D = 2 * matrix[0][2]
//       const E = 2 * matrix[1][2]
//       const F = matrix[2][2]
//       return Ellipse.FromGeneralForm(A, B, C, D, E, F)
//     } else {
//       throw new Error(`Matrix does not meet requirements for ellipse.`)
//     }
//   }
//
//   public static Circle = {
//
//     FromCenterAndRadius(center: Point, radius: number): Ellipse {
//       const {x: p, y: q} = center.getCartesianCoordinates()
//       const r = radius
//       return Ellipse.FromGeneralForm(1, 0, 1, -2 * p, -2 * q, p * p + q * q - r * r)
//     },
//
//     // (x - p)² + (y - q)² = r²
//     FromGeneralForm(p: number, q: number, r: number): Ellipse {
//       const center = Point.FromCartesianCoordinates(p, q)
//       return Ellipse.Circle.FromCenterAndRadius(center, r)
//     },
//
//     FromCenterAndLine(center: Point, line: Line): Ellipse {
//       const radius = Point.GetDistanceBetweenLineAndPoint(line, center)
//       return Ellipse.Circle.FromCenterAndRadius(center, radius)
//     },
//
//     FromCenterAndPoint(center: Point, point: Point): Ellipse {
//       const radius = Point.GetDistanceBetween(center, point)
//       return Ellipse.Circle.FromCenterAndRadius(center, radius)
//     },
//
//   }
//
//   private A: number
//   private B: number
//   private C: number
//   private D: number
//   private E: number
//   private F: number
//
//   protected constructor(A: number, B: number, C: number, D: number, E: number, F: number) {
//     super('ellipse')
//     this.A = A
//     this.B = B
//     this.C = C
//     this.D = D
//     this.E = E
//     this.F = F
//   }
//
//   private isEllipse(): boolean {
//     const [A, B, C] = [this.A, this.B, this.C]
//     return B ** 2 - 4 * A * C < 0 // TODO float comparison
//   }
//
//   public isCircle(): boolean {
//     return this.isEllipse() && areEqualFloats(this.A, this.C)
//   }
//
//   public getRadii(): number[] {
//     if (!this.isEllipse()) {
//       throw new Error(`Cannot get radii since this is not ellipse`)
//     }
//     const [A, B, C, D, E, F] = [this.A, this.B, this.C, this.D, this.E, this.F]
//     const discriminant: number = B ** 2 - 4 * A * C
//     const upperLeft: number = A * E ** 2 + C * D ** 2 - B * D * E + discriminant * F
//     const upperRight: number[] = [
//       A + C + Math.sqrt((A - C) ** 2 + B ** 2),
//       A + C - Math.sqrt((A - C) ** 2 + B ** 2),
//     ]
//     const bottom: number = discriminant
//     return upperRight.map(right => {
//       return -Math.sqrt(2 * upperLeft * right) / bottom
//     })
//   }
//
//   public getCenter(): Point {
//     const [A, B, C, D, E] = [this.A, this.B, this.C, this.D, this.E]
//     const discriminant: number = B ** 2 - 4 * A * C
//     const xUp = 2 * C * D - B * E
//     const yUp = 2 * A * E - B * D
//     const x = xUp / discriminant
//     const y = yUp / discriminant
//     return Point.FromCartesianCoordinates(x, y)
//   }
//
//   /**
//    * Gets angle between main ellipse axis and positive orientation or x-axis, in radians.
//    */
//   public getAngle(): number {
//     const [A, B, C] = [this.A, this.B, this.C]
//     if (isZero(B) && (A <= C || areEqualFloats(A, C))) {
//       return 0
//     } else if (isZero(B) && A > C) {
//       return Math.PI / 2
//     } else {
//       const sqrt = Math.sqrt((A - C) ** 2 + B ** 2)
//       const k = (C - A - sqrt) / B
//       return Math.atan(k)
//     }
//   }
//
//   public getGeneralForm(): EllipseGeneralForm {
//     const [A, B, C, D, E, F] = [this.A, this.B, this.C, this.D, this.E, this.F]
//     return {A, B, C, D, E, F}
//   }
//
//   public getMatrix(): number[][] {
//     const [A, B, C, D, E, F] = [this.A, this.B, this.C, this.D, this.E, this.F]
//     return [
//       [A, B / 2, D / 2],
//       [B / 2, C, E / 2],
//       [D / 2, E / 2, F],
//     ]
//   }
//
//   public readJson(json): this {
//     return undefined
//   }
//
//   public writeJson() {
//   }
//
//   public copyValuesFrom(ellipse: Ellipse): this {
//     [this.A, this.B, this.C, this.D, this.E, this.F] =
//       [ellipse.A, ellipse.B, ellipse.C, ellipse.D, ellipse.E, ellipse.F]
//     return this
//   }
//
//   protected cloneValues(): this {
//     const {A, B, C, D, E, F} = this.getGeneralForm()
//     return <this>Ellipse.FromGeneralForm(A, B, C, D, E, F)
//   }
//
//   protected destructToPoints(): Point[] {
//     throw new Error(`Ellipse cannot be deconstructed to points`)
//   }
//
//   protected reconstructFromPoints(...points: Point[]): this {
//     throw new Error(`Ellipse cannot be reconstructed from points`)
//   }
//
//   public applyMatrixWithRespectToCenter(matrix: number[][]): this {
//     const matrixT: number[][] = Matrix.Transpose(matrix)
//     const newMatrix = Matrix.Multiply(matrixT, Matrix.Multiply(this.getMatrix(), matrix))
//     const newEllipse = Ellipse.FromMatrix(newMatrix)
//     return this.copyFrom(newEllipse)
//   }
//
//   public getArea(): number {
//     const [a, b] = this.getRadii()
//     return Math.PI * a * b
//   }
//
//   public getPerimeter(): number {
//     throw 'TODO' // TODO
//   }
//
// }
