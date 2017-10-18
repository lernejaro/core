import {areEqualFloats} from '../../util'
import {Matrix} from '../matrix'

const customEqualities = function (first: any, second: any) {
  if (typeof first == 'number' && typeof second == 'number') {
    return areEqualFloats(first, second)
  }
}

describe(`Matrix`, () => {

  beforeEach(() => jasmine.addCustomEqualityTester(customEqualities))

  it(`should transpose a matrix`, () => {
    const a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    const b = [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
    expect(Matrix.Transpose(a)).toEqual(b)

    const c = [[1], [2], [3]]
    const d = [[1, 2, 3]]
    expect(Matrix.Transpose(c)).toEqual(d)
    expect(Matrix.Transpose(d)).toEqual(c)
  })

  it(`should multiply matrices`, () => {
    const m = [[1, 2], [3, 4]]

    const a = [[0], [0]]
    expect(Matrix.Multiply(m, a)).toEqual([[0], [0]])

    const b = [[1], [1]]
    expect(Matrix.Multiply(m, b)).toEqual([[3], [7]])

    const x = [[1, 2]]
    const y = [[1], [2]]
    expect(Matrix.Multiply(x, y)).toEqual([[5]])
    expect(Matrix.Multiply(y, x)).toEqual([[1, 2], [2, 4]])

    const t = [[1, 2, 3, 4, 5, 6]]
    const s = Matrix.Transpose(t)
    expect(Matrix.Multiply(s, t)).toEqual(
      [
        [1, 2, 3, 4, 5, 6],
        [2, 4, 6, 8, 10, 12],
        [3, 6, 9, 12, 15, 18],
        [4, 8, 12, 16, 20, 24],
        [5, 10, 15, 20, 25, 30],
        [6, 12, 18, 24, 30, 36],
      ],
    )
  })

  it(`should generate identity matrices`, () => {
    const i1 = [[1]]
    const i2 = [[1, 0], [0, 1]]
    const i3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
    expect(Matrix.GetIdentity(1)).toEqual(i1)
    expect(Matrix.GetIdentity(2)).toEqual(i2)
    expect(Matrix.GetIdentity(3)).toEqual(i3)
  })

  describe(`Matrix.IsMatrix`, () => {

    it(`should return false for a string`, () => {
      expect(Matrix.IsMatrix(<any>'foo')).toBe(false)
    })

    it(`should return false for a number`, () => {
      expect(Matrix.IsMatrix(<any>1)).toBe(false)
    })

    it(`should return false for 1D array`, () => {
      expect(Matrix.IsMatrix(<any>[1, 2]))
    })

    it(`should return false for different lengths of rows`, () => {
      expect(Matrix.IsMatrix([[1], [1, 2]])).toBe(false)
    })

    it(`should return false for one element being a string`, () => {
      expect(Matrix.IsMatrix(<any>[[1, 2], [3, '4']])).toBe(false)
    })

    it(`should return false for one element being undefined`, () => {
      expect(Matrix.IsMatrix(<any>[[1, 2], [3, null]])).toBe(false)
    })

    it(`should return true for a proper matrix`, () => {
      expect(Matrix.IsMatrix([[1, 2], [3, 4]])).toBe(true)
      expect(Matrix.IsMatrix([[1]])).toBe(true)
    })

    it(`should return true for a proper non-square matrix`, () => {
      expect(Matrix.IsMatrix([[1, 2], [3, 4], [5, 6]])).toBe(true)
    })

  })

  describe(`Matrix.GetDimensions`, () => {
    it(`should get dimension`, () => {
      expect(Matrix.GetDimensions([[1, 2, 3], [1, 2, 3]])).toEqual([2, 3])
      expect(Matrix.GetDimensions([[1, 2], [1, 2]])).toEqual([2, 2])
      expect(Matrix.GetDimensions([[1], [1]])).toEqual([2, 1])
      expect(Matrix.GetDimensions([[1]])).toEqual([1, 1])
    })

    it(`should throw when not a proper matrix`, () => {
      expect(() => Matrix.GetDimensions([[1], [2], [3, 4]])).toThrow()
    })
  })

  describe(`Matrix.IsSquareMatrix`, () => {
    it(`should determine that matrix is square`, () => {
      const m = [[1, 2], [3, 4]]
      expect(Matrix.IsSquareMatrix(m)).toBe(true)
    })

    it(`should determine that matrix is not square`, () => {
      const m = [[1, 2], [3, 4], [5, 6]]
      expect(Matrix.IsSquareMatrix(m)).toBe(false)
    })

    it(`should throw when not a proper matrix`, () => {
      const m = [[1, 2], [3, 4], [5]]
      expect(() => Matrix.IsSquareMatrix(m)).toThrow()
    })
  })

  it(`should get homogeneous inverse for I3`, () => {
    const M = Matrix.GetIdentity(3)
    const actual = Matrix.HomogeneousInverse(M)
    expect(actual).toEqual(M)
  })

  describe(`Matrix.HomogeneousInverse`, () => {

    it(`should work for an affine transformation`, () => {
      const matrix = [
        [1, 0, 3],
        [0, -1, 3],
        [0, 0, 1],
      ]
      const expected = (Matrix.HomogeneousInverse(matrix))
      const actual = [
        [1, 0, -3],
        [0, -1, 3],
        [0, 0, 1],
      ]
      expect(actual).toEqual(expected)
    })

  })

  it(`should get homogeneous inverse for translation`, () => {
    const A = Matrix.Homogeneous.Translate(1, 2)
    const E = Matrix.Homogeneous.Translate(-1, -2)
    expect(Matrix.HomogeneousInverse(A)).toEqual(E)
    expect(Matrix.HomogeneousInverse(E)).toEqual(A)
  })

  describe(`should get matrix for`, () => {
    it(`stretching along X`, () => {
      const m = [[2, 0], [0, 1]]
      expect(Matrix.StretchX(2)).toEqual(m)
    })

    it(`stretching along Y`, () => {
      const m = [[1, 0], [0, 2]]
      expect(Matrix.StretchY(2)).toEqual(m)
    })

    it(`stretching along X and Y`, () => {
      const m = [[2, 0], [0, 2]]
      expect(Matrix.Stretch(2)).toEqual(m)
    })

    it(`rotation`, () => {
      const m = [[0, -1], [1, 0]]
      const n = Matrix.Rotate(Math.PI / 2)
      m.forEach((_, i) => {
        _.forEach((__, j) => {
          expect(__).toBeCloseTo(n[i][j])
        })
      })
    })

    it(`shearing along X axis`, () => {
      const m = [[1, 2], [0, 1]]
      expect(Matrix.ShearX(2)).toEqual(m)
    })

    it(`shearing along Y axis`, () => {
      const m = [[1, 0], [2, 1]]
      expect(Matrix.ShearY(2)).toEqual(m)
    })
  })

  describe(`should get homogeneous matrix for`, () => {
    it(`translation along X`, () => {
      const m = [[1, 0, 2], [0, 1, 0], [0, 0, 1]]
      expect(Matrix.Homogeneous.TranslateX(2)).toEqual(m)
    })

    it(`translation along Y`, () => {
      const m = [[1, 0, 0], [0, 1, 2], [0, 0, 1]]
      expect(Matrix.Homogeneous.TranslateY(2)).toEqual(m)
    })

    it(`translation along X and Y`, () => {
      const m = [[1, 0, 2], [0, 1, 3], [0, 0, 1]]
      expect(Matrix.Homogeneous.Translate(2, 3)).toEqual(m)
    })

    it(`stretching along X`, () => {
      const m = [[2, 0, 0], [0, 1, 0], [0, 0, 1]]
      expect(Matrix.Homogeneous.StretchX(2)).toEqual(m)
    })

    it(`stretching along Y`, () => {
      const m = [[1, 0, 0], [0, 2, 0], [0, 0, 1]]
      expect(Matrix.Homogeneous.StretchY(2)).toEqual(m)
    })

    it(`stretching along X and Y`, () => {
      const m = [[2, 0, 0], [0, 2, 0], [0, 0, 1]]
      expect(Matrix.Homogeneous.Stretch(2)).toEqual(m)
    })

    it(`rotation`, () => {
      const m = [[0, -1, 0], [1, 0, 0], [0, 0, 1]]
      const n = Matrix.Homogeneous.Rotate(Math.PI / 2)
      m.forEach((_, i) => {
        _.forEach((__, j) => {
          expect(__).toBeCloseTo(n[i][j])
        })
      })
    })

    it(`shearing along X axis`, () => {
      const m = [[1, 2, 0], [0, 1, 0], [0, 0, 1]]
      expect(Matrix.Homogeneous.ShearX(2)).toEqual(m)
    })

    it(`shearing along Y axis`, () => {
      const m = [[1, 0, 0], [2, 1, 0], [0, 0, 1]]
      expect(Matrix.Homogeneous.ShearY(2)).toEqual(m)
    })
  })

})
