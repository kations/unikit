export default function construct(componentConstructor, tag, options) {
  /* This is callable directly as a template function */
  // $FlowFixMe: Not typed to avoid destructuring arguments
  const templateFunction = (...args) =>
    componentConstructor(tag, options, css(...args));

  /* If config methods are called, wrap up a new template function and merge options */
  templateFunction.withConfig = config =>
    constructWithOptions(componentConstructor, tag, { ...options, ...config });

  /* Modify/inject new props at runtime */
  templateFunction.attrs = attrs =>
    constructWithOptions(componentConstructor, tag, {
      ...options,
      attrs: Array.prototype.concat(options.attrs, attrs).filter(Boolean)
    });

  return templateFunction;
}
