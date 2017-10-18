import {
  Circle,
  Ellipse,
  GeometryObject,
  Line,
  Point,
  Polygon,
  Segment,
} from '../geometry-objects/everything'

export abstract class Renderer {

  protected abstract renderPoint(point: Point);

  protected abstract renderLine(line: Line);

  protected abstract renderSegment(segment: Segment);

  /**
   * @deprecated
   */
  protected abstract renderCircle(circle: Circle);

  protected abstract renderEllipse(ellipse: Ellipse);

  protected abstract renderPolygon(polygon: Polygon);

  protected beforeObjectsRender(objects: GeometryObject[]) {
    // Do nothing
  }

  protected afterObjectsRender(objects: GeometryObject[]) {
    // Do nothing
  }

  protected beforeEachObjectRender(object: GeometryObject) {
    // Do nothing
  }

  protected afterEachObjectRender(object: GeometryObject) {
    // Do nothing
  }

  public render(objects: GeometryObject[]) {
    this.beforeObjectsRender(objects)
    objects.forEach(object => {
      this.beforeEachObjectRender(object)
      switch (object.kind) {
        case 'point':
          this.renderPoint(<Point>object)
          break
        case 'line':
          this.renderLine(<Line>object)
          break
        case 'segment':
          this.renderSegment(<Segment>object)
          break
        case 'circle':
          this.renderCircle(<Circle>object)
          break
        case 'polygon':
          this.renderPolygon(<Polygon>object)
          break
        case 'ellipse':
          this.renderEllipse(<Ellipse>object)
          break
      }
      this.afterEachObjectRender(object)
    })
    this.afterObjectsRender(objects)
  }

}
