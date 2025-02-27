["type"] @keyword.type

[ (type_identifier) ] @type

[(constructor_name)] @constructor

[(type_parameter) (parameter)] @variable.parameter
; (int_literal) @number
(value_identifier) @function


(string) @string
(comment) @comment

[ "=" ] @operator

[ "|" ] @punctuation.delimiter
