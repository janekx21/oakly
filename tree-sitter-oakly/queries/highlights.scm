["type" "alias"] @keyword.type

[ (type_identifier) ] @type

[(constructor_name)] @constructor

[(type_parameter) (parameter)] @variable.parameter
; (int_literal) @number
(value_identifier) @function

(field_identifier) @variable.member 

(string) @string
(comment) @comment

[ "=" ] @operator

[ "|" "," ":" ] @punctuation.delimiter

["{" "}" "(" ")"] @punctuation.bracket

(ERROR) @error 
