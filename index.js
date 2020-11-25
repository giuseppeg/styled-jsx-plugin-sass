module.exports = (css, settings) => {
  const sass = getSassImplementation();

  const cssWithPlaceholders = css
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%(\w*\s*[),;!{])/g,
      (_, id, p1) => `styled-jsx-placeholder-${id}-${p1}`
    )
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%/g,
      (_, id) => `/*%%styled-jsx-placeholder-${id}%%*/`
    );

  // Prepend option data to cssWithPlaceholders
  const optionData = (settings.sassOptions && settings.sassOptions.data) || '';
  const data = optionData + '\n' + cssWithPlaceholders;

  const preprocessed = sass
    .renderSync(Object.assign({}, settings.sassOptions, {data}))
    .css.toString();

  return preprocessed
    .replace(
      /styled-jsx-placeholder-(\d+)-(\w*\s*[),;!{])/g,
      (_, id, p1) => `%%styled-jsx-placeholder-${id}%%${p1}`
    )
    .replace(
      /\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g,
      (_, id) => `%%styled-jsx-placeholder-${id}%%`
    );
};

function getSassImplementation() {
  let sassImplPkg = 'sass';

  try {
    require.resolve('sass');
  } catch {
    try {
      require.resolve('node-sass');
      sassImplPkg = 'node-sass';
    } catch {
      sassImplPkg = 'sass';
    }
  }
  return require(sassImplPkg);
}
