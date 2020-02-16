# CodingExercises

## Pre-Requisites

`NodeJS`\
`Node Package Manager`

### Installing dependencies

Prior to attempting to run any of the following exercises you will need to run `npm install --production` in order to acquire dependencies.

### Exercise 1

To verify the first exercise you can execute the command `npm run lisp:validate -- --expression "<expression>"`\
Where `<expression>` should be any invalid, or valid **LISP** parenthetical expression.\
**Note:** you will need quotations to guarantee it evaluates the expression in between quotations correctly.\
\
Alternatively, you can use `npm test` to run a full suite of tests against Exercise 1.

### Exercise 2

To verify the second exercise you can execute the command `npm run registration:start`/\
This will initialize a server at port **3000**, to which you can connect by visiting **http://localhost:3000** from any browser.\
If for any reason you have an error which might indicate that the port is blocked, you can modify the `.env` file in this directory\
so that the **PORT** variable references an open port on your machine.

Exercise 2 should replace your page with the values of your submission if the **Register** button is pressed.\
All but the `Business Address` are validated using a regular expression. Tool hints provide examples in the correct format for each field.

### Exercise 3

To verify the third exercise you can execute the command `npm run csv:transform -- --file "<filename>" --outDir "<outputDirectory>"`\
where `<filename>` should be referencing a valid csv file within any directory. and `<outDir>` should reference a valid output directory.\
Alternatively, `--outDir "<outputDirectory>"` may be ommited, and the default output location will be within `exercises/csvTransformer`.
