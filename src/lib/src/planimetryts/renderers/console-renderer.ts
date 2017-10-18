import {Renderer} from './renderer'
import {Circle, Ellipse, Line, Point, Polygon, Segment} from '../geometry-objects/everything'

export class ConsoleRenderer extends Renderer {

  public renderPoint(point: Point): void {
    const p = point.getCartesianCoordinates()
    console.log(`Point ${point.label()} (${p.x}, ${p.y})`)
  }

  public renderLine(line: Line): void {
    const l = line.getGeneralForm()
    console.log(`Line ${l.A}x + ${l.B}y + ${l.C} = 0`)
  }

  public renderSegment(segment: Segment): void {
    const s = segment.getPoints().map(p => p.getCartesianCoordinates())
    console.log(`Segment from (${s[0].x}, ${s[0].y}) to (${s[1].x}, ${s[1].y})`)
  }

  /**
   * @deprecated
   */
  public renderCircle(circle: Circle): void {
    const c = circle.center().getCartesianCoordinates()
    const r = circle.radius()
    console.log(`Circle with center at (${c.x}, ${c.y}) and radius of ${r}`)
  }

  public renderEllipse(ellipse: Ellipse): void {
    const [a, b] = ellipse.getRadii()
    const angle = ellipse.getAngle()
    const {x, y} = ellipse.getCenter().getCartesianCoordinates()
    console.log(`Ellipse with center at (${x}, ${y}), ` +
      `radii ${a} and ${b}, rotated for ${angle}`)
  }

  public renderPolygon(polygon: Polygon): void {
    const v = polygon.vertices().map(p => p.getCartesianCoordinates())
    const points = v.map(p => `(${p.x}, ${p.y})`).join('-')
    console.log(`Polygon at ${points}`)
  }

}
