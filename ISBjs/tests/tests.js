test("Test parsing of contrived expression", function () {
    
    var theObj = [
        { "prop": "lastname", "oper": "Is equal to", "cnst": "one", "dataType": "text" },
        "AND",
        { "prop": "gender", "oper": "Starts with", "cnst": "two", "dataType": "text" },
        "OR",
        [{ "prop": "age", "oper": "Is greater than", "cnst": "10", "dataType": "number" },
            "AND", { "prop": "vested", "oper": "Is equal to", "cnst": "", "dataType": "bool" }]
    ];

    isb._theExpression = theObj;
    isb.render();
    var whr = isb.parseForLinq();

    ok(typeof whr[0] === "string", 'Index zero of parsed output is a string.');
});

test("Testing postfix evaluation", function () {

    //A * (B + C * D) + E becomes A B C D * + * E +
    //{"L":"A"},{"L":"B"},{"L":"C"},{"L":"D"},AND,OR,AND,{"L":"E"},OR
    isb._theExpression = [{ 'L': 'A' }, 'AND', [{ 'L': 'B' }, 'OR', { 'L': 'C' }, 'AND', { 'L': 'D' }], 'OR', { 'L': 'E' }];   
    var postfx = isb.parseToPostFix().join();
    deepEqual(postfx, '{"L":"A"},{"L":"B"},{"L":"C"},{"L":"D"},AND,OR,AND,{"L":"E"},OR',
        "Contrived expression parses correctly to postfix.");

});
