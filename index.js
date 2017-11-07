const sass = require('node-sass')

module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(/%%styled-jsx-placeholder-(\d+)%%(\w*\s*[);{])/g, (_, id, p1) =>
      `styled-jsx-placeholder-${id}-${p1}`
    )
    .replace(/%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-placeholder-${id}%%*/`
    )

  const preprocessed = sass.renderSync(Object.assign({
    data: cssWithPlaceholders
  }, settings.sassOptions)).css.toString()

  return preprocessed
    .replace(/styled-jsx-placeholder-(\d+)-(\w*\s*[);{])/g, (_, id, p1) =>
      `%%styled-jsx-placeholder-${id}%%${p1}`
    )
    .replace(/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%%`
    )
}
