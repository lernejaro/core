import {Renderer} from './renderer'
import {MaterialColor} from './color'
import {
  Circle,
  Ellipse,
  GeometryObject,
  Line,
  MaterialColor as MaterialColorEnum,
  Point,
  Polygon,
  RectangularArea,
  Segment,
} from '../geometry-objects/everything'
import {Subject} from 'rxjs/Subject'
import {Matrix} from '../geometry-objects/matrix'
import {Coordinate, Offset} from '../../../typings'

function getCursorPosition(canvas, event): Coordinate {
  let rect = canvas.getBoundingClientRect()
  let x = event.clientX - rect.left
  let y = event.clientY - rect.top
  return {x, y}
}

export class CanvasRenderer extends Renderer {

  // private secondaryRenderer: Renderer = new ConsoleRenderer();
  private getColor = MaterialColor

  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  // private topLeft: Coordinate;
  private width: number = 600
  private height: number = 600

  private _gridLines: Set<Line>

  private _appliedMatrix: number[][]
  private _inverseMatrix: number[][]

  private _rightAppliedMatrix: number[][]
  private _rightInverseMatrix: number[][]

  public get appliedMatrix(): number[][] {
    return [...this._appliedMatrix.map(el => [...el])]
  }

  private setIdentityMatrix() {
    const I = Matrix.GetIdentity(3)
    this._appliedMatrix = I
    this._inverseMatrix = I
    this._rightAppliedMatrix = I
    this._rightInverseMatrix = I
  }

  public applyMatrix(matrix: number[][], leftMul: boolean = true): this {
    const inverse = Matrix.HomogeneousInverse(matrix)
    if (leftMul) {
      this._appliedMatrix = Matrix.Multiply(matrix, this._appliedMatrix)
      this._inverseMatrix = Matrix.Multiply(this._inverseMatrix, inverse)
      this._rightAppliedMatrix =
        Matrix.Multiply(this._rightAppliedMatrix, matrix)
      this._rightInverseMatrix =
        Matrix.Multiply(inverse, this._rightInverseMatrix)
    } else {
      this._appliedMatrix = Matrix.Multiply(this._appliedMatrix, matrix)
      this._inverseMatrix = Matrix.Multiply(inverse, this._inverseMatrix)
      this._rightAppliedMatrix =
        Matrix.Multiply(matrix, this._rightAppliedMatrix)
      this._rightInverseMatrix =
        Matrix.Multiply(this._rightInverseMatrix, inverse)
    }
    return this
  }

  public move(dx: number, dy: number): this {
    return this.applyMatrix(Matrix.Homogeneous.Translate(dx, dy), true)
  }

  public zoom(towards: Coordinate, value: number): this {
    const {x, y} = towards
    return this
      .applyMatrix(Matrix.Homogeneous.Translate(-x, -y))
      .applyMatrix(Matrix.Homogeneous.Stretch(value))
      .applyMatrix(Matrix.Homogeneous.Translate(x, y))
  }

  private getCurrentVisibleArea(): RectangularArea {
    const {width: w, height: h} = this
    const matrix = this._inverseMatrix
    const point1 = Point.FromCartesianCoordinates(0, 0).applyMatrix(matrix)
    const point2 = Point.FromCartesianCoordinates(w, h).applyMatrix(matrix)
    return RectangularArea.FromTwoPoints(point1, point2)
  }

  private prepareContext() {
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
  }

  constructor(canvas: HTMLCanvasElement) {
    super()
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.registerEvents()
    this.prepareContext()

    this.setIdentityMatrix()

    this
      .applyMatrix(Matrix.Homogeneous.StretchY(-1))
      .applyMatrix(Matrix.Homogeneous.Translate(300, 300))

    this.createGrid()
  }

  // Call this every time user changes grid parameters
  protected createGrid(): void {
    const step = 100 // TODO: Make these parameters configurable
    this._gridLines = new Set<Line>()
    for (let x = -500; x < 500; x += step) {
      this._gridLines.add(Line.VerticalThroughPoint(x))
      this._gridLines.add(Line.HorizontalThroughPoint(x))
    }
  }

  protected drawGrid(): void {
    this._gridLines.forEach(gridLine => this.renderLine(gridLine))
  }

  protected drawAxis(): void {
  }

  protected clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  private viewToLogicCoordinates(point: Coordinate): Coordinate {
    const pointMatrix = [[point.x], [point.y], [1]]
    const newMatrix = Matrix.Multiply(this._inverseMatrix, pointMatrix)
    const x = newMatrix[0][0]
    const y = newMatrix[1][0]
    return {x, y}
  }

  protected beforeObjectsRender(objects: GeometryObject[]) {
    this.clear()
  }

  protected renderLabel(label: string, position: Coordinate) {
    if (label == null) {
      return
    }
    const {x, y} = position
    this.ctx.font = '12px monospace'
    this.ctx.textBaseline = 'center'
    this.ctx.fillStyle = 'black'
    this.ctx.fillText(label, x, y)
  }

  protected renderPoint(point: Point) {
    const clone = point.clone().applyMatrix(this._appliedMatrix)
    const {x, y} = clone.getCartesianCoordinates()
    this.ctx.save()
    let fillColor = point.strokeColor()
    if (fillColor == null) {
      fillColor = MaterialColorEnum.BLUE_GREY // TODO should be class member
    }
    this.ctx.fillStyle = this.getColor(fillColor, 400).css()
    let strokeColor = point.strokeColor()
    if (strokeColor == null) {
      strokeColor = MaterialColorEnum.BLUE_GREY // TODO should be class member
    }
    this.ctx.strokeStyle = this.getColor(strokeColor, 800).css()
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.arc(x, y, 3, 0, 2 * Math.PI)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.closePath()
    this.renderLabel(point.label(), {x: x + 10, y: y + 10})
    this.ctx.restore()
  }

  protected renderLine(line: Line): void {
    const {width: w, height: h} = this
    const matrix = this._inverseMatrix
    const point1 = Point.FromCartesianCoordinates(0, 0).applyMatrix(matrix)
    const point2 = Point.FromCartesianCoordinates(w, h).applyMatrix(matrix)
    const visibleArea: RectangularArea = RectangularArea.FromTwoPoints(point1, point2)
    const segment = visibleArea.getCapturedSegment(line)
    if (segment != null) {
      segment.copyViewDataFrom(line)
      this.renderSegment(segment)
    }
  }

  protected renderSegment(segment: Segment): void {
    const clone = segment.clone().applyMatrix(this._appliedMatrix)
    const [start, end] = clone.getPoints().map(point => {
      return point.getCartesianCoordinates()
    })

    this.ctx.save()
    let strokeColor = segment.strokeColor()
    if (strokeColor == null) {
      strokeColor = MaterialColorEnum.BLUE_GREY // should be class member
    }
    this.ctx.strokeStyle = this.getColor(strokeColor, 700).css()
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.moveTo(start.x, start.y)
    this.ctx.lineTo(end.x, end.y)
    this.ctx.stroke()
    this.ctx.closePath()
    this.ctx.restore()
  }

  /**
   * @deprecated
   */
  protected renderCircle(circle: Circle): void {
    const clone = circle.clone().applyMatrix(this._appliedMatrix)
    const c = clone.getGeneralForm()
    this.ctx.save()
    this.ctx.strokeStyle = this.getColor(circle.strokeColor(), 500).css()
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.arc(c.p, c.q, c.r, 0, 2 * Math.PI)
    this.ctx.stroke()
    this.ctx.closePath()
    this.ctx.restore()
  }

  protected renderEllipse(ellipse: Ellipse): void {
    const clone = ellipse.clone().applyMatrix(this._inverseMatrix)
    const [a, b] = clone.getRadii()
    const angle = clone.getAngle()
    const {x, y} = clone.getCenter().getCartesianCoordinates()
    this.ctx.save()
    this.ctx.strokeStyle = this.getColor(ellipse.strokeColor(), 500).css()
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.ellipse(x, y, a, b, angle, 0, 2 * Math.PI)
    this.ctx.stroke()

    // Fill or do nothing if fill color not given
    let fillColor = ellipse.fillColor()
    if (fillColor != null) {
      this.ctx.fillStyle = this.getColor(fillColor, 500).css()
      const oldAlpha = this.ctx.globalAlpha
      this.ctx.globalAlpha = .1
      this.ctx.fill()
      this.ctx.globalAlpha = oldAlpha
    }

    this.ctx.closePath()
    this.ctx.restore()
  }

  protected renderPolygon(polygon: Polygon): void {
    this.ctx.save()
    const vertices = polygon.vertices()

    this.ctx.beginPath()
    const {x: x0, y: y0} = vertices[0].clone()
      .applyMatrix(this._appliedMatrix).getCartesianCoordinates()
    this.ctx.moveTo(x0, y0)
    vertices.forEach(vertex => {
      const {x, y} = vertex.clone()
        .applyMatrix(this._appliedMatrix).getCartesianCoordinates()
      this.ctx.lineTo(x, y)
    })
    const {x: xn, y: yn} = vertices[0].clone()
      .applyMatrix(this._appliedMatrix).getCartesianCoordinates()
    this.ctx.lineTo(xn, yn)

    // Stroke - default if nothing given
    let strokeColor = polygon.strokeColor()
    if (strokeColor == null) {
      strokeColor = MaterialColorEnum.BLUE_GREY // should be class member
    }
    this.ctx.strokeStyle = this.getColor(strokeColor, 700).css()
    this.ctx.stroke()

    // Fill or do nothing if fill color not given
    let fillColor = polygon.fillColor()
    if (fillColor != null) {
      this.ctx.fillStyle = this.getColor(fillColor, 500).css()
      const oldAlpha = this.ctx.globalAlpha
      this.ctx.globalAlpha = .1
      this.ctx.fill()
      this.ctx.globalAlpha = oldAlpha
    }
    this.ctx.closePath()
    this.ctx.restore()
  }

  private isMouseDown

  public mouseDown$ = new Subject<Coordinate>()
  public mouseDrag$ = new Subject<{ logic: Offset, canvas: Offset }>()
  public mouseUp$ = new Subject<Coordinate>()
  public mouseScrollUp$ = new Subject<Coordinate>()
  public mouseScrollDown$ = new Subject<Coordinate>()
  public mouseMove$ = new Subject<{ logic: Coordinate, canvas: Coordinate }>()

  private registerEvents() {
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this))
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.canvas.addEventListener('wheel', this.onMouseScroll.bind(this), <any>{passive: true})
  }

  private onMouseUp(event: MouseEvent): void {
    this.isMouseDown = false
    const clickPosition = getCursorPosition(this.canvas, event)
    const {x, y} = this.viewToLogicCoordinates(clickPosition)
    this.mouseUp$.next({x, y})
  }

  private onMouseLeave(event: MouseEvent): void {
    this.onMouseUp(event)
  }

  private onMouseDown(event: MouseEvent): void {
    this.isMouseDown = true
    const clickPosition = getCursorPosition(this.canvas, event)
    const {x, y} = this.viewToLogicCoordinates(clickPosition)
    this.mouseDown$.next({x, y})
  }

  private onMouseMove(event: MouseEvent): void {
    const canvasOffset = {dx: event.movementX, dy: event.movementY}
    const movementStart = {x: event.offsetX, y: event.offsetY}
    const movementEnd = {
      x: movementStart.x + canvasOffset.dx,
      y: movementStart.y + canvasOffset.dy,
    }

    const logicStart = this.viewToLogicCoordinates(movementStart)
    const logicEnd = this.viewToLogicCoordinates(movementEnd)

    const logicOffset = {
      dx: logicEnd.x - logicStart.x,
      dy: logicEnd.y - logicStart.y,
    }
    if (this.isMouseDown) {
      this.mouseDrag$.next({logic: logicOffset, canvas: canvasOffset})
    } else {
      this.mouseMove$.next({logic: logicStart, canvas: movementStart})
    }
  }

  private onMouseScroll(event: WheelEvent): void {
    const clickPosition = getCursorPosition(this.canvas, event)
    // const {x, y} = this.viewToLogicCoordinates(clickPosition)
    const {x, y} = clickPosition
    const downwards = event.deltaY > 0
    if (downwards) {
      this.mouseScrollDown$.next({x, y})
    } else {
      this.mouseScrollUp$.next({x, y})
    }
  }

}
