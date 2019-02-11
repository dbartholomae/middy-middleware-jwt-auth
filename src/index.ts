import debugFactory, { IDebugger } from 'debug'

/** A documented example module */
export default class Module {
  /** The logger used in the module */
  private readonly logger: IDebugger

  /** Creates a new Module */
  constructor () {
    this.logger = debugFactory('module-ts-template')
  }

  /** Starts the module */
  start () {
    this.logger('Starting module')
  }
}
