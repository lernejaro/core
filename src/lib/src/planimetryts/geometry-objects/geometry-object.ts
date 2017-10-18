// import {Line} from './line'
// import {Point} from './point'
// import {Matrix} from './matrix'
// import {MaterialColor} from './material-colors'
//
// function ViewData() {
//   return function (target: GeometryObject, key: string) {
//     const targetAny = target as any
//     if (!targetAny.$$viewData) {
//       targetAny.$$viewData = []
//     }
//     targetAny.$$viewData.push(key)
//   }
// }
//
//
// export abstract class GeometryObject {
//
//   public $$viewData: string[] // Populated by the decorator
//
//   @ViewData() protected _strokeColor: MaterialColor
//   @ViewData() protected _fillColor: MaterialColor
//   @ViewData() protected _label: string
//
//   constructor(public kind: string) {
//   }
//
//   public abstract readJson(json): this;
//
//   public abstract writeJson();
//
//   public label(): string;
//   public label(label: string): this;
//   public label(label?: string): string | this {
//     if (arguments.length == 0) {
//       return this._label
//     } else {
//       this._label = label
//       return this
//     }
//   }
//
//   public strokeColor(): MaterialColor;
//   public strokeColor(color: MaterialColor): this;
//   public strokeColor(color?: MaterialColor): this | MaterialColor {
//     if (arguments.length == 0) {
//       return this._strokeColor
//     } else {
//       this._strokeColor = color
//       return this
//     }
//   }
//
//   public fillColor(): MaterialColor;
//   public fillColor(fillColor: MaterialColor): this;
//   public fillColor(fillColor?: MaterialColor): MaterialColor | this {
//     if (arguments.length == 0) {
//       return this._fillColor
//     } else {
//       this._fillColor = fillColor
//       return this
//     }
//   }
//
//   public copyViewDataFrom(object: GeometryObject): this {
//     object.$$viewData.forEach(key => {
//       this[key] = object[key]
//     })
//     return this
//   }
//
//   public abstract copyValuesFrom(object: GeometryObject): this;
//
//   public copyFrom(object: GeometryObject): this {
//     return this.copyViewDataFrom(object).copyValuesFrom(object)
//   }
//
//   protected abstract cloneValues(): this;
//
//   // TODO: Write tests for this
//   public clone(): this {
//     const valueClone: this = this.cloneValues()
//     valueClone.copyViewDataFrom(this)
//     return valueClone
//   }
//
//   protected abstract destructToPoints(): Point[];
//
//   protected abstract reconstructFromPoints(...points: Point[]): this;
//
//   protected applyMatrixWithRespectToCenter(matrix: number[][]): this {
//     const points = this.destructToPoints()
//     points.forEach(point => point.applyMatrix(matrix))
//     return this.reconstructFromPoints(...points)
//   }
//
//   private applyMatrixWithRespectTo(matrix: number[][], point: Point): this {
//     const {x, y} = point.getCartesianCoordinates()
//     return this
//       .translate(-x, -y)
//       .applyMatrixWithRespectToCenter(matrix)
//       .translate(x, y)
//   }
//
//   public applyMatrix(matrix: number[][], point?: Point): this {
//     if (arguments.length == 1 || point == null) {
//       return this.applyMatrixWithRespectToCenter(matrix)
//     } else if (arguments.length == 2) {
//       return this.applyMatrixWithRespectTo(matrix, point)
//     } else {
//       throw `Invalid number of arguments for function applyHomogeneousMatrix.
// Expected 1 or 2 but given ${arguments.length}.`
//     }
//   }
//
//   public translateX(dx: number): this {
//     return this.applyMatrix(Matrix.Homogeneous.TranslateX(dx))
//   }
//
//   public translateY(dy: number): this {
//     return this.applyMatrix(Matrix.Homogeneous.TranslateY(dy))
//   }
//
//   public translate(dx: number, dy: number): this {
//     return this.applyMatrix(Matrix.Homogeneous.Translate(dx, dy))
//   }
//
//   public stretchX(k: number, point?: Point): this {
//     return this.applyMatrix(Matrix.Homogeneous.StretchX(k), point)
//   }
//
//   public stretchY(k: number, point?: Point): this {
//     return this.applyMatrix(Matrix.Homogeneous.StretchY(k), point)
//   }
//
//   public stretch(k: number, point?: Point): this {
//     return this.applyMatrix(Matrix.Homogeneous.Stretch(k), point)
//   }
//
//   public rotate(θ: number, point?: Point): this {
//     return this.applyMatrix(Matrix.Homogeneous.Rotate(θ), point)
//   }
//
//   public shearX(k: number, point?: Point): this {
//     return this.applyMatrix(Matrix.Homogeneous.ShearX(k), point)
//   }
//
//   public shearY(k: number, point?: Point): this {
//     return this.applyMatrix(Matrix.Homogeneous.ShearY(k), point)
//   }
//
//   public reflectOverPoint(point: Point): this {
//     return this.stretch(-1, point)
//   }
//
//   public reflectOverLine(line: Line): this {
//     if (line.isVertical()) {
//       const {A, C} = line.getGeneralForm()
//       const x = -C / A
//       return this
//         .translateX(-x)
//         .stretchX(-1)
//         .translateX(x)
//     } else {
//       const {k, n} = line.getExplicitForm()
//       const angle = Math.atan(k)
//       return this.translateY(-n)
//         .rotate(-angle)
//         .stretchY(-1)
//         .rotate(angle)
//         .translateY(n)
//     }
//   }
//
//   public radialSymmetry(point: Point, count: number): GeometryObject[] {
//     const baseAngle = 2 * Math.PI / count
//     return Array(count).fill(0).map((_, i) => i * baseAngle).map(angle => {
//       return this.cloneValues().rotate(angle, point)
//     })
//   }
//
// }
//
