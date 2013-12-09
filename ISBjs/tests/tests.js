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
