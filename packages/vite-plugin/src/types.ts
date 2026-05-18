export interface AuraPluginOptions {
  /**
   * Whether to strip the MutationObserver runtime for static sites
   * that don't have dynamically injected aura elements.
   * @default false
   */
  staticOnly?: boolean

  /**
   * Whether to strip the IntersectionObserver reveal runtime when
   * no [reveal] attributes are detected in the HTML entry point.
   * @default true
   */
  treeshakeReveal?: boolean
}
