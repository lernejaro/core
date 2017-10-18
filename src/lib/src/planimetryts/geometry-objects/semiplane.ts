// import {GeometryObject} from './geometry-object'
// import {Line} from './line'
// import {Point} from './point'
//
// // TODO Write tests
//
// export class Semiplane extends GeometryObject {
//
//   public static FromLineAndVector(line: Line, vector: Point): Semiplane {
//     return new Semiplane(line, vector)
//   }
//
//   protected _line: Line
//   protected _vector: Point
//
//   protected constructor(line: Line, vector: Point) {
//     super('semiplane')
//     this._line = line
//     this._vector = vector
//   }
//
//   protected cloneValues(): this {
//     return <this>Semiplane.FromLineAndVector(this._line.clone(), this._vector.clone())
//   }
//
//   // TODO
//   readJson(json): this {
//     return undefined
//   }
//
//   // TODO
//   writeJson() {
//   }
//
//   copyValuesFrom(semiplane: Semiplane): this {
//     this._line = semiplane._line.clone()
//     this._vector = semiplane._vector.clone()
//     return this
//   }
//
//   protected destructToPoints(): Point[] {
//     const destructLine = (<any>this._line).destructToPoints()
//     const destructVector = (<any>this._vector).destructToPoints()
//     return [...destructLine, ...destructVector]
//   }
//
//   protected reconstructFromPoints(...points: Point[]): this {
//     const linePoints = points.slice(0, 2)
//     const vectorPoints = points.slice(2);
//     (<any>this._line).reconstructFromPoints(linePoints);
//     (<any>this._vector).reconstructFromPoints(vectorPoints)
//     return this
//   }
//
// }
