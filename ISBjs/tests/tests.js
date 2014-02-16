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
    var whr = isb.parse("l2e");

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
    
    var expected1 = "( Surname.ToLower() != \"bob\" AND ( BillRate != 10 AND  Not (DOH.Year = 2008 And DOH.Month = 7 And DOH.Day = 1)))";
    var actual = isb.parse("l2e");

    deepEqual(actual[0], expected1);
});

test("Test Linq to Entities parsing for Not Equals for all data types and case sensitive", function () {
    isb._IGNORECASE = false;
    isb._theExpression =
        [{ "prop": "Surname", "oper": "Is not equal to", "cnst": "bob", "dataType": "text" }, "AND", { "prop": "BillRate", "oper": "Is not equal to", "cnst": "10", "dataType": "number" }, "AND", { "prop": "DOH", "oper": "Is not equal to", "cnst": "7/1/2008", "dataType": "date" }];
    
    var expected1 = "( Surname != \"bob\" AND ( BillRate != 10 AND  Not (DOH.Year = 2008 And DOH.Month = 7 And DOH.Day = 1)))";
    
    var actual = isb.parse("l2e");
    deepEqual(actual[0], expected1);
});

test("Test case sensitive for Linq to Entities parsing.", function () {
    isb._IGNORECASE = false;
    isb._theExpression =
        [{ "prop": "Surname", "oper": "Is not equal to", "cnst": "Bob", "dataType": "text" }];

    var expected = " Surname != \"Bob\"";
    var actual = isb.parse("l2e");
    deepEqual(actual[0], expected, "As expected, a case-sensitive compare does not lower case the user entered value.");
});

test("Test each available operator on text type data - Case Sensitive.", function(){
    isb._IGNORECASE = false;
    isb._theExpression = [{"prop":"Surname","oper":"Is equal to","cnst":"foo","dataType":"text"},"AND",{"prop":"Surname","oper":"Is not equal to","cnst":"foo","dataType":"text"},"AND",{"prop":"Surname","oper":"Contains","cnst":"oo","dataType":"text"},"AND",{"prop":"Surname","oper":"Starts with","cnst":"foo","dataType":"text"},"AND",{"prop":"Surname","oper":"Ends with","cnst":"foo","dataType":"text"},"AND",{"prop":"Surname","oper":"Is in","cnst":"foo,bar, bazz","dataType":"text"},"AND",{"prop":"Surname","oper":"Is null","cnst":"","dataType":"text"},"AND",{"prop":"Surname","oper":"Is not equal to","cnst":"foo","dataType":"text"},"AND",{"prop":"Surname","oper":"Is not null","cnst":"","dataType":"text"},"AND",{"prop":"Surname","oper":"Is less than","cnst":"f","dataType":"text"},"AND",{"prop":"Surname","oper":"Is greater than","cnst":"f","dataType":"text"}];

    var expected1 = "( Surname = \"foo\" AND ( Surname != \"foo\" AND ( Surname.Contains(\"oo\") AND ( Surname.StartsWith(\"foo\") AND ( Surname.EndsWith(\"foo\") AND ((Surname.Equals(\"foo\") OR Surname.Equals(\"bar\") OR Surname.Equals(\"bazz\"))  AND ( Surname = Null AND ( Surname != \"foo\" AND ( Surname != Null AND ( Surname < \"f\" AND  Surname > \"f\"))))))))))";

    var actual = isb.parse("l2e");
    deepEqual(actual[0], expected1);
});

