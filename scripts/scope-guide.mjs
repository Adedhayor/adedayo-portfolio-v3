import postcss from 'postcss'
import fs from 'node:fs'
const ast = postcss.parse(fs.readFileSync('src/guide-source.css', 'utf8'))
ast.walkRules(rule => {
  rule.selectors = rule.selectors.map(selector => {
    if (selector.includes('.guide-page')) return selector
    if (selector === 'html' || selector === 'body') return '.guide-page'
    return `.guide-page ${selector}`
  })
})
fs.writeFileSync('src/guide.css', ast.toString() + '\n.guide-page { min-height: 100vh; }\n.guide-page a:focus-visible { outline: 2px solid var(--red); outline-offset: 4px; }\n')
