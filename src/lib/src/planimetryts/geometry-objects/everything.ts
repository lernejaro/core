import {
  areEqualFloats,
  cartesianToPolar,
  degreeToRadian,
  Equation,
  isZero,
  polarToCartesian,
  radianToDegree,
} from '../util'
import {Matrix} from './matrix'

function ViewData() {
  return function (target: GeometryObject, key: string) {
    const targetAny = target as any
    if (!targetAny.$$viewData) {
      targetAny.$$viewData = []
    }
    targetAny.$$viewData.push(key)
  }
}

export interface Coordinate {
  x: number
  y: number
}

export interface Offset {
  dx: number
  dy: number
}

export enum MaterialColor {
  RED,
  PINK,
  PURPLE,
  DEEP_PURPLE,
  INDIGO,
  BLUE,
  LIGHT_BLUE,
  CYAN,
  TEAL,
  GREEN,
  LIGHT_GREEN,
  LIME,
  YELLOW,
  AMBER,
  ORANGE,
  DEEP_ORANGE,
  BROWN,
  GREY,
  BLUE_GREY,
}

export abstract class GeometryObject {

  public $$viewData: string[] // Populated by the decorator

  @ViewData() protected _strokeColor: MaterialColor
  @ViewData() protected _fillColor: MaterialColor
  @ViewData() protected _label: string

  constructor(public kind: string) {
  }

  public abstract readJson(json): this;

  public abstract writeJson();

  public label(): string;
  public label(label: string): this;
  public label(label?: string): string | this {
    if (arguments.length == 0) {
      return this._label
    } else {
      this._label = label
      return this
    }
  }

  public strokeColor(): MaterialColor;
  public strokeColor(color: MaterialColor): this;
  public strokeColor(color?: MaterialColor): this | MaterialColor {
    if (arguments.length == 0) {
      return this._strokeColor
    } else {
      this._strokeColor = color
      return this
    }
  }

  public fillColor(): MaterialColor;
  public fillColor(fillColor: MaterialColor): this;
  public fillColor(fillColor?: MaterialColor): MaterialColor | this {
    if (arguments.length == 0) {
      return this._fillColor
    } else {
      this._fillColor = fillColor
      return this
    }
  }

  public copyViewDataFrom(object: GeometryObject): this {
    object.$$viewData.forEach(key => {
      this[key] = object[key]
    })
    return this
  }

  public abstract copyValuesFrom(object: GeometryObject): this;

  public copyFrom(object: GeometryObject): this {
    return this.copyViewDataFrom(object).copyValuesFrom(object)
  }

  protected abstract cloneValues(): this;

  // TODO: Write tests for this
  public clone(): this {
    const valueClone: this = this.cloneValues()
    valueClone.copyViewDataFrom(this)
    return valueClone
  }

  protected abstract destructToPoints(): Point[];

  protected abstract reconstructFromPoints(...points: Point[]): this;

  protected applyMatrixWithRespectToCenter(matrix: number[][]): this {
    const points = this.destructToPoints()
    points.forEach(point => point.applyMatrix(matrix))
    return this.reconstructFromPoints(...points)
  }

  private applyMatrixWithRespectTo(matrix: number[][], point: Point): this {
    const {x, y} = point.getCartesianCoordinates()
    return this
      .translate(-x, -y)
      .applyMatrixWithRespectToCenter(matrix)
      .translate(x, y)
  }

  public applyMatrix(matrix: number[][], point?: Point): this {
    if (arguments.length == 1 || point == null) {
      return this.applyMatrixWithRespectToCenter(matrix)
    } else if (arguments.length == 2) {
      return this.applyMatrixWithRespectTo(matrix, point)
    } else {
      throw `Invalid number of arguments for function applyHomogeneousMatrix.
Expected 1 or 2 but given ${arguments.length}.`
    }
  }

  public translateX(dx: number): this {
    return this.applyMatrix(Matrix.Homogeneous.TranslateX(dx))
  }

  public translateY(dy: number): this {
    return this.applyMatrix(Matrix.Homogeneous.TranslateY(dy))
  }

  public translate(dx: number, dy: number): this {
    return this.applyMatrix(Matrix.Homogeneous.Translate(dx, dy))
  }

  public stretchX(k: number, point?: Point): this {
    return this.applyMatrix(Matrix.Homogeneous.StretchX(k), point)
  }

  public stretchY(k: number, point?: Point): this {
    return this.applyMatrix(Matrix.Homogeneous.StretchY(k), point)
  }

  public stretch(k: number, point?: Point): this {
    return this.applyMatrix(Matrix.Homogeneous.Stretch(k), point)
  }

  public rotate(θ: number, point?: Point): this {
    return this.applyMatrix(Matrix.Homogeneous.Rotate(θ), point)
  }

  public shearX(k: number, point?: Point): this {
    return this.applyMatrix(Matrix.Homogeneous.ShearX(k), point)
  }

  public shearY(k: number, point?: Point): this {
    return this.applyMatrix(Matrix.Homogeneous.ShearY(k), point)
  }

  public reflectOverPoint(point: Point): this {
    return this.stretch(-1, point)
  }

  public reflectOverLine(line: Line): this {
    if (line.isVertical()) {
      const {A, C} = line.getGeneralForm()
      const x = -C / A
      return this
        .translateX(-x)
        .stretchX(-1)
        .translateX(x)
    } else {
      const {k, n} = line.getExplicitForm()
      const angle = Math.atan(k)
      return this.translateY(-n)
        .rotate(-angle)
        .stretchY(-1)
        .rotate(angle)
        .translateY(n)
    }
  }

  public radialSymmetry(point: Point, count: number): GeometryObject[] {
    const baseAngle = 2 * Math.PI / count
    return Array(count).fill(0).map((_, i) => i * baseAngle).map(angle => {
      return this.cloneValues().rotate(angle, point)
    })
  }

}


export class Line extends GeometryObject {

  public static AreEqual(line1: Line, line2: Line): boolean {
    if (!Line.AreParallel(line1, line2)) {
      return false
    }
    if (line1.isVertical() && line2.isVertical()) {
      const l1 = line1.getGeneralForm()
      const l2 = line2.getGeneralForm()
      return areEqualFloats(l1.C / l1.A, l2.C / l2.A)
    }
    const l1 = line1.getGeneralForm()
    const l2 = line2.getGeneralForm()
    return areEqualFloats(l1.C / l1.B, l2.C / l2.B)
  }

  public static FromSegmentForm(m: number, n: number): Line {
    const A = n
    const B = m
    const C = -(n * m)
    return new Line(A, B, C)
  }

  public static FromExplicitForm(k: number, n: number): Line {
    const A = k
    const B = -1
    const C = n
    return new Line(A, B, C)
  }

  public static FromGeneralForm(A: number, B: number, C: number): Line {
    return new Line(A, B, C)
  }

  public static FromNormalForm(φ: number, p: number): Line {
    const A = Math.cos(φ)
    const B = Math.sin(φ)
    const C = -p
    return new Line(A, B, C)
  }

  public static FromPointAndCoefficient(point: Point, k: number): Line {
    const n = point.y() - k * point.x()
    return Line.FromExplicitForm(k, n)
  }

  public static FromPointAndAngle(point: Point, angleRad: number): Line {
    if (areEqualFloats(angleRad, Math.PI / 2)) {
      return Line.VerticalThroughPoint(point)
    }
    const k = Math.tan(angleRad)
    return Line.FromPointAndCoefficient(point, k)
  }

  public static FromTwoPoints(point1: Point, point2: Point): Line {
    // TODO: what if two same points are given?
    const dy = point2.y() - point1.y()
    const dx = point2.x() - point1.x()
    if (isZero(dx)) {
      return Line.VerticalThroughPoint(point1)
    }
    const k = dy / dx
    return Line.FromPointAndCoefficient(point1, k)
  }

  public static FromSegment(segment: Segment): Line {
    const [point1, point2] = segment.getPoints()
    return Line.FromTwoPoints(point1, point2)
  }

  public static HorizontalThroughPoint(point: Point | number): Line {
    let y: number
    if (typeof point === 'number') {
      y = point
    } else {
      y = point.getCartesianCoordinates().y
    }
    return Line.FromExplicitForm(0, y)
  }

  public static VerticalThroughPoint(point: Point | number): Line {
    let x: number
    if (typeof point === 'number') {
      x = point
    } else {
      x = point.getCartesianCoordinates().x
    }
    return Line.FromGeneralForm(1, 0, -x)
  }

  public static GetAnglesBetween(line1: Line, line2: Line): number[] {
    if ((line1.isVertical() && line2.isVertical())
      || (line1.isHorizontal() && line2.isHorizontal())) {
      return [0, Math.PI]
    }
    if ((line1.isVertical() && line2.isHorizontal())
      || (line1.isHorizontal() && line2.isVertical())) {
      return [Math.PI / 2, Math.PI / 2]
    }
    let k1, k2
    if (!line1.isVertical()) {
      k1 = line1.getExplicitForm().k
    } else {
      k1 = Infinity
    }
    if (!line2.isVertical()) {
      k2 = line2.getExplicitForm().k
    } else {
      k2 = Infinity
    }
    return [
      Math.atan2((k2 - k1), (1 + k1 * k2)),
      Math.atan2((k1 - k2), (1 + k1 * k2)),
    ].sort()
  }

  public static GetDistanceBetweenLineAndPoint(line: Line, point: Point): number {
    const l = line.getGeneralForm()
    const num = l.A * point.x() + l.B * point.y() + l.C
    const den = Math.sqrt(l.A * l.A + l.B * l.B)
    return Math.abs(num / den)
  }

  public static GetBisectors(line1: Line, line2: Line): Line[] {
    const l1 = line1.getGeneralForm()
    const l2 = line2.getGeneralForm()
    const sgn1 = Math.sign(l1.C) == 0 ? -1 : Math.sign(l1.C)
    const sgn2 = Math.sign(l2.C) == 0 ? -1 : Math.sign(l2.C)
    const sqrt1 = -sgn1 * Math.sqrt(l1.A * l1.A + l1.B * l1.B)
    const sqrt2 = -sgn2 * Math.sqrt(l2.A * l2.A + l2.B * l2.B)
    const A1 = (l1.A / sqrt1 + l2.A / sqrt2)
    const A2 = (l1.A / sqrt1 - l2.A / sqrt2)
    const B1 = (l1.B / sqrt1 + l2.B / sqrt2)
    const B2 = (l1.B / sqrt1 - l2.B / sqrt2)
    const C1 = (l1.C / sqrt1 + l2.C / sqrt2)
    const C2 = (l1.C / sqrt1 - l2.C / sqrt2)
    return [new Line(A1, B1, C1), new Line(A2, B2, C2)]
  }

  public static GetBisector(vertex: Point, arm1: Point, arm2: Point): Line {
    const line1 = Line.FromTwoPoints(vertex, arm1)
    const line2 = Line.FromTwoPoints(vertex, arm2)
    const bisectors = Line.GetBisectors(line1, line2)
    return bisectors.find(bisector => !bisector.pointsAreOnSameSide(arm1, arm2))
  }

  public static AreParallel(line1: Line, line2: Line): boolean {
    if (line1.isVertical() && line2.isVertical()) {
      return true
    }
    if (line1.isVertical() || line2.isVertical()) {
      // Only one is vertical
      return false
    }
    const k1 = line1.getExplicitForm().k
    const k2 = line2.getExplicitForm().k
    return areEqualFloats(k1, k2)
  }

  public static AreOrthogonal(line1: Line, line2: Line): boolean {
    if (line1.isVertical() && line2.isHorizontal()) {
      return true
    }
    if (line1.isHorizontal() && line2.isVertical()) {
      return true
    }
    if (line1.isVertical() || line2.isVertical()) {
      // One is vertical and the other is not horizontal
      return false
    }
    const k1 = line1.getExplicitForm().k
    const k2 = line2.getExplicitForm().k
    return areEqualFloats(k1 * k2, -1)
  }

  public static GetIntersection(line1: Line, line2: Line): Point | null {
    if (Line.AreParallel(line1, line2)) {
      return null
    }
    const [l1, l2] = [line1, line2].map(line => line.getGeneralForm())
    if (!isZero(l1.A)) {
      const yNum = (l1.C * l2.A) / l1.A - l2.C
      const yDen = l2.B - (l1.B * l2.A) / l1.A
      const y = yNum / yDen
      const x = (-l1.C - l1.B * y) / l1.A
      return Point.FromCartesianCoordinates(x, y)
    }
    if (!isZero(l1.B)) {
      const xNum = (l2.B * l1.C) / l1.B - l2.C
      const xDen = l2.A - (l2.B * l1.A) / l1.B
      const x = xNum / xDen
      const y = (-l1.C - l1.A * x) / l1.B
      return Point.FromCartesianCoordinates(x, y)
    }
  }

  public static ParallelThroughPoint(line: Line, point: Point): Line {
    if (line.isVertical()) {
      return Line.VerticalThroughPoint(point)
    } else if (line.isHorizontal()) {
      return Line.HorizontalThroughPoint(point)
    } else {
      const k = line.getExplicitForm().k
      return Line.FromPointAndCoefficient(point, k)
    }
  }

  public static OrthogonalThroughPoint(line: Line | Segment, point: Point): Line {
    let _line: any = line // fuck you TS
    if (_line instanceof Segment) {
      _line = Line.FromSegment(_line)
    }
    if (_line.isVertical()) {
      return Line.HorizontalThroughPoint(point)
    } else if (_line.isHorizontal()) {
      return Line.VerticalThroughPoint(point)
    } else {
      const k = _line.getExplicitForm().k
      const newK = -1 / k
      return Line.FromPointAndCoefficient(point, newK)
    }
  }

  public static X_AXIS: Line = Line.HorizontalThroughPoint(0)
  public static Y_AXIS: Line = Line.VerticalThroughPoint(0)
  public static Y_EQUALS_X: Line = Line.FromExplicitForm(1, 0)

  private _A: number
  private _B: number
  private _C: number

  protected constructor(A: number, B: number, C: number) {
    super('line')
    this._A = A
    this._B = B
    this._C = C
    return this
  }

  public writeJson() {
    return {
      kind: 'line',
      label: this.label(),
      color: this.strokeColor(),
      defaultValue: 'general',
      value: {
        'general': this.getGeneralForm(),
        'explicit': this.getExplicitForm(),
        'segment': this.getSegmentForm(),
      },
    }
  }

  public readJson(json): this {
    this._A = json.value['general'].A
    this._B = json.value['general'].B
    this._C = json.value['general'].C
    this.label(json.label)
    this.strokeColor(json.strokeColor)
    return this
  }

  public copyValuesFrom(line: Line): this {
    const {A, B, C} = line.getGeneralForm()
    this._A = A
    this._B = B
    this._C = C
    return this
  }

  protected cloneValues(): this {
    const {A, B, C} = this.getGeneralForm()
    return <this>Line.FromGeneralForm(A, B, C)
  }

  private aIsZero(): boolean {
    return isZero(this._A)
  }

  private bIsZero(): boolean {
    return isZero(this._B)
  }

  private cIsZero(): boolean {
    return isZero(this._C)
  }

  public isHorizontal(): boolean {
    return this.aIsZero()
  }

  public isVertical(): boolean {
    return this.bIsZero()
  }

  public getGeneralForm(): { A: number, B: number, C: number } {
    return {A: this._A, B: this._B, C: this._C}
  }

  public getExplicitForm(): { k: number, n: number } {
    if (this.bIsZero()) {
      return null
    }
    const k = -this._A / this._B
    const n = -this._C / this._B
    return {k, n}
  }

  public getSegmentForm(): { m: number, n: number } {
    if (this.aIsZero() || this.bIsZero() || this.cIsZero()) {
      return null
    }
    const m = -this._C / this._A
    const n = -this._C / this._B
    return {m, n}
  }

  // public getNormalForm(): {φ: number, p: number} {
  //
  // }

  public getTwoPoints(): Point[] {
    if (this.isHorizontal()) {
      return [Line.VerticalThroughPoint(0), Line.VerticalThroughPoint(1)]
        .map(line => Line.GetIntersection(this, line))
    } else {
      return [Line.HorizontalThroughPoint(0), Line.HorizontalThroughPoint(1)]
        .map(line => Line.GetIntersection(this, line))
    }
  }

  protected destructToPoints(): Point[] {
    return this.getTwoPoints().map(p => p.clone())
  }

  protected reconstructFromPoints(...points: Point[]): this {
    const [point1, point2] = points
    const line = Line.FromTwoPoints(point1, point2)
    this._A = line._A
    this._B = line._B
    this._C = line._C
    return this
  }

  private getPointPositionalSign(point: Point): -1 | 0 | 1 {
    const l = this.getGeneralForm()
    const p = point.getCartesianCoordinates()
    const result = l.A * p.x + l.B * p.y + l.C
    if (isZero(result)) {
      return 0
    } else {
      return result > 0 ? 1 : -1
    }
  }

  public pointsAreOnSameSide(point1: Point, point2: Point): boolean {
    if (this.containsPoint(point1) || this.containsPoint(point2)) {
      return false
    }
    const sidePoint1: number = this.getPointPositionalSign(point1)
    const sidePoint2: number = this.getPointPositionalSign(point2)
    return sidePoint1 == sidePoint2
  }

  public containsPoint(point: Point): boolean {
    return this.getPointPositionalSign(point) == 0
  }

}


export class Angle extends GeometryObject {

  public static Degrees(angleDegrees: number): Angle {
    return new Angle(angleDegrees)
  }

  public static Radians(angleRadians: number): Angle {
    return new Angle(radianToDegree(angleRadians))
  }

  public static Add(angle1: Angle, angle2: Angle): Angle {
    return Angle.Degrees(angle1.degrees + angle2.degrees)
  }

  private _angleDegrees: number

  private _displayLines: boolean = false
  private _decoration: AngleDecoration = AngleDecoration.NONE

  protected constructor(angleDegrees: number) {
    super('angle')
    this._angleDegrees = angleDegrees
  }

  // TODO
  // plus the whole component is dubious
  // is it for transforming angles
  // or for drawing angle at a point
  public writeJson() {
    return {
      label: this.label(),
      color: this.strokeColor(),
      kind: 'angle',
      defaultValue: 'three-points',
      value: {},
    }
  }

  public readJson(json): this {
    this.label(json.label)
    this.strokeColor(json.strokeColor)
    return this
  }

  public copyValuesFrom(angle: Angle): this {
    this._angleDegrees = angle.degrees
    return this
  }

  protected cloneValues(): this {
    return <this>Angle.Degrees(this.degrees)
  }

  public decoration(): AngleDecoration;
  public decoration(decoration: AngleDecoration): this;
  public decoration(decoration?: AngleDecoration): this | AngleDecoration {
    if (arguments.length == 0) {
      return this._decoration
    } else {
      this._decoration = decoration
      return this
    }
  }

  public get degrees(): number {
    return this._angleDegrees
  }

  public get radians(): number {
    return degreeToRadian(this._angleDegrees)
  }

  public displayLines(value?: boolean): this {
    if (arguments.length == 0) {
      this._displayLines = true
    } else {
      this._displayLines = value
    }
    return this
  }

  public hideLines(): this {
    this._displayLines = false
    return this
  }

  protected destructToPoints(): Point[] {
    throw 'TODO'
  }

  protected reconstructFromPoints(...points: Point[]): this {
    throw 'TODO'
  }

  public radialSymmetry(point: Point): this[] {
    throw 'TODO'
  }

}

export class Circle extends GeometryObject {

  public static AreEqual(circle1: Circle, circle2: Circle): boolean {
    const equalRadii = areEqualFloats(circle1._radius, circle2._radius)
    const equalCenters = Point.AreEqual(circle1._center, circle2._center)
    return equalRadii && equalCenters
  }

  public static FromGeneralForm(p: number, q: number, r: number): Circle {
    const center = Point.FromCartesianCoordinates(p, q)
    return Circle.FromCenterAndRadius(center, r)
  }

  public static FromCenterAndRadius(center: Point, radius: number): Circle {
    return new Circle(center, radius)
  }

  public static FromBoundingBox(topLeft: Point, bottomRight: Point): Circle {
    const center = Point.GetPointBetween(topLeft, bottomRight)
    const d = Point.GetDistanceBetween(topLeft, bottomRight)
    const radius = d / (2 * Math.sqrt(2))
    return Circle.FromCenterAndRadius(center, radius)
  }

  public static FromCenterAndPoint(center: Point, point: Point): Circle {
    const radius = Point.GetDistanceBetween(center, point)
    return Circle.FromCenterAndRadius(center, radius)
  }

  public static FromCenterAndLine(center: Point, line: Line): Circle {
    const radius = Point.GetDistanceBetweenLineAndPoint(line, center)
    return Circle.FromCenterAndRadius(center, radius)
  }

  public static GetIntersectionsWithLine(circle: Circle, line: Line): Point[] {
    const c = circle._center.getCartesianCoordinates()
    const r = circle._radius
    if (line.isVertical()) {
      const l = line.getGeneralForm()

      const x: number = -l.C / l.A

      const A = 1
      const B = -2 * c.y
      const C = (x - c.x) ** 2 - r ** 2 + c.y ** 2
      const ys: number[] = Equation.Quadratic.solve(A, B, C)

      return ys.map(y => Point.FromCartesianCoordinates(x, y))
    } else {
      const l = line.getExplicitForm()

      const A = l.k ** 2 + 1
      const B = 2 * l.k * l.n - 2 * c.x - 2 * c.y * l.k
      const C = c.x ** 2 + l.n ** 2 + c.y ** 2 - 2 * l.n * c.y - r ** 2
      const xs: number[] = Equation.Quadratic.solve(A, B, C)

      return xs.map(x => {
        const y = l.k * x + l.n
        return Point.FromCartesianCoordinates(x, y)
      })
    }
  }

  public static GetIntersectionsWithCircle(c1: Circle, c2: Circle): Point[] {
    throw 'TODO Circle.GetIntersectionsWithCircle'
  }

  private _center: Point
  private _radius: number

  protected constructor(center: Point, radius: number) {
    super('circle')
    this._center = center
    this._radius = radius
    return this
  }

  public writeJson() {
    return {
      kind: 'circle',
      label: this.label(),
      color: this.strokeColor(),
      defaultValue: 'general',
      value: {
        'general': this.getGeneralForm(),
      },
    }
  }

  public readJson(json): this {
    this.label(json.label)
    this.strokeColor(json.strokeColor)
    const x = json.value['general'].p
    const y = json.value['general'].q
    this._center = Point.FromCartesianCoordinates(x, y)
    this._radius = json.value['general'].r
    return this
  }

  public center(): Point {
    return this._center
  }

  public radius(): number;
  public radius(radius: number): this;
  public radius(fn: ((radius: number) => number)): this;
  public radius(radius?: number | ((radius: number) => number)): number | this {
    if (radius == null) {
      return this._radius
    } else {
      if (typeof radius === 'number') {
        this._radius = radius
      } else {
        this._radius = radius(this._radius)
      }
      return this
    }
  }

  public copyValuesFrom(circle: Circle): this {
    this._radius = circle._radius
    this._center = circle._center.clone()
    return this
  }

  protected cloneValues(): this {
    const {p, q, r} = this.getGeneralForm()
    return <this>Circle.FromGeneralForm(p, q, r)
  }

  public getGeneralForm(): { p: number, q: number, r: number } {
    const p = this._center.x()
    const q = this._center.y()
    const r = this._radius
    return {p, q, r}
  }

  public getRightPoint(): Point {
    return Point.Add(this._center, Point.FromPolarCoordinates(this._radius, 0))
  }

  protected destructToPoints(): Point[] {
    const center = this._center.clone()
    const point = this.getRightPoint()
    return [center, point]
  }

  protected reconstructFromPoints(...points: Point[]): this {
    const [center, point] = points
    const circle = Circle.FromCenterAndPoint(center, point)
    this._radius = circle._radius
    this._center = circle._center
    return this
  }

  private getPointPositionalSign(point: Point): number {
    const c = this.getGeneralForm()
    const p = point.getCartesianCoordinates()
    const result = (p.x - c.p) ** 2 + (p.y - c.q) ** 2 - c.r ** 2
    if (isZero(result)) {
      return 0
    } else {
      return result > 0 ? 1 : -1
    }
  }

  public containsPoint(point: Point): boolean {
    return this.getPointPositionalSign(point) == 0
  }

  public isPointInside(point: Point): boolean {
    return this.getPointPositionalSign(point) == -1
  }

  public isPointOutside(point: Point): boolean {
    return !this.containsPoint(point) && !this.isPointInside(point)
  }

  public pointsAreOnSameSide(point1: Point, point2: Point): boolean {
    if (this.containsPoint(point1) || this.containsPoint(point2)) {
      return false
    }
    const sidePoint1: number = this.getPointPositionalSign(point1)
    const sidePoint2: number = this.getPointPositionalSign(point2)
    return sidePoint1 == sidePoint2
  }

  public getTangentsThroughPoint(point: Point): Line[] {
    throw 'TODO Circle#getTangentThroughPoint'
  }

}

export interface EllipseGeneralForm {
  A: number, B: number, C: number, D: number, E: number, F: number
}

export enum AngleDecoration {
  NONE,
  LINE,
  DOUBLE_LINE,
  TRIPLE_LINE,
  WAVE,
  DOUBLE_WAVE,
  TRIPLE_WAVE,
}

export class Ellipse extends GeometryObject {

  public static AreEqual(ellipse1: Ellipse, ellipse2: Ellipse): boolean {
    const {A: A1, B: B1, C: C1, D: D1, E: E1, F: F1} = ellipse1.getGeneralForm()
    const {A: A2, B: B2, C: C2, D: D2, E: E2, F: F2} = ellipse2.getGeneralForm()
    return areEqualFloats(A1, A2)
      && areEqualFloats(B1, B2)
      && areEqualFloats(C1, C2)
      && areEqualFloats(D1, D2)
      && areEqualFloats(E1, E2)
      && areEqualFloats(F1, F2)
  }

  /**
   * (x/a)² + (y/b)² = 1
   * @param a
   * @param b
   * @returns {Ellipse}
   * @constructor
   */
  public static FromCanonicalForm(a: number, b: number): Ellipse {
    if (isZero(a) || isZero(b)) {
      throw new Error(`a or b cannot be equal to 0. Given values: a = ${a}, b = ${b}`)
    }
    const [A, C, F] = [b ** 2, a ** 2, -(a ** 2 * b ** 2)]
    return Ellipse.FromGeneralForm(A, 0, C, 0, 0, F)
  }

  /**
   * Ax² + Bxy + Cy² + Dx + Et + F = 0
   *
   * @param A Coefficient of x²
   * @param B Coefficient of xy
   * @param C Coefficient of y²
   * @param D Coefficient of x
   * @param E Coefficient of y
   * @param F Coefficient of 1
   * @returns {Ellipse}
   * @constructor
   */
  public static FromGeneralForm(A: number,
                                B: number,
                                C: number,
                                D: number,
                                E: number,
                                F: number): Ellipse {
    const something = new Ellipse(A, B, C, D, E, F)
    if (something.isEllipse()) {
      return something
    } else {
      throw new Error(`Parameters [A, B, C, D, E, F] = ` +
        `[${A}, ${B}, ${C}, ${D}, ${E}, ${F}] do not form an ellipse`)
    }
  }


  public static FromMatrix(matrix: number[][]): Ellipse {
    if (areEqualFloats(matrix[0][1], matrix[1][0])
      && areEqualFloats(matrix[0][2], matrix[2][0])
      && areEqualFloats(matrix[1][2], matrix[2][1])) {
      const A = matrix[0][0]
      const B = 2 * matrix[0][1]
      const C = matrix[1][1]
      const D = 2 * matrix[0][2]
      const E = 2 * matrix[1][2]
      const F = matrix[2][2]
      return Ellipse.FromGeneralForm(A, B, C, D, E, F)
    } else {
      throw new Error(`Matrix does not meet requirements for ellipse.`)
    }
  }

  public static Circle = {

    FromCenterAndRadius(center: Point, radius: number): Ellipse {
      const {x: p, y: q} = center.getCartesianCoordinates()
      const r = radius
      return Ellipse.FromGeneralForm(1, 0, 1, -2 * p, -2 * q, p * p + q * q - r * r)
    },

    // (x - p)² + (y - q)² = r²
    FromGeneralForm(p: number, q: number, r: number): Ellipse {
      const center = Point.FromCartesianCoordinates(p, q)
      return Ellipse.Circle.FromCenterAndRadius(center, r)
    },

    FromCenterAndLine(center: Point, line: Line): Ellipse {
      const radius = Point.GetDistanceBetweenLineAndPoint(line, center)
      return Ellipse.Circle.FromCenterAndRadius(center, radius)
    },

    FromCenterAndPoint(center: Point, point: Point): Ellipse {
      const radius = Point.GetDistanceBetween(center, point)
      return Ellipse.Circle.FromCenterAndRadius(center, radius)
    },

  }

  private A: number
  private B: number
  private C: number
  private D: number
  private E: number
  private F: number

  protected constructor(A: number, B: number, C: number, D: number, E: number, F: number) {
    super('ellipse')
    this.A = A
    this.B = B
    this.C = C
    this.D = D
    this.E = E
    this.F = F
  }

  private isEllipse(): boolean {
    const [A, B, C] = [this.A, this.B, this.C]
    return B ** 2 - 4 * A * C < 0 // TODO float comparison
  }

  public isCircle(): boolean {
    return this.isEllipse() && areEqualFloats(this.A, this.C)
  }

  public getRadii(): number[] {
    if (!this.isEllipse()) {
      throw new Error(`Cannot get radii since this is not ellipse`)
    }
    const [A, B, C, D, E, F] = [this.A, this.B, this.C, this.D, this.E, this.F]
    const discriminant: number = B ** 2 - 4 * A * C
    const upperLeft: number = A * E ** 2 + C * D ** 2 - B * D * E + discriminant * F
    const upperRight: number[] = [
      A + C + Math.sqrt((A - C) ** 2 + B ** 2),
      A + C - Math.sqrt((A - C) ** 2 + B ** 2),
    ]
    const bottom: number = discriminant
    return upperRight.map(right => {
      return -Math.sqrt(2 * upperLeft * right) / bottom
    })
  }

  public getCenter(): Point {
    const [A, B, C, D, E] = [this.A, this.B, this.C, this.D, this.E]
    const discriminant: number = B ** 2 - 4 * A * C
    const xUp = 2 * C * D - B * E
    const yUp = 2 * A * E - B * D
    const x = xUp / discriminant
    const y = yUp / discriminant
    return Point.FromCartesianCoordinates(x, y)
  }

  /**
   * Gets angle between main ellipse axis and positive orientation or x-axis, in radians.
   */
  public getAngle(): number {
    const [A, B, C] = [this.A, this.B, this.C]
    if (isZero(B) && (A <= C || areEqualFloats(A, C))) {
      return 0
    } else if (isZero(B) && A > C) {
      return Math.PI / 2
    } else {
      const sqrt = Math.sqrt((A - C) ** 2 + B ** 2)
      const k = (C - A - sqrt) / B
      return Math.atan(k)
    }
  }

  public getGeneralForm(): EllipseGeneralForm {
    const [A, B, C, D, E, F] = [this.A, this.B, this.C, this.D, this.E, this.F]
    return {A, B, C, D, E, F}
  }

  public getMatrix(): number[][] {
    const [A, B, C, D, E, F] = [this.A, this.B, this.C, this.D, this.E, this.F]
    return [
      [A, B / 2, D / 2],
      [B / 2, C, E / 2],
      [D / 2, E / 2, F],
    ]
  }

  public readJson(json): this {
    return undefined
  }

  public writeJson() {
  }

  public copyValuesFrom(ellipse: Ellipse): this {
    [this.A, this.B, this.C, this.D, this.E, this.F] =
      [ellipse.A, ellipse.B, ellipse.C, ellipse.D, ellipse.E, ellipse.F]
    return this
  }

  protected cloneValues(): this {
    const {A, B, C, D, E, F} = this.getGeneralForm()
    return <this>Ellipse.FromGeneralForm(A, B, C, D, E, F)
  }

  protected destructToPoints(): Point[] {
    throw new Error(`Ellipse cannot be deconstructed to points`)
  }

  protected reconstructFromPoints(...points: Point[]): this {
    throw new Error(`Ellipse cannot be reconstructed from points`)
  }

  public applyMatrixWithRespectToCenter(matrix: number[][]): this {
    const matrixT: number[][] = Matrix.Transpose(matrix)
    const newMatrix = Matrix.Multiply(matrixT, Matrix.Multiply(this.getMatrix(), matrix))
    const newEllipse = Ellipse.FromMatrix(newMatrix)
    return this.copyFrom(newEllipse)
  }

  public getArea(): number {
    const [a, b] = this.getRadii()
    return Math.PI * a * b
  }

  public getPerimeter(): number {
    throw 'TODO' // TODO
  }

}

// TODO: Add Polylines

export class Polygon extends GeometryObject {

  // TODO: Add circular tests (ABC == BCA)
  // TODO: Also think about is CW/CCW important for marking polygons as the same ones
  public static AreEqual(polygon1: Polygon, polygon2: Polygon): boolean {
    return (polygon1._vertices.length == polygon2._vertices.length)
      && (polygon1._vertices.every((v1, i) => Point.AreEqual(v1, polygon2._vertices[i])))
  }

  public static FromVertices(...points: Point[]): Polygon {
    return new Polygon(...points)
  }

  protected _vertices: Point[]

  protected constructor(...points: Point[]) {
    super('polygon')
    this._vertices = points
  }

  public writeJson() {
    const vertices = this._vertices.map(v => v.getCartesianCoordinates())
    return {
      kind: 'polygon',
      color: this.strokeColor(),
      label: this.label(),
      defaultValue: 'list-of-vertices',
      values: {
        'list-of-vertices': vertices,
      },
    }
  }

  public readJson(json): this {
    this.label(json.label)
    this.strokeColor(json.strokeColor)
    this._vertices = json.values['list-of-vertices'].map(coord => {
      return Point.FromCartesianCoordinates(coord.x, coord.y)
    })
    return this
  }

  public vertices(): Point[] {
    return this._vertices.map(point => point.clone())
  }

  public segments(): Segment[] {
    let vertices = this.vertices()
    vertices.push(vertices[0])
    let segments: Segment[] = []
    for (let i = 0; i < vertices.length - 1; i++) {
      const curr = vertices[i]
      const next = vertices[i + 1]
      const segment = Segment.FromTwoPoints(curr, next)
      segments.push(segment)
    }
    return segments
  }

  public copyValuesFrom(polygon: Polygon): this {
    this._vertices = polygon._vertices.map(v => v.clone())
    return this
  }

  protected cloneValues(): this {
    const clones = this._vertices.map(p => p.clone())
    return <this>Polygon.FromVertices(...clones)
  }

  public getArea(): number {
    // http://stackoverflow.com/a/717367
    let area = 0
    const N = this._vertices.length
    for (let i = 0; i < N; i += 2) {
      const u = this._vertices[i % N].getCartesianCoordinates()
      const v = this._vertices[(i + 1) % N].getCartesianCoordinates()
      const t = this._vertices[(i + 2) % N].getCartesianCoordinates()
      area += v.x * (t.y - u.y) + v.y * (u.x - t.x)
    }
    return area / 2
  }

  public getAngleAt(vertexIndex: number): Angle {
    throw 'TODO'
  }

  protected destructToPoints(): Point[] {
    return this.vertices().map(v => v.clone())
  }

  protected reconstructFromPoints(...points: Point[]): this {
    this._vertices = points
    return this
  }

}

// This is used for calculations, not for drawing.
// To draw a rectangular area, draw a polygon and set its fill color.
export class RectangularArea extends GeometryObject {

  public static AreEqual(rectangularArea1: RectangularArea,
                         rectangularArea2: RectangularArea): boolean {
    const [point11, point12] = rectangularArea1.getPoints()
    const [point21, point22] = rectangularArea2.getPoints()
    return Point.AreEqual(point11, point21) && Point.AreEqual(point12, point22)
  }

  public static FromTwoPoints(point1: Point, point2: Point): RectangularArea {
    return new RectangularArea(point1.x(), point1.y(), point2.x(), point2.y())
  }

  protected _point1: Point
  protected _point2: Point

  protected constructor(x1: number, y1: number, x2: number, y2: number, label?: string) {
    super('rectangular-area')

    const minX = Math.min(x1, x2)
    const minY = Math.min(y1, y2)
    const maxX = Math.max(x1, x2)
    const maxY = Math.max(y1, y2)

    this._point1 = Point.FromCartesianCoordinates(minX, minY)
    this._point2 = Point.FromCartesianCoordinates(maxX, maxY)
    this._label = label
  }

  public readJson(json): this {
    this.label(json.label)
    this.strokeColor(json.strokeColor)
    const {x1, x2, y1, y2} = json.value['two-points']
    this._point1 = Point.FromCartesianCoordinates(x1, y1)
    this._point2 = Point.FromCartesianCoordinates(x2, y2)
    return this
  }

  public writeJson() {
    return {
      kind: 'point',
      label: this.label(),
      color: this.strokeColor(),
      defaultValue: 'two-points',
      value: {
        'two-points': this.getPoints(),
      },
    }
  }

  public getPoints(): Point[] {
    return [this._point1, this._point2]
  }

  public copyValuesFrom(rectangularArea: RectangularArea): this {
    [this._point1, this._point2] = rectangularArea.getPoints().map(ra => ra.clone())
    return this
  }

  protected cloneValues(): this {
    const [point1, point2] = [this._point1.clone(), this._point2.clone()]
    return <this>RectangularArea.FromTwoPoints(point1, point2)
  }

  protected destructToPoints(): Point[] {
    return this.getPoints().map(ra => ra.clone())
  }

  protected reconstructFromPoints(...points: Point[]): this {
    [this._point1, this._point2] = points
    return this
  }

  public getPolygon(): Polygon {
    const [A, C] = [this._point1.clone(), this._point2.clone()]
    const {x: Ax, y: Ay} = A.getCartesianCoordinates()
    const {x: Cx, y: Cy} = C.getCartesianCoordinates()
    const B = Point.FromCartesianCoordinates(Cx, Ay)
    const D = Point.FromCartesianCoordinates(Ax, Cy)
    return Polygon.FromVertices(A, B, C, D)
  }

  public getVertices(): Point[] {
    return this.getPolygon().vertices()
  }

  public getSegments(): Segment[] {
    return this.getPolygon().segments()
  }

  public getLines(): Line[] {
    return this.getSegments().map(segment => segment.getLine())
  }

  public getCenterPoint(): Point {
    const [point1, point2] = this.getPoints()
    return Point.GetPointBetween(point1, point2)
  }

  public containsPoint(point: Point): boolean {
    const center = this.getCenterPoint()
    return this.getLines().every(line => line.pointsAreOnSameSide(point, center))
  }

  public pointsLaysOnTheEdge(point: Point): boolean {
    return this.getLines().some(line => line.containsPoint(point))
  }

  public containsPointInclusively(point: Point): boolean {
    return this.containsPoint(point) || this.pointsLaysOnTheEdge(point)
  }

  public containsSegmentFully(segment: Segment): boolean {
    return segment.getPoints().every(this.containsPoint.bind(this))
  }

  public containsSegmentAtLeastPartially(segment: Segment): boolean {
    return segment.getPoints().some(this.containsPoint.bind(this))
  }

  public getCapturedSegment(line: Line): Segment | null {
    const intersections = this.getSegments()
      .map(segment => Segment.GetIntersectionWithLine(segment, line))
      .filter(point => point != null)

    if (intersections.length != 2) {
      return null
    }

    const [A, B] = intersections
    return Segment.FromTwoPoints(A, B)
  }

}

export class Segment extends GeometryObject {

  public static AreEqual(segment1: Segment, segment2: Segment): boolean {
    const [point11, point12] = segment1.getPoints()
    const [point21, point22] = segment2.getPoints()
    return (Point.AreEqual(point11, point21) && Point.AreEqual(point12, point22))
      || (Point.AreEqual(point11, point22) && Point.AreEqual(point12, point21))
  }

  public static FromTwoPoints(point1: Point, point2: Point): Segment {
    return new Segment(point1, point2)
  }

  public static FromGeneralForm(x1: number, y1: number, x2: number, y2: number): Segment {
    const point1 = Point.FromCartesianCoordinates(x1, y1)
    const point2 = Point.FromCartesianCoordinates(x2, y2)
    return Segment.FromTwoPoints(point1, point2)
  }

  public static GetIntersection(segment1: Segment, segment2: Segment): Point | null {
    const [line1, line2] = [segment1, segment2].map(segment => segment.getLine())
    const intersection = Line.GetIntersection(line1, line2)

    if (intersection == null) {
      return null
    }

    if (segment1.containsPoint(intersection) && segment2.containsPoint(intersection)) {
      return intersection
    } else {
      return null
    }
  }

  public static GetIntersectionWithLine(segment1: Segment, line2: Line): Point | null {
    const line1 = segment1.getLine()
    const intersection = Line.GetIntersection(line1, line2)

    if (intersection == null) {
      return null
    }

    if (segment1.containsPoint(intersection)) {
      return intersection
    } else {
      return null
    }
  }

  protected _point1: Point
  protected _point2: Point

  protected constructor(point1: Point, point2: Point, label?: string) {
    super('segment')
    this._point1 = point1
    this._point2 = point2
    this._label = label
  }

  public writeJson() {
    const [p1, p2] = this.getPoints()
    const {x1, y1, x2, y2} = {
      x1: p1.x(),
      y1: p1.y(),
      x2: p2.x(),
      y2: p2.y(),
    }
    return {
      kind: 'segment',
      label: this.label(),
      color: this.strokeColor(),
      defaultValue: 'two-points',
      value: {
        'two-points': {x1, y1, x2, y2},
      },
    }
  }

  public readJson(json): this {
    this.label(json.label)
    this.strokeColor(json.strokeColor)
    const x1 = json.value['two-points'].x1
    const x2 = json.value['two-points'].x2
    const y1 = json.value['two-points'].y1
    const y2 = json.value['two-points'].y2
    this._point1 = Point.FromCartesianCoordinates(x1, y1)
    this._point2 = Point.FromCartesianCoordinates(x2, y2)
    return this
  }

  public copyValuesFrom(segment: Segment): this {
    [this._point1, this._point2] = segment.getPoints().map(p => p.clone())
    return this
  }

  protected cloneValues(): this {
    const point1 = this._point1.clone()
    const point2 = this._point2.clone()
    return <this>Segment.FromTwoPoints(point1, point2)
  }

  public getPoints(): Point[] {
    return [this._point1, this._point2]
  }

  protected destructToPoints(): Point[] {
    return this.getPoints().map(p => p.clone())
  }

  protected reconstructFromPoints(...points: Point[]): this {
    const [point1, point2] = points
    this._point1 = point1
    this._point2 = point2
    return this
  }

  public getMiddle(): Point {
    return Point.GetPointBetween(this._point1, this._point2)
  }

  public getLine(): Line {
    const points = this.getPoints()
    return Line.FromTwoPoints(points[0], points[1])
  }

  public getBisector(): Line {
    return Line.OrthogonalThroughPoint(this.getLine(), this.getMiddle())
  }

  public containsPoint(point: Point, inclusively: boolean = false): boolean {
    const lineContainsPoint = this.getLine().containsPoint(point)
    if (!lineContainsPoint) {
      return false
    }

    if (this.getLine().isHorizontal()) {
      const minX = Math.min(this._point1.x(), this._point2.x())
      const maxX = Math.max(this._point1.x(), this._point2.x())
      if (inclusively) {
        return minX <= point.x() && point.x() <= maxX
      } else {
        return minX < point.x() && point.x() < maxX
      }
    }

    if (this.getLine().isVertical()) {
      const minY = Math.min(this._point1.y(), this._point2.y())
      const maxY = Math.max(this._point1.y(), this._point2.y())
      if (inclusively) {
        return minY <= point.y() && point.y() <= maxY
      } else {
        return minY < point.y() && point.y() < maxY
      }
    }

    const [point1, point2] = this.getPoints()
    const rectangularArea = RectangularArea.FromTwoPoints(point1, point2)
    if (inclusively) {
      return rectangularArea.containsPointInclusively(point)
    } else {
      return rectangularArea.containsPoint(point)
    }
  }

  public getIntersectionWithSegment(segment: Segment): Point | null {
    return Segment.GetIntersection(this, segment)
  }

  public getIntersectionWithLine(line: Line): Point | null {
    return Segment.GetIntersectionWithLine(this, line)
  }

}

// TODO Write tests

export class Semiplane extends GeometryObject {

  public static FromLineAndVector(line: Line, vector: Point): Semiplane {
    return new Semiplane(line, vector)
  }

  protected _line: Line
  protected _vector: Point

  protected constructor(line: Line, vector: Point) {
    super('semiplane')
    this._line = line
    this._vector = vector
  }

  protected cloneValues(): this {
    return <this>Semiplane.FromLineAndVector(this._line.clone(), this._vector.clone())
  }

  // TODO
  readJson(json): this {
    return undefined
  }

  // TODO
  writeJson() {
  }

  copyValuesFrom(semiplane: Semiplane): this {
    this._line = semiplane._line.clone()
    this._vector = semiplane._vector.clone()
    return this
  }

  protected destructToPoints(): Point[] {
    const destructLine = (<any>this._line).destructToPoints()
    const destructVector = (<any>this._vector).destructToPoints()
    return [...destructLine, ...destructVector]
  }

  protected reconstructFromPoints(...points: Point[]): this {
    const linePoints = points.slice(0, 2)
    const vectorPoints = points.slice(2);
    (<any>this._line).reconstructFromPoints(linePoints);
    (<any>this._vector).reconstructFromPoints(vectorPoints)
    return this
  }

}

export class Triangle extends Polygon {

  public static EquilateralFromCenterAndSideLength(center: Point,
                                                   side: number): Triangle {
    throw 'TODO'
  }

  public static EquilateralFromCenterAndCircumradius(center: Point,
                                                     circumradius: number): Triangle {
    throw 'TODO'
  }

  public static
  EquilateralFromCenterAndCircumscribedRadius(center: Point,
                                              circumscribedRadius: number): Triangle {
    throw 'TODO'
  }

  public getCircumscribedCircle(): Circle {
    // https://en.wikipedia.org/wiki/Circumscribed_circle#Cartesian_coordinates_2
    const A = this._vertices[0].getCartesianCoordinates()
    const B = this._vertices[1].getCartesianCoordinates()
    const C = this._vertices[2].getCartesianCoordinates()

    const D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y))
    const Ux = (1 / D) * ((A.x * A.x + A.y * A.y) * (B.y - C.y) +
      (B.x * B.x + B.y * B.y) * (C.y - A.y) +
      (C.x * C.x + C.y * C.y) * (A.y - B.y))
    const Uy = (1 / D) * ((A.x * A.x + A.y * A.y) * (C.x - B.x) +
      (B.x * B.x + B.y * B.y) * (A.x - C.x) +
      (C.x * C.x + C.y * C.y) * (B.x - A.x))
    const center = Point.FromCartesianCoordinates(Ux, Uy)
    return Circle.FromCenterAndPoint(center, this._vertices[0])
  }

  public getVertexLabels(): string[] {
    return this._vertices.map(point => point.label())
  }

  public isEquilateral(): boolean {
    throw 'TODO'
  }

}

export class Point extends GeometryObject {

  public static AreEqual(point1: Point, point2: Point): boolean {
    return areEqualFloats(point1.x(), point2.x())
      && areEqualFloats(point1.y(), point2.y())
  }

  public static FromPolarCoordinates(r: number, φ: number, label?: string): Point {
    const cartesian = polarToCartesian(r, φ)
    return new Point(cartesian.x, cartesian.y, label)
  }

  public static FromCartesianCoordinates(x: number, y: number, label?: string): Point {
    return new Point(x, y, label)
  }

  public static CENTER: Point = Point.FromCartesianCoordinates(0, 0)

  /**
   * Works for both regular and homogeneous matrix coordinates.
   * @param matrix
   * @param label
   * @returns {Point}
   * @constructor
   */
  public static FromMatrix(matrix: number[][], label?: string): Point {
    const x = matrix[0][0]
    const y = matrix[1][0]
    let z
    if (matrix.length == 2) {
      z = 1
    } else {
      z = matrix[2][0]
    }
    return new Point(x, y / z, label) // TODO shouldn't it be x / z?
  }

  public static Negative(point: Point): Point {
    return new Point(-point.x(), -point.y())
  }

  public static Add(point1: Point, point2: Point): Point {
    return new Point(point1.x() + point2.x(), point1.y() + point2.y())
  }

  public static Subtract(point1: Point, point2: Point): Point {
    return Point.Add(point1, Point.Negative(point2))
  }

  public static DotProduct(point1: Point, point2: Point): number {
    return point1.x() * point2.x() + point1.y() * point2.y()
  }

  // public static CrossProductLength(point1: Point, point2: Point): number {
  //
  // }

  public static GetDistanceBetween(point1: Point, point2: Point): number {
    const dx = point1.x() - point2.x()
    const dy = point1.y() - point2.y()
    return Math.sqrt(dx * dx + dy * dy)
  }

  public static GetPointAtRatio(point1: Point, point2: Point, m: number, n: number = 1): Point {
    const x = (n * point1.x() + m * point2.x()) / (m + n)
    const y = (n * point1.y() + m * point2.y()) / (m + n)
    return new Point(x, y)
  }

  public static GetPointBetween(point1: Point, point2: Point): Point {
    return Point.GetPointAtRatio(point1, point2, 1, 1)
  }

  public static GetDistanceBetweenLineAndPoint(line: Line, point: Point): number {
    return Line.GetDistanceBetweenLineAndPoint(line, point)
  }

  protected _x: number
  protected _y: number

  protected constructor(x: number, y: number, label?: string) {
    super('point')
    this._x = x
    this._y = y
    this._label = label
    return this
  }

  public writeJson() {
    return {
      kind: 'point',
      label: this.label(),
      color: this.strokeColor(),
      defaultValue: 'cartesian',
      value: {
        'cartesian': this.getCartesianCoordinates(),
        'polar': this.getPolarCoordinates(),
      },
    }
  }

  public readJson(json): this {
    this.x(json.value['cartesian'].x)
    this.y(json.value['cartesian'].y)
    this.label(json.label)
    this.strokeColor(json.strokeColor)
    return this
  }

  public x(): number;
  public x(x: number): this;
  public x(fn: (x: number) => number): this;
  public x(x?: number | ((x: number) => number)): this | number {
    if (x == null) {
      return this._x
    } else {
      if (typeof x === 'number') {
        this._x = x
      } else {
        this._x = x(this._x)
      }
      return this
    }
  }

  public y(): number;
  public y(y: number): this;
  public y(fn: (y: number) => number): this;
  public y(y?: number | ((y: number) => number)): this | number {
    if (y == null) {
      return this._y
    } else {
      if (typeof y === 'number') {
        this._y = y
      } else {
        this._y = y(this._y)
      }
      return this
    }
  }

  public copyValuesFrom(point: Point): this {
    this._x = point._x
    this._y = point._y
    return this
  }

  protected cloneValues(): this {
    const {x, y} = this.getCartesianCoordinates()
    return <this>Point.FromCartesianCoordinates(x, y)
  }

  public getNonHomogeneousMatrixCoordinates(): [[number], [number]] {
    return [[this._x], [this._y]]
  }

  public getHomogeneousMatrixCoordinates(): [[number], [number], [number]] {
    return [[this._x], [this._y], [1]]
  }

  public getMatrixCoordinates(homogeneous: boolean = true): number[][] {
    if (homogeneous) {
      return this.getHomogeneousMatrixCoordinates()
    } else {
      return this.getNonHomogeneousMatrixCoordinates()
    }
  }

  public getPolarCoordinates(): { r: number, φ: number } {
    return cartesianToPolar(this._x, this._y)
  }

  public getCartesianCoordinates(): Coordinate {
    return {x: this._x, y: this._y}
  }

  public translateByPoint(point: Point): this {
    return this.copyFrom(Point.Add(this, point))
  }

  public distanceTo(point: Point) {
    return Point.GetDistanceBetween(this, point)
  }

  protected destructToPoints(): Point[] {
    return [this.cloneValues()]
  }

  protected reconstructFromPoints(...points: Point[]): this {
    const point = points[0]
    this._x = point._x
    this._y = point._y
    return this
  }

  protected applyMatrixWithRespectToCenter(matrix: number[][]): this {
    const [n, m] = Matrix.GetDimensions(matrix)
    let isHomogeneous: boolean
    if (n == 2 && m == 2) {
      isHomogeneous = false
    } else if (n == 3 && m == 3) {
      isHomogeneous = true
    } else {
      throw `Matrix needs to be 2×2 or 3×3. Given matrix is ${matrix}.`
    }
    const matrixCoordinates = this.getMatrixCoordinates(isHomogeneous)
    const newMatrix = Matrix.Multiply(matrix, matrixCoordinates)
    const newPoint = Point.FromMatrix(newMatrix)
    return this.copyFrom(newPoint)
  }

}
