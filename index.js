const sass = require('node-sass');

module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(/:\s*%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `: styled-jsx-placeholder-${id}()`
    )
    .replace(/%%styled-jsx-placeholder-(\d+)%%\s*{/g, (_, id) =>
      `styled-jsx-placeholder-${id} {`
    )
    .replace(/%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-placeholder-${id}%%*/`
    )

  const preprocessed = sass.renderSync(Object.assign({
    data: cssWithPlaceholders
  }, settings.sassOptions)).css.toString()

  return preprocessed
    .replace(/:\s*styled-jsx-placeholder-(\d+)\(\)/g, (_, id) =>
      `: %%styled-jsx-placeholder-${id}%%`
    )
    .replace(/styled-jsx-placeholder-(\d+)\s*{/g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%% {`
    )
    .replace(/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%%`
    )
}
