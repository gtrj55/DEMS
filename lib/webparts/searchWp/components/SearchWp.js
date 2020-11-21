var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import styles from './SearchWp.module.scss';
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { PrimaryButton } from 'office-ui-fabric-react';
import { SPOperation } from './SPServices/SPOperation';
import Slider from '@material-ui/core/Slider';
import { Query } from '@syncfusion/ej2-data';
import { MultiSelectComponent, CheckBoxSelection, Inject } from '@syncfusion/ej2-react-dropdowns';
require('./InternalSearch.css');
var SearchWp = /** @class */ (function (_super) {
    __extends(SearchWp, _super);
    function SearchWp(props) {
        var _this = _super.call(this, props) || this;
        _this.keyword = [
            { value: 'eight', label: 'eight', clearableValue: false },
        ];
        _this.maxSelected = 3;
        _this.fields = { text: 'value', value: 'label' };
        //slider functions start
        _this.SliderhandleChange = function (event, newValue) {
            _this.setState({
                SelectedExp: newValue
            });
        };
        _this.select = function () {
            _this.setState({
                selectedSector: _this.mulObj.value || [],
                selectedSkill: _this.mulObj1.value || []
            });
        };
        _this.handleChange = function (selectedOption) {
            var skillClone = selectedOption.map(function (skill) { return skill.label; });
            _this.setState({
                selectedOption: selectedOption,
                selectedSkill: skillClone
            });
        };
        _this.SubmitSkill = function () {
            window.location.href = _this.props.context.pageContext.web.absoluteUrl + "/sitePages/SearchResult.aspx?sk=" + encodeURIComponent(_this.state.selectedSkill);
        };
        _this.submitRequest = function () {
            window.location.href = _this.props.context.pageContext.web.absoluteUrl + "/sitePages/SearchResult.aspx?stor=" + encodeURIComponent(_this.state.selectedSector) + "&sk=" + encodeURIComponent(_this.state.selectedSkill) + "&exp=" + encodeURIComponent(_this.state.SelectedExp);
        };
        _this.state = {
            selectedOption: '',
            selectedSector: [],
            selectedSkill: [],
            options: [],
            KeyOption: [],
            SearchMode: false,
            SelectedExp: [2, 5]
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.ops = new SPOperation();
        return _this;
    }
    //slider functions end
    SearchWp.prototype.componentDidMount = function () {
        var _this = this;
        this.ops.getSector(this.props.context).then(function (sector) {
            _this.ops.GetSkill(_this.props.context).then(function (skill) {
                _this.keyword = skill;
                _this.setState({
                    options: sector,
                    KeyOption: skill
                });
            });
        });
    };
    SearchWp.prototype.render = function () {
        var _this = this;
        var selectedOption = this.state.selectedOption;
        var value = selectedOption;
        var selectedSector = this.state.selectedSector;
        var selectedSkill = this.state.selectedSkill;
        return (React.createElement("div", { className: styles.searchWp },
            React.createElement("div", { className: "container-fluid" }, !this.state.SearchMode ?
                React.createElement("div", null,
                    React.createElement("div", { className: "row searchOnMiddleDiv1" },
                        React.createElement("div", { className: "col-md-7 offset-md-1 searchOnMiddleDiv2" },
                            React.createElement("div", { className: "form-group searchOnMiddleDiv3" },
                                React.createElement("label", { className: "labelSearchkeyword" },
                                    React.createElement("h6", null, "Search by Keyword"),
                                    this.state.selectedSkill.length > 2 ? React.createElement("span", { className: "spanSearchkeyword" }, "**Maximum skill 3 selected") : React.createElement(React.Fragment, null)),
                                React.createElement(Select, { name: "form-field-name", multi //for Multi select
                                    : true, autofocus: true, placeholder: "Search", value: value, onChange: this.handleChange, options: this.state.selectedSkill.length < 3 ? this.keyword : null, clearable: true }))),
                        React.createElement("div", { className: "col-md-3" },
                            React.createElement("div", { className: "form-group" },
                                React.createElement("label", { style: { width: "100%" } },
                                    React.createElement("h6", { style: { visibility: "hidden" } }, "Search")),
                                React.createElement(PrimaryButton, { text: "Search", onClick: this.SubmitSkill, className: "buttonSave", disabled: this.state.selectedSkill.length == 0 }))),
                        React.createElement("div", { className: "col-md-1" })),
                    React.createElement("div", { className: "row advanceDiv" },
                        React.createElement("div", { className: "col-md-11 offset-md-1 AdvanceDivMargin1" },
                            React.createElement("a", { style: { color: "#196EAE" }, onClick: function () { _this.setState({ SearchMode: true }); } }, "Advanced Search")))) :
                React.createElement("div", null,
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-md-6 offset-md-3" },
                            React.createElement("h4", { className: "AdvanceH" }, "Advanced Search"),
                            React.createElement("button", { onClick: function () { _this.setState({ SearchMode: false }); }, type: "button", className: "close AdvanceHClose", "aria-label": "Close" },
                                React.createElement("span", { "aria-hidden": "true" }, "\u00D7")),
                            React.createElement("hr", { className: "hrclear" }))),
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-md-6 offset-md-3" },
                            React.createElement("div", { className: "form-group" },
                                React.createElement("label", null,
                                    React.createElement("strong", null,
                                        React.createElement("span", { className: "mandatory" }, "*"),
                                        "Skill:")),
                                React.createElement(MultiSelectComponent, { id: "mtselement", ref: function (scope1) { _this.mulObj1 = scope1; }, dataSource: this.state.KeyOption, placeholder: "Skills", mode: "CheckBox", showDropDownIcon: true, change: this.select, maximumSelectionLength: 3, filterBarPlaceholder: "Search Skills", popupHeight: "350px", fields: this.fields, allowFiltering: true, filtering: function (e) {
                                        var query = new Query();
                                        query = (e.text != "") ? query.where("value", "contains", e.text, true) : query;
                                        e.updateData(_this.state.KeyOption, query);
                                    } },
                                    React.createElement(Inject, { services: [CheckBoxSelection] })))),
                        React.createElement("div", { className: "col-md-3" })),
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-md-6 offset-md-3" },
                            React.createElement("div", { className: "form-group" },
                                React.createElement("label", null,
                                    React.createElement("strong", null, "Sector:")),
                                React.createElement(MultiSelectComponent, { id: "checkbox", ref: function (scope) { _this.mulObj = scope; }, dataSource: this.state.options, placeholder: "Sector", mode: "CheckBox", showDropDownIcon: true, change: this.select, maximumSelectionLength: 3, filterBarPlaceholder: "Search Sectors", popupHeight: "350px", fields: this.fields, allowFiltering: true, filtering: function (e) {
                                        var query = new Query();
                                        query = (e.text != "") ? query.where("value", "contains", e.text, true) : query;
                                        e.updateData(_this.state.options, query);
                                    }, style: { border: "1px solid" } },
                                    React.createElement(Inject, { services: [CheckBoxSelection] })))),
                        React.createElement("div", { className: "col-md-3" }),
                        React.createElement("div", { className: "col-md-6 offset-md-3" },
                            React.createElement("div", { className: "form-group" },
                                React.createElement("label", null,
                                    React.createElement("strong", null,
                                        "Experience: ",
                                        this.state.SelectedExp[0],
                                        " ",
                                        Number(this.state.SelectedExp[0]) > 1 ? "Yrs" : "Yr",
                                        " - ",
                                        this.state.SelectedExp[1],
                                        " ",
                                        Number(this.state.SelectedExp[1]) > 1 ? "Yrs" : "Yr")),
                                React.createElement("div", { style: { width: "100%" } },
                                    React.createElement(Slider, { min: 0, max: 20, value: this.state.SelectedExp, onChange: this.SliderhandleChange, valueLabelDisplay: "auto", "aria-labelledby": "range-slider" })))),
                        React.createElement("div", { className: "col-md-3" }),
                        React.createElement("div", { className: "col-md-12 offset-md-3 marginButtonDiv" },
                            React.createElement(PrimaryButton, { text: "Search", onClick: this.submitRequest, className: "buttonSave", disabled: this.state.selectedSkill.length == 0 })))))));
    };
    return SearchWp;
}(React.Component));
export default SearchWp;
//# sourceMappingURL=SearchWp.js.map