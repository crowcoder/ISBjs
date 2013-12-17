

module com.contrivedexample.isbjs {

    export interface ILangMap {
        equal: string;
        notequal: string;
        startswith: string;
        endswith: string;
        istrue: string;
        isfalse: string;
        isnull: string;
        isnotnull: string;
        contains: string;
        greater: string;
        greatereq: string;
        less: string;
        lesseq: string;
        isin: string;
        isnotin: string;
        defsrch: string;
        reset: string;
    }

    export interface IsbAttributes {
        attrName: string;
        attrValue: string;
    }

    export interface IsbConfig {
        defBtnClass: string;
        defBtnAttributes: Array<IsbAttributes>;

        resetBtnClass: string;
        resetBtnAttributes: Array<IsbAttributes>;

        plusBtnClass: string;
        plusBtnAttributes: Array<IsbAttributes>;

        forkBtnClass: string;
        forBtnAttributes: Array<IsbAttributes>;

        listClass: string; //class name(s) for the root <ul>

        //classes and attributes for all <li>'s except the and/or select
        listItemClass: string;
        listAttributes: Array<IsbAttributes>;
        listItemAttributes: Array<IsbAttributes>;

        //classes and attributes for the and/or <li>
        andOrLiClass: string;
        andOrLiAttributes: Array<IsbAttributes>;

        //classes and attributes for the and/or select options
        andOrOptClass: string;
        andOrOptAttributes: Array<IsbAttributes>;

        //class on the plus and fork buttons
        btnClass: string;

        //classes and attributes for the property select
        propSelClass: string;
        propSelAttributes: Array<IsbAttributes>;

        //classes and attributes for the property select options
        propSelOptClass: string;
        propSelOptAttributes: Array<IsbAttributes>;

        operSelClass: string;
        operSelAttributes: Array<IsbAttributes>;
        operSelOptClass: string;
        operSelOptAttributes: Array<IsbAttributes>;

        valueInputClass: string;
        valueInputAttributes: Array<IsbAttributes>;
        valueInputErrClass: string;

        andOrSelClass: string;
        andOrSelAttributes: Array<IsbAttributes>;

        ulName: string;
        divName: string;
        defaultDataType: string;
        langmap: ILangMap;
        ignoreCase: boolean;
    }

    export interface IsbFiterProperty {
        display: string;
        value: string;
        dataType: string;
    }

    export class Isb {

        private _TEXT: string = "text";
        private _NUMBER: string = "number";
        private _BOOL: string = "bool";
        private _DATE: string = "date";

        private _theInputs: Array<HTMLInputElement>;

        private _sql: string; // var to hold the sql code as it is being constructed
        private _params: Array<string> = [];

        //String literals. May be redefined by configuration
        private _DEFINE_SEARCH: string; //Text on the button that initially builds the search
        private _RESET: string; //Text on the button to reset/clear the search and start over
        private _DEFTYPE: string; //the default data type to use for new filter rows/items
        private _EQUALS: string;
        private _NOTEQUALS: string;
        private _STARTS_WITH: string;
        private _ENDS_WITH: string;
        private _TRUE: string;
        private _FALSE: string;
        private _NULL: string;
        private _NOT_NULL: string;
        private _CONTAINS: string;
        private _GREATER: string;
        private _GREATER_EQ: string;
        private _LESS: string;
        private _LESS_EQ: string;
        private _IN: string;
        private _NOTIN: string;
        private _NOATTR: string;

        private _IGNORECASE: boolean;

        private _theExpression: Array<any>;

        private _textConditions: Array<string>;
        private _dateConditions: Array<string>;
        private _nbrConditions: Array<string>;
        private _boolConditions: Array<string>;
        private _defaultConditions: Array<string>;

        private _propSelect: HTMLSelectElement;

        private _props: Array<IsbFiterProperty>;
        private _fltrConfig: IsbConfig;

        /*****************************************************************************************
        * CONSTRUCTOR
        *****************************************************************************************/
        constructor(fltrConfig: IsbConfig) {
            this._fltrConfig = fltrConfig;
            this._props = [];
            this._theInputs = [];

            //if a language map was supplied, use those values for the string literals
            //otherwise default to English
            var usingLang: boolean = fltrConfig.langmap !== void 0;

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
            this._DEFTYPE = fltrConfig.defaultDataType &&
            (fltrConfig.defaultDataType === "text" || fltrConfig.defaultDataType === "date" ||
            fltrConfig.defaultDataType === "bool" || fltrConfig.defaultDataType === "number") ?
            fltrConfig.defaultDataType : "text";

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

        renderHeader(that): void {

            //create a div containing a button that builds or resets a search session
            var goBtn: HTMLButtonElement = document.createElement("button");
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
        }

        //Add a 'field name' to the list of choices.
        addFilterProperty(prop: IsbFiterProperty): void {
            this._props.push(prop);
            //recreate the prop select each time an item is added
            this._propSelect = this.createPropSelect();
        }

        render(): void {

            var theUL: HTMLUListElement =
                <HTMLUListElement>document.querySelector("#" + this._fltrConfig.ulName);
            theUL.innerHTML = "";
            this._theInputs = [];
            this.addCriteria(this._theExpression, theUL);
            console.log(JSON.stringify(this._theExpression));
        }

        //Internal helper to create a <select> of field names once and clone this
        //one during render instead running this code over and over for each filter "row"
        private createPropSelect(): HTMLSelectElement {
            var propSelect = document.createElement("select");

            //add a class or series of class names if set in the Config
            if (this._fltrConfig.propSelClass != void 0) {
                propSelect.className = this._fltrConfig.propSelClass;
            }

            //Add any attributes to the Select element if set in the Config
            if (this.implementsAttr(this._fltrConfig.propSelAttributes)) {
                for (var attrIdx = 0; attrIdx < this._fltrConfig.propSelAttributes.length; attrIdx++) {
                    propSelect.setAttribute(this._fltrConfig.propSelAttributes[attrIdx].attrName,
                        this._fltrConfig.propSelAttributes[attrIdx].attrValue);
                }
            }

            //Add the options to the Select
            for (var idx = 0; idx < this._props.length; idx++) {
                var opt = document.createElement("option");

                //Set the class if given in the Config
                if (typeof this._fltrConfig.propSelOptClass === "string") {
                    opt.className = this._fltrConfig.propSelOptClass;
                }

                //Add any attributes if set in the Config
                if (this.implementsAttr(this._fltrConfig.propSelOptAttributes)) {
                    for (var optIdx = 0; optIdx < this._fltrConfig.propSelOptAttributes.length; optIdx++) {
                        opt.setAttribute(this._fltrConfig.propSelOptAttributes[optIdx].attrName,
                            this._fltrConfig.propSelOptAttributes[optIdx].attrValue);
                    }
                }

                opt.setAttribute("value", this._props[idx].value);
                opt.appendChild(document.createTextNode(this._props[idx].display));
                propSelect.appendChild(opt);
            }
            return propSelect;
        }

        //Checks if the passed object has an 'attrName' and 'attrValue' property.
        implementsAttr(src): boolean {
            if (src == void 0) {
                return false;
            }

            for (var idx = 0; idx < src.length; idx++) {
                if (!(src[idx].hasOwnProperty("attrName") && src[idx].hasOwnProperty("attrValue"))) {
                    return false;
                }
                else {
                    if (!(typeof src[idx].attrName === "string" && typeof src[idx].attrValue === "string")) {
                        return false;
                    }
                }
            }
            return true;
        }

        //Checks if the passed object has string-valued "display", "value" and "dataType" properties.
        implementsFilter(src): boolean {

            if (src == void 0) { return false; }

            if (!(src.hasOwnProperty("display") &&
                src.hasOwnProperty("value") &&
                src.hasOwnProperty("dataType"))) {
                return false;
            }
            else {
                if (!(typeof src.display === "string" && typeof src.value === "string" && typeof src.dataType === "string")) {
                    return false;
                }
            }
            return true;
        }

        //Called recursively on the backing array, "expressions", to keep the data and UI in sync.
        addCriteria(arr: Array<any>, ul: HTMLUListElement): void {
            var newul: HTMLUListElement;
            for (var i = 0; i < arr.length; i++) {
                if (typeof arr[i] == "string") {

                    //Create the And/Or ListItem and configure its classes and attributes
                    var andornode = document.createElement("li");

                    if (typeof this._fltrConfig.andOrLiClass === "string") {
                        andornode.className = this._fltrConfig.andOrLiClass;
                    }

                    if (this.implementsAttr(this._fltrConfig.propSelOptAttributes)) {
                        for (var andOrIdx = 0; andOrIdx < this._fltrConfig.andOrLiAttributes.length; andOrIdx++) {
                            andornode.setAttribute(this._fltrConfig.andOrLiAttributes[andOrIdx].attrName,
                                this._fltrConfig.andOrLiAttributes[andOrIdx].attrValue);
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
                            andOpt.setAttribute(this._fltrConfig.andOrOptAttributes[andOrOptIdx].attrName,
                                this._fltrConfig.andOrOptAttributes[andOrOptIdx].attrValue);
                            orOpt.setAttribute(this._fltrConfig.andOrOptAttributes[andOrOptIdx].attrName,
                                this._fltrConfig.andOrOptAttributes[andOrOptIdx].attrValue);
                        }
                    }

                    andOrSelect.onchange = (function (idx: number) {
                        return function () { arr[idx] = this.value; };
                    })(i);

                    andOrSelect.appendChild(andOpt);
                    andOrSelect.appendChild(orOpt);
                    andornode.appendChild(andOrSelect);
                    andOrSelect.value = arr[i];

                    if (arr[i + 1] instanceof Array) {
                        andornode.appendChild(this.buildPlusOrFork(i, arr, "p", 2, this));
                    }
                    ul.appendChild(andornode);
                }
                else {
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
                                fltrRow.setAttribute(this._fltrConfig.listItemAttributes[liIdx].attrName,
                                    this._fltrConfig.listItemAttributes[liIdx].attrValue);
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
                                    inp.onchange = (function (idx: number, that) {
                                    return function () {
                                            arr[idx].cnst = this.value;
                                            if (typeof that._fltrConfig.valueInputClass === "string") {
                                                if (this.value !== '') {
                                                    this.className = that._fltrConfig.valueInputClass;
                                                }
                                            }
                                        }
                                })(i, this);

                                    fltrRow.appendChild(inp);
                                    this._theInputs.push(inp);
                                }

                                break;
                            case this._BOOL:
                               // arr[i].cnst = void 0;
                                break;
                        }

                        fltrRow.appendChild(this.buildPlusOrFork(i, arr, "p", 1, this));
                        fltrRow.appendChild(this.buildPlusOrFork(i, arr, "f", 1, this));
                        ul.appendChild(fltrRow);

                        propsel.onchange = (function (idx: number, that) {
                            return function () {
                                arr[idx].prop = this.value;

                                //find the datatype of the item the user just selected
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
                            }
                        })(i, this);

                        //On change of operator, change backing data to match the choice
                        opersel.onchange = (function (idx: number, that) {
                            return function () {
                                arr[idx].oper = this.value;
                                that.render();
                            };
                        })(i, this);
                    }
                }
            }
        }

        buildPropSelect(pos, thearray): HTMLSelectElement {
            var propSelect: HTMLSelectElement = <HTMLSelectElement>this._propSelect.cloneNode(true);
            propSelect.value = thearray[pos].prop;
            return propSelect;
        }

        buildOperatorSelect(whichoper): HTMLSelectElement {
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
                        opt.setAttribute(this._fltrConfig.operSelOptAttributes[operIdx].attrName,
                            this._fltrConfig.operSelOptAttributes[operIdx].attrValue);
                    }
                }

                opt.appendChild(document.createTextNode(whichlist[idx]));
                operSelect.appendChild(opt);
            }
            return operSelect;
        }

        buildPlusOrFork(pos: number, thearray: Array<any>, pOrf: string, offset: number, that): HTMLButtonElement {
            var btn = document.createElement("button");

            if (typeof this._fltrConfig.btnClass === "string") {
                btn.className = this._fltrConfig.btnClass;
            }

            btn.appendChild(document.createTextNode(pOrf === "p" ? "+" : "( )"));

            var pushObj: any;
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

            btn.onclick = (
                function (whicharray: Array<any>, idx: number, pushobj: any, that: any) {
                    return function () {
                        whicharray.splice(idx + offset, 0, "AND", pushobj);
                        that.render();
                    }
                })(thearray, pos, pushObj, that);
            return btn;
        }

        //Parses the search builder to an array of two strings.
        //The first string is the "where" clause and the second is the list of
        //parameters required to execute the where clause.
        parseForLinq(): Array<any> {
            var parseerr = false;
            for (var idx = 0; idx < this._theInputs.length; idx++) {
                if (this._theInputs[idx].value === '') {
                    parseerr = true;
                    if (typeof this._fltrConfig.valueInputErrClass === "string") {
                        this._theInputs[idx].className = this._theInputs[idx].className + " " + this._fltrConfig.valueInputErrClass;
                    }
                }
            }

            if (!parseerr) {
                console.log(JSON.stringify(this._theExpression));
                this.parseLinqToEntities(this._theExpression);
                var sqlstring = this._sql;
                var paramstring = JSON.stringify(this._params);
                this._sql = "";
                this._params = [];
                return [sqlstring, paramstring];
            }
            else {
                return ["Missing search values exist"];
            }
        }

        
        parseToPostFix(): Array<string> {
            var _operStack : Array<string> = [];
            var _postfix : Array<string> = [];
            var flattenedArray = '';
            
            (function parse(flatStr) {
                flatStr = flatStr.substring(0, flatStr.length - 1); //strip trailing comma
                var theArr: Array<string> = flatStr.split(",");

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
                            flattenedArray += theArr[i] + ",";
                        } else {
                            if (theArr[i] instanceof Array) {
                                flattenedArray += "(,";
                                flattenArray(theArr[i]);
                                flattenedArray += "),";
                            } else {
                                flattenedArray += JSON.stringify(theArr[i]) + ",";
                            }
                        }
                    }
                    return flattenedArray;
                })(this._theExpression));

            return _postfix;
        }

        //Parses the backing array to a string suitable for use in a Dynamic Linq where clause.
        private parseLinqToEntities(arr): void {

            if (!arr) {throw "Backing array is undefined" };

            //set the value with the correct data type as well as correct value
            for (var i = 0; i < arr.length; i++) {
                var constVal;
                switch (arr[i].dataType) {
                    case 'date':
                        var dt = new Date(arr[i].cnst);
                        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset()); //chop off timezone offset
                        constVal = dt;
                        break;
                    case 'number':
                        constVal = parseFloat(arr[i].cnst);
                        break;
                    default:
                        constVal = arr[i].cnst;
                        break;
                }

                if (typeof arr[i] == "string") {
                    this._sql += " " + arr[i] + " ";
                }
                else {
                    if (arr[i] instanceof Array) {
                        this._sql += "(";
                        this.parseLinqToEntities(arr[i]);
                        this._sql += ")";
                    } else {
                        var theOperator;
                        switch (arr[i].oper) {
                            case this._EQUALS:
                                switch (arr[i].dataType) {
                                    case "date":
                                    case "bool":
                                    case "number":
                                        theOperator = " " + arr[i].prop + " @" + this._params.length;
                                        this._params.push(constVal);
                                        break;
                                    default:
                                        theOperator = " " + arr[i].prop + (this._IGNORECASE ? ".ToLower() = @" : " = @") + this._params.length;
                                        if (this._IGNORECASE) {
                                            this._params.push(constVal.toLowerCase());
                                        } else {
                                            this._params.push(constVal);
                                        }                                        
                                    }                                                                
                                break;
                            case this._NOTEQUALS:
                                switch (arr[i].dataType) {
                                    case "date":
                                    case "bool":
                                    case "number":
                                        theOperator = " " + arr[i].prop + " != @" + this._params.length;
                                        this._params.push(constVal);
                                        break;
                                    default:
                                        theOperator = " " + arr[i].prop + (this._IGNORECASE ? ".ToLower() != @" : " != @") + this._params.length;
                                        if (this._IGNORECASE) {
                                            this._params.push(constVal.toLowerCase());
                                        } else {
                                            this._params.push(constVal);
                                        }
                                    }   
                                break;
                            case this._LESS:
                                    theOperator = " " + arr[i].prop + " < @" + this._params.length;
                                    this._params.push(constVal);
                                break;
                            case this._LESS_EQ:
                                    theOperator = " " + arr[i].prop + " <= @" + this._params.length;
                                    this._params.push(constVal);
                                break;
                            case this._GREATER:
                                    theOperator = " " + arr[i].prop + " > @" + this._params.length;
                                    this._params.push(constVal);
                                break;
                            case this._GREATER_EQ:
                                    theOperator = " " + arr[i].prop + " >= @" + this._params.length;
                                    this._params.push(constVal);
                                break;
                            case this._STARTS_WITH:
                                theOperator = " " + arr[i].prop + ".StartsWith(@" + this._params.length + ")";
                                this._params.push(constVal);
                                break;
                            case this._ENDS_WITH:
                                theOperator = " " + arr[i].prop + ".EndsWith(@" + this._params.length + ")";
                                this._params.push(constVal);
                                break;
                            case this._NULL:
                                theOperator = " " + arr[i].prop + " = Null";
                                break;
                            case this._NOT_NULL:
                                theOperator = " " + arr[i].prop + " Not = Null";
                                break;
                            case this._IN:
                                var tokens = arr[i].cnst.split(",");
                                theOperator = "(";
                                for (var tokIdx = 0; tokIdx < tokens.length; tokIdx++) {
                                    theOperator += arr[i].prop + ".Equals(@" + this._params.length + ") ";
                                    if (tokIdx !== tokens.length - 1) {
                                        theOperator += "OR ";
                                    }
                                    this._params.push(tokens[tokIdx].trim());
                                }
                                theOperator += ") ";
                                break;
                            case this._CONTAINS:
                                theOperator = " " + arr[i].prop + ".Contains(@" + this._params.length + ")";
                                this._params.push(constVal);
                                break;
                            case this._TRUE:
                                theOperator = " " + arr[i].prop + " = True ";
                                break;
                            case this._FALSE:
                                theOperator = " " + arr[i].prop + " = False ";
                                break;
                            default:
                                throw "Unknown operator " + (arr[i] || "~") + ". Cannot parse.";

                        }

                        if (this._sql == void 0) {
                            this._sql = '';
                        }

                        this._sql += theOperator;
                    }
                }
            }
        }
    }
}