import {Coordinate} from '../../typings'

export function cartesianToPolar(x: number, y: number): { r: number, φ: number } {
  const r = Math.sqrt(x * x + y * y)
  const φ = Math.atan2(y, x)
  return {r, φ}
}

export function polarToCartesian(r: number, φ: number): Coordinate {
  const x = r * Math.cos(φ)
  const y = r * Math.sin(φ)
  return {x, y}
}

export function radianToDegree(angleRadian: number): number {
  return angleRadian * 57.2958
}

export function degreeToRadian(angleDegree: number): number {
  return angleDegree * 0.0174533
}

export function areEqualFloats(a: number, b: number, eps: number = 1e-6): boolean {
  return Math.abs(a - b) < eps
}

export function isZero(n: number, eps: number = 1e-6): boolean {
  return areEqualFloats(n, 0, eps)
}

export namespace Equation {

  // Ax + B = 0
  export namespace Linear {

  }

  // Ax² + Bx + C = 0
  export namespace Quadratic {

    function check(A: number, B: number, C: number): void {
      if (isZero(A)) {
        throw 'First coefficient cannot be zero in a quadratic'
      }
    }

    export function getDiscriminant(A: number, B: number, C: number): number {
      check(A, B, C)
      return B ** 2 - 4 * A * C
    }

    export function numberOfSolutions(A: number, B: number, C: number): number {
      check(A, B, C)
      const D = getDiscriminant(A, B, C)
      if (isZero(D)) {
        return 1
      } else {
        return D > 0 ? 2 : 0
      }
    }

    export function solve(A: number, B: number, C: number): number[] {
      check(A, B, C)
      const n = numberOfSolutions(A, B, C)
      if (n == 0) {
        return []
      }
      const D = getDiscriminant(A, B, C)
      if (isZero(D)) {
        return [-B / (2 * A)]
      } else {
        const sqrtD = Math.sqrt(D)
        return [(-B - sqrtD) / (2 * A), (-B + sqrtD) / (2 * A)]
      }
    }

  }

}
