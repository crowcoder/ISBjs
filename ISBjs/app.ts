interface IsbConfig {
    listClass: string;
    listItemClass: string;
    divName: string;
}

interface IsbFiterProperty {
    display: string;
    value: string;
    dataType: string;
}

interface IsbLine {
    prop: string;
    oper: string;
    cnst: string;
    dataType: string;
}

module com.contrivedexample.isb {

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
        }

        private _theExpression: Array<any>;

        private _textConditions = ["Is equal to", "Contains", "Starts With", "Ends With", "Is Null"];
        private _dateConditions = ["Is equal to", "Is greater than", "Is less than", "Is Null"];
        private _nbrConditions = ["Is equal to", "Is greater than", "Is less than", "Is Null"];
        private _boolConditions = ["True", "False"];

        private EQUALS: string = "=";
        private STARTS_WITH: string = "sw";
        private TRUE: string = "t";
        private FALSE: string = "f";
        private CONTAINS: string = "c";
        private GREATER: string = ">";
        private GREATER_EQ: string = ">=";
        private LESS: string = "<";
        private LESS_EQ: string = "<=";

        private _props: Array<IsbFiterProperty>;
        private _fltrConfig: IsbConfig;

        addFilterProperty(prop: IsbFiterProperty) {
            this._props.push(prop);
        }

        render() {
            var theUl: HTMLUListElement =
                <HTMLUListElement>document.querySelector("#" + this._fltrConfig.divName);
            theUl.innerHTML = "";
            this.addCriteria(this._theExpression, theUl);
            console.log(JSON.stringify(this._theExpression));
        }

        addCriteria(arr: Array<any>, ul: HTMLUListElement) {
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

                    andOrSelect.onchange = (function (idx:number) {
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

                        var opersel = this.buildOperatorSelect("text")
                        var propsel = this.buildPropSelect(i, arr);
                        propsel["operator"] = opersel; //assign it an operator select so we can change the datatype of items

                        propsel.onchange = (function (idx:number, that) {
                            return function () {
                                arr[idx].prop = this.value;
                                var datatype;
                                for (var j = 0; j < that._props.length; j++) {
                                    if (that._props[j].value === this.value) {
                                        datatype = that._props[j].dataType;
                                    }
                                }

                                propsel["operator"].innerHTML = "";
                                var whichlist;
                                switch (datatype) {
                                    case "text":
                                        whichlist = that._textConditions;
                                        break;
                                    case "number":
                                        whichlist = that._nbrConditions;
                                        break;
                                    case "bool":
                                        whichlist = that._boolConditions;
                                        break;
                                    case "date":
                                        whichlist = that._dateConditions;
                                        break;
                                }

                                for (var i = 0; i < whichlist.length; i++) {
                                    var optn = document.createElement("option");
                                    optn.setAttribute("value", whichlist[i]);
                                    optn.appendChild(document.createTextNode(whichlist[i]));
                                    propsel["operator"].appendChild(optn);
                                }
                            }
                        })(i, this);

                        fltrRow.appendChild(propsel);
                        fltrRow.appendChild(opersel);
                        var inp = document.createElement("input");
                        inp.setAttribute("type", "text");
                        inp.setAttribute("size", "10");
                        inp.setAttribute("value", arr[i].cnst);
                        fltrRow.appendChild(inp);

                        fltrRow.appendChild(this.buildPlusOrFork(i, arr, "p", 1, this));
                        fltrRow.appendChild(this.buildPlusOrFork(i, arr, "f", 1, this));
                        ul.appendChild(fltrRow);
                    }
                }
            }
        }

        buildPropSelect(pos, thearray) {
            var propSelect = document.createElement("select");

            for (var i = 0; i < this._props.length; i++) {
                var opt = document.createElement("option");
                opt.setAttribute("value", this._props[i].value);
                opt.appendChild(document.createTextNode(this._props[i].display));
                propSelect.appendChild(opt);
            }
            propSelect.value = thearray[pos].prop;

            return propSelect;
        }

        buildOperatorSelect(whichoper) {
            var operSelect = document.createElement("select");
            for (var i = 0; i < this._textConditions.length; i++) {
                var opt = document.createElement("option");
                opt.setAttribute("value", this._textConditions[i]);
                opt.appendChild(document.createTextNode(this._textConditions[i]));
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