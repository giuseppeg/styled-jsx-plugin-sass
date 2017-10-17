const assert = require('assert')
const stripIndent = require('strip-indent')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const sass = require('node-sass')

const cleanup = str => stripIndent(str).trim()

describe('styled-jsx-plugin-sass', () => {
  let plugin

  before(() => {
    plugin = require('./')
  })

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

  describe('node-sass options', () => {
    let spy

    before(() => {
      spy = sinon.spy(sass, 'renderSync');
      plugin = proxyquire('./', {
        'node-sass': {
          renderSync: spy
        }
      })
    })

    it('allows "precision" to be set', () => {
      plugin('p { color: red; }', {
        precision: 2
      })
      sinon.assert.calledWithMatch(spy, { precision: 2 })
    })

    it('it allows "includePaths" to be set', () => {
      plugin('p { color: red; }', {
        includePaths: ['./foo']
      })
      sinon.assert.calledWithMatch(spy, { includePaths: ['./foo'] })
    })

    it('does not allow unsupported options', () => {
      plugin('p { color: red; }', {
        foo: 'bar'
      })
      sinon.assert.neverCalledWithMatch(spy, { foo: 'bar' })
    })
  })
})
