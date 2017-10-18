import {Injectable} from '@angular/core'
import {flatMap} from 'lodash-es'
import {format} from '../code/code'

type LatexNodeType = 'env' | 'tag' | 'command' | 'math'

type LatexContent = string | LatexNode

interface LatexNode {
  type: LatexNodeType
}

interface LatexNodeEnv extends LatexNode {
  type: 'env'
  name: string
  opts?: string[]
  content: LatexContent[]
}

interface LatexNodeTag extends LatexNode {
  type: 'tag'
  name: string
  opts?: string[]
  content?: LatexContent[]
}

interface LatexNodeCommand extends LatexNode {
  type: 'command',
  name: string,
}

interface LatexNodeMathMode extends LatexNode {
  type: 'math',
  content: string
}

function env(name: string, content: LatexContent[]): LatexNodeEnv
function env(name: string, opts: string[], content: LatexContent[]): LatexNodeEnv
function env(arg1: string, arg2: string[] | LatexContent[], arg3?: LatexContent[]): LatexNodeEnv {
  if (arguments.length == 2) {
    const [name, content] = Array.from(arguments)
    return {
      type: 'env',
      name, content,
    }
  } else if (arguments.length == 3) {
    const [name, opts, content] = Array.from(arguments)
    return {
      type: 'env',
      name, opts, content,
    }
  }
}

function renderEnv(env: LatexNodeEnv): string {
  return `\n\\begin${env.opts == null ? '' : `[${env.opts.join(',')}]`}{${env.name}}\n` +
    `${render(env.content)}`.replace(/^/gm, '  ') +
    `\n\\end{${env.name}}\n`
}

function tag(name: string, content: LatexContent[]): LatexNodeTag
function tag(name: string, opts: string[], content: LatexContent[]): LatexNodeTag
function tag(arg1: string, arg2: string[] | LatexContent[], arg3?: LatexContent[]): LatexNodeTag {
  if (arguments.length == 2) {
    const [name, content] = Array.from(arguments)
    return {
      type: 'tag',
      name, content,
    }
  } else if (arguments.length == 3) {
    const [name, opts, content] = Array.from(arguments)
    return {
      type: 'tag',
      name, opts, content,
    }
  }
}

function usePackage(name: string, options?: string[]): LatexContent[] {
  return [
    tag('usepackage', options, [name]),
    '\n',
  ]
}

function mathMode(content: string): LatexNodeMathMode {
  return {
    type: 'math',
    content,
  }
}

function renderTag(tag: LatexNodeTag): string {
  return `\\${tag.name}` +
    `${tag.opts == null ? '' : `[${tag.opts.join(',')}]`}` +
    `${tag.content ? `{${render(tag.content)}}` : ''}`
}

function command(name: string): LatexNodeCommand {
  return {
    type: 'command',
    name,
  }
}

function renderCommand(command: LatexNodeCommand): string {
  return ` \\${command.name} `
}

function renderMath(math: LatexNodeMathMode): string {
  return `$${math.content}$`
}

function render(node: LatexContent | LatexContent[]): string {
  if (Array.isArray(node)) {
    return node.map(x => render(x)).join('')
  } else {
    if (typeof node === 'string') {
      return sanitizeForLatex(node)
    } else {
      if (node.type == 'env') {
        return renderEnv(<LatexNodeEnv>node)
      } else if (node.type == 'tag') {
        return renderTag(<LatexNodeTag>node)
      } else if (node.type == 'command') {
        return renderCommand(<LatexNodeCommand>node)
      } else if (node.type == 'math') {
        return renderMath(<LatexNodeMathMode>node)
      } else {
        throw new Error(`Unknown node type ${node.type}`)
      }
    }
  }

}

function sanitizeForLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/"/g, `''`)
    // .replace(/'/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/&/g, '\\&')
    .replace(/\_/g, '\\_') // must be last!
}

const languagesMap = new Map<string, string>()
  .set('sr', 'serbian')
  .set('en', 'english')


type Generator = (content: LatexContent[],
                  el: HTMLElement,
                  context: LatexServiceContext) =>
  LatexContent[]

// Map HTMLElement's tagName to a generator function
const htmlTagsMap = new Map<string, Generator>()
  .set('b', c => [tag('textbf', c)])
  .set('strong', c => [tag('textbf', c)])
  .set('i', c => [tag('textit', c)])
  .set('em', c => [tag('textit', c)])
  .set('pre', (c, el) => [env('verbatim', [format`${el.innerText}`])])
  .set('code', c => [tag('texttt', c)])
  .set('div', c => c)
  .set('span', c => c)
  .set('article', (c, el, ctx) => [
    tag('documentclass', ['article']),
    '\n',
    ...usePackage('hyperref'),
    ...usePackage('inputenc', ['utf8']),
    ...usePackage('babel', [languagesMap.get(ctx.language)]),
    ...usePackage('parskip'),
    ...usePackage('microtype'),
    tag('title', [ctx.title]),
    '\n',
    tag('author', [ctx.author]),
    '\n',
    '\n',
    env('document', [
      command('maketitle'),
      ...c,
    ]),
  ])
  .set('p', c => [...c, '\n\n'])
  // .set('a', (c, el: HTMLAnchorElement) => [
  //   ...c,
  //   ' (',
  //   tag('url', [el.href]),
  //   ')',
  // ])
  .set('a', (c, el: HTMLAnchorElement) => [
    ' ',
    ...c,
    tag('footnote', [
      tag('url', [el.href]),
    ]),
  ])
  .set('summary', c => [env('abstract', c)])
  .set('h2', c => [tag('section', c)])
  .set('h3', c => [tag('subsection', c)])
  .set('h4', c => [tag('subsubsection', c)])
  .set('h5', c => [tag('paragraph', c)])
  .set('h6', c => [tag('subparagraph', c)])
  .set('button', c => [])
  .set('abbr', c => [' ', ...c])
  .set('lrn-markdown', (c, el, ctx) => createContent(el.children[1], ctx))
  .set('lrn-digression', (c, el, ctx) => [
    ...createContent(el.children[1], ctx), // TODO smaller font siye
  ])
  .set('ul', c => [env('itemize', c)])
  .set('ol', c => [env('enumerate', c)])
  .set('li', c => [
    command('item'),
    ' ',
    ...c,
    '\n',
  ])
  .set('dl', c => [env('description', c)])
  .set('dt', c => [command('item'), `[`, ...c, `]`])
  .set('dd', c => c)
  .set('blockquote', c => [env('quotation', c)])
  .set('cite', c => ['--', ...c])
  .set('lrn-katex', (_c, el) => [mathMode(el.attributes.getNamedItem('data-original-math').value)])
  .set('math', _ => [])
  .set('semantics', _ => [])
  .set('annotation', _ => [])

function createContent(el: Node, context: LatexServiceContext): LatexContent[] {
  switch (el.nodeType) {
    case Node.TEXT_NODE:
      const text = (el as Text).wholeText
        .replace(/\n/g, '')
        .replace(/\s+/g, ' ')
      return [text]
    case Node.ELEMENT_NODE:
      if (window.getComputedStyle(el as HTMLElement).display == 'none') {
        return []
      }

      const tagName = (el as Element).tagName.toLowerCase()

      const generator = htmlTagsMap.has(tagName)
        ? htmlTagsMap.get(tagName)
        : null

      if (generator == null) {
        console.error(`No idea what to do with tag "${tagName}", so I will ignore it.`, el)
        return []
      }

      const childNodes = Array.from(el.childNodes)
      const content = flatMap(childNodes, childNode => createContent(childNode, context))
      return generator(content, el as HTMLElement, context)
    default:
      return []
  }
}

/**
 * The service used to transform an article (as Notebook component) into a
 * Latex document which can be compiled.
 */
@Injectable()
export class LatexService {

  constructor() {
  }

  public render(el: HTMLElement, context: LatexServiceContext): string {
    return this.transform(el, context)
  }

  private transform(el: HTMLElement, context: LatexServiceContext): string {
    const nodes = createContent(el, context)
    return render(nodes)
  }
}

export interface LatexServiceContext {
  title: string
  author: string
  language: 'en' | 'sr'
}
