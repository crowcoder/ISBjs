

module com.contrivedexample.isbjs {

    export interface IsbConfig {
        listClass: string;
        listItemClass: string;
        divName: string;
    }

    export interface IsbFiterProperty {
        display: string;
        value: string;
        dataType: string;
    }

    class Translations {
        public _equals = {
            "en": "Is equal to",
            "zh": "等於",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "jaanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _notequals = {
            "en": "Is not equal to",
            "zh": "不等於",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _startswith = {
            "en": "Starts with",
            "zh": "開頭",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _endswith = {
            "en": "Ends with",
            "zh": "以結束",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _true = {
            "en": "Is true",
            "zh": "是真的",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _false = {
            "en": "Is false",
            "zh": "是錯誤的",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _null = {
            "en": "Is null",
            "zh": "為空",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _notnull = {
            "en": "Is not null",
            "zh": "不是 null",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _contains = {
            "en": "Contains",
            "zh": "包含",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _greater = {
            "en": "Is greater than",
            "zh": "大於",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _greatereq = {
            "en": "Is greater than or equal to",
            "zh": "大於或等於",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _less = {
            "en": "Is less than",
            "zh": "是少於",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _lesseq = {
            "en": "Is less than or equal to",
            "zh": "小於或等於",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _in = {
            "en": "Is in",
            "zh": "是在範圍內",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };

        public _notin = {
            "en": "Is not in",
            "zh": "不在",
            "fr": "french",
            "de": "german",
            "es": "Es igual a",
            "ja": "japanese",
            "it": "italian",
            "he": "hebrew",
            "hu": "hungarian",
            "ms": "malay",
            "ru": "russian"
        };
    }

    export class Isb {
        constructor(fltrConfig: IsbConfig) {
            this._fltrConfig = fltrConfig;
            this._props = [];
            this._theExpression = [
                {
                    'prop': 'LastName',
                    'oper': '=',
                    'cnst': 'Mitchell',
                    'dataType': 'text'
                }];            

            //var trans = new Translations();
            
        }

        
        private _TEXT: string = "text";
        private _NUMBER: string = "number";
        private _BOOL: string = "bool";
        private _DATE: string = "date";
        
        
        
        private _EQUALS: string = "等於";
        private _NOTEQUALS: string = "Is not equal to";
        private _STARTS_WITH: string = "Starts with";
        private _ENDS_WITH: string = "Ends with";
        private _TRUE: string = "True";
        private _FALSE: string = "False";
        private _NULL: string = "Null";
        private _NOT_NULL: string = "Not null";
        private _CONTAINS: string = "Contains";
        private _GREATER: string = "Is greater than";
        private _GREATER_EQ: string = "Is greater or =";
        private _LESS: string = "Is less than";
        private _LESS_EQ: string = "Is less or =";
        private _IN: string = "In";
        private _NOTIN: string = "Not In";
        private _theExpression: Array<any>;

        private _textConditions = [this._EQUALS, this._CONTAINS, this._STARTS_WITH, this._ENDS_WITH, this._NULL, this._NOTEQUALS, this._NOT_NULL];
        private _dateConditions = [this._EQUALS, this._GREATER, this._GREATER_EQ, this._LESS, this._LESS_EQ, this._NULL, this._NOT_NULL];
        private _nbrConditions = [this._EQUALS, this._GREATER, this._GREATER_EQ, this._LESS, this._LESS_EQ, this._NULL, this._NOT_NULL];
        private _boolConditions = ["True", "False"];
        private _propSelect: HTMLSelectElement;

        setLanguage() {

        }

        private _props: Array<IsbFiterProperty>;
        private _fltrConfig: IsbConfig;

        //Add a 'field name' to the list of choices.
        addFilterProperty(prop: IsbFiterProperty) {
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
            for (var idx = 0; idx < this._props.length; idx++) {
                var opt = document.createElement("option");
                opt.setAttribute("value", this._props[idx].value);
                opt.appendChild(document.createTextNode(this._props[idx].display));
                propSelect.appendChild(opt);
            }
            return propSelect;
        }

        //called recursively on the backing array, "expressions", to keep the data and UI in sync
        addCriteria(arr: Array<any>, ul: HTMLUListElement): void {
            var newul: HTMLUListElement;
            for (var i = 0; i < arr.length; i++) {
                if (typeof arr[i] == "string") {
                    var andornode = document.createElement("li");
                    andornode.className = this._fltrConfig.listItemClass;
                    var andOrSelect = document.createElement("select");
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
                        //var minusBtn = document.createElement("button");
                        //minusBtn.appendChild(document.createTextNode("-"));
                        //fltrRow.appendChild(minusBtn);

                        var opersel = this.buildOperatorSelect(arr[i].dataType);
                        opersel.value = arr[i].oper;
                        var propsel = this.buildPropSelect(i, arr);
                        // propsel["operator"] = opersel; //assign it an operator select so we can change the datatype of items

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

        buildPropSelect(pos, thearray) {
            var propSelect: HTMLSelectElement = <HTMLSelectElement>this._propSelect.cloneNode(true);
            propSelect.value = thearray[pos].prop;
            return propSelect;
        }

        buildOperatorSelect(whichoper) {
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

        buildPlusOrFork(pos: number, thearray: Array<any>, pOrf: string, offset: number, that) {
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

        buildPlus(pos: number, thearray: Array<any>, that) {
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

        buildAndOr(pos, thearray, that) {

            var addCriteriaSelect = document.createElement("select");

            var noOpt = document.createElement("option");
            noOpt.setAttribute("value", '?');
            noOpt.appendChild(document.createTextNode(''));

            var andOpt = document.createElement("option");
            andOpt.setAttribute("value", "AND");
            andOpt.appendChild(document.createTextNode("AND"));

            var orOpt = document.createElement("option");
            orOpt.setAttribute("value", "OR");
            orOpt.appendChild(document.createTextNode("OR"));

            addCriteriaSelect.appendChild(noOpt);
            addCriteriaSelect.appendChild(andOpt);
            addCriteriaSelect.appendChild(orOpt);

            addCriteriaSelect.onchange = (
                function (whicharray, idx, that) {
                        return function () {
                        whicharray.splice(idx + 1, 0, this.value, { 'prop': "?", 'oper': '?', 'const': '?' });
                        that.render();
                    }
                    }
                )(thearray, pos, that);

            return addCriteriaSelect;
        }
    }
}