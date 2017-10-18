import {LispInterpreter} from './lisp'

const lisp = new LispInterpreter()

describe(`Lisp interpreter`, () => {

  describe(`Basic`, () => {

    it(`should interpret a single atom (number)`, () => {
      expect(lisp.handle(`1`)).toEqual(`1`)
    })

    it(`should interpret a list of a single number`, () => {
      expect(lisp.handle(`(1)`)).toEqual(`(1)`)
    })

    it(`should interpret a list of two numbers`, () => {
      expect(lisp.handle(`(1 2)`)).toEqual(`(1 2)`)
    })

    it(`should not care for whitespace`, () => {
      expect(lisp.handle(`  (  1     2 )`)).toEqual(`(1 2)`)
    })

    it(`should interpret a simple nested list`, () => {
      expect(lisp.handle(`(1 (2 3))`)).toEqual(`(1 (2 3))`)
    })

    it(`should interpret another simple ensted list`, () => {
      expect(lisp.handle(`((1 2) (3 4))`)).toEqual(`((1 2) (3 4))`)
    })

  })

  describe(`Arithmetic binary operations`, () => {

    it(`should add two numbers`, () => {
      expect(lisp.handle(`(+ 1 2)`)).toEqual(`3`)
    })

    it(`should subtract two numbers`, () => {
      expect(lisp.handle(`(- 10 4)`)).toEqual(`6`)
    })

    it(`should multiply two numbers`, () => {
      expect(lisp.handle(`(* 2 3)`)).toEqual(`6`)
    })

    it(`should divide two numbers`, () => {
      expect(lisp.handle(`(/ 6 4)`)).toEqual(`1.5`)
    })

    it(`should take absolute value`, () => {
      expect(lisp.handle(`(abs -1)`)).toEqual(`1`)
      expect(lisp.handle(`(abs 1)`)).toEqual(`1`)
    })

    it(`should take a square root`, () => {
      expect(lisp.handle(`(sqrt 4)`)).toEqual(`2`)
      expect(lisp.handle(`(sqrt 9)`)).toEqual(`3`)
    })

  })

  describe(`Nested calculations`, () => {

    it(`should work`, () => {
      expect(lisp.handle(`(+ 1 2 (+ 3 4 (+ 5)))`)).toEqual(`15`)
    })

  })

  describe(`Arithmetic n-ary operations`, () => {

    it(`should add three numbers`, () => {
      expect(lisp.handle(`(+ 1 2 3)`)).toEqual(`6`)
    })

    it(`should add 10 numbers`, () => {
      expect(lisp.handle(`(+ 1 2 3 4 5 6 7 8 9 10)`)).toEqual(`55`)
    })

  })

  describe(`Numerical comparisons`, () => {

    it(`should determine that two same numbers are equal`, () => {
      expect(lisp.handle(`(= 1 1)`)).toEqual(`t`)
    })

    it(`should determine that two different numbers are not equal`, () => {
      expect(lisp.handle(`(= 1 2)`)).toEqual(`nil`)
    })

    it(`should determine a lesser number`, () => {
      expect(lisp.handle(`(< 3 4)`)).toEqual(`t`)
      expect(lisp.handle(`(< 4 3)`)).toEqual(`nil`)
    })

    it(`should determine a larger number`, () => {
      expect(lisp.handle(`(> 3 4)`)).toEqual(`nil`)
      expect(lisp.handle(`(> 4 3)`)).toEqual(`t`)
    })

  })

  describe(`First/last combinations`, () => {

    it(`should CAR`, () => {
      expect(lisp.handle(`(car (1 2 3))`)).toEqual(`1`)
    })

    it(`should CDR`, () => {
      expect(lisp.handle(`(cdr (1 2 3))`)).toEqual(`(2 3)`)
    })

    it(`should CADR`, () => {
      expect(lisp.handle(`(cadr (1 2 3 4))`)).toEqual(`2`)
    })

    it(`should CDDR`, () => {
      expect(lisp.handle(`(cddr (1 2 3 4))`)).toEqual(`(3 4)`)
    })

  })


})
