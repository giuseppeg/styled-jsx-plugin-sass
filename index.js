const sass = require('node-sass')

module.exports = (css, settings = {}) => {
  const cssWithPlaceholders = css
    .replace(/\:\s*%%styled-jsx-expression-(\d+)%%/g, (_, id) =>
      `: styled-jsx-expression-${id}()`
    )
    .replace(/%%styled-jsx-expression-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-expression-${id}%%*/`
    )

  // Allow a subset of node-sass options
  const allowedOptions = ['precision', 'includePaths']

  const options = Object.entries(settings).reduce((p, o) => {
    const [k, v] = o
    if (allowedOptions.includes(k)) {
      p[k] = v
    }
    return p
  }, {})

  const preprocessed = sass.renderSync(Object.assign({
    data: cssWithPlaceholders
  }, options)).css.toString()

  return preprocessed
    .replace(/\:\s*styled-jsx-expression-(\d+)\(\)/g, (_, id) =>
      `: %%styled-jsx-expression-${id}%%`
    )
    .replace(/\/\*%%styled-jsx-expression-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-expression-${id}%%`
    )
}
