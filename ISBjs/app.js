﻿var com;
(function (com) {
    (function (contrivedexample) {
        (function (isbjs) {
            var Isb = (function () {
                /*****************************************************************************************
                * CONSTRUCTOR
                *****************************************************************************************/
                function Isb(fltrConfig) {
                    this._TEXT = "text";
                    this._NUMBER = "number";
                    this._BOOL = "bool";
                    this._DATE = "date";
                    this._params = [];
                    this._fltrConfig = fltrConfig;
                    this._props = [];
                    this._theInputs = [];

                    //if a language map was supplied, use those values for the string literals
                    //otherwise default to English
                    var usingLang = fltrConfig.langmap !== void 0;

                    this._EQUALS = usingLang ? fltrConfig.langmap.equal : "Is equal to";
                    this._NOTEQUALS = usingLang ? fltrConfig.langmap.notequal : "Is not equal to";
                    this._STARTS_WITH = usingLang ? fltrConfig.langmap.startswith : "Starts with";
                    this._ENDS_WITH = usingLang ? fltrConfig.langmap.endswith : "Ends with";
                    this._TRUE = usingLang ? fltrConfig.langmap.istrue : "Is true";
                    this._FALSE = usingLang ? fltrConfig.langmap.isfalse : "Is false";
                    this._NULL = usingLang ? fltrConfig.langmap.isnull : "Is null";
                    this._NOT_NULL = usingLang ? fltrConfig.langmap.isnotnull : "Is not null";
                    this._CONTAINS = usingLang ? fltrConfig.langmap.contains : "Contains";
                    this._GREATER = usingLang ? fltrConfig.langmap.greater : "Is greater than";
                    this._GREATER_EQ = usingLang ? fltrConfig.langmap.greatereq : "Is greater than or equal to";
                    this._LESS = usingLang ? fltrConfig.langmap.less : "Is less than";
                    this._LESS_EQ = usingLang ? fltrConfig.langmap.lesseq : "Is less than or equal to";
                    this._IN = usingLang ? fltrConfig.langmap.isin : "Is in";
                    this._NOTIN = usingLang ? fltrConfig.langmap.isnotin : "Is not in";
                    this._DEFINE_SEARCH = usingLang ? fltrConfig.langmap.defsrch : "Define Search";
                    this._RESET = usingLang ? fltrConfig.langmap.reset : "Reset";
                    this._DEFTYPE = fltrConfig.defaultDataType && (fltrConfig.defaultDataType === "text" || fltrConfig.defaultDataType === "date" || fltrConfig.defaultDataType === "bool" || fltrConfig.defaultDataType === "number") ? fltrConfig.defaultDataType : "text";

                    this._IGNORECASE = fltrConfig.ignoreCase === true ? true : false;

                    this._textConditions = [this._EQUALS, this._NOTEQUALS, this._CONTAINS, this._STARTS_WITH, this._ENDS_WITH, this._IN, this._NULL, this._NOTEQUALS, this._NOT_NULL, this._LESS, this._GREATER];
                    this._dateConditions = [this._EQUALS, this._NOTEQUALS, this._GREATER, this._GREATER_EQ, this._LESS, this._LESS_EQ, , this._IN, this._NULL, this._NOT_NULL];
                    this._nbrConditions = [this._EQUALS, this._NOTEQUALS, this._GREATER, this._GREATER_EQ, this._LESS, this._LESS_EQ, , this._IN, this._NULL, this._NOT_NULL];
                    this._boolConditions = [this._TRUE, this._FALSE];

                    switch (fltrConfig.defaultDataType) {
                        case "text":
                            this._defaultConditions = this._textConditions;
                            break;
                        case "date":
                            this._defaultConditions = this._dateConditions;
                            break;
                        case "bool":
                            this._defaultConditions = this._boolConditions;
                            break;
                        case "number":
                            this._defaultConditions = this._nbrConditions;
                            break;
                        default:
                            this._defaultConditions = this._textConditions;
                    }

                    this.renderHeader(this);
                }
                Isb.prototype.renderHeader = function (that) {
                    //create a div containing a button that builds or resets a search session
                    var goBtn = document.createElement("button");
                    goBtn.id = "IsbGoBtn";
                    goBtn.appendChild(document.createTextNode(this._DEFINE_SEARCH));
                    goBtn.setAttribute("data-role", "start");
                    goBtn.onclick = function () {
                        var btnRole = this.getAttribute("data-role");
                        if (btnRole === "start") {
                            this.innerHTML = "Reset";
                            this.setAttribute("data-role", "reset");
                        }

                        that._theExpression = [];
                        that._theExpression.push({
                            'prop': that._props[0].value,
                            'oper': that._defaultConditions[0],
                            'cnst': '',
                            'dataType': that._DEFTYPE
                        });
                        that.render();
                    };

                    document.querySelector("#" + this._fltrConfig.divName).appendChild(goBtn);
                };

                //Add a 'field name' to the list of choices.
                Isb.prototype.addFilterProperty = function (prop) {
                    this._props.push(prop);

                    //recreate the prop select each time an item is added
                    this._propSelect = this.createPropSelect();
                };

                Isb.prototype.render = function () {
                    var theUL = document.querySelector("#" + this._fltrConfig.ulName);
                    theUL.innerHTML = "";
                    this._theInputs = [];
                    this.addCriteria(this._theExpression, theUL);
                    console.log(JSON.stringify(this._theExpression));
                };

                //Internal helper to create a <select> of field names once and clone this
                //one during render instead running this code over and over for each filter "row"
                Isb.prototype.createPropSelect = function () {
                    var propSelect = document.createElement("select");

                    //add a class or series of class names if set in the Config
                    if (this._fltrConfig.propSelClass != void 0) {
                        propSelect.className = this._fltrConfig.propSelClass;
                    }

                    //Add any attributes to the Select element if set in the Config
                    if (this.implementsAttr(this._fltrConfig.propSelAttributes)) {
                        for (var attrIdx = 0; attrIdx < this._fltrConfig.propSelAttributes.length; attrIdx++) {
                            propSelect.setAttribute(this._fltrConfig.propSelAttributes[attrIdx].attrName, this._fltrConfig.propSelAttributes[attrIdx].attrValue);
                        }
                    }

                    for (var idx = 0; idx < this._props.length; idx++) {
                        var opt = document.createElement("option");

                        //Set the class if given in the Config
                        if (typeof this._fltrConfig.propSelOptClass === "string") {
                            opt.className = this._fltrConfig.propSelOptClass;
                        }

                        //Add any attributes if set in the Config
                        if (this.implementsAttr(this._fltrConfig.propSelOptAttributes)) {
                            for (var optIdx = 0; optIdx < this._fltrConfig.propSelOptAttributes.length; optIdx++) {
                                opt.setAttribute(this._fltrConfig.propSelOptAttributes[optIdx].attrName, this._fltrConfig.propSelOptAttributes[optIdx].attrValue);
                            }
                        }

                        opt.setAttribute("value", this._props[idx].value);
                        opt.appendChild(document.createTextNode(this._props[idx].display));
                        propSelect.appendChild(opt);
                    }
                    return propSelect;
                };

                //Checks if the passed object has an 'attrName' and 'attrValue' property.
                Isb.prototype.implementsAttr = function (src) {
                    if (src == void 0) {
                        return false;
                    }

                    for (var idx = 0; idx < src.length; idx++) {
                        if (!(src[idx].hasOwnProperty("attrName") && src[idx].hasOwnProperty("attrValue"))) {
                            return false;
                        } else {
                            if (!(typeof src[idx].attrName === "string" && typeof src[idx].attrValue === "string")) {
                                return false;
                            }
                        }
                    }
                    return true;
                };

                //Checks if the passed object has string-valued "display", "value" and "dataType" properties.
                Isb.prototype.implementsFilter = function (src) {
                    if (src == void 0) {
                        return false;
                    }

                    if (!(src.hasOwnProperty("display") && src.hasOwnProperty("value") && src.hasOwnProperty("dataType"))) {
                        return false;
                    } else {
                        if (!(typeof src.display === "string" && typeof src.value === "string" && typeof src.dataType === "string")) {
                            return false;
                        }
                    }
                    return true;
                };

                //Called recursively on the backing array, "expressions", to keep the data and UI in sync.
                Isb.prototype.addCriteria = function (arr, ul) {
                    var newul;
                    for (var i = 0; i < arr.length; i++) {
                        if (typeof arr[i] == "string") {
                            //Create the And/Or ListItem and configure its classes and attributes
                            var andornode = document.createElement("li");

                            if (typeof this._fltrConfig.andOrLiClass === "string") {
                                andornode.className = this._fltrConfig.andOrLiClass;
                            }

                            if (this.implementsAttr(this._fltrConfig.propSelOptAttributes)) {
                                for (var andOrIdx = 0; andOrIdx < this._fltrConfig.andOrLiAttributes.length; andOrIdx++) {
                                    andornode.setAttribute(this._fltrConfig.andOrLiAttributes[andOrIdx].attrName, this._fltrConfig.andOrLiAttributes[andOrIdx].attrValue);
                                }
                            }

                            //Create the And/Or <select> and configure its classes and attributes
                            var andOrSelect = document.createElement("select");
                            if (typeof this._fltrConfig.andOrSelClass === "string") {
                                andOrSelect.className = this._fltrConfig.andOrSelClass;
                            }

                            //create the and/or options and set class names and attributes
                            var andOpt = document.createElement("option");
                            andOpt.setAttribute("value", "AND");
                            andOpt.appendChild(document.createTextNode("AND"));

                            var orOpt = document.createElement("option");
                            orOpt.setAttribute("value", "OR");
                            orOpt.appendChild(document.createTextNode("OR"));

                            if (this.implementsFilter(this._fltrConfig.andOrOptAttributes)) {
                                for (var andOrOptIdx = 0; andOrOptIdx < this._fltrConfig.andOrOptAttributes.length; andOrOptIdx++) {
                                    andOpt.setAttribute(this._fltrConfig.andOrOptAttributes[andOrOptIdx].attrName, this._fltrConfig.andOrOptAttributes[andOrOptIdx].attrValue);
                                    orOpt.setAttribute(this._fltrConfig.andOrOptAttributes[andOrOptIdx].attrName, this._fltrConfig.andOrOptAttributes[andOrOptIdx].attrValue);
                                }
                            }

                            andOrSelect.onchange = (function (idx) {
                                return function () {
                                    arr[idx] = this.value;
                                };
                            })(i);

                            andOrSelect.appendChild(andOpt);
                            andOrSelect.appendChild(orOpt);
                            andornode.appendChild(andOrSelect);
                            andOrSelect.value = arr[i];

                            if (arr[i + 1] instanceof Array) {
                                andornode.appendChild(this.buildPlusOrFork(i, arr, "p", 2, this));
                            }
                            ul.appendChild(andornode);
                        } else {
                            if (arr[i] instanceof Array) {
                                newul = document.createElement("ul");
                                if (typeof this._fltrConfig.listClass === "string") {
                                    newul.className = this._fltrConfig.listClass;
                                }
                                ul.appendChild(newul);
                                this.addCriteria(arr[i], newul);
                            } else {
                                var fltrRow = document.createElement("li");
                                if (typeof this._fltrConfig.listItemClass === "string") {
                                    fltrRow.className = this._fltrConfig.listItemClass;
                                }
                                if (this.implementsAttr(this._fltrConfig.listItemAttributes)) {
                                    for (var liIdx = 0; liIdx < this._fltrConfig.listItemAttributes.length; liIdx++) {
                                        fltrRow.setAttribute(this._fltrConfig.listItemAttributes[liIdx].attrName, this._fltrConfig.listItemAttributes[liIdx].attrValue);
                                    }
                                }

                                var opersel = this.buildOperatorSelect(arr[i].dataType);
                                opersel.value = arr[i].oper;
                                var propsel = this.buildPropSelect(i, arr);

                                fltrRow.appendChild(propsel);
                                fltrRow.appendChild(opersel);

                                switch (arr[i].dataType) {
                                    case this._TEXT:
                                    case this._NUMBER:
                                    case this._DATE:
                                        if (arr[i].oper === this._NULL || arr[i].oper === this._NOT_NULL) {
                                        } else {
                                            var inp = document.createElement("input");
                                            if (typeof this._fltrConfig.valueInputClass === "string") {
                                                inp.className = this._fltrConfig.valueInputClass;
                                            }
                                            inp.setAttribute("size", "10");
                                            inp.setAttribute("type", arr[i].dataType);
                                            inp.setAttribute("value", arr[i].cnst);
                                            propsel["inpt"] = inp;
                                            inp.onchange = (function (idx, that) {
                                                return function () {
                                                    arr[idx].cnst = this.value;
                                                    if (typeof that._fltrConfig.valueInputClass === "string") {
                                                        if (this.value !== '') {
                                                            this.className = that._fltrConfig.valueInputClass;
                                                        }
                                                    }
                                                };
                                            })(i, this);

                                            fltrRow.appendChild(inp);
                                            this._theInputs.push(inp);
                                        }

                                        break;
                                    case this._BOOL:
                                        break;
                                }

                                fltrRow.appendChild(this.buildPlusOrFork(i, arr, "p", 1, this));
                                fltrRow.appendChild(this.buildPlusOrFork(i, arr, "f", 1, this));
                                ul.appendChild(fltrRow);

                                propsel.onchange = (function (idx, that) {
                                    return function () {
                                        arr[idx].prop = this.value;

                                        for (var propIdx = 0; propIdx < that._props.length; propIdx++) {
                                            if (that._props[propIdx].value === this.value) {
                                                arr[idx].dataType = that._props[propIdx].dataType;
                                                break;
                                            }
                                        }

                                        switch (arr[idx].dataType) {
                                            case that._TEXT:
                                            case that._NUMBER:
                                            case that._DATE:
                                                arr[idx].oper = that._EQUALS;
                                                break;
                                            case that._BOOL:
                                                arr[idx].oper = that._TRUE;
                                                break;
                                        }

                                        //re-render the widget so that the appropriate operators are shown for this choice
                                        that.render();
                                    };
                                })(i, this);

                                //On change of operator, change backing data to match the choice
                                opersel.onchange = (function (idx, that) {
                                    return function () {
                                        arr[idx].oper = this.value;
                                        that.render();
                                    };
                                })(i, this);
                            }
                        }
                    }
                };

                Isb.prototype.buildPropSelect = function (pos, thearray) {
                    var propSelect = this._propSelect.cloneNode(true);
                    propSelect.value = thearray[pos].prop;
                    return propSelect;
                };

                Isb.prototype.buildOperatorSelect = function (whichoper) {
                    var operSelect = document.createElement("select");

                    if (typeof this._fltrConfig.operSelClass === "string") {
                        operSelect.className = this._fltrConfig.operSelClass;
                    }

                    var whichlist;
                    switch (whichoper) {
                        case this._TEXT:
                            whichlist = this._textConditions;
                            break;
                        case this._NUMBER:
                            whichlist = this._nbrConditions;
                            break;
                        case this._BOOL:
                            whichlist = this._boolConditions;
                            break;
                        case this._DATE:
                            whichlist = this._dateConditions;
                            break;
                    }

                    var doSetAttr = this.implementsAttr(this._fltrConfig.operSelOptAttributes);
                    var doSetClass = typeof this._fltrConfig.operSelOptClass === "string";

                    for (var idx = 0; idx < whichlist.length; idx++) {
                        var opt = document.createElement("option");

                        if (doSetClass) {
                            opt.className = this._fltrConfig.operSelOptClass;
                        }

                        opt.setAttribute("value", whichlist[idx]);

                        if (doSetAttr) {
                            for (var operIdx = 0; operIdx < this._fltrConfig.operSelOptAttributes.length; operIdx++) {
                                opt.setAttribute(this._fltrConfig.operSelOptAttributes[operIdx].attrName, this._fltrConfig.operSelOptAttributes[operIdx].attrValue);
                            }
                        }

                        opt.appendChild(document.createTextNode(whichlist[idx]));
                        operSelect.appendChild(opt);
                    }
                    return operSelect;
                };

                Isb.prototype.buildPlusOrFork = function (pos, thearray, pOrf, offset, that) {
                    var btn = document.createElement("button");

                    if (typeof this._fltrConfig.btnClass === "string") {
                        btn.className = this._fltrConfig.btnClass;
                    }

                    btn.appendChild(document.createTextNode(pOrf === "p" ? "+" : "( )"));

                    var pushObj;
                    if (pOrf === "p") {
                        pushObj = {
                            'prop': this._props[0].value,
                            'oper': this._defaultConditions[0],
                            'cnst': '',
                            'dataType': this._DEFTYPE
                        };
                    } else {
                        pushObj = [{
                                'prop': this._props[0].value,
                                'oper': this._defaultConditions[0],
                                'cnst': '',
                                'dataType': this._DEFTYPE
                            }];
                    }

                    btn.onclick = (function (whicharray, idx, pushobj, that) {
                        return function () {
                            whicharray.splice(idx + offset, 0, "AND", pushobj);
                            that.render();
                        };
                    })(thearray, pos, pushObj, that);
                    return btn;
                };

                //Parses the search builder to an array of two strings.
                //The first string is the "where" clause and the second is the list of
                //parameters required to execute the where clause.
                Isb.prototype.parseForLinq = function () {
                    var parseerr = false;
                    this._params = []; //reset the parameters

                    for (var idx = 0; idx < this._theInputs.length; idx++) {
                        var inputType = this._theInputs[idx].getAttribute("type");
                        switch (inputType) {
                            case "text":
                                if (this._theInputs[idx].value === '') {
                                    parseerr = true;
                                }
                                break;
                            case "number":
                                var nbr = parseFloat(this._theInputs[idx].value);
                                if (isNaN(nbr) || !isFinite(nbr)) {
                                    parseerr = true;
                                }
                                break;
                            case "date":
                                if (isNaN(Date.parse(this._theInputs[idx].value))) {
                                    parseerr = true;
                                }
                                break;
                            default:
                        }
                        if (parseerr) {
                            if (typeof this._fltrConfig.valueInputErrClass === "string") {
                                this._theInputs[idx].className = this._theInputs[idx].className + " " + this._fltrConfig.valueInputErrClass;
                            }
                        }
                    }

                    //No data error found, lets do this...
                    if (!parseerr) {
                        // console.log(JSON.stringify(this._theExpression));
                        var sqlstring = "";

                        var pstfix = this.parseToPostFix();

                        for (var i = 0; i < pstfix.length; i++) {
                            if (pstfix[i].indexOf("{") === 0) {
                                pstfix.splice(i, 1, this.getDynLinq2EntitiesExpr(pstfix[i]));
                            }
                        }

                        toInfix.call(this, pstfix);

                        function toInfix(theArr) {
                            for (var fixIdx = 0; fixIdx < theArr.length; fixIdx++) {
                                if (theArr[fixIdx] === "AND" || theArr[fixIdx] === "OR") {
                                    //remove 3 items starting at index minus 2, replace them with one item that is the
                                    //combination of those 3 items into one expression
                                    theArr.splice(fixIdx - 2, 3, "(" + theArr[fixIdx - 2] + " " + theArr[fixIdx] + " " + theArr[fixIdx - 1] + ")");

                                    toInfix.call(this, theArr);
                                }
                            }
                        }

                        //console.log(pstfix[0]);
                        return [pstfix[0], this._params];
                    } else {
                        return ["Missing search values exist"];
                    }
                };

                //Parses the object 'expr' and returns the expression in dynamic linq to entities format
                Isb.prototype.getDynLinq2EntitiesExpr = function (expr) {
                    var fltr = JSON.parse(expr);
                    var theOperator;
                    var cs = this._IGNORECASE ? ".ToLower()" : "";
                    var constVal;

                    switch (fltr.dataType) {
                        case 'date':
                            var dt = new Date(fltr.cnst);
                            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset()); //chop off timezone offset and daylight saving time
                            constVal = dt;
                            break;
                        case 'number':
                            constVal = parseFloat(fltr.cnst);
                            break;
                        default:
                            constVal = fltr.cnst;
                            break;
                    }

                    switch (fltr.oper) {
                        case this._EQUALS:
                            switch (fltr.dataType) {
                                case "date":
                                case "bool":
                                case "number":
                                    theOperator = " " + fltr.prop + " = @" + this._params.length;
                                    this._params.push(constVal);
                                    break;
                                default:
                                    theOperator = " " + fltr.prop + cs + " = @" + this._params.length;
                                    if (this._IGNORECASE) {
                                        this._params.push(constVal.toLowerCase());
                                    } else {
                                        this._params.push(constVal);
                                    }
                            }
                            break;
                        case this._NOTEQUALS:
                            switch (fltr.dataType) {
                                case "date":
                                case "bool":
                                case "number":
                                    theOperator = " " + fltr.prop + " != @" + this._params.length;
                                    this._params.push(constVal);
                                    break;
                                default:
                                    theOperator = " " + fltr.prop + cs + " != @" + this._params.length;
                                    if (this._IGNORECASE) {
                                        this._params.push(constVal.toLowerCase());
                                    } else {
                                        this._params.push(constVal);
                                    }
                            }
                            break;
                        case this._LESS:
                            theOperator = " " + fltr.prop + " < @" + this._params.length;
                            this._params.push(constVal);
                            break;
                        case this._LESS_EQ:
                            theOperator = " " + fltr.prop + " <= @" + this._params.length;
                            this._params.push(constVal);
                            break;
                        case this._GREATER:
                            theOperator = " " + fltr.prop + " > @" + this._params.length;
                            this._params.push(constVal);
                            break;
                        case this._GREATER_EQ:
                            theOperator = " " + fltr.prop + " >= @" + this._params.length;
                            this._params.push(constVal);
                            break;
                        case this._STARTS_WITH:
                            theOperator = " " + fltr.prop + cs + ".StartsWith(@" + this._params.length + ")";
                            this._params.push(constVal);
                            break;
                        case this._ENDS_WITH:
                            theOperator = " " + fltr.prop + cs + ".EndsWith(@" + this._params.length + ")";
                            this._params.push(constVal);
                            break;
                        case this._NULL:
                            theOperator = " " + fltr.prop + " = Null";
                            break;
                        case this._NOT_NULL:
                            theOperator = " " + fltr.prop + " Not = Null";
                            break;
                        case this._IN:
                            var tokens = fltr.cnst.split(",");
                            theOperator = "(";
                            for (var tokIdx = 0; tokIdx < tokens.length; tokIdx++) {
                                theOperator += fltr.prop + cs + ".Equals(@" + this._params.length + ") ";
                                if (tokIdx !== tokens.length - 1) {
                                    theOperator += "OR ";
                                }
                                this._params.push(tokens[tokIdx].trim());
                            }
                            theOperator += ") ";
                            break;
                        case this._CONTAINS:
                            theOperator = " " + fltr.prop + cs + ".Contains(@" + this._params.length + ")";
                            this._params.push(constVal);
                            break;
                        case this._TRUE:
                            theOperator = " " + fltr.prop + " = True ";
                            break;
                        case this._FALSE:
                            theOperator = " " + fltr.prop + " = False ";
                            break;
                        default:
                            throw "Unknown operator " + (fltr || "~") + ". Cannot parse.";
                    }
                    return theOperator;
                };

                Isb.prototype.parseToPostFix = function () {
                    var _operStack = [];
                    var _postfix = [];
                    var flattenedArray = '';
                    var delim = "|";

                    (function parse(flatStr) {
                        flatStr = flatStr.substring(0, flatStr.length - 1); //strip trailing comma
                        var theArr = flatStr.split(delim);

                        for (var i = 0; i < theArr.length; i++) {
                            if (theArr[i] == "AND" || theArr[i] === "OR" || theArr[i] === "(") {
                                if (_operStack.length === 0 || _operStack[0] === "(") {
                                    _operStack.unshift(theArr[i]);
                                } else {
                                    if ((theArr[i] === "AND" || theArr[i] === "OR") && _operStack[0] === "OR") {
                                        _operStack.unshift(theArr[i]);
                                    } else {
                                        while (theArr[i] === "OR" && _operStack[0] === "AND") {
                                            _postfix.push(_operStack.shift());
                                        }
                                        _operStack.unshift(theArr[i]);
                                    }
                                }
                            } else {
                                if (theArr[i] === ")") {
                                    while (_operStack[0] !== "(") {
                                        _postfix.push(_operStack.shift());
                                    }
                                    _operStack.shift();
                                } else {
                                    _postfix.push(theArr[i]);
                                }
                            }
                        }
                        for (var idx = 0; idx < _operStack.length; idx++) {
                            _postfix.push(_operStack[idx]);
                        }
                    })((function flattenArray(theArr) {
                        for (var i = 0; i < theArr.length; i++) {
                            if (typeof theArr[i] == "string") {
                                flattenedArray += theArr[i] + delim;
                            } else {
                                if (theArr[i] instanceof Array) {
                                    flattenedArray += "(" + delim;
                                    flattenArray(theArr[i]);
                                    flattenedArray += ")" + delim;
                                } else {
                                    flattenedArray += JSON.stringify(theArr[i]) + delim;
                                }
                            }
                        }
                        return flattenedArray;
                    })(this._theExpression));

                    return _postfix;
                };

                Isb.prototype.parseSql = function () {
                    //WHERE (N'foo' = (LOWER([Extent1].[Surname]))) OR (N'clinton' = (LOWER([Extent1].[Surname]))) OR (N'bar' = (LOWER([Extent1].[Surname])))
                };
                return Isb;
            })();
            isbjs.Isb = Isb;
        })(contrivedexample.isbjs || (contrivedexample.isbjs = {}));
        var isbjs = contrivedexample.isbjs;
    })(com.contrivedexample || (com.contrivedexample = {}));
    var contrivedexample = com.contrivedexample;
})(com || (com = {}));
//# sourceMappingURL=app.js.map
