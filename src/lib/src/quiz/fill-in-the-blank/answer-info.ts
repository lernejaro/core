export type AnswerInfoFeedback = (isCorrect: boolean, givenAnswer: string) => string

export interface AnswerInfo {
  name: string
  correct: boolean
  answer: string
  hint: string
  feedback: string
}
