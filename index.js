const sass = require('node-sass').renderSync

module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(/\:\s*%%styled-jsx-expression-(\d+)%%/g, (_, id) =>
      `: styled-jsx-expression-${id}()`
    )
    .replace(/%%styled-jsx-expression-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-expression-${id}%%*/`
    )

  const preprocessed = sass({
    data: cssWithPlaceholders
  }).css.toString()

  return preprocessed
    .replace(/\:\s*styled-jsx-expression-(\d+)\(\)/g, (_, id) =>
      `: %%styled-jsx-expression-${id}%%`
    )
    .replace(/\/\*%%styled-jsx-expression-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-expression-${id}%%`
    )
}
