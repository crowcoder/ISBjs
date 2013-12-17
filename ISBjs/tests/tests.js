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

test("Test Linq to Entities for Not Equals for all data types with ignore case", function () {
    isb._IGNORECASE = true;
    isb._theExpression =
        [{ "prop": "Surname", "oper": "Is not equal to", "cnst": "bob", "dataType": "text" }, "AND", { "prop": "BillRate", "oper": "Is not equal to", "cnst": "10", "dataType": "number" }, "AND", { "prop": "DOH", "oper": "Is not equal to", "cnst": "7/1/2008", "dataType": "date" }];

    var expected1 = " Surname.ToLower() != @0 AND  BillRate != @1 AND  DOH != @2";
    var expected2 = "[\"bob\",10,\"2008-07-01T00:00:00.000Z\"]";

    var actual = isb.parseForLinq();

    deepEqual(actual[0], expected1);
    deepEqual(actual[1], expected2);
});

test("Test Linq to Entities parsing for Not Equals for all data types and case sensitive", function () {
    isb._IGNORECASE = false;
    isb._theExpression =
        [{ "prop": "Surname", "oper": "Is not equal to", "cnst": "bob", "dataType": "text" }, "AND", { "prop": "BillRate", "oper": "Is not equal to", "cnst": "10", "dataType": "number" }, "AND", { "prop": "DOH", "oper": "Is not equal to", "cnst": "7/1/2008", "dataType": "date" }];

    var expected1 = " Surname != @0 AND  BillRate != @1 AND  DOH != @2";
    var expected2 = "[\"bob\",10,\"2008-07-01T00:00:00.000Z\"]";

    var actual = isb.parseForLinq();

    deepEqual(actual[0], expected1);
    deepEqual(actual[1], expected2);
});

test("Test case sensitive for Linq to Entities parsing.", function () {
    isb._IGNORECASE = false;
    isb._theExpression =
        [{ "prop": "Surname", "oper": "Is not equal to", "cnst": "Bob", "dataType": "text" }];

    var expected = "[\"Bob\"]";
    var actual = isb.parseForLinq();
    deepEqual(actual[1], expected, "As expected, a case-sensitive compare does not lower case the user entered value.");
});

test("Test each available operator on text type data - Case Sensitive.", function(){
    isb._IGNORECASE = false;
    isb._theExpression = [{"prop":"Surname","oper":"Is equal to","cnst":"foo","dataType":"text"},"AND",{"prop":"Surname","oper":"Is not equal to","cnst":"foo","dataType":"text"},"AND",{"prop":"Surname","oper":"Contains","cnst":"oo","dataType":"text"},"AND",{"prop":"Surname","oper":"Starts with","cnst":"foo","dataType":"text"},"AND",{"prop":"Surname","oper":"Ends with","cnst":"foo","dataType":"text"},"AND",{"prop":"Surname","oper":"Is in","cnst":"foo,bar, bazz","dataType":"text"},"AND",{"prop":"Surname","oper":"Is null","cnst":"","dataType":"text"},"AND",{"prop":"Surname","oper":"Is not equal to","cnst":"foo","dataType":"text"},"AND",{"prop":"Surname","oper":"Is not null","cnst":"","dataType":"text"},"AND",{"prop":"Surname","oper":"Is less than","cnst":"f","dataType":"text"},"AND",{"prop":"Surname","oper":"Is greater than","cnst":"f","dataType":"text"}];

    var expected1 = " Surname = @0 AND  Surname != @1 AND  Surname.Contains(@2) AND  Surname.StartsWith(@3) AND  Surname.EndsWith(@4) AND (Surname.Equals(@5) OR Surname.Equals(@6) OR Surname.Equals(@7) )  AND  Surname = Null AND  Surname != @8 AND  Surname Not = Null AND  Surname < @9 AND  Surname > @10";

    var expected2 = "[\"foo\",\"foo\",\"oo\",\"foo\",\"foo\",\"foo\",\"bar\",\"bazz\",\"foo\",\"f\",\"f\"]";
    var actual = isb.parseForLinq();
    deepEqual(actual[0], expected1);
    deepEqual(actual[1], expected2);
});

