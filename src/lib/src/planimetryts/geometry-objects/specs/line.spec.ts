import {areEqualFloats, isZero} from '../../util'
import {Line, Point, MaterialColor} from '../everything'

const customEqualities = function (first: any, second: any) {
  if (first.kind == 'line' && second.kind == 'line') {
    return Line.AreEqual(first, second)
  }
  if (first.kind == 'point' && second.kind == 'point') {
    return Point.AreEqual(first, second)
  }
}

describe(`Line`, () => {

  beforeEach(() => jasmine.addCustomEqualityTester(customEqualities))

  it(`should report very close lines as the same (eps = 1e-6`, () => {
    const diff = 1e-8
    const line1 = Line.FromGeneralForm(1, 2, 3)
    const line2 = Line.FromGeneralForm(1 + diff, 2 + diff, 3 + diff)
    expect(Line.AreEqual(line1, line2)).toBe(true)
  })

  describe(`Line#copyValuesFrom`, () => {

    it(`should copy by value to an object`, () => {
      const line1 = Line.FromGeneralForm(1, 2, 3)
      const line2 = Line.FromGeneralForm(4, 5, 6)
      line2.copyValuesFrom(line1)
      expect(line2).toEqual(line1)
      expect(line2).not.toBe(line1)
    })

    it(`should not copy view data`, () => {
      const line1 = Line.FromGeneralForm(1, 2, 3)
        .label('A')
        .strokeColor(MaterialColor.LIGHT_BLUE)
        .fillColor(MaterialColor.BLUE)
      const line2 = Line.FromGeneralForm(4, 5, 6)
        .label('B')
        .strokeColor(MaterialColor.AMBER)
        .fillColor(MaterialColor.RED)
      line1.copyValuesFrom(line2)
      expect(line1).toEqual(line2)
      expect(line1).not.toBe(line2)
      expect(line1.label()).toBe('A')
      expect(line1.strokeColor()).toBe(MaterialColor.LIGHT_BLUE)
      expect(line1.fillColor()).toBe(MaterialColor.BLUE)
    })

  })

  describe(`Line#copyViewDataFrom`, () => {

    it(`should copy only label, stroke color and fill color`, () => {
      const line1 = Line.FromGeneralForm(1, 2, 3)
        .label('A')
        .strokeColor(MaterialColor.LIGHT_BLUE)
        .fillColor(MaterialColor.BLUE)
      const line2 = Line.FromGeneralForm(4, 5, 6)
        .label('B')
        .strokeColor(MaterialColor.AMBER)
        .fillColor(MaterialColor.RED)
      line1.copyViewDataFrom(line2)
      expect(line1).not.toEqual(line2)
      expect(line1).not.toBe(line2)
      expect(line1.label()).toBe('B')
      expect(line1.strokeColor()).toBe(MaterialColor.AMBER)
      expect(line1.fillColor()).toBe(MaterialColor.RED)
    })

  })

  describe(`Line#copyFrom`, () => {

    it(`should copy everything`, () => {
      const line1 = Line.FromGeneralForm(1, 2, 3)
        .label('A')
        .strokeColor(MaterialColor.LIGHT_BLUE)
        .fillColor(MaterialColor.BLUE)
      const line2 = Line.FromGeneralForm(4, 5, 6)
        .label('B')
        .strokeColor(MaterialColor.AMBER)
        .fillColor(MaterialColor.RED)
      line1.copyFrom(line2)
      expect(line1).toEqual(line2)
      expect(line1).not.toBe(line2)
      expect(line1.label()).toBe('B')
      expect(line1.strokeColor()).toBe(MaterialColor.AMBER)
      expect(line1.fillColor()).toBe(MaterialColor.RED)
    })

  })

  it(`should get general form`, () => {
    const line = Line.FromGeneralForm(1, 2, 3)
    expect(line.getGeneralForm()).toEqual({A: 1, B: 2, C: 3})
  })

  it(`should create from segment form`, () => {
    const line1 = Line.FromSegmentForm(3, 3)
    const line2 = Line.FromGeneralForm(1, 1, -3)
    expect(line1).toEqual(line2)
  })

  it(`should create a horizontal line from explicit form`, () => {
    const line1 = Line.FromExplicitForm(0, 1)
    const line2 = Line.FromGeneralForm(0, 1, -1)
    expect(line1).toEqual(line2)
    expect(line1.isHorizontal()).toBe(true)
  })

  it(`should create a line from explicit form`, () => {
    const line1 = Line.FromExplicitForm(1, 1)
    const line2 = Line.FromGeneralForm(-1, 1, -1)
    expect(line1).toEqual(line2)
  })

  it(`should create a line from normal form`, () => {
    const line1 = Line.FromNormalForm(Math.PI / 4, Math.SQRT2)
    const line2 = Line.FromSegmentForm(2, 2)
    expect(line1).toEqual(line2)
  })

  it(`should create a horizontal line from a point and coefficient`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const coefficient = 0
    const line1 = Line.FromPointAndCoefficient(point, coefficient)
    const line2 = Line.FromExplicitForm(0, 1)
    expect(line1).toEqual(line2)
  })

  it(`should create a line from a point and a coefficient`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const coefficient = -1
    const line1 = Line.FromPointAndCoefficient(point, coefficient)
    const line2 = Line.FromSegmentForm(2, 2)
    expect(line1).toEqual(line2)
  })

  it(`should create a horizontal line from a point and an angle`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const angleRadians = Math.PI
    const line1 = Line.FromPointAndAngle(point, angleRadians)
    const line2 = Line.FromGeneralForm(0, -1, 1)
    expect(line1).toEqual(line2)
    expect(line1.isHorizontal()).toBe(true)
  })

  it(`should create a vertical line from a point and an angle`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const angleRadians = Math.PI / 2
    const line1 = Line.FromPointAndAngle(point, angleRadians)
    const line2 = Line.FromGeneralForm(-1, 0, 1)
    expect(line1).toEqual(line2)
    expect(line1.isVertical()).toBe(true)
  })

  it(`should create a line fom a point and an angle`, () => {
    const point = Point.FromCartesianCoordinates(0, 0)
    const angleRadians = Math.PI / 4
    const line1 = Line.FromPointAndAngle(point, angleRadians)
    const line2 = Line.FromExplicitForm(1, 0)
    expect(line1).toEqual(line2)
  })

  it(`should create a horizontal line from two points`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = Point.FromCartesianCoordinates(2, 2)
    const line1 = Line.FromTwoPoints(point1, point2)
    const line2 = Line.HorizontalThroughPoint(point1)
    expect(line1).toEqual(line2)
    expect(line1.isHorizontal()).toBe(true)
  })

  it(`should create a vertical line from two points`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = Point.FromCartesianCoordinates(1, 4)
    const line1 = Line.FromTwoPoints(point1, point2)
    const line2 = Line.VerticalThroughPoint(point1)
    expect(line1).toEqual(line2)
    expect(line1.isVertical()).toBe(true)
  })

  it(`should create a line from two points`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 1)
    const point2 = Point.FromCartesianCoordinates(-1, -1)
    const line1 = Line.FromTwoPoints(point1, point2)
    const line2 = Line.FromExplicitForm(1, 0)
    expect(line1).toEqual(line2)
  })

  it(`should create a horizontal line through a point`, () => {
    const point = Point.FromCartesianCoordinates(1, 2)
    const line = Line.FromExplicitForm(0, 2)
    const line1 = Line.HorizontalThroughPoint(point)
    const line2 = Line.HorizontalThroughPoint(point.y())
    expect(line).toEqual(line1)
    expect(line).toEqual(line2)
    expect(line1.isHorizontal()).toBe(true)
  })

  it(`should create a vertical line through a point`, () => {
    const point = Point.FromCartesianCoordinates(1, 2)
    const line = Line.FromGeneralForm(1, 0, -1)
    const line1 = Line.VerticalThroughPoint(point)
    const line2 = Line.VerticalThroughPoint(point.x())
    expect(line).toEqual(line1)
    expect(line).toEqual(line2)
    expect(line1.isVertical()).toBe(true)
  })

  it(`should get angle between two axises`, () => {
    const line1 = Line.VerticalThroughPoint(0)
    const line2 = Line.HorizontalThroughPoint(0)
    const angle = Line.GetAnglesBetween(line1, line2)[0]
    expect(areEqualFloats(angle, Math.PI / 2)).toBe(true,
      `Angle should've been ≈π/2 but was ${angle}`)
  })

  it(`should get angle between parallel lines`, () => {
    const line1 = Line.FromExplicitForm(2, 2)
    const line2 = Line.FromExplicitForm(2, 4)
    const angle = Line.GetAnglesBetween(line1, line2)[0]
    expect(isZero(angle)).toBe(true,
      `Angle should've been ≈0 but was ${angle}`)
  })

  it(`should get angle between parallel horizontal lines`, () => {
    const line1 = Line.FromExplicitForm(0, 1)
    const line2 = Line.FromExplicitForm(0, 2)
    const angle = Line.GetAnglesBetween(line1, line2)[0]
    expect(isZero(angle)).toBe(true,
      `Angle should've been ≈0 but was ${angle}`)
  })

  it(`should get angle between parallel vertical lines`, () => {
    const line1 = Line.VerticalThroughPoint(1)
    const line2 = Line.VerticalThroughPoint(2)
    const angle = Line.GetAnglesBetween(line1, line2)[0]
    expect(isZero(angle)).toBe(true,
      `Angle should've been ≈0 but was ${angle}`)
  })

  it(`should get distance between line and a point`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const line = Line.FromSegmentForm(-2, 2)
    const distance = Line.GetDistanceBetweenLineAndPoint(line, point)
    expect(areEqualFloats(distance, Math.SQRT2)).toBe(true,
      `Distance should've been ≈√2 but was ${distance}`)
  })

  it(`should get distance between a horizontal line and a point`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const line = Line.HorizontalThroughPoint(2)
    const distance = Line.GetDistanceBetweenLineAndPoint(line, point)
    expect(areEqualFloats(distance, 1)).toBe(true,
      `Distance should've been ≈1 but was ${distance}`)
  })

  it(`should get distance between a vertical line and a point`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const line = Line.VerticalThroughPoint(2)
    const distance = Line.GetDistanceBetweenLineAndPoint(line, point)
    expect(areEqualFloats(distance, 1)).toBe(true,
      `Distance should've been ≈1 but was ${distance}`)
  })

  it(`should get bisectors for axises`, () => {
    const line1 = Line.X_AXIS
    const line2 = Line.Y_AXIS
    const bisector1 = Line.FromExplicitForm(+1, 0)
    const bisector2 = Line.FromExplicitForm(-1, 0)
    const bisectors = Line.GetBisectors(line1, line2)
    expect(bisectors).toEqual([bisector1, bisector2])
  })

  it(`should get bisectors for lines`, () => {
    const line1 = Line.Y_EQUALS_X
    const line2 = Line.FromSegmentForm(4, 4)
    const bisector1 = Line.VerticalThroughPoint(2)
    const bisector2 = Line.HorizontalThroughPoint(2)
    const bisectors = Line.GetBisectors(line1, line2)
    expect(bisectors).toEqual([bisector1, bisector2])
  })

  it(`should determine if lines are parallel`, () => {
    const line1 = Line.FromExplicitForm(1, 2)
    const line2 = Line.FromExplicitForm(1, 3)
    expect(Line.AreParallel(line1, line2)).toBe(true)
    expect(Line.AreParallel(line2, line1)).toBe(true)
  })

  it(`should determine if vertical lines are parallel`, () => {
    const line1 = Line.VerticalThroughPoint(1)
    const line2 = Line.VerticalThroughPoint(2)
    expect(Line.AreParallel(line1, line2)).toBe(true)
    expect(Line.AreParallel(line2, line1)).toBe(true)
  })

  it(`should determine if horizontal lines are parallel`, () => {
    const line1 = Line.HorizontalThroughPoint(1)
    const line2 = Line.HorizontalThroughPoint(2)
    expect(Line.AreParallel(line1, line2)).toBe(true)
    expect(Line.AreParallel(line2, line1)).toBe(true)
  })

  it(`should determine if lines are not parallel`, () => {
    const line1 = Line.FromExplicitForm(1, 2)
    const line2 = Line.FromExplicitForm(2, 2)
    expect(Line.AreParallel(line1, line2)).toBe(false)
    expect(Line.AreParallel(line2, line1)).toBe(false)
  })

  it(`should determine that line are not parallel`, () => {
    expect(Line.AreParallel(Line.X_AXIS, Line.Y_AXIS)).toBe(false)
    expect(Line.AreParallel(Line.Y_AXIS, Line.X_AXIS)).toBe(false)
  })

  it(`should determine that axis are orthogonal`, () => {
    expect(Line.AreOrthogonal(Line.X_AXIS, Line.Y_AXIS)).toBe(true)
    expect(Line.AreOrthogonal(Line.Y_AXIS, Line.X_AXIS)).toBe(true)
  })

  it(`should determine that lines are orthogonal`, () => {
    const line1 = Line.FromExplicitForm(+1, 0)
    const line2 = Line.FromExplicitForm(-1, 0)
    expect(Line.AreOrthogonal(line1, line2)).toBe(true)
    expect(Line.AreOrthogonal(line2, line1)).toBe(true)
  })

  it(`should determine that lines are not orthogonal`, () => {
    const line1 = Line.FromExplicitForm(1, 0)
    const line2 = Line.FromExplicitForm(-2, 0)
    expect(Line.AreOrthogonal(line1, line2)).toBe(false)
    expect(Line.AreOrthogonal(line2, line1)).toBe(false)
  })

  it(`should get intersection`, () => {
    const line1 = Line.FromExplicitForm(1, 0)
    const line2 = Line.FromExplicitForm(2, 1)
    const intersection = Point.FromCartesianCoordinates(-1, -1)
    expect(Line.GetIntersection(line1, line2)).toEqual(intersection)
  })

  it(`should get intersection when one line is horizontal`, () => {
    const line1 = Line.FromExplicitForm(1, 2)
    const line2 = Line.HorizontalThroughPoint(1)
    const intersection = Point.FromCartesianCoordinates(-1, 1)
    expect(Line.GetIntersection(line1, line2)).toEqual(intersection)
  })

  it(`should get intersection when one line is vertical`, () => {
    const line1 = Line.FromExplicitForm(1, 2)
    const line2 = Line.VerticalThroughPoint(-1)
    const intersection = Point.FromCartesianCoordinates(-1, 1)
    expect(Line.GetIntersection(line1, line2)).toEqual(intersection)
  })

  it(`should get intersection of orthogonal lines`, () => {
    const line1 = Line.FromExplicitForm(1, 1)
    const line2 = Line.FromExplicitForm(-1, 2)
    const intersection = Point.FromCartesianCoordinates(0.5, 1.5)
    expect(Line.GetIntersection(line1, line2)).toEqual(intersection)
  })

  it(`should get intersection of axises`, () => {
    expect(Line.GetIntersection(Line.X_AXIS, Line.Y_AXIS)).toEqual(Point.CENTER)
  })

  it(`should not get intersection of parallel lines`, () => {
    const line1 = Line.VerticalThroughPoint(1)
    const line2 = Line.VerticalThroughPoint(2)
    expect(Line.GetIntersection(line1, line2)).toBe(null)
  })

  it(`should get two points of a line`, () => {
    const line = Line.FromExplicitForm(1, 1)
    const point1 = Point.FromCartesianCoordinates(-1, 0)
    const point2 = Point.FromCartesianCoordinates(0, +1)
    expect(line.getTwoPoints()).toEqual([point1, point2])
  })

  it(`should get two points of a vertical line`, () => {
    const line = Line.VerticalThroughPoint(1)
    const point1 = Point.FromCartesianCoordinates(1, 0)
    const point2 = Point.FromCartesianCoordinates(1, 1)
    expect(line.getTwoPoints()).toEqual([point1, point2])
  })

  it(`should get two points of a horizontal line`, () => {
    const line = Line.HorizontalThroughPoint(1)
    const point1 = Point.FromCartesianCoordinates(0, 1)
    const point2 = Point.FromCartesianCoordinates(1, 1)
    expect(line.getTwoPoints()).toEqual([point1, point2])
  })

  it(`should create line parallel to a line and through point`, () => {
    const line = Line.FromSegmentForm(-4, 2)
    const point = Point.FromCartesianCoordinates(-4, 2)
    const expected = Line.FromSegmentForm(-8, 4)
    const actual = Line.ParallelThroughPoint(line, point)
    expect(actual).toEqual(expected)
  })

  it(`should create line parallel to horizontal line`, () => {
    const line = Line.HorizontalThroughPoint(1)
    const point = Point.FromCartesianCoordinates(2, 2)
    const expected = Line.HorizontalThroughPoint(2)
    const actual = Line.ParallelThroughPoint(line, point)
    expect(actual).toEqual(expected)
  })

  it(`should create line parallel to vertical line`, () => {
    const line = Line.VerticalThroughPoint(1)
    const point = Point.FromCartesianCoordinates(2, 2)
    const expected = Line.VerticalThroughPoint(2)
    const actual = Line.ParallelThroughPoint(line, point)
    expect(actual).toEqual(expected)
  })

  it(`should create line orthogonal to a line`, () => {
    const line = Line.FromSegmentForm(-4, 2)
    const point = Point.FromCartesianCoordinates(-4, 2)
    const expected = Line.FromSegmentForm(-3, -6)
    const actual = Line.OrthogonalThroughPoint(line, point)
    expect(actual).toEqual(expected)
  })

  it(`should create line orthogonal to horizontal line`, () => {
    const line = Line.HorizontalThroughPoint(1)
    const point = Point.FromCartesianCoordinates(2, 2)
    const expected = Line.VerticalThroughPoint(2)
    const actual = Line.OrthogonalThroughPoint(line, point)
    expect(actual).toEqual(expected)
  })

  it(`should create line orthogonal to vertical line`, () => {
    const line = Line.VerticalThroughPoint(1)
    const point = Point.FromCartesianCoordinates(2, 2)
    const expected = Line.HorizontalThroughPoint(2)
    const actual = Line.OrthogonalThroughPoint(line, point)
    expect(actual).toEqual(expected)
  })

  it(`should report that a point is on a line`, () => {
    const line = Line.FromSegmentForm(-3, -6)
    const point = Point.FromCartesianCoordinates(-4, 2)
    expect(line.containsPoint(point)).toBe(true)
  })

  it(`should report that a point is on a vertical line`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const line = Line.VerticalThroughPoint(point)
    expect(line.containsPoint(point)).toBe(true)
  })

  it(`should report that a point is on a horizotal line`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const line = Line.HorizontalThroughPoint(point)
    expect(line.containsPoint(point)).toBe(true)
  })

  it(`should report that a point is not on a line`, () => {
    const line = Line.FromSegmentForm(-4, -2)
    const point = Point.FromCartesianCoordinates(1, 1)
    expect(line.containsPoint(point)).toBe(false)
  })

  it(`should report that a point is not on a horizontal line`, () => {
    const point = Point.FromCartesianCoordinates(2, 2)
    const line = Line.HorizontalThroughPoint(1)
    expect(line.containsPoint(point)).toBe(false)
  })

  it(`should report that a point is not on a vertical line`, () => {
    const point = Point.FromCartesianCoordinates(2, 2)
    const line = Line.VerticalThroughPoint(1)
    expect(line.containsPoint(point)).toBe(false)
  })

  it(`should report that points are on the same side of a line`, () => {
    const point1 = Point.FromCartesianCoordinates(2, 1)
    const point2 = Point.FromCartesianCoordinates(-1, -3)
    const line = Line.Y_EQUALS_X
    expect(line.pointsAreOnSameSide(point1, point2)).toBe(true)
  })

  it(`should report that points are not on the same side of a line`, () => {
    const point1 = Point.FromCartesianCoordinates(2, 1)
    const point2 = Point.FromCartesianCoordinates(-2, -1)
    const line = Line.Y_EQUALS_X
    expect(line.pointsAreOnSameSide(point1, point2)).toBe(false)
  })

  it(`should report that point on a line is not one the same side with another point`, () => {
    const line = Line.Y_EQUALS_X
    const point1 = Point.FromCartesianCoordinates(1, 1)

    const point2 = Point.FromCartesianCoordinates(2, 1)
    expect(line.pointsAreOnSameSide(point1, point2)).toBe(false)

    const point3 = Point.FromCartesianCoordinates(2, 2)
    expect(line.pointsAreOnSameSide(point1, point3)).toBe(false)
  })

  it(`should report that points are on the same side of horizontal line`, () => {
    const line = Line.X_AXIS
    const point1 = Point.FromCartesianCoordinates(-1, 1)
    const point2 = Point.FromCartesianCoordinates(1, 1)
    expect(line.pointsAreOnSameSide(point1, point2)).toBe(true)
  })

  it(`should report that points are not on the same side of a horizontal line`, () => {
    const line = Line.X_AXIS
    const point1 = Point.FromCartesianCoordinates(1, 1)
    const point2 = Point.FromCartesianCoordinates(1, -1)
    expect(line.pointsAreOnSameSide(point1, point2)).toBe(false)
  })

  it(`should report that points are on the same side of a vertical line`, () => {
    const line = Line.Y_AXIS
    const point1 = Point.FromCartesianCoordinates(1, 1)
    const point2 = Point.FromCartesianCoordinates(1, -1)
    expect(line.pointsAreOnSameSide(point1, point2)).toBe(true)
  })

  it(`should report that points are not on the same side of a vertical line`, () => {
    const line = Line.Y_AXIS
    const point1 = Point.FromCartesianCoordinates(1, 1)
    const point2 = Point.FromCartesianCoordinates(-1, 1)
    expect(line.pointsAreOnSameSide(point1, point2)).toBe(false)
  })

  it(`should get bisector`, () => {
    const vertex = Point.CENTER
    const arm1 = Point.FromCartesianCoordinates(1, 1)
    const arm2 = Point.FromCartesianCoordinates(1, -1)
    const expected = Line.X_AXIS
    expect(Line.GetBisector(vertex, arm1, arm2)).toEqual(expected)
    expect(Line.GetBisector(vertex, arm2, arm1)).toEqual(expected)
  })

  it(`should reflect over a point`, () => {
    const point = Point.FromCartesianCoordinates(1, 2)
    const line1 = Line.FromSegmentForm(1, -1)
    const line2 = Line.FromSegmentForm(-3, 3)
    expect(line1.reflectOverPoint(point)).toEqual(line2)
  })

})
