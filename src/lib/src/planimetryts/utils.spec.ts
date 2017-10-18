import {Equation, radianToDegree, degreeToRadian} from './util'

describe(`Angle conversion`, () => {

    it(`should convert radians to degrees`, () => {
        expect(radianToDegree(0)).toBeCloseTo(0)
        expect(radianToDegree(1)).toBeCloseTo(57.2958)
        expect(radianToDegree(-1)).toBeCloseTo(-57.2958)
        expect(radianToDegree(3.14159)).toBeCloseTo(179.999848)
        expect(radianToDegree(42)).toBeCloseTo(2406.42)
    })

    it(`should convert degrees to radians`, () => {
        expect(degreeToRadian(0)).toBeCloseTo(0)
        expect(degreeToRadian(1)).toBeCloseTo(0.0174533)
        expect(degreeToRadian(-1)).toBeCloseTo(-0.0174533)
        expect(degreeToRadian(180)).toBeCloseTo(3.14159)
        expect(degreeToRadian(42)).toBeCloseTo(0.733038)
    })

})

describe(`Equation`, () => {

    xdescribe(`Linear`, () => {



    })

    describe(`Quadratic`, () => {

        describe(`should get discriminant for`, () => {
            it(`non-zero A, B, C`, () => {
                const D = Equation.Quadratic.getDiscriminant(1, -5, 6)
                expect(D).toBeCloseTo(1)
            })

            it(`C = 0`, () => {
                const D = Equation.Quadratic.getDiscriminant(1, -2, 0)
                expect(D).toBeCloseTo(4)
            })

            it(`B = 0`, () => {
                const D = Equation.Quadratic.getDiscriminant(1, 0, -4)
                expect(D).toBeCloseTo(16)
            })

            it(`B = C = 0`, () => {
                const D = Equation.Quadratic.getDiscriminant(1, 0, 0)
                expect(D).toBeCloseTo(0)
            })

            it(`D = 0 and non-zero A, B, C`, () => {
                const D = Equation.Quadratic.getDiscriminant(1, -2, 1)
                expect(D).toBeCloseTo(0)
            })

            it(`impossible to solve`, () => {
                const solutions = Equation.Quadratic.numberOfSolutions(1, 0, 1)
                expect(solutions).toBe(0)
            })

            it(`should throw if A = 0`, () => {
                expect(() => Equation.Quadratic.getDiscriminant(0, 1, 2)).toThrow()
            })
        })

        describe(`should get number of solutions for`, () => {
            it(`non-zero A, B, C`, () => {
                const solutions = Equation.Quadratic.numberOfSolutions(1, -5, 6)
                expect(solutions).toBe(2)
            })

            it(`C = 0`, () => {
                const solutions = Equation.Quadratic.numberOfSolutions(1, -2, 0)
                expect(solutions).toBe(2)
            })

            it(`B = 0`, () => {
                const solutions = Equation.Quadratic.numberOfSolutions(1, 0, -4)
                expect(solutions).toBe(2)
            })

            it(`B = C = 0`, () => {
                const solutions = Equation.Quadratic.numberOfSolutions(1, 0, 0)
                expect(solutions).toBe(1)
            })

            it(`D = 0 and non-zero A, B, C`, () => {
                const solutions = Equation.Quadratic.numberOfSolutions(1, -2, 1)
                expect(solutions).toBe(1)
            })

            it(`impossible to solve`, () => {
                const solutions = Equation.Quadratic.numberOfSolutions(1, 0, 1)
                expect(solutions).toBe(0)
            })

            it(`should throw if A = 0`, () => {
                expect(() => Equation.Quadratic.numberOfSolutions(0, 1, 2)).toThrow()
            })
        })

        describe(`should get solutions for`, () => {
            it(`non-zero A, B, C`, () => {
                const solutions = Equation.Quadratic.solve(1, -5, 6)
                expect(solutions.length).toBe(2)
                expect(solutions[0]).toBeCloseTo(2)
                expect(solutions[1]).toBeCloseTo(3)
            })

            it(`C = 0`, () => {
                const solutions = Equation.Quadratic.solve(1, -2, 0)
                expect(solutions.length).toBe(2)
                expect(solutions[0]).toBeCloseTo(0)
                expect(solutions[1]).toBeCloseTo(2)
            })

            it(`B = 0`, () => {
                const solutions = Equation.Quadratic.solve(1, 0, -4)
                expect(solutions.length).toBe(2)
                expect(solutions[0]).toBeCloseTo(-2)
                expect(solutions[1]).toBeCloseTo(+2)
            })

            it(`B = C = 0`, () => {
                const solutions = Equation.Quadratic.solve(1, 0, 0)
                expect(solutions.length).toBe(1)
                expect(solutions[0]).toBeCloseTo(0)
            })

            it(`D = 0 and non-zero A, B, C`, () => {
                const solutions = Equation.Quadratic.solve(1, -2, 1)
                expect(solutions.length).toBe(1)
                expect(solutions[0]).toBeCloseTo(1)
            })

            it(`impossible to solve`, () => {
                const solutions = Equation.Quadratic.solve(1, 0, 1)
                expect(solutions).toEqual([])
            })

            it(`should throw if A = 0`, () => {
                expect(() => Equation.Quadratic.solve(0, 1, 2)).toThrow()
            })
        })

    })

})
