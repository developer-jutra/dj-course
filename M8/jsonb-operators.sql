-- based on: https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING

-- Extracts n'th element of JSON array (array elements are indexed from zero, but negative integers count from the end).
SELECT '[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::json -> 2; -- → {"c":"baz"}

-- Extracts JSON object field with the given key.
SELECT '{"a": {"b":"foo"}}'::json -> 'a'; -- → {"b":"foo"}

-- Extracts n'th element of JSON array, as text.
SELECT '[1,2,3]'::json ->> 2; -- → 3

-- Extracts JSON sub-object at the specified path, where path elements can be either field keys or array indexes.
SELECT '{"a": {"b": ["foo","bar"]}}'::json #> '{a,b,1}'; -- → "bar"


-- Does the first JSON value contain the second?
SELECT '{"a":1, "b":2}'::jsonb @> '{"b":2}'::jsonb; -- → true

-- Is the first JSON value contained in the second?
SELECT '{"b":2}'::jsonb <@ '{"a":1, "b":2}'::jsonb; -- → true

-- Does the text string exist as a top-level key or array element within the JSON value?
SELECT '{"a":1, "b":2}'::jsonb ? 'b'; -- → true
SELECT '["a", "b", "c"]'::jsonb ? 'b'; -- → true

-- Builds a possibly-heterogeneously-typed JSON array out of a variadic argument list. Each argument is converted as per to_json or to_jsonb.
SELECT json_build_array(1, 2, 'foo', 4, 5); -- → [1,2,"foo",4,5]

-- and MANY, MANY more...
