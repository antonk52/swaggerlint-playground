declare module 'pseudo-yaml-ast' {
    declare function yamlToAst(input: string): any;
    export const loc: Symbol<'pseudo-yaml-ast-loc'>
    export default yamlToAst
}
