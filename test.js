const assert = require('assert')
const stripIndent = require('strip-indent')
const plugin = require('./')

const cleanup = str => stripIndent(str).trim()

describe('styled-jsx-plugin-sass', () => {
  it('applies plugins', () => {
    assert.equal(
      plugin('p { img { display: block} color: color(red a(90%)) }').trim(),
      cleanup(`
        p {
          color: color(red a(90%)); }
          p img {
            display: block; }
      `)
    )
  })

  it('works with expressions placeholders', () => {
    assert.equal(
      plugin('p { img { display: block } color: %%styled-jsx-expression-1%%; } %%styled-jsx-expression-1%%').trim(),
      cleanup(`
        p {
          color: %%styled-jsx-expression-1%%; }
          p img {
            display: block; }

        %%styled-jsx-expression-1%%
      `)
    )
  })

  it('works with @import', () => {
    assert.equal(
      plugin('@import "fixture"; p { color: red }').trim(),
      cleanup(`
        div {
          color: red; }

        p {
          color: red; }
      `)
    )
  })
})
