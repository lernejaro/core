import {EvaluateFunction} from '../../../planimetrics/planimetrics.component'
import {AxisConfiguration} from './axis.interface'
import {Line, Point, RectangularArea, Segment} from '../everything'

const arrayGen = length => Array.from({length}).map((_, index) => index)

interface ExpandedAxisConfiguration {
  hideX: boolean
  hideY: boolean
  hideNotchesX: boolean
  hideNotchesY: boolean
  hideNumbersX: boolean
  hideNumbersY: boolean
  notchDistanceX: number
  notchDistanceY: number
  notchLength: number
}

function expandAxisConfiguration(configuration: AxisConfiguration = {}): ExpandedAxisConfiguration {
  const {
    hideX = false,
    hideY = false,
    hideNotchesX = hideX,
    hideNotchesY = hideY,
    hideNumbersX = hideNotchesX,
    hideNumbersY = hideNotchesY,
    notchDistanceX = 50,
    notchDistanceY = 50,
    notchLength = 6,
  } = configuration
  return {
    hideX,
    hideY,
    hideNotchesX,
    hideNotchesY,
    hideNumbersX,
    hideNumbersY,
    notchDistanceX,
    notchDistanceY,
    notchLength,
  }
}

const horizontalNotch = (length, x, y) =>
  Segment.FromGeneralForm(x - length / 2, y, x + length / 2, y)

const verticalNotch = (length, x, y) =>
  Segment.FromGeneralForm(x, y - length / 2, x, y + length / 2)

const firstGreaterThanAndDivisibleBy = (lowerLimit: number, moduo: number): number => {
  const overhead = lowerLimit % moduo
  return lowerLimit - overhead
}

const firstLessThanAndDivisibleBy = (upperLimit: number, moduo: number): number => {
  const overhead = upperLimit % moduo
  return upperLimit - overhead
}

const rangeGenerator = (lo: number, hi: number, step: number = 1): number[] => {
  return arrayGen((hi - lo) / step + 1).map(n => n * step).map(n => n + lo)
}

export function Axis(configuration: AxisConfiguration = {}): EvaluateFunction {
  const expandedConfiguration = expandAxisConfiguration(configuration)

  return function evaluate({inverseTransformationMatrix}) {
    const w = 600 // TODO: Do not assume these but send to evaluate function
    const h = 600 // TODO: Do not assume these but send to evaluate function

    // TODO "visibleArea" should be sent to evaluate function as well
    const matrix = inverseTransformationMatrix
    const point1 = Point.FromCartesianCoordinates(0, 0).applyMatrix(matrix)
    const point2 = Point.FromCartesianCoordinates(w, h).applyMatrix(matrix)
    const visibleArea: RectangularArea = RectangularArea.FromTwoPoints(point1, point2)

    const xAxisSegment = visibleArea.getCapturedSegment(Line.X_AXIS)
    const yAxisSegment = visibleArea.getCapturedSegment(Line.Y_AXIS)

    let xNotches = []
    if (xAxisSegment != null) {
      const [lo, hi] = xAxisSegment.getPoints()
        .sort((a, b) => a.x() < b.x() ? -1 : 1)
        .map(point => point.x())
      const {notchDistanceX: step} = expandedConfiguration
      const from = firstGreaterThanAndDivisibleBy(lo, step)
      const to = firstLessThanAndDivisibleBy(hi, step)
      xNotches = rangeGenerator(from, to, step)
        .map(x => verticalNotch(expandedConfiguration.notchLength, x, 0))
    }

    let yNotches = []
    if (yAxisSegment != null) {
      const [lo, hi] = yAxisSegment.getPoints()
        .sort((a, b) => a.y() < b.y() ? -1 : 1)
        .map(point => point.y())
      const {notchDistanceY: step} = expandedConfiguration
      const from = firstGreaterThanAndDivisibleBy(lo, step)
      const to = firstLessThanAndDivisibleBy(hi, step)
      yNotches = rangeGenerator(from, to, step)
        .map(y => horizontalNotch(expandedConfiguration.notchLength, 0, y))
    }

    return [
      ...(!expandedConfiguration.hideX ? [Line.X_AXIS] : []),
      ...(!expandedConfiguration.hideY ? [Line.Y_AXIS] : []),
      ...(!expandedConfiguration.hideNotchesX ? xNotches : []),
      ...(!expandedConfiguration.hideNotchesY ? yNotches : []),
    ]
  }
}
