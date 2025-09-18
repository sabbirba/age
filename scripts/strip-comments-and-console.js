#!/usr/bin/env node
const fs = require('fs-extra');
const globbyPkg = require('globby');
const globby = typeof globbyPkg === 'function' ? globbyPkg : globbyPkg.globby || globbyPkg.default || globbyPkg;
const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
const generate = require('@babel/generator');

async function main() {
  const patterns = ['src/**/*.{js,jsx,ts,tsx}'];
  const paths = await globby(patterns, { gitignore: true });
  if (!paths.length) {
    console.log('No source files found.');
    return;
  }

  for (const filePath of paths) {
    try {
      const code = await fs.readFile(filePath, 'utf8');
      let ast;
      try {
        ast = parser.parse(code, {
          sourceType: 'module',
          plugins: [
            'typescript',
            'jsx',
            'classProperties',
            'decorators-legacy',
            'optionalChaining',
            'nullishCoalescingOperator',
            'topLevelAwait',
          ],
        });
      } catch (err) {
        console.error(`Parse failed for ${filePath}: ${err.message}`);
        continue;
      }
      const traverseFn =
        typeof traverse === 'function'
          ? traverse
          : traverse && traverse.default
            ? traverse.default
            : traverse;

      traverseFn(ast, {
        enter(path) {
          if (path.isExpressionStatement()) {
            const expr = path.node.expression;
            if (
              expr &&
              expr.type === 'CallExpression' &&
              expr.callee &&
              expr.callee.type === 'MemberExpression'
            ) {
              const obj = expr.callee.object;
              if (obj && obj.type === 'Identifier' && obj.name === 'console') {
                path.remove();
                return;
              }
            }
          }
          if (path.isAssignmentExpression()) {
            const left = path.node.left;
            if (
              left &&
              left.type === 'MemberExpression' &&
              left.object &&
              left.object.type === 'Identifier' &&
              left.object.name === 'console'
            ) {
              if (path.parentPath && path.parentPath.isExpressionStatement()) {
                path.parentPath.remove();
              } else {
                path.remove();
              }
              return;
            }
          }
          if (path.isExpressionStatement() && path.node.expression.type === 'MemberExpression') {
            const me = path.node.expression;
            if (me.object && me.object.type === 'Identifier' && me.object.name === 'console') {
              path.remove();
              return;
            }
          }
        },
      });
      traverseFn(ast, {
        enter(path) {
          if (path.node && path.node.leadingComments) delete path.node.leadingComments;
          if (path.node && path.node.trailingComments) delete path.node.trailingComments;
          if (path.node && path.node.innerComments) delete path.node.innerComments;
        },
      });

      const generated = generate.default
        ? generate.default(ast, { comments: false, retainLines: false })
        : generate(ast, { comments: false, retainLines: false });
      const output = generated.code;
      const collapsed = output.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+$/gm, '');

      await fs.writeFile(filePath, collapsed, 'utf8');
      console.log(`Processed: ${filePath}`);
    } catch (err) {
      console.error(`Failed to process ${filePath}: ${err.stack || err}`);
    }
  }

  console.log('Removed console calls and collapsed blank lines. Run `npm run format` to reformat.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
