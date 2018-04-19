import { render as mbRender } from "monkberry"
import { LtMonkberryRenderOptions, LtMonkberryView, LtMonkberryReferences } from "./exported-definitions";

export function render(template: any, options: LtMonkberryRenderOptions = {}): LtMonkberryView {
  let Ref = makeRefDirective()
  let directives = {
    ref: Ref,
    placeholder: makePlaceholderDirective(options.placeholders)
  }
  options.directives = options.directives ? { ...options.directives, ...directives } : directives
  let view = mbRender(template, document.createElement("div"), options) as LtMonkberryView
  Object.defineProperties(view, {
    references: {
      get: () => {
        return Ref.references
      }
    }
  });
  view.rootEl = () => {
    if (view.nodes.length !== 1)
      throw new Error(`The root element must be a single element (${view.nodes.length})`)
    return view.nodes[0] as any
  }
  view.ref = name => {
    if (!Ref.references[name] || Ref.references[name].length !== 1)
      throw new Error(`Cannot find a single node "${name}" (${Ref.references[name] ? Ref.references[name].length : 0})`)
    return Ref.references[name][0] as any
  }
  return view
}

function makeRefDirective() {
  class Ref {
    static references: LtMonkberryReferences = {}

    private node?: Element
    private name?: string
    bind(node) {
      let oldNode = this.node
      this.node = node
      if (this.name === undefined)
        return
      if (oldNode !== node)
        deleteNode(this.name, oldNode)
      addNode(this.name, this.node)
    }

    unbind() {
      if (this.name !== undefined)
        deleteNode(this.name, this.node)
      this.node = undefined
    }

    update(name) {
      if (typeof name !== "string")
        throw new Error(`The ':ref' type should be 'string' (current: ${typeof name})`)
      let oldName = this.name
      this.name = name
      if (!this.node)
        return
      if (oldName !== undefined && oldName !== name)
        deleteNode(oldName, this.node)
      addNode(this.name, this.node)
    }
  }
  return Ref
  function addNode(name, node) {
    if (!Ref.references[name])
      Ref.references[name] = []
    Ref.references[name].push(node)
  }
  function deleteNode(name, node) {
    if (!Ref.references[name])
      return
    let index = Ref.references[name].indexOf(node)
    if (index !== -1)
      Ref.references[name].splice(index, 1)
  }
}

function makePlaceholderDirective(placeholders) {
  return class Placeholder {
    private node?: Element
    private name?: string
    bind(node) {
      if (this.node) {
        if (this.node !== node)
          throw new Error(`Cannot bind a placeholder on several nodes`)
        return
      }
      this.node = node
      if (this.name !== undefined)
        fill(this.name, this.node)
    }

    unbind() {
      throw new Error(`Cannot unbind a placeholder`)
    }

    update(name) {
      if (typeof name !== "string")
        throw new Error(`The ':ref' type should be 'string' (current: ${typeof name})`)
      if (this.name !== undefined) {
        if (this.name !== name)
          throw new Error(`Cannot bind a placeholder on several names (${this.name}, ${name})`)
        return
      }
      this.name = name
      if (this.node)
        fill(this.name, this.node)
    }
  }

  function fill(name, node) {
    if (!placeholders[name])
      throw new Error(`Unknown placeholder: ${name}`)
    let result = placeholders[name](node)
    if (result) {
      if (Array.isArray(result)) {
        for (let child of result)
          node.appendChild(child)
      } else
        node.appendChild(result)
    }
  }
}