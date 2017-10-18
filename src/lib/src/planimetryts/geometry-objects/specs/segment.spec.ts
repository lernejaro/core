import {Line, MaterialColor, Point, Segment} from '../everything'

const customEqualities = function (first: any, second: any) {
  if (first.kind == 'line' && second.kind == 'line') {
    return Line.AreEqual(first, second)
  }
  if (first.kind == 'point' && second.kind == 'point') {
    return Point.AreEqual(first, second)
  }
  if (first.kind == 'segment' && second.kind == 'segment') {
    return Segment.AreEqual(first, second)
  }
}

describe(`Segment`, () => {

  beforeEach(() => jasmine.addCustomEqualityTester(customEqualities))

  describe(`Segment.AreEqual`, () => {
    const point11 = Point.FromCartesianCoordinates(1, 2)
    const point12 = Point.FromCartesianCoordinates(3, 4)
    const point21 = point11.clone()
    const point22 = point12.clone()

    it(`should determine that segments are equal with equivalent points`, () => {
      const segment1 = Segment.FromTwoPoints(point11, point12)
      const segment2 = Segment.FromTwoPoints(point21, point22)
      expect(Segment.AreEqual(segment1, segment2)).toBe(true)
      expect(Segment.AreEqual(segment2, segment1)).toBe(true)
      expect(segment1).toEqual(segment2)
    })

    it(`should determine that segments are equal with swapped points`, () => {
      const segment1 = Segment.FromTwoPoints(point11, point12)
      const segment2 = Segment.FromTwoPoints(point22, point21)
      expect(Segment.AreEqual(segment1, segment2)).toBe(true)
      expect(Segment.AreEqual(segment2, segment1)).toBe(true)
      expect(segment1).toEqual(segment2)
    })

  })

  it(`should get bisector of a segment`, () => {
    const point1 = Point.FromCartesianCoordinates(2, 1.5)
    const point2 = Point.FromCartesianCoordinates(4, 2.5)
    const segment = Segment.FromTwoPoints(point1, point2)
    const actual = segment.getBisector()
    const expected = Line.FromExplicitForm(-2, 8)
    expect(actual).toEqual(expected)
  })

  describe(`GetIntersection`, () => {

    const segment1 = Segment.FromGeneralForm(1, 2, 5, 4)
    const segment1P = Segment.FromGeneralForm(2, 2, 6, 4)
    const segment2 = Segment.FromGeneralForm(4, 1, 2, 5)
    const segment3 = Segment.FromGeneralForm(1, 1, 2, 2)

    const vSegment1 = Segment.FromGeneralForm(6, 1, 6, 3)
    const vSegment2 = Segment.FromGeneralForm(6, 2, 6, 4)
    const vSegment3 = Segment.FromGeneralForm(6, 5, 6, 6)
    const vSegment4 = Segment.FromGeneralForm(6, 0, 6, 10)
    const vSegmentP = Segment.FromGeneralForm(7, 1, 7, 2)

    const hSegment1 = Segment.FromGeneralForm(1, 6, 3, 6)
    const hSegment2 = Segment.FromGeneralForm(2, 6, 4, 6)
    const hSegment3 = Segment.FromGeneralForm(5, 6, 6, 6)
    const hSegment4 = Segment.FromGeneralForm(0, 6, 10, 6)
    const hSegmentP = Segment.FromGeneralForm(1, 7, 2, 7)

    it(`should get intersection of two segments`, () => {
      const actual = Segment.GetIntersection(segment1, segment2)
      const expected = Point.FromCartesianCoordinates(3, 3)
      expect(actual).toEqual(expected)
    })

    it(`should return null when no intersection`, () => {
      expect(segment1.getIntersectionWithSegment(segment3)).toBeNull()
      expect(segment2.getIntersectionWithSegment(segment3)).toBeNull()
      expect(segment1.getIntersectionWithSegment(vSegment1)).toBeNull()
      expect(segment1.getIntersectionWithSegment(vSegment2)).toBeNull()
      expect(segment1.getIntersectionWithSegment(vSegment3)).toBeNull()
      expect(segment1.getIntersectionWithSegment(vSegment4)).toBeNull()
      expect(segment1.getIntersectionWithSegment(hSegment1)).toBeNull()
      expect(segment1.getIntersectionWithSegment(hSegment2)).toBeNull()
      expect(segment1.getIntersectionWithSegment(hSegment3)).toBeNull()
      expect(segment1.getIntersectionWithSegment(hSegment4)).toBeNull()
    })

    it(`should return null when segments are parallel`, () => {
      expect(segment1.getIntersectionWithSegment(segment1P)).toBeNull()
    })

    it(`should return null when no intersection for two horizontal segments`, () => {
      expect(hSegment1.getIntersectionWithSegment(hSegmentP)).toBeNull()
    })

    it(`should return null when no intersection for two vertical segments`, () => {
      expect(vSegment1.getIntersectionWithSegment(vSegmentP)).toBeNull()
    })

    it(`should return null when segments are on the same horizontal line, but no overlap`, () => {
      expect(hSegment1.getIntersectionWithSegment(hSegment3)).toBeNull()
    })

    it(`should return null when segments are on the same vertical line, but no overlap`, () => {
      expect(vSegment1.getIntersectionWithSegment(vSegment3)).toBeNull()
    })

    it(`should return null when segments are on the same horizontal line with overlap`, () => {
      expect(hSegment1.getIntersectionWithSegment(hSegment2)).toBeNull()
    })

    it(`should return null when segments are on the same vertical line with overlap`, () => {
      expect(vSegment1.getIntersectionWithSegment(hSegment2)).toBeNull()
    })

    describe(`WithLine`, () => {

      it(`should get intersection of two segments`, () => {
        const actual = Segment.GetIntersectionWithLine(segment1, segment2.getLine())
        const expected = Point.FromCartesianCoordinates(3, 3)
        expect(actual).toEqual(expected)
      })

      it(`should return null when segments are parallel`, () => {
        expect(segment1.getIntersectionWithLine(segment1P.getLine())).toBeNull()
      })

      it(`should return null when no intersection for two horizontal segments`, () => {
        expect(hSegment1.getIntersectionWithLine(hSegmentP.getLine())).toBeNull()
      })

      it(`should return null when no intersection for two vertical segments`, () => {
        expect(vSegment1.getIntersectionWithLine(vSegmentP.getLine())).toBeNull()
      })

      it(`should return null when segments are on the same horizontal line, but no overlap`, () => {
        expect(hSegment1.getIntersectionWithLine(hSegment3.getLine())).toBeNull()
      })

      it(`should return null when segments are on the same vertical line, but no overlap`, () => {
        expect(vSegment1.getIntersectionWithLine(vSegment3.getLine())).toBeNull()
      })

      it(`should return null when segments are on the same horizontal line with overlap`, () => {
        expect(hSegment1.getIntersectionWithLine(hSegment2.getLine())).toBeNull()
      })

      it(`should return null when segments are on the same vertical line with overlap`, () => {
        expect(vSegment1.getIntersectionWithLine(hSegment2.getLine())).toBeNull()
      })

    })

  })

  describe(`Segment#copyValuesFrom`, () => {

    it(`should copy by value to an object`, () => {
      const segmentSrc = Segment.FromGeneralForm(1, 2, 3, 4)
      const segmentDst = Segment.FromGeneralForm(2, 3, 4, 5)
      segmentDst.copyValuesFrom(segmentSrc)
      expect(segmentDst).toEqual(segmentSrc)
      expect(segmentDst).not.toBe(segmentSrc)
    })

    it(`should not copy view data`, () => {
      const segmentSrc = Segment.FromGeneralForm(1, 2, 3, 4)
        .label('a')
        .fillColor(MaterialColor.BLUE)
        .strokeColor(MaterialColor.LIGHT_BLUE)
      const segmentDst = Segment.FromGeneralForm(5, 6, 7, 8)
        .label('b')
        .fillColor(MaterialColor.BROWN)
        .strokeColor(MaterialColor.CYAN)
      segmentDst.copyValuesFrom(segmentSrc)
      expect(segmentDst).toEqual(segmentSrc)
      expect(segmentDst).not.toBe(segmentSrc)
      expect(segmentDst.label()).toEqual('b')
      expect(segmentDst.fillColor()).toEqual(MaterialColor.BROWN)
      expect(segmentDst.strokeColor()).toEqual(MaterialColor.CYAN)
    })

  })

  describe(`Segment#copyViewDataFrom`, () => {

    it(`should copy only label, stroke color and fill color`, () => {
      const segmentSrc = Segment.FromGeneralForm(1, 2, 3, 4)
        .label('a')
        .fillColor(MaterialColor.BLUE)
        .strokeColor(MaterialColor.LIGHT_BLUE)
      const segmentDst = Segment.FromGeneralForm(5, 6, 7, 8)
        .label('b')
        .fillColor(MaterialColor.BROWN)
        .strokeColor(MaterialColor.CYAN)
      segmentDst.copyViewDataFrom(segmentSrc)
      expect(segmentDst).not.toEqual(segmentSrc)
      expect(segmentDst).not.toBe(segmentSrc)
      expect(segmentDst.label()).toEqual('a')
      expect(segmentDst.fillColor()).toEqual(MaterialColor.BLUE)
      expect(segmentDst.strokeColor()).toEqual(MaterialColor.LIGHT_BLUE)
    })

  })

  describe(`Segment#copyFrom`, () => {

    it(`should copy everything`, () => {
      const segmentSrc = Segment.FromGeneralForm(1, 2, 3, 4)
        .label('a')
        .fillColor(MaterialColor.BLUE)
        .strokeColor(MaterialColor.LIGHT_BLUE)
      const segmentDst = Segment.FromGeneralForm(5, 6, 7, 8)
        .label('b')
        .fillColor(MaterialColor.BROWN)
        .strokeColor(MaterialColor.CYAN)
      segmentDst.copyFrom(segmentSrc)
      expect(segmentDst).toEqual(segmentSrc)
      expect(segmentDst).not.toBe(segmentSrc)
      expect(segmentDst.label()).toEqual('a')
      expect(segmentDst.fillColor()).toEqual(MaterialColor.BLUE)
      expect(segmentDst.strokeColor()).toEqual(MaterialColor.LIGHT_BLUE)
    })

  })

  describe(`getMiddle`, () => {

    it(`should get the midpoint of the segment`, () => {
      const segment = Segment.FromGeneralForm(1, 2, 3, 4)
      const expected = Point.FromCartesianCoordinates(2, 3)
      const actual = segment.getMiddle()
      expect(actual).toEqual(expected)
    })

  })

  describe(`getLine`, () => {

    it(`should get line`, () => {
      const point1 = Point.FromCartesianCoordinates(1, 2)
      const point2 = Point.FromCartesianCoordinates(5, 1)
      const segment = Segment.FromTwoPoints(point1, point2)
      const expected = Line.FromTwoPoints(point1, point2)
      const actual = segment.getLine()
      expect(actual).toEqual(expected)
    })

  })

  describe(`containsPoint`, () => {

    describe(`for horizontal segment`, () => {

      const A = Point.FromCartesianCoordinates(1, 2)
      const B = Point.FromCartesianCoordinates(6, 2)
      const segment = Segment.FromTwoPoints(A, B)
      const out = Point.FromCartesianCoordinates(4, 6)
      const onLine = Point.FromCartesianCoordinates(8, 2)
      const onSegment = Point.FromCartesianCoordinates(4, 2)

      it(`should return true when the point is on the segment`, () => {
        expect(segment.containsPoint(onSegment)).toBe(true)
        expect(segment.containsPoint(onSegment, true)).toBe(true)
      })

      it(`should return false when the point is on the line but not in segment boundaries`, () => {
        expect(segment.containsPoint(onLine)).toBe(false)
        expect(segment.containsPoint(onLine, true)).toBe(false)
      })

      it(`should return false when the point is not even on the line`, () => {
        expect(segment.containsPoint(out)).toBe(false)
        expect(segment.containsPoint(out, true)).toBe(false)
      })

      it(`should properly handle segment end points`, () => {
        expect(segment.containsPoint(A)).toBe(false)
        expect(segment.containsPoint(B)).toBe(false)
        expect(segment.containsPoint(A, true)).toBe(true)
        expect(segment.containsPoint(B, true)).toBe(true)
      })

    })

    describe(`for vertical segment`, () => {

      const A = Point.FromCartesianCoordinates(2, 1)
      const B = Point.FromCartesianCoordinates(2, 6)
      const segment = Segment.FromTwoPoints(A, B)
      const out = Point.FromCartesianCoordinates(6, 4)
      const onLine = Point.FromCartesianCoordinates(2, 8)
      const onSegment = Point.FromCartesianCoordinates(2, 4)

      it(`should return true when the point is on the segment`, () => {
        expect(segment.containsPoint(onSegment)).toBe(true)
        expect(segment.containsPoint(onSegment, true)).toBe(true)
      })

      it(`should return false when the point is on the line but not in segment boundaries`, () => {
        expect(segment.containsPoint(onLine)).toBe(false)
        expect(segment.containsPoint(onLine, true)).toBe(false)
      })

      it(`should return false when the point is not even on the line`, () => {
        expect(segment.containsPoint(out)).toBe(false)
        expect(segment.containsPoint(out, true)).toBe(false)
      })

      it(`should properly handle segment end points`, () => {
        expect(segment.containsPoint(A)).toBe(false)
        expect(segment.containsPoint(B)).toBe(false)
        expect(segment.containsPoint(A, true)).toBe(true)
        expect(segment.containsPoint(B, true)).toBe(true)
      })

    })

    describe(`for general case`, () => {

      const A = Point.FromCartesianCoordinates(1, 2)
      const B = Point.FromCartesianCoordinates(5, 4)
      const segment = Segment.FromTwoPoints(A, B)
      const out = Point.FromCartesianCoordinates(4, 6)
      const inRectangleArea = Point.FromCartesianCoordinates(2, 3)
      const onLine = Point.FromCartesianCoordinates(-1, 1)
      const onSegment = Point.FromCartesianCoordinates(3, 3)

      it(`should return true when the point is on the segment`, () => {
        expect(segment.containsPoint(onSegment)).toBe(true)
        expect(segment.containsPoint(onSegment, true)).toBe(true)
      })

      it(`should return false when the point is on the line but not in segment boundaries`, () => {
        expect(segment.containsPoint(onLine)).toBe(false)
        expect(segment.containsPoint(onLine, true)).toBe(false)
      })

      it(`should return false when the point is in the area but not on the segment`, () => {
        expect(segment.containsPoint(inRectangleArea)).toBe(false)
        expect(segment.containsPoint(inRectangleArea, true)).toBe(false)
      })

      it(`should return false when the point is not even on the line`, () => {
        expect(segment.containsPoint(out)).toBe(false)
        expect(segment.containsPoint(out, true)).toBe(false)
      })

      it(`should properly handle segment end points`, () => {
        expect(segment.containsPoint(A)).toBe(false)
        expect(segment.containsPoint(B)).toBe(false)
        expect(segment.containsPoint(A, true)).toBe(true)
        expect(segment.containsPoint(B, true)).toBe(true)
      })

    })

  })


})
