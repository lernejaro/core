// import {Polygon} from './polygon'
// import {Point} from './point'
// import {Circle} from './circle'
//
// export class Triangle extends Polygon {
//
//   public static EquilateralFromCenterAndSideLength(center: Point,
//                                                    side: number): Triangle {
//     throw 'TODO'
//   }
//
//   public static EquilateralFromCenterAndCircumradius(center: Point,
//                                                      circumradius: number): Triangle {
//     throw 'TODO'
//   }
//
//   public static
//   EquilateralFromCenterAndCircumscribedRadius(center: Point,
//                                               circumscribedRadius: number): Triangle {
//     throw 'TODO'
//   }
//
//   public getCircumscribedCircle(): Circle {
//     // https://en.wikipedia.org/wiki/Circumscribed_circle#Cartesian_coordinates_2
//     const A = this._vertices[0].getCartesianCoordinates()
//     const B = this._vertices[1].getCartesianCoordinates()
//     const C = this._vertices[2].getCartesianCoordinates()
//
//     const D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y))
//     const Ux = (1 / D) * ((A.x * A.x + A.y * A.y) * (B.y - C.y) +
//       (B.x * B.x + B.y * B.y) * (C.y - A.y) +
//       (C.x * C.x + C.y * C.y) * (A.y - B.y))
//     const Uy = (1 / D) * ((A.x * A.x + A.y * A.y) * (C.x - B.x) +
//       (B.x * B.x + B.y * B.y) * (A.x - C.x) +
//       (C.x * C.x + C.y * C.y) * (B.x - A.x))
//     const center = Point.FromCartesianCoordinates(Ux, Uy)
//     return Circle.FromCenterAndPoint(center, this._vertices[0])
//   }
//
//   public getVertexLabels(): string[] {
//     return this._vertices.map(point => point.label())
//   }
//
//   public isEquilateral(): boolean {
//     throw 'TODO'
//   }
//
// }
