import {areEqualFloats} from '../../util'
import {Line, MaterialColor, Point} from '../everything'

const pointEquality = function (first: any, second: any) {
  if (first.kind == 'point' && second.kind == 'point') {
    return Point.AreEqual(first, second)
  }
}

describe(`Point`, () => {

  beforeEach(() => jasmine.addCustomEqualityTester(pointEquality))

  it(`should report very close points as the same (eps = 1e-6)`, () => {
    const diff = 1e-7
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = Point.FromCartesianCoordinates(1 + diff, 2 - diff)
    const equality: boolean = Point.AreEqual(point1, point2)
    expect(equality).toBe(true)
  })

  it(`should get x`, () => {
    const point = Point.FromCartesianCoordinates(1, 2)
    expect(point.x()).toBe(1)
  })

  it(`should set x`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = point1.x(0)
    expect(point1).toBe(point2)
    expect(point2.x()).toBe(0)
  })

  it(`should map x`, () => {
    const point1 = Point.FromCartesianCoordinates(3, 2)
    const point2 = point1.x(x => x * x)
    expect(point1).toBe(point2)
    expect(point2.x()).toBe(9)
  })

  it(`should get y`, () => {
    const point = Point.FromCartesianCoordinates(1, 2)
    expect(point.y()).toBe(2)
  })

  it(`should set y`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = point1.y(0)
    expect(point1).toBe(point2)
    expect(point2.y()).toBe(0)
  })

  it(`should map y`, () => {
    const point1 = Point.FromCartesianCoordinates(3, 2)
    const point2 = point1.y(y => y * y + 1)
    expect(point1).toBe(point2)
    expect(point2.y()).toBe(5)
  })

  it(`should set label during creation`, () => {
    const point = Point.FromCartesianCoordinates(1, 2, 'label')
    expect(point.label()).toEqual('label')
  })

  it(`should change label`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = point1.label('label')
    expect(point1).toBe(point2)
    expect(point2.label()).toEqual('label')
  })

  it(`should chain method calls`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2, 'label')
      .x(3).y(4).label('foo')
    const point2 = Point.FromCartesianCoordinates(3, 4, 'foo')
    expect(point1).toEqual(point2)
  })

  it(`should create a point from polar coordinates`, () => {
    const point1 = Point.FromPolarCoordinates(1, 0)
    const point2 = Point.FromCartesianCoordinates(1, 0)
    expect(point1).toEqual(point2)

    const point3 = Point.FromPolarCoordinates(2, Math.PI / 4)
    const point4 = Point.FromCartesianCoordinates(Math.sqrt(2), Math.sqrt(2))
    expect(point3).toEqual(point4)

    const point5 = Point.FromPolarCoordinates(1, Math.PI / 2)
    const point6 = Point.FromCartesianCoordinates(0, 1)
    expect(point5).toEqual(point6)
  })

  describe(`Point#copyValuesFrom`, () => {

    it(`should copy by value to an object`, () => {
      const point1 = Point.FromCartesianCoordinates(1, 2)
      const point2 = Point.FromCartesianCoordinates(2, 3)
      point2.copyValuesFrom(point1)
      expect(point1).toEqual(point2)
      expect(point1).not.toBe(point2)
    })

    it(`should not copy view data`, () => {
      const point1 = Point.FromCartesianCoordinates(1, 2)
        .label('A')
        .strokeColor(MaterialColor.AMBER)
        .fillColor(MaterialColor.BLUE)
      const point2 = Point.FromCartesianCoordinates(4, 5)
        .label('B')
        .strokeColor(MaterialColor.BLUE_GREY)
        .fillColor(MaterialColor.BROWN)
      point2.copyValuesFrom(point1)
      expect(point1).toEqual(point2)
      expect(point2.label()).toBe('B')
      expect(point2.strokeColor()).toBe(MaterialColor.BLUE_GREY)
      expect(point2.fillColor()).toBe(MaterialColor.BROWN)
    })

  })

  describe(`Point#copyViewDataFrom`, () => {

    it(`should copy label, stroke color and fill color`, () => {
      const point1 = Point.FromCartesianCoordinates(1, 2)
        .label('A')
        .fillColor(MaterialColor.BROWN)
        .strokeColor(MaterialColor.BLUE_GREY)
      const point2 = Point.FromCartesianCoordinates(3, 4)
        .label('B')
        .fillColor(MaterialColor.BLUE)
        .strokeColor(MaterialColor.LIGHT_BLUE)
      point2.copyViewDataFrom(point1)
      expect(point1).not.toEqual(point2)
      expect(point2.label()).toBe('A')
      expect(point2.fillColor()).toBe(MaterialColor.BROWN)
      expect(point2.strokeColor()).toBe(MaterialColor.BLUE_GREY)
    })

  })

  describe(`Point#copyFrom`, () => {

    it(`should copy everything`, () => {
      const point1 = Point.FromCartesianCoordinates(1, 2)
        .label('A')
        .fillColor(MaterialColor.BROWN)
        .strokeColor(MaterialColor.BLUE_GREY)
      const point2 = Point.FromCartesianCoordinates(3, 4)
        .label('B')
        .fillColor(MaterialColor.BLUE)
        .strokeColor(MaterialColor.LIGHT_BLUE)
      point2.copyFrom(point1)
      expect(point1).toEqual(point2)
      expect(point2.label()).toBe('A')
      expect(point2.fillColor()).toBe(MaterialColor.BROWN)
      expect(point2.strokeColor()).toBe(MaterialColor.BLUE_GREY)
    })

  })

  it(`should get polar coordinates`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const polar = point.getPolarCoordinates()
    expect(polar.r).toBe(Math.sqrt(2))
    expect(polar.φ).toBe(Math.PI / 4)
  })

  it(`should create a point from matrix`, () => {
    const matrix = [[1], [2]]
    const point1 = Point.FromMatrix(matrix)
    const point2 = Point.FromCartesianCoordinates(1, 2)
    expect(point1).toEqual(point2)
  })

  it(`should get matrix from a point`, () => {
    const point = Point.FromCartesianCoordinates(1, 2)
    const matrix = point.getNonHomogeneousMatrixCoordinates()
    expect(matrix).toEqual([[1], [2]])
  })

  it(`should create a point as negative of the given`, () => {
    const point = Point.FromCartesianCoordinates(1, 2)
    const negative = Point.Negative(point)
    const expected = Point.FromCartesianCoordinates(-1, -2)
    expect(point).not.toBe(negative) // we expect a different reference
    expect(negative).toEqual(expected)
  })

  it(`should create a point as addition of two`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = Point.FromCartesianCoordinates(3, 4)
    const addition = Point.Add(point1, point2)
    const point = Point.FromCartesianCoordinates(4, 6)
    expect(point1).not.toBe(addition) // we expect a different reference
    expect(point2).not.toBe(addition) // we expect a different reference
    expect(addition).toEqual(point)
  })

  it(`should create a point as subtraction of two`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = Point.FromCartesianCoordinates(3, 4)
    const subtraction = Point.Subtract(point1, point2)
    const point = Point.FromCartesianCoordinates(-2, -2)
    expect(point1).not.toBe(subtraction) // we expect a different reference
    expect(point2).not.toBe(subtraction) // we expect a different reference
    expect(subtraction).toEqual(point)
  })

  it(`should calculate dot product of two points`, () => {
    const point1 = Point.FromCartesianCoordinates(-1, 2)
    const point2 = Point.FromCartesianCoordinates(3, 4)
    const dotProduct = -1 * 3 + 2 * 4
    expect(Point.DotProduct(point1, point2)).toBe(dotProduct)
  })

  it(`should get distance between two points`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = Point.FromCartesianCoordinates(3, 4)
    expect(Point.GetDistanceBetween(point1, point2)).toBe(2 * Math.sqrt(2))

    const point3 = Point.FromCartesianCoordinates(1, 0)
    const point4 = Point.FromCartesianCoordinates(2, 0)
    expect(Point.GetDistanceBetween(point3, point4)).toBe(1)

    const point5 = Point.FromCartesianCoordinates(0, 1)
    const point6 = Point.FromCartesianCoordinates(0, 2)
    expect(Point.GetDistanceBetween(point5, point6)).toBe(1)
  })

  it(`should get point at ratio given as two numbers`, () => {
    const point1 = Point.FromCartesianCoordinates(0, 0)
    const point2 = Point.FromCartesianCoordinates(6, 3)
    const third = Point.FromCartesianCoordinates(2, 1)
    expect(Point.GetPointAtRatio(point1, point2, 1, 2)).toEqual(third)
  })

  it(`should get point at ratio given as a single number`, () => {
    const point1 = Point.FromCartesianCoordinates(0, 0)
    const point2 = Point.FromCartesianCoordinates(6, 3)
    const ratio = Point.GetPointAtRatio(point1, point2, 1 / 2)
    const expected = Point.FromCartesianCoordinates(2, 1)
    expect(ratio).toEqual(expected)
  })

  it(`should get point at the middle`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = Point.FromCartesianCoordinates(3, 4)
    const middle = Point.FromCartesianCoordinates(2, 3)
    expect(Point.GetPointBetween(point1, point2)).toEqual(middle)
  })

  it(`should get distance between line and a point`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const line = Line.FromSegmentForm(-2, 2)
    const distance = Point.GetDistanceBetweenLineAndPoint(line, point)
    expect(areEqualFloats(distance, Math.SQRT2)).toBe(true,
      `Distance should've been ≈√2 but was ${distance}`)
  })

  it(`should translate the point`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const diff = Point.FromPolarCoordinates(3, Math.PI)
    const point2 = point1.translateByPoint(diff)
    expect(point1).toBe(point2)
    expect(point2).toEqual(Point.FromCartesianCoordinates(-2, 2))
  })

  it(`should get distance to a point (non-static)`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = Point.FromCartesianCoordinates(-1, 2)
    expect(point1.distanceTo(point2)).toBe(2)
  })

  it(`should not change reference when applying matrix`, () => {
    const p1 = Point.FromCartesianCoordinates(1, 2)
    const p2 = p1.applyMatrix([[1, 0], [0, 1]])
    expect(p1).toBe(p2)
  })

  it(`should apply transformation matrix`, () => {
    const m = [[1, 2], [3, 4]]

    const p1 = Point.FromCartesianCoordinates(0, 0)
    const p2 = Point.FromCartesianCoordinates(0, 0)
    expect(p1.applyMatrix(m)).toEqual(p2)

    const p3 = Point.FromCartesianCoordinates(1, 1)
    const p4 = Point.FromCartesianCoordinates(3, 7)
    expect(p3.applyMatrix(m)).toEqual(p4)

    const p5 = Point.FromCartesianCoordinates(-1, 1)
    const p6 = Point.FromCartesianCoordinates(1, 1)
    expect(p5.applyMatrix(m)).toEqual(p6)

    const p7 = Point.FromCartesianCoordinates(2, -3)
    const p8 = Point.FromCartesianCoordinates(-4, -6)
    expect(p7.applyMatrix(m)).toEqual(p8)
  })

  it(`should apply homogeneous transformation matrix with default center`, () => {
    const m = [[1, 2, 3], [4, 5, 6], [0, 0, 1]]

    const p1 = Point.FromCartesianCoordinates(0, 0)
    const p2 = Point.FromCartesianCoordinates(3, 6)
    expect(p1.applyMatrix(m)).toEqual(p2)

    const p3 = Point.FromCartesianCoordinates(1, 1)
    const p4 = Point.FromCartesianCoordinates(6, 15)
    expect(p3.applyMatrix(m)).toEqual(p4)

    const p5 = Point.FromCartesianCoordinates(-1, 1)
    const p6 = Point.FromCartesianCoordinates(4, 7)
    expect(p5.applyMatrix(m)).toEqual(p6)

    const p7 = Point.FromCartesianCoordinates(2, -3)
    const p8 = Point.FromCartesianCoordinates(-1, -1)
    expect(p7.applyMatrix(m)).toEqual(p8)
  })

  it(`should translate along X`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 1)
    const point2 = Point.FromCartesianCoordinates(2, 1)
    expect(point1.translateX(1)).toEqual(point2)
  })

  it(`should translate along Y`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 1)
    const point2 = Point.FromCartesianCoordinates(1, 2)
    expect(point1.translateY(1)).toEqual(point2)
  })

  it(`should translate along X and Y`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 1)
    const point2 = Point.FromCartesianCoordinates(3, 2)
    expect(point1.translate(2, 1)).toEqual(point2)
  })

  it(`should stretch X`, () => {
    const point1 = Point.FromCartesianCoordinates(2, 1)
    const point2 = Point.FromCartesianCoordinates(4, 1)
    expect(point1.stretchX(2)).toEqual(point2)
  })

  it(`should stretch x with new center`, () => {
    const center = Point.FromCartesianCoordinates(1, 1)
    const point1 = Point.FromCartesianCoordinates(2, 1)
    const point2 = Point.FromCartesianCoordinates(3, 1)
    expect(point1.stretchX(2, center)).toEqual(point2)
  })

  it(`should stretch Y`, () => {
    const point1 = Point.FromCartesianCoordinates(2, 1)
    const point2 = Point.FromCartesianCoordinates(2, 2)
    expect(point1.stretchY(2)).toEqual(point2)
  })

  it(`should stretch y with new center`, () => {
    const center = Point.FromCartesianCoordinates(2, 3)
    const point1 = Point.FromCartesianCoordinates(2, 2)
    const point2 = Point.FromCartesianCoordinates(2, 1)
    expect(point1.stretchY(2, center)).toEqual(point2)
  })

  it(`should stretch`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = Point.FromCartesianCoordinates(5, 10)
    expect(point1.stretch(5)).toEqual(point2)
  })

  it(`should stretch with new center`, () => {
    const center = Point.FromCartesianCoordinates(4, 4)
    const point1 = Point.FromCartesianCoordinates(0, 0)
    const point2 = Point.FromCartesianCoordinates(-4, -4)
    expect(point1.stretch(2, center)).toEqual(point2)
  })

  describe(`should rotate`, () => {
    it(`for π / 2`, () => {
      const point1 = Point.FromCartesianCoordinates(1, 0)
      const point2 = Point.FromCartesianCoordinates(0, 1)
      expect(point1.rotate(Math.PI / 2)).toEqual(point2)
    })

    it(`for π`, () => {
      const point3 = Point.FromCartesianCoordinates(1, 0)
      const point4 = Point.FromCartesianCoordinates(-1, 0)
      expect(point3.rotate(Math.PI)).toEqual(point4)
    })

    it(`for 3π / 2`, () => {
      const point5 = Point.FromCartesianCoordinates(1, 0)
      const point6 = Point.FromCartesianCoordinates(0, -1)
      expect(point5.rotate(3 * Math.PI / 2)).toEqual(point6)
    })
  })

  describe(`should rotate around an arbitrary point`, () => {
    it(`for π / 2`, () => {
      const point1 = Point.FromCartesianCoordinates(2, 1)
      const point2 = Point.FromCartesianCoordinates(1, 2)
      const center = Point.FromCartesianCoordinates(1, 1)
      expect(point1.rotate(Math.PI / 2, center)).toEqual(point2)
    })
  })

  it(`should shear along x-axis`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = Point.FromCartesianCoordinates(5, 2)
    expect(point1.shearX(2)).toEqual(point2)
  })

  it(`should shear along y-axis`, () => {
    const point1 = Point.FromCartesianCoordinates(1, 2)
    const point2 = Point.FromCartesianCoordinates(1, 4)
    expect(point1.shearY(2)).toEqual(point2)
  })

  it(`should reflect over a vertical line (to the left)`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const line = Line.VerticalThroughPoint(-2)
    const reflection = Point.FromCartesianCoordinates(-5, 1)
    expect(point.reflectOverLine(line)).toEqual(reflection)
  })

  it(`should reflect over a vertical line (to the right)`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const line = Line.VerticalThroughPoint(2)
    const reflection = Point.FromCartesianCoordinates(3, 1)
    expect(point.reflectOverLine(line)).toEqual(reflection)
  })

  it(`should reflect over a horizontal line (to the above)`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const line = Line.HorizontalThroughPoint(-1)
    const reflection = Point.FromCartesianCoordinates(1, -3)
    expect(point.reflectOverLine(line)).toEqual(reflection)
  })

  it(`should reflect over a horizontal line (to the below)`, () => {
    const point = Point.FromCartesianCoordinates(1, 1)
    const line = Line.HorizontalThroughPoint(2)
    const reflection = Point.FromCartesianCoordinates(1, 3)
    expect(point.reflectOverLine(line)).toEqual(reflection)
  })

  it(`should reflect over a line`, () => {
    const point = Point.FromCartesianCoordinates(1, 0)
    const line = Line.Y_EQUALS_X
    const reflection = Point.FromCartesianCoordinates(0, 1)
    expect(point.reflectOverLine(line)).toEqual(reflection)
  })

  it(`should reflect over a line`, () => {
    const point = Point.FromCartesianCoordinates(0, 1)
    const line = Line.Y_EQUALS_X
    const reflection = Point.FromCartesianCoordinates(1, 0)
    expect(point.reflectOverLine(line)).toEqual(reflection)
  })

  it(`should reflect over a point`, () => {
    const point1 = Point.FromCartesianCoordinates(2, 1)
    const center = Point.FromCartesianCoordinates(1, 2)
    const point2 = Point.FromCartesianCoordinates(0, 3)
    expect(point1.reflectOverPoint(center)).toEqual(point2)
  })

})
