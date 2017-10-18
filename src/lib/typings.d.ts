/** tslint:disable */
// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

///<reference path="Path2D.d.ts"/>

export declare module 'katex' {

  interface KatexOptions {
    /**
     * If true the math will be rendered in display mode, which will put the math in display
     * style (so \int and \sum are large, for example), and will center the math on the page
     * on its own line. If false the math will be rendered in inline mode. (default: false)
     */
    displayMode?: boolean
    /**
     * throwOnError: boolean. If true, KaTeX will throw a ParseError when it encounters an
     * unsupported command. If false, KaTeX will render the unsupported command as text in
     * the color given by errorColor. (default: true)
     */
    throwOnError?: boolean
    /**
     * errorColor: string. A color string given in the format "#XXX" or "#XXXXXX". This
     * option determines the color which unsupported commands are rendered in.
     * (default: #cc0000)
     */
    errorColor?: string
  }

  export const render: (str: string, element: HTMLElement, options?: KatexOptions) => void
  export const renderToString: (str: string, options?: KatexOptions) => string

}
