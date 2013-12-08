

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

        andOrSelClass: string;
        andOrSelAttributes: Array<IsbAttributes>;

        divName: string;
        langmap: ILangMap;
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

        //String literals. May be redefined by configuration
        private _DEFINE_SEARCH: string;
        private _RESET: string;
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

        private _theExpression: Array<any>;

        private _textConditions: Array<string>;
        private _dateConditions: Array<string>;
        private _nbrConditions: Array<string>;
        private _boolConditions: Array<string>;

        private _propSelect: HTMLSelectElement;

        private _props: Array<IsbFiterProperty>;
        private _fltrConfig: IsbConfig;

        constructor(fltrConfig: IsbConfig) {
            this._fltrConfig = fltrConfig;
            this._props = [];

            //if a language map was supplied, use those values for the string literals
            //otherwise default to English
            var usingLang: boolean = fltrConfig.langmap !== void 0;

            this._EQUALS = usingLang ? fltrConfig.langmap.equal : "Is equal to";
            this._NOTEQUALS = usingLang ? fltrConfig.langmap.notequal : "Is not equal to";
            this._STARTS_WITH =usingLang ? fltrConfig.langmap.startswith : "Starts with";
            this._ENDS_WITH = usingLang ?fltrConfig.langmap.endswith : "Ends with";
            this._TRUE = usingLang ?fltrConfig.langmap.istrue : "Is true";
            this._FALSE = usingLang ?fltrConfig.langmap.isfalse : "Is false";
            this._NULL = usingLang ?fltrConfig.langmap.isnull: "Is null";
            this._NOT_NULL = usingLang ?fltrConfig.langmap.isnotnull: "Is not null";
            this._CONTAINS = usingLang ?fltrConfig.langmap.contains: "Contains";
            this._GREATER = usingLang ?fltrConfig.langmap.greater: "Is greater than";
            this._GREATER_EQ = usingLang ?fltrConfig.langmap.greatereq: "Is greater than or equal to";
            this._LESS = usingLang ?fltrConfig.langmap.less : "Is less than";
            this._LESS_EQ = usingLang ?fltrConfig.langmap.lesseq : "Is less than or equal to";
            this._IN = usingLang ?fltrConfig.langmap.isin: "Is in";
            this._NOTIN = usingLang ?fltrConfig.langmap.isnotin: "Is not in";
            this._DEFINE_SEARCH = usingLang ?fltrConfig.langmap.defsrch : "Define Search";
            this._RESET = usingLang ? fltrConfig.langmap.reset : "Reset";
            
            this._textConditions = [this._EQUALS, this._CONTAINS, this._STARTS_WITH, this._ENDS_WITH, this._NULL, this._NOTEQUALS, this._NOT_NULL];
            this._dateConditions = [this._EQUALS, this._GREATER, this._GREATER_EQ, this._LESS, this._LESS_EQ, this._NULL, this._NOT_NULL];
            this._nbrConditions = [this._EQUALS, this._GREATER, this._GREATER_EQ, this._LESS, this._LESS_EQ, this._NULL, this._NOT_NULL];
            this._boolConditions = [this._TRUE, this._FALSE];

            this._theExpression = [
                {
                    'prop': 'LastName',
                    'oper': '=',
                    'cnst': 'Mitchell',
                    'dataType': 'text'
                }];
        }

        //Add a 'field name' to the list of choices.
        addFilterProperty(prop: IsbFiterProperty): void {
            this._props.push(prop);
            //recreate the prop select each time an item is added
            this._propSelect = this.createPropSelect();
        }

        render(): void {
            var theUl: HTMLUListElement =
                <HTMLUListElement>document.querySelector("#" + this._fltrConfig.divName);
            theUl.innerHTML = "";
            this.addCriteria(this._theExpression, theUl);
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
            if(this.isImplementor(this._fltrConfig.propSelAttributes)) {
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
                if (this.isImplementor(this._fltrConfig.propSelOptAttributes)) {
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

        //Checks if the passed objec has an 'attrName' and 'attrValue' property
        isImplementor(src, ...theProperties: Array<string>): boolean {
            for (var idx = 0; idx < src.length; idx++) {
                if (!(src[idx].hasOwnProperty("attrName") && src[idx].hasOwnProperty("attrValue"))) {
                    return false;
                }
                else {
                    if(!(typeof src[idx].attrName === "string" && typeof src[idx].attrValue === "string")) {
                        return false;
                    }
                }
            }
                return true;
        }

        //called recursively on the backing array, "expressions", to keep the data and UI in sync
        addCriteria(arr: Array<any>, ul: HTMLUListElement): void {
            var newul: HTMLUListElement;
            for (var i = 0; i < arr.length; i++) {
                if (typeof arr[i] == "string") {

                    //Create the And/Or ListItem and configure its classes and attributes
                    var andornode = document.createElement("li");
                    andornode.className = this._fltrConfig.andOrLiClass;
                    if (this._fltrConfig.andOrLiAttributes != void 0) {
                        for (var andOrIdx = 0; andOrIdx < this._fltrConfig.andOrLiAttributes.length; andOrIdx++) {
                            andornode.setAttribute(this._fltrConfig.andOrLiAttributes[andOrIdx].attrName,
                                this._fltrConfig.andOrLiAttributes[andOrIdx].attrValue);
                        }
                    }

                    //Create the And/Or <select> and configure its classes and attributes
                    var andOrSelect = document.createElement("select");
                    if (typeof this._fltrConfig.andOrSelClass === "string") {
                        andornode.className = this._fltrConfig.andOrSelClass;
                    }
                    if (this._fltrConfig.andOrSelAttributes != void 0) {

                    }                    

                    var andOpt = document.createElement("option");
                    andOpt.setAttribute("value", "AND");
                    andOpt.appendChild(document.createTextNode("AND"));
                    var orOpt = document.createElement("option");
                    orOpt.setAttribute("value", "OR");
                    orOpt.appendChild(document.createTextNode("OR"));

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
                        newul.className = this._fltrConfig.listClass;
                        ul.appendChild(newul);
                        this.addCriteria(arr[i], newul);
                    } else {
                        var fltrRow = document.createElement("li");
                        fltrRow.className = this._fltrConfig.listItemClass;
                        
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
                                    inp.setAttribute("size", "10");
                                    inp.setAttribute("type", arr[i].dataType);
                                    inp.setAttribute("value", arr[i].cnst);
                                    propsel["inpt"] = inp;
                                    inp.onchange = (function (idx: number, that) {
                                    return function () {
                                            arr[idx].cnst = this.value;
                                        }
                                })(i, this);

                                    fltrRow.appendChild(inp);
                                }

                                break;
                            case this._BOOL:
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

            for (var idx = 0; idx < whichlist.length; idx++) {
                var opt = document.createElement("option");
                opt.setAttribute("value", whichlist[idx]);
                opt.appendChild(document.createTextNode(whichlist[idx]));
                operSelect.appendChild(opt);
            }
            return operSelect;
        }

        buildPlusOrFork(pos: number, thearray: Array<any>, pOrf: string, offset: number, that): HTMLButtonElement {
            var btn = document.createElement("button");
            btn.appendChild(document.createTextNode(pOrf === "p" ? "+" : "( )"));

            var pushObj: any;
            if (pOrf === "p") {
                pushObj = {
                    'prop': this._props[0].value,
                    'oper': this._textConditions[0],
                    'cnst': '?',
                    'dataType': 'text'
                };
            } else {
                pushObj = [{
                    'prop': this._props[0].value,
                    'oper': this._textConditions[0],
                    'cnst': '?',
                    'dataType': 'text'
                }];
            }

            btn.onclick = (
                function (whicharray: Array<any>, idx: number, that: any) {
                    return function () {
                        whicharray.splice(idx + offset, 0, "AND", pushObj);
                        that.render();
                    }
                })(thearray, pos, that);
            return btn;
        }

        buildPlus(pos: number, thearray: Array<any>, that): HTMLButtonElement {
            var plusBtn = document.createElement("button");
            plusBtn.appendChild(document.createTextNode("+"));
            plusBtn.onclick = (
                function (whicharray: Array<any>, idx: number, that: any) {
                        return function () {
                        whicharray.splice(idx + 1, 0, "AND",
                            {
                                'prop': this.props[0].value,
                                'oper': this.textConditions[0],
                                'cnst': '?',
                                'dataType': 'text'
                            });
                        that.render();
                    }
                    }
                )(thearray, pos, that);
            return plusBtn;
        }

    }
}