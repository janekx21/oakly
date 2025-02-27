use std::{any::Any, borrow::BorrowMut};

use tree_sitter::{InputEdit, Language, Parser, Point, Query, QueryCursor, StreamingIterator};
use tree_sitter_oakly::LANGUAGE;

fn main() {
    let mut parser = Parser::new();
    parser
        .set_language(&LANGUAGE.into())
        .expect("Error loading Rust grammar");

    // let source_code = "type Maybe a = Just a | Nothing\n";
    let source_code = include_str!("../example-files/types.oakly");

    let mut tree = parser.parse(source_code, None).unwrap();
    let root_node = tree.root_node();

    println!("{}", root_node.to_sexp());

    let query = Query::new(
        &LANGUAGE.into(),
        "(type_definition (_ (type_identifier)@type_name )) ",
    )
    .unwrap();
    let mut query_cursor = QueryCursor::new();
    query_cursor
        .matches(&query, root_node, source_code.as_bytes())
        .for_each(|f| {
            let type_definition = f.captures.first().unwrap();
            println!(
                "{:?}",
                type_definition
                    .node
                    .utf8_text(source_code.as_bytes())
                    .unwrap()
            );
        })
}
