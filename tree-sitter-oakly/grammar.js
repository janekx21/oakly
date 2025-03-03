

start => "a" name | "b"*
name = "janek" | "lara"



bbb
aaa

a

ab

b

ajanek

alara


/**
 * @file Functional language
 * @author Janek Winkler <janekx21@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "oakly",

  conflicts: ($) => [[$.constructor], [$.sum_type]],

  extras: ($) => [/[ \t\n\r]/, $.comment],

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => repeat(choice($.type_definition, $.value_definition)),
    comment: (_) => token(seq("#", /.*/)),

    type_definition: ($) =>
      seq(choice($.sum_type_definition, $.alias_definition)),
    sum_type_definition: ($) =>
      seq(
        "type",
        $.type_identifier,
        repeat($.type_parameter),
        "=",
        $.constructor,
        repeat(seq("|", $.constructor)),
      ),
    constructor: ($) => seq($.constructor_name, repeat($.type)),

    value_definition: ($) =>
      seq($.value_identifier, repeat($.parameter), "=", $.expression), // janeksName = "Janek"
    parameter: ($) => /[a-z]+/,

    alias_definition: ($) =>
      seq("alias", $.type_identifier, repeat($.type_parameter), "=", $.type),

    type: ($) =>
      choice(
        $.sum_type,
        $.type_parameter,
        seq("(", $.type, ")"),
        $.product_type,
      ),
    sum_type: ($) => seq($.type_identifier, repeat($.type)),
    product_type: ($) =>
      seq(
        "{",
        field("include", optional(seq($.type_parameter, "|"))),
        $.name_type_pair,
        repeat(seq(",", $.name_type_pair)),
        "}",
      ),

    name_type_pair: ($) => seq($.field_identifier, ":", $.type),

    expression: ($) => $.string,
    string: ($) => /\".*\"/,

    constructor_name: ($) => /[A-Z][A-Za-z0-9]*/,
    type_identifier: ($) => /[A-Z][A-Za-z0-9]*/,
    type_parameter: ($) => /[a-z][A-Za-z0-9]*/,
    value_identifier: ($) => /[a-z][A-Za-z0-9]*/,
    field_identifier: ($) => /[a-z][A-Za-z0-9]*/,
  },
});
