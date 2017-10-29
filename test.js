const assert = require('assert')
const stripIndent = require('strip-indent')
const plugin = require('./')

const cleanup = str => stripIndent(str).trim();

describe('styled-jsx-plugin-sass', () => {

  it('applies plugins', () => {
    assert.equal(
      plugin('p { img { display: block} color: color(red a(90%)) }', {}).trim(),
      cleanup(`
        p {
          color: color(red a(90%)); }
          p img {
            display: block; }
      `)
    )
  });

  it('works with placeholders', () => {
    assert.equal(
      plugin('p { img { display: block } color: %%styled-jsx-placeholder-0%%; } %%styled-jsx-placeholder-1%%', {}).trim(),
      cleanup(`
        p {
          color: %%styled-jsx-placeholder-0%%; }
          p img {
            display: block; }

        %%styled-jsx-placeholder-1%%
      `)
    )
  });

  it('works with selectors and media queries placeholders', () => {
    assert.equal(
      plugin('p { display: block; @media %%styled-jsx-placeholder-0%% { color: red; } }', {}).trim(),
      cleanup(`
        p {
          display: block; }
          @media %%styled-jsx-placeholder-0%% {
            p {
              color: red; } }
      `)
    )
  });

  it('works with @import', () => {
    assert.equal(
      plugin('@import "fixture"; p { color: red }', {}).trim(),
      cleanup(`
        div {
          color: red; }

        p {
          color: red; }
      `)
    )
  });

  it('applies sassOptions', () => {
    assert.equal(
      plugin('div { padding: (1 / 3) * 1em }', {
        sassOptions: {
          precision: 1
        }
      }).trim(),
      cleanup(`
        div {
          padding: 0.3em; }
      `)
    )
  });
});
