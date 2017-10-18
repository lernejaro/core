// import {degreeToRadian, radianToDegree} from '../util'
// import {GeometryObject} from './geometry-object'
// import {Point} from './point'
//
// export enum AngleDecoration {
//   NONE,
//   LINE,
//   DOUBLE_LINE,
//   TRIPLE_LINE,
//   WAVE,
//   DOUBLE_WAVE,
//   TRIPLE_WAVE,
// }
//
// export class Angle extends GeometryObject {
//
//   public static Degrees(angleDegrees: number): Angle {
//     return new Angle(angleDegrees)
//   }
//
//   public static Radians(angleRadians: number): Angle {
//     return new Angle(radianToDegree(angleRadians))
//   }
//
//   public static Add(angle1: Angle, angle2: Angle): Angle {
//     return Angle.Degrees(angle1.degrees + angle2.degrees)
//   }
//
//   private _angleDegrees: number
//
//   private _displayLines: boolean = false
//   private _decoration: AngleDecoration = AngleDecoration.NONE
//
//   protected constructor(angleDegrees: number) {
//     super('angle')
//     this._angleDegrees = angleDegrees
//   }
//
//   // TODO
//   // plus the whole component is dubious
//   // is it for transforming angles
//   // or for drawing angle at a point
//   public writeJson() {
//     return {
//       label: this.label(),
//       color: this.strokeColor(),
//       kind: 'angle',
//       defaultValue: 'three-points',
//       value: {},
//     }
//   }
//
//   public readJson(json): this {
//     this.label(json.label)
//     this.strokeColor(json.strokeColor)
//     return this
//   }
//
//   public copyValuesFrom(angle: Angle): this {
//     this._angleDegrees = angle.degrees
//     return this
//   }
//
//   protected cloneValues(): this {
//     return <this>Angle.Degrees(this.degrees)
//   }
//
//   public decoration(): AngleDecoration;
//   public decoration(decoration: AngleDecoration): this;
//   public decoration(decoration?: AngleDecoration): this | AngleDecoration {
//     if (arguments.length == 0) {
//       return this._decoration
//     } else {
//       this._decoration = decoration
//       return this
//     }
//   }
//
//   public get degrees(): number {
//     return this._angleDegrees
//   }
//
//   public get radians(): number {
//     return degreeToRadian(this._angleDegrees)
//   }
//
//   public displayLines(value?: boolean): this {
//     if (arguments.length == 0) {
//       this._displayLines = true
//     } else {
//       this._displayLines = value
//     }
//     return this
//   }
//
//   public hideLines(): this {
//     this._displayLines = false
//     return this
//   }
//
//   protected destructToPoints(): Point[] {
//     throw 'TODO'
//   }
//
//   protected reconstructFromPoints(...points: Point[]): this {
//     throw 'TODO'
//   }
//
//   public radialSymmetry(point: Point): this[] {
//     throw 'TODO'
//   }
//
// }
