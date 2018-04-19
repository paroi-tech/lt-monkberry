export interface MonkberryView {
  update(state: any): void
  querySelector(query: string): Element | null
  readonly nodes: Node[]
}

export interface LtMonkberryReferences {
  [ref: string]: Element[]
}

export interface LtMonkberryView extends MonkberryView {
  rootEl<T = Element>(): T
  ref<T = Element>(ref: string): T
  readonly references: LtMonkberryReferences
}

/**
 * Each function can return an `Element` or an array of `Element`, which will been appended as children to `el`. Or it can return nothing if the calls to `el.appendChild` have already been done by the function.
 */
export interface LtMonkberryPlaceholders {
  [placeholder: string]: (el: Element) => Element | Element[] | undefined
}

export interface LtMonkberryRenderOptions {
  placeholders?: LtMonkberryPlaceholders
  [optionName: string]: any
}