const sass = require('node-sass').renderSync

module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(/\:\s*%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `: styled-jsx-placeholder-${id}()`
    )
    .replace(/%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-placeholder-${id}%%*/`
    )

  const preprocessed = sass({
    data: cssWithPlaceholders
  }).css.toString()

  return preprocessed
    .replace(/\:\s*styled-jsx-placeholder-(\d+)\(\)/g, (_, id) =>
      `: %%styled-jsx-placeholder-${id}%%`
    )
    .replace(/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%%`
    )
}
