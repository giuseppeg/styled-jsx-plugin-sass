const sass = require('node-sass').renderSync

module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(/\:\s*%%styled-jsx-(expression|placeholder)-(\d+)%%/g, (_, p, id) =>
      `: styled-jsx-${p}-${id}()`
    )
    .replace(/%%styled-jsx-(expression|placeholder)-(\d+)%%/g, (_, p, id) =>
      `/*%%styled-jsx-${p}-${id}%%*/`
    )

  const preprocessed = sass({
    data: cssWithPlaceholders
  }).css.toString()

  return preprocessed
    .replace(/\:\s*styled-jsx-(expression|placeholder)-(\d+)\(\)/g, (_, p, id) =>
      `: %%styled-jsx-${p}-${id}%%`
    )
    .replace(/\/\*%%styled-jsx-(expression|placeholder)-(\d+)%%\*\//g, (_, p, id) =>
      `%%styled-jsx-${p}-${id}%%`
    )
}
