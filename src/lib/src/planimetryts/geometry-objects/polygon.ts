// import {GeometryObject} from './geometry-object'
// import {Point} from './point'
// import {Angle} from './angle'
// import {Segment} from './segment'
//
// // TODO: Add Polylines
//
// export class Polygon extends GeometryObject {
//
//   // TODO: Add circular tests (ABC == BCA)
//   // TODO: Also think about is CW/CCW important for marking polygons as the same ones
//   public static AreEqual(polygon1: Polygon, polygon2: Polygon): boolean {
//     return (polygon1._vertices.length == polygon2._vertices.length)
//       && (polygon1._vertices.every((v1, i) => Point.AreEqual(v1, polygon2._vertices[i])))
//   }
//
//   public static FromVertices(...points: Point[]): Polygon {
//     return new Polygon(...points)
//   }
//
//   protected _vertices: Point[]
//
//   protected constructor(...points: Point[]) {
//     super('polygon')
//     this._vertices = points
//   }
//
//   public writeJson() {
//     const vertices = this._vertices.map(v => v.getCartesianCoordinates())
//     return {
//       kind: 'polygon',
//       color: this.strokeColor(),
//       label: this.label(),
//       defaultValue: 'list-of-vertices',
//       values: {
//         'list-of-vertices': vertices,
//       },
//     }
//   }
//
//   public readJson(json): this {
//     this.label(json.label)
//     this.strokeColor(json.strokeColor)
//     this._vertices = json.values['list-of-vertices'].map(coord => {
//       return Point.FromCartesianCoordinates(coord.x, coord.y)
//     })
//     return this
//   }
//
//   public vertices(): Point[] {
//     return this._vertices.map(point => point.clone())
//   }
//
//   public segments(): Segment[] {
//     let vertices = this.vertices()
//     vertices.push(vertices[0])
//     let segments: Segment[] = []
//     for (let i = 0; i < vertices.length - 1; i++) {
//       const curr = vertices[i]
//       const next = vertices[i + 1]
//       const segment = Segment.FromTwoPoints(curr, next)
//       segments.push(segment)
//     }
//     return segments
//   }
//
//   public copyValuesFrom(polygon: Polygon): this {
//     this._vertices = polygon._vertices.map(v => v.clone())
//     return this
//   }
//
//   protected cloneValues(): this {
//     const clones = this._vertices.map(p => p.clone())
//     return <this>Polygon.FromVertices(...clones)
//   }
//
//   public getArea(): number {
//     // http://stackoverflow.com/a/717367
//     let area = 0
//     const N = this._vertices.length
//     for (let i = 0; i < N; i += 2) {
//       const u = this._vertices[i % N].getCartesianCoordinates()
//       const v = this._vertices[(i + 1) % N].getCartesianCoordinates()
//       const t = this._vertices[(i + 2) % N].getCartesianCoordinates()
//       area += v.x * (t.y - u.y) + v.y * (u.x - t.x)
//     }
//     return area / 2
//   }
//
//   public getAngleAt(vertexIndex: number): Angle {
//     throw 'TODO'
//   }
//
//   protected destructToPoints(): Point[] {
//     return this.vertices().map(v => v.clone())
//   }
//
//   protected reconstructFromPoints(...points: Point[]): this {
//     this._vertices = points
//     return this
//   }
//
// }
