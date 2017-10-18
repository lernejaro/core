import {Line, Point, Polygon, RectangularArea, Segment} from '../everything'
const customEqualities = function (first: any, second: any) {
  if (first.kind == 'point' && second.kind == 'point') {
    return Point.AreEqual(first, second)
  }
}

describe(`RectangularArea`, () => {

  beforeEach(() => jasmine.addCustomEqualityTester(customEqualities))

  const Ax = 1
  const Ay = 2
  const Cx = 10
  const Cy = 20

  const A = Point.FromCartesianCoordinates(Ax, Ay)
  const B = Point.FromCartesianCoordinates(Cx, Ay)
  const C = Point.FromCartesianCoordinates(Cx, Cy)
  const D = Point.FromCartesianCoordinates(Ax, Cy)

  describe(`FromTwoPoints`, () => {

    it(`should create a new rectangular area from two properly ordered points`, () => {
      const area = RectangularArea.FromTwoPoints(A, C)
      const [p1, p2] = area.getPoints()
      expect(p1).toEqual(A)
      expect(p2).toEqual(C)
    })

    it(`should create a new rectangular area from two points given in reverse order`, () => {
      const area = RectangularArea.FromTwoPoints(C, A)
      const [p1, p2] = area.getPoints()
      expect(p1).toEqual(A)
      expect(p2).toEqual(C)
    })

    it(`should create a new rectangular area from two diagonally given points`, () => {
      const area = RectangularArea.FromTwoPoints(B, D)
      const [p1, p2] = area.getPoints()
      expect(p1).toEqual(A)
      expect(p2).toEqual(C)
    })

    it(`should create a new rectangular area from two diagonally given points, again`, () => {
      const area = RectangularArea.FromTwoPoints(D, B)
      const [p1, p2] = area.getPoints()
      expect(p1).toEqual(A)
      expect(p2).toEqual(C)
    })

  })

  describe(`getPolygon`, () => {

    it(`should get polygon which represents the same are covered by the rectangle`, () => {
      const area = RectangularArea.FromTwoPoints(A, C)
      const actual = area.getPolygon()
      const expected = Polygon.FromVertices(A, B, C, D)
      expect(Polygon.AreEqual(actual, expected)).toBe(true)
    })

  })

  describe(`getVertices`, () => {

    it(`should get vertices which the area rectangle is built upon`, () => {
      const area = RectangularArea.FromTwoPoints(B, D)
      const actuals = area.getVertices()
      const expected = [A, B, C, D]
      actuals.forEach((actual, index) => {
        expect(Point.AreEqual(actual, expected[index]))
      })
    })

  })

  describe(`containsPoint`, () => {

    it(`should tell that the center point is contained inside the rectangular area`, () => {
      const area = RectangularArea.FromTwoPoints(D, B)
      const center = Point.FromCartesianCoordinates(5.5, 11)
      expect(area.containsPoint(center)).toBe(true)
    })

    it(`should tell that a random point is contained inside the rectangular area`, () => {
      const area = RectangularArea.FromTwoPoints(C, A)
      const point = Point.FromCartesianCoordinates(9, 3)
      expect(area.containsPoint(point)).toBe(true)
    })

    it(`should tell that a point is not inside the area (off by two axes)`, () => {
      const area = RectangularArea.FromTwoPoints(D, B)
      expect(area.containsPoint(Point.CENTER)).toBe(false)
    })

    it(`should tell that a point is not inside the area (off by a single axis)`, () => {
      const area = RectangularArea.FromTwoPoints(B, D)
      const point = Point.FromCartesianCoordinates(5.5, 100)
      expect(area.containsPoint(point)).toBe(false)
    })

    it(`should tell that vertices do not belong inside`, () => {
      const area = RectangularArea.FromTwoPoints(A, C)
      expect(area.containsPoint(A)).toBe(false)
      expect(area.containsPoint(B)).toBe(false)
      expect(area.containsPoint(C)).toBe(false)
      expect(area.containsPoint(D)).toBe(false)
    })

    it(`should tell that points on the rectangle's segments do not belong inside`, () => {
      const area = RectangularArea.FromTwoPoints(A, C)
      const point1 = Point.GetPointBetween(A, B)
      const point2 = Point.GetPointBetween(A, D)
      expect(area.containsPoint(point1)).toBe(false)
      expect(area.containsPoint(point2)).toBe(false)
    })

  })

  describe(`pointLaysOnTheEdge`, () => {

    it(`should tell that the center point is not on the edge of the rectangular area`, () => {
      const area = RectangularArea.FromTwoPoints(D, B)
      const center = Point.FromCartesianCoordinates(5.5, 11)
      expect(area.containsPoint(center)).toBe(true)
    })

    it(`should tell that a random point is contained inside the rectangular area`, () => {
      const area = RectangularArea.FromTwoPoints(C, A)
      const point = Point.FromCartesianCoordinates(9, 3)
      expect(area.containsPoint(point)).toBe(true)
    })

    it(`should tell that a point is not inside the area (off by two axes)`, () => {
      const area = RectangularArea.FromTwoPoints(D, B)
      expect(area.containsPoint(Point.CENTER)).toBe(false)
    })

    it(`should tell that a point is not inside the area (off by a single axis)`, () => {
      const area = RectangularArea.FromTwoPoints(B, D)
      const point = Point.FromCartesianCoordinates(5.5, 100)
      expect(area.containsPoint(point)).toBe(false)
    })

    it(`should tell that vertices do not belong inside`, () => {
      const area = RectangularArea.FromTwoPoints(A, C)
      expect(area.containsPoint(A)).toBe(false)
      expect(area.containsPoint(B)).toBe(false)
      expect(area.containsPoint(C)).toBe(false)
      expect(area.containsPoint(D)).toBe(false)
    })

    it(`should tell that points on the rectangle's segments do not belong inside`, () => {
      const area = RectangularArea.FromTwoPoints(A, C)
      const point1 = Point.GetPointBetween(A, B)
      const point2 = Point.GetPointBetween(A, D)
      expect(area.containsPoint(point1)).toBe(false)
      expect(area.containsPoint(point2)).toBe(false)
    })

  })

  describe(`containsPointInclusively`, () => {

    it(`should tell that the center point is contained inside the rectangular area`, () => {
      const area = RectangularArea.FromTwoPoints(D, B)
      const center = Point.FromCartesianCoordinates(5.5, 11)
      expect(area.containsPointInclusively(center)).toBe(true)
    })

    it(`should tell that a random point is contained inside the rectangular area`, () => {
      const area = RectangularArea.FromTwoPoints(C, A)
      const point = Point.FromCartesianCoordinates(9, 3)
      expect(area.containsPointInclusively(point)).toBe(true)
    })

    it(`should tell that a point is not inside the area (off by two axes)`, () => {
      const area = RectangularArea.FromTwoPoints(D, B)
      expect(area.containsPointInclusively(Point.CENTER)).toBe(false)
    })

    it(`should tell that a point is not inside the area (off by a single axis)`, () => {
      const area = RectangularArea.FromTwoPoints(B, D)
      const point = Point.FromCartesianCoordinates(5.5, 100)
      expect(area.containsPointInclusively(point)).toBe(false)
    })

    it(`should tell that vertices belong inside`, () => {
      const area = RectangularArea.FromTwoPoints(A, C)
      expect(area.containsPointInclusively(A)).toBe(true)
      expect(area.containsPointInclusively(B)).toBe(true)
      expect(area.containsPointInclusively(C)).toBe(true)
      expect(area.containsPointInclusively(D)).toBe(true)
    })

    it(`should tell that points on the rectangle's segments do not belong inside`, () => {
      const area = RectangularArea.FromTwoPoints(A, C)
      const point1 = Point.GetPointBetween(A, B)
      const point2 = Point.GetPointBetween(A, D)
      expect(area.containsPointInclusively(point1)).toBe(true)
      expect(area.containsPointInclusively(point2)).toBe(true)
    })

  })

  describe(`getCapturedSegment`, () => {

    const area = RectangularArea.FromTwoPoints(A, C)

    it(`should get captured segment for a vertical line through the area`, () => {
      const line = Line.VerticalThroughPoint(5)
      const actual = area.getCapturedSegment(line)
      const expected = Segment.FromGeneralForm(5, 2, 5, 20)
      expect(Segment.AreEqual(actual, expected)).toBe(true)
    })

    it(`should get captured segment for a horizontal line through the area`, () => {
      const line = Line.HorizontalThroughPoint(5)
      const actual = area.getCapturedSegment(line)
      const expected = Segment.FromGeneralForm(1, 5, 10, 5)
      expect(Segment.AreEqual(actual, expected)).toBe(true)
    })

  })

})
