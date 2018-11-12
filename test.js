const assert = require('assert')
const path = require('path')
const fs = require('fs')
const stripIndent = require('strip-indent')
const plugin = require('./')

const cleanup = str => stripIndent(str).trim()

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
  })

  it("does not add space after variable placeholder", () => {
    assert.equal(
      plugin('p { img { color: %%styled-jsx-placeholder-0%%px; } }', {}).trim(),
      cleanup(`
        p img {
          color: %%styled-jsx-placeholder-0%%px; }
      `)
    )
  })

  it("works with placeholders in css functions", () => {
    assert.equal(
      plugin('div { grid-template-columns: repeat(%%styled-jsx-placeholder-0%%, calc(%%styled-jsx-placeholder-1%%% - %%styled-jsx-placeholder-2%%px)); }', {}).trim(),
      cleanup(`
        div {
          grid-template-columns: repeat(%%styled-jsx-placeholder-0%%, calc(%%styled-jsx-placeholder-1%%% - %%styled-jsx-placeholder-2%%px)); }
      `)
    )
  })

  it('works with placeholders', () => {
    assert.equal(
      plugin(`
        p { 
          img { display: block } color: %%styled-jsx-placeholder-0%%; border-bottom: 1px solid %%styled-jsx-placeholder-1%%; 
          em { color: %%styled-jsx-placeholder-2%% !important; }
        }
        %%styled-jsx-placeholder-1%%`,
        {}
      ).trim(),
      cleanup(`
        p {
          color: %%styled-jsx-placeholder-0%%;
          border-bottom: 1px solid %%styled-jsx-placeholder-1%%; }
          p img {
            display: block; }
          p em {
            color: %%styled-jsx-placeholder-2%% !important; }

        %%styled-jsx-placeholder-1%%
      `)
    )
  })

  it('works with media queries placeholders', () => {
    assert.equal(
      plugin(`
        p {
          display: block;
          @media %%styled-jsx-placeholder-0%% { color: red; }
          @media (min-width: %%styled-jsx-placeholder-0%%px) { color: blue; }
          @media (min-width: %%styled-jsx-placeholder-0%%) { color: yellow; }
        }`,
        {}
      ).trim(),
      cleanup(`
        p {
          display: block; }
          @media %%styled-jsx-placeholder-0%% {
            p {
              color: red; } }
          @media (min-width: %%styled-jsx-placeholder-0%%px) {
            p {
              color: blue; } }
          @media (min-width: %%styled-jsx-placeholder-0%%) {
            p {
              color: yellow; } }
      `)
    )
  })

  it('works with selectors placeholders', () => {
    assert.equal(
      plugin('p { display: block; %%styled-jsx-placeholder-0%% { color: red; } }', {}).trim(),
      cleanup(`
        p {
          display: block; }
          p %%styled-jsx-placeholder-0%% {
            color: red; }
      `)
    )
  })

  it('works with @import', () => {
    assert.equal(
      plugin('@import "fixtures/fixture"; p { color: red }', {}).trim(),
      cleanup(`
        div {
          color: red; }

        p {
          color: red; }
      `)
    )
  })

  it('works with relative @import', () => {
    const filename = 'fixtures/entry.scss'
    const file = fs.readFileSync(path.join(__dirname, filename))

    assert.equal(
      plugin(file.toString(), {
        sassOptions: {
          includePaths: [path.join(__dirname, 'fixtures')]
        },
        babel: { filename }
      }).trim(),
      cleanup(`
        * {
          font-family: "Comic Sans MS" !important; }

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
  })
})
