const sass = require('node-sass');
const path = require('path');

module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(/%%styled-jsx-placeholder-(\d+)%%(\w*\s*[),;!{])/g, (_, id, p1) =>
      `styled-jsx-placeholder-${id}-${p1}`
    )
    .replace(/%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-placeholder-${id}%%*/`
    )

  // Add the directory containing the current file to includePaths to enable relative
  // imports, only works when the filename is provided
  const includePaths = settings.sassOptions && settings.sassOptions.includePaths || [];
  
  if (settings.babel && settings.babel.filename) {
    includePaths.push(path.dirname(settings.babel.filename));
  }

  // Prepend option data to cssWithPlaceholders
  const optionData = settings.sassOptions && settings.sassOptions.data || "";
  const data = optionData + "\n" + cssWithPlaceholders;

  const preprocessed = sass.renderSync(
    Object.assign(
      {},
      settings.sassOptions,
      { data },
      { includePaths }
    )).css.toString()

  return preprocessed
    .replace(/styled-jsx-placeholder-(\d+)-(\w*\s*[),;!{])/g, (_, id, p1) =>
      `%%styled-jsx-placeholder-${id}%%${p1}`
    )
    .replace(/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%%`
    )
}
