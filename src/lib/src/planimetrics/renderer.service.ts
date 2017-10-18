import {Injectable} from '@angular/core'
import {CanvasRenderer} from '../planimetryts/renderers/canvas-renderer'
import {Subject} from 'rxjs'
import {GeometryObject} from '../planimetryts/geometry-objects/everything'
import {Coordinate, Offset} from '../../typings'

@Injectable()
export class RendererService {

  // TODO Make this possible with every Renderer (missing events atm)
  private renderer: CanvasRenderer

  public mouseDown$: Subject<Coordinate>
  public mouseDrag$: Subject<{ logic: Offset, canvas: Offset }>
  public mouseUp$: Subject<Coordinate>
  public mouseScrollUp$: Subject<Coordinate>
  public mouseScrollDown$: Subject<Coordinate>
  public mouseMove$: Subject<{ logic: Coordinate, canvas: Coordinate }>

  public setRenderer(renderer: CanvasRenderer): void {
    this.renderer = renderer
    this.mouseDown$ = this.renderer.mouseDown$
    this.mouseDrag$ = this.renderer.mouseDrag$
    this.mouseUp$ = this.renderer.mouseUp$
    this.mouseScrollUp$ = this.renderer.mouseScrollUp$
    this.mouseScrollDown$ = this.renderer.mouseScrollDown$
    this.mouseMove$ = this.renderer.mouseMove$
  }

  public move(dx: number, dy: number): void {
    this.renderer.move(dx, dy)
  }

  public zoom(towards: Coordinate, value: number): void {
    this.renderer.zoom(towards, value)
  }

  public getTransformationMatrix(): number[][] {
    return this.renderer.appliedMatrix
  }

  constructor() {
  }

  public render(objects: GeometryObject[]): void {
    this.renderer.render(objects)
  }

}
