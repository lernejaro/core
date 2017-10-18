import {Line, Point, Circle, MaterialColor} from '../everything'

const customEqualities = function (first: any, second: any) {
  if (first.kind == 'line' && second.kind == 'line') {
    return Line.AreEqual(first, second)
  }
  if (first.kind == 'point' && second.kind == 'point') {
    return Point.AreEqual(first, second)
  }
  if (first.kind == 'circle' && second.kind == 'circle') {
    return Circle.AreEqual(first, second)
  }
}

describe(`Circle`, () => {

  beforeEach(() => jasmine.addCustomEqualityTester(customEqualities))

  describe(`Circle.AreEqual`, () => {
    it(`should determine that two circles are equal`, () => {
      const circle1 = Circle.FromGeneralForm(1, 1, 1)
      const circle2 = Circle.FromGeneralForm(1, 1, 1)
      expect(circle1).not.toBe(circle2)
      expect(Circle.AreEqual(circle1, circle2)).toBe(true)
      expect(circle1).toEqual(circle2)
    })

    it(`should determine that two circles are not equal`, () => {
      const circle1 = Circle.FromGeneralForm(1, 1, 1)
      const circle2 = Circle.FromGeneralForm(1, 1.1, 1)
      expect(circle1).not.toBe(circle2)
      expect(Circle.AreEqual(circle1, circle2)).toBe(false)
      expect(circle1).not.toEqual(circle2)
    })
  })

  describe(`Circle#copyValuesFrom`, () => {

    it(`should copy by value to an object`, () => {
      const circleSrc = Circle.FromGeneralForm(1, 2, 3)
      const circleDst = Circle.FromGeneralForm(4, 5, 6)
      circleDst.copyValuesFrom(circleSrc)
      expect(circleSrc).toEqual(circleDst)
      expect(circleSrc).not.toBe(circleDst)
    })

    it(`should not copy view data`, () => {
      const circleSrc = Circle.FromGeneralForm(1, 2, 3)
        .label('k')
        .strokeColor(MaterialColor.BLUE)
        .fillColor(MaterialColor.BLUE_GREY)
      const circleDst = Circle.FromGeneralForm(4, 5, 6)
        .label('n')
        .strokeColor(MaterialColor.CYAN)
        .fillColor(MaterialColor.BROWN)
      circleDst.copyValuesFrom(circleSrc)
      expect(circleSrc).toEqual(circleDst)
      expect(circleSrc).not.toBe(circleDst)
      expect(circleDst.label()).toBe('n')
      expect(circleDst.strokeColor()).toBe(MaterialColor.CYAN)
      expect(circleDst.fillColor()).toBe(MaterialColor.BROWN)
    })

  })

  describe(`Circle#copyViewDataFrom`, () => {

    it(`should copy only label, stroke color and fill color`, () => {
      const circleSrc = Circle.FromGeneralForm(1, 2, 3)
        .label('k')
        .strokeColor(MaterialColor.BLUE)
        .fillColor(MaterialColor.BLUE_GREY)
      const circleDst = Circle.FromGeneralForm(4, 5, 6)
        .label('n')
        .strokeColor(MaterialColor.CYAN)
        .fillColor(MaterialColor.BROWN)
      circleDst.copyViewDataFrom(circleSrc)
      expect(circleSrc).not.toEqual(circleDst)
      expect(circleSrc).not.toBe(circleDst)
      expect(circleDst.label()).toBe('k')
      expect(circleDst.strokeColor()).toBe(MaterialColor.BLUE)
      expect(circleDst.fillColor()).toBe(MaterialColor.BLUE_GREY)
    })

  })

  describe(`Circle#copyFrom`, () => {

    it(`should copy everything`, () => {
      const circleSrc = Circle.FromGeneralForm(1, 2, 3)
        .label('k')
        .strokeColor(MaterialColor.BLUE)
        .fillColor(MaterialColor.BLUE_GREY)
      const circleDst = Circle.FromGeneralForm(4, 5, 6)
        .label('n')
        .strokeColor(MaterialColor.CYAN)
        .fillColor(MaterialColor.BROWN)
      circleDst.copyFrom(circleSrc)
      expect(circleSrc).toEqual(circleDst)
      expect(circleSrc).not.toBe(circleDst)
      expect(circleDst.label()).toBe('k')
      expect(circleDst.strokeColor()).toBe(MaterialColor.BLUE)
      expect(circleDst.fillColor()).toBe(MaterialColor.BLUE_GREY)
    })

  })

  describe(`Circle.FromBoundingBox`, () => {
    it(`should create a circle from bounding box`, () => {
      const topLeft = Point.FromCartesianCoordinates(2, 0)
      const bottomRight = Point.FromCartesianCoordinates(0, 2)
      const actual = Circle.FromBoundingBox(topLeft, bottomRight)
      const expected = Circle.FromGeneralForm(1, 1, 1)
      expect(actual).toEqual(expected)
    })
  })

  describe(`Circle.FromCenterAndPoint`, () => {
    it(`should create a circle from a center and another point`, () => {
      const center = Point.FromCartesianCoordinates(1, 1)
      const point = Point.FromCartesianCoordinates(1, 0)
      const actual = Circle.FromCenterAndPoint(center, point)
      const expected = Circle.FromGeneralForm(1, 1, 1)
      expect(actual).toEqual(expected)
    })
  })

  describe(`Circle.FromCenterAndLine`, () => {
    const center = Point.FromCartesianCoordinates(1, 1)
    const expected = Circle.FromGeneralForm(1, 1, 1)

    it(`should create a circle from a center and a vertical line`, () => {
      const verticalLine = Line.VerticalThroughPoint(2)
      const actual = Circle.FromCenterAndLine(center, verticalLine)
      expect(actual).toEqual(expected)
    })

    it(`should create a circle from a center and a horizontal line`, () => {
      const horizontalLine = Line.HorizontalThroughPoint(2)
      const actual = Circle.FromCenterAndLine(center, horizontalLine)
      expect(actual).toEqual(expected)
    })

    it(`should create a circle from a center and a line`, () => {
      const line = Line.Y_EQUALS_X
      const center2 = Point.FromCartesianCoordinates(4, 2)
      const actual = Circle.FromCenterAndLine(center2, line)
      const expected2 = Circle.FromCenterAndRadius(center2, Math.SQRT2)
      expect(actual).toEqual(expected2)
    })
  })

  it(`should get two intersections with line`, () => {
    const line = Line.Y_EQUALS_X
    const center = Point.FromCartesianCoordinates(2, 2)
    const radius = 1
    const circle = Circle.FromCenterAndRadius(center, radius)
    const x = radius * (Math.SQRT1_2 * (Math.SQRT2 - 1))
    const expected0 = Point.FromCartesianCoordinates(1 + x, 1 + x)
    const expected1 = Point.FromCartesianCoordinates(3 - x, 3 - x)
    const actual = Circle.GetIntersectionsWithLine(circle, line)
    expect(actual).toEqual([expected0, expected1])
  })

  it(`should get one intersection with line`, () => {
    const radius = 1
    const center = Point.FromCartesianCoordinates(2, 2)
    const circle = Circle.FromCenterAndRadius(center, radius)
    const x = radius * (Math.SQRT1_2 * (Math.SQRT2 - 1))
    const line = Line.FromExplicitForm(1, 2 - 2 * x)
    const expected0 = Point.FromCartesianCoordinates(1 + x, 3 - x)
    const actual = Circle.GetIntersectionsWithLine(circle, line)
    expect(actual).toEqual([expected0])
  })

  it(`should get no intersections with line`, () => {
    const line = Line.FromExplicitForm(1, 2)
    const center = Point.FromCartesianCoordinates(2, 2)
    const circle = Circle.FromCenterAndRadius(center, 1)
    const actual = Circle.GetIntersectionsWithLine(circle, line)
    expect(actual).toEqual([])
  })

  it(`should get two intersections with a horizontal line`, () => {
    const line = Line.HorizontalThroughPoint(1)
    const circle = Circle.FromGeneralForm(1, 1, 1)
    const expected0 = Point.FromCartesianCoordinates(0, 1)
    const expected1 = Point.FromCartesianCoordinates(2, 1)
    const actual = Circle.GetIntersectionsWithLine(circle, line)
    expect(actual).toEqual([expected0, expected1])
  })

  it(`should get one intersection with a horizontal line`, () => {
    const line = Line.HorizontalThroughPoint(1)
    const circle = Circle.FromGeneralForm(2, 2, 1)
    const actual = Circle.GetIntersectionsWithLine(circle, line)
    const expected = Point.FromCartesianCoordinates(2, 1)
    expect(actual).toEqual([expected])
  })

  it(`should get no intersections with a horizontal line`, () => {
    const line = Line.HorizontalThroughPoint(-1)
    const circle = Circle.FromGeneralForm(2, 2, 1)
    const actual = Circle.GetIntersectionsWithLine(circle, line)
    expect(actual).toEqual([])
  })

  it(`should get two intersections with a vertical line`, () => {
    const line = Line.VerticalThroughPoint(1)
    const circle = Circle.FromGeneralForm(1, 1, 1)
    const actual = Circle.GetIntersectionsWithLine(circle, line)
    const expected = [
      Point.FromCartesianCoordinates(1, 0),
      Point.FromCartesianCoordinates(1, 2),
    ]
    expect(actual).toEqual(expected)
  })

  it(`should get one intersection with a vertical line`, () => {
    const line = Line.VerticalThroughPoint(1)
    const circle = Circle.FromGeneralForm(2, 1, 1)
    const actual = Circle.GetIntersectionsWithLine(circle, line)
    const expected = Point.FromCartesianCoordinates(1, 1)
    expect(actual).toEqual([expected])
  })

  it(`should get no intersections with a vertical line`, () => {
    const line = Line.VerticalThroughPoint(1)
    const circle = Circle.FromGeneralForm(10, 10, 1)
    const actual = Circle.GetIntersectionsWithLine(circle, line)
    expect(actual).toEqual([])
  })

  it(`should contain a point, not in/out`, () => {
    const circle = Circle.FromGeneralForm(2, 2, 1)
    const point = Point.FromCartesianCoordinates(2, 1)
    expect(circle.containsPoint(point)).toBe(true)
    expect(circle.isPointInside(point)).toBe(false)
    expect(circle.isPointOutside(point)).toBe(false)
  })

  it(`should have a point inside, not on/out`, () => {
    const circle = Circle.FromGeneralForm(2, 2, 1)
    const point = Point.FromCartesianCoordinates(2.5, 1.5)
    expect(circle.containsPoint(point)).toBe(false)
    expect(circle.isPointInside(point)).toBe(true)
    expect(circle.isPointOutside(point)).toBe(false)
  })

  it(`should have a point outside, not on/in`, () => {
    const circle = Circle.FromGeneralForm(2, 2, 1)
    const point = Point.FromCartesianCoordinates(2, 0)
    expect(circle.containsPoint(point)).toBe(false)
    expect(circle.isPointInside(point)).toBe(false)
    expect(circle.isPointOutside(point)).toBe(true)
  })

  it(`should get the right point on the circle`, () => {
    const circle = Circle.FromGeneralForm(2, 2, 1)
    const rightPoint = Point.FromCartesianCoordinates(3, 2)
    expect(circle.getRightPoint()).toEqual(rightPoint)
  })

  describe(`should determine if points are one the same side`, () => {
    const circle = Circle.FromGeneralForm(1, 1, 1)
    const on1 = Point.FromCartesianCoordinates(0, 1)
    const on2 = Point.FromCartesianCoordinates(1, 0)
    const outside1 = Point.FromCartesianCoordinates(0, 0)
    const outside2 = Point.FromCartesianCoordinates(2, 2)
    const inside1 = Point.FromCartesianCoordinates(1, 1)
    const inside2 = Point.FromCartesianCoordinates(1, 1.5)

    it(`when both are outside`, () => {
      expect(circle.pointsAreOnSameSide(outside1, outside2)).toBe(true)
    })

    it(`when one is outside and one is on the circle`, () => {
      expect(circle.pointsAreOnSameSide(outside1, on1)).toBe(false)
      expect(circle.pointsAreOnSameSide(outside2, on1)).toBe(false)
      expect(circle.pointsAreOnSameSide(outside1, on2)).toBe(false)
      expect(circle.pointsAreOnSameSide(outside2, on2)).toBe(false)
    })

    it(`when one is outside and one is inside`, () => {
      expect(circle.pointsAreOnSameSide(outside1, inside1)).toBe(false)
      expect(circle.pointsAreOnSameSide(outside2, inside1)).toBe(false)
      expect(circle.pointsAreOnSameSide(outside2, inside2)).toBe(false)
      expect(circle.pointsAreOnSameSide(outside1, inside2)).toBe(false)
    })

    it(`when both are on the circle`, () => {
      expect(circle.pointsAreOnSameSide(on1, on2)).toBe(false)
    })

    it(`when one is on the circle and one is inside`, () => {
      expect(circle.pointsAreOnSameSide(inside1, on1)).toBe(false)
      expect(circle.pointsAreOnSameSide(inside2, on1)).toBe(false)
      expect(circle.pointsAreOnSameSide(inside1, on2)).toBe(false)
      expect(circle.pointsAreOnSameSide(inside2, on2)).toBe(false)
    })

    it(`when both are inside`, () => {
      expect(circle.pointsAreOnSameSide(inside1, inside2)).toBe(true)
    })
  })

  it(`should get center`, () => {
    const circle = Circle.FromGeneralForm(1, 1, 2)
    const center = Point.FromCartesianCoordinates(1, 1)
    expect(circle.center()).toEqual(center)
  })

  it(`should get radius`, () => {
    const circle = Circle.FromGeneralForm(1, 1, 1)
    expect(circle.radius()).toEqual(1)
  })

  it(`should set radius`, () => {
    const circle1 = Circle.FromGeneralForm(1, 1, 1)
    expect(circle1.radius()).toEqual(1)
    const circle2 = circle1.radius(2)
    expect(circle2.radius()).toEqual(2)
    expect(circle1).toBe(circle2) // Should not change reference
  })

  it(`should map radius`, () => {
    const circle1 = Circle.FromGeneralForm(1, 1, 1)
    expect(circle1.radius()).toEqual(1)
    const circle2 = circle1.radius(r => r + 5)
    expect(circle2.radius()).toEqual(6)
    expect(circle1).toBe(circle2) // Should not change reference
  })

  it(`should clone`, () => {
    const circle1 = Circle.FromGeneralForm(1, 1, 1)
    const circle2 = circle1.clone()
    expect(circle1).toEqual(circle2)
    expect(circle1).not.toBe(circle2)
  })

  // TODO
  // Note that this is mathematically wrong -- shear will be applied malformed.
  // However, it remains this way until we develop a strategy for this.
  it(`should apply matrix`, () => {
    const matrix = [[1, 2], [3, 4]]
    const circle1 = Circle.FromGeneralForm(1, 1, 1)
    const circle2 = Circle.FromGeneralForm(3, 7, Math.sqrt(10))
    circle1.applyMatrix(matrix)
    expect(circle1).toEqual(circle2)
  })

  // TODO
  // See above
  it(`should apply homogeneous matrix`, () => {
    const matrix = [[1, 2, 3], [4, 5, 6], [0, 0, 1]]
    const circle1 = Circle.FromGeneralForm(1, 1, 1)
    const circle2 = Circle.FromGeneralForm(6, 15, Math.sqrt(17))
    circle1.applyMatrix(matrix)
    expect(circle1).toEqual(circle2)
  })

})
