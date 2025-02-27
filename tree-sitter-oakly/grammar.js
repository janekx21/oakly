/**
 * @file Functional language
 * @author Janek Winkler <janekx21@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "oakly",

  conflicts: ($) => [[]],

  extras: ($) => [/[ \t\n\r]/, $.comment],

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => repeat(choice($.type_definition, $.value_definition)),
    comment: (_) => token(seq("#", /.*/)),

    type_definition: ($) => seq(choice($.sum_type, $.product_type), "\n"),
    sum_type: ($) =>
      seq(
        "type",
        $.type_identifier,
        repeat($.type_parameter),
        "=",
        $.constructor,
        repeat(seq("|", $.constructor)),
      ),
    constructor: ($) =>
      seq(
        $.constructor_name,
        repeat(choice($.type_identifier, $.type_parameter)),
      ),
    constructor_name: ($) => /[A-Z][A-Za-z]*/,
    type_identifier: ($) => /[A-Z][A-Za-z]*/,
    type_parameter: ($) => /[a-z]+/,
    value_definition: ($) =>
      seq($.value_identifier, repeat($.parameter), "=", $.expression),
    parameter: ($) => /[a-z]+/,
    value_identifier: ($) => /[a-z]+/,

    product_type: ($) =>
      seq(
        "alias",
        $.type_identifier,
        repeat($.type_parameter),
        "=",
        "{",
        field("include", optional(seq($.type_parameter, "|"))),
        $.name_type_pair,
        repeat(seq(",", $.name_type_pair)),
        "}",
      ),

    name_type_pair: ($) => seq($.field_identifier, ":", $.type_identifier),
    field_identifier: ($) => /[a-z]+/,

    expression: ($) => $.string,
    string: ($) => /\".*\"/,
  },
});
