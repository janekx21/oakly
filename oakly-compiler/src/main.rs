use std::{any::Any, borrow::BorrowMut};

use tree_sitter::{
    InputEdit, Language, Node, Parser, Point, Query, QueryCursor, StreamingIterator,
};
use tree_sitter_oakly::LANGUAGE;

enum Type {
    Product { pairs: Vec<NameTypePair> },
    String,
    Int,
}

struct NameTypePair {
    key: String,
    value: Type,
}

fn product_type_node_to_type(node: &Node) {
    assert!(node.kind() == "product_type");

    let mut cursor = node.walk();
    for child in node.children(&mut cursor) {
        if child.kind() == "name_type_pair" {
            let mut cursor = node.walk();
            match child
                .children(&mut cursor)
                .collect::<Vec<Node>>()
                .as_mut_slice()
            {
                [name, _, type_] => println!("{:?} {:?}", name, type_),
                _ => unreachable!(),
            }
            println!("found name type pair {:?}", child)
        }
    }
}

fn main() {
    let mut parser = Parser::new();
    parser
        .set_language(&LANGUAGE.into())
        .expect("Error loading Rust grammar");

    let source_code = "alias Person = { name : String, age : Int }\n";
    // let source_code = include_str!("../example-files/types.oakly");

    let mut tree = parser.parse(source_code, None).unwrap();
    let root_node = tree.root_node();

    println!("{}", root_node.to_sexp());

    let query = Query::new(
        &LANGUAGE.into(),
        "(type_definition (_ (type_identifier)@type_name  (type _ @type))) ",
    )
    .unwrap();
    let mut query_cursor = QueryCursor::new();
    query_cursor
        .matches(&query, root_node, source_code.as_bytes())
        .for_each(|f| {
            let mut captures_iter = f.captures.iter();
            let type_name = captures_iter.next().unwrap();
            let type_ = captures_iter.next().unwrap();

            match type_.node.kind() {
                "product_type" => {
                    product_type_node_to_type(&type_.node);
                }
                _ => {
                    println!(
                        "Type name {:?} = {:?}",
                        type_name.node.utf8_text(source_code.as_bytes()).unwrap(),
                        type_.node.utf8_text(source_code.as_bytes()).unwrap()
                    )
                }
            }
        });

    let query = Query::new(&LANGUAGE.into(), "(ERROR)@error").unwrap();
    query_cursor
        .matches(&query, root_node, source_code.as_bytes())
        .for_each(|f| {
            let type_definition = f.captures.first().unwrap();
            println!(
                "Error {:?}",
                type_definition
                    .node
                    .utf8_text(source_code.as_bytes())
                    .unwrap()
            );
        });
}
