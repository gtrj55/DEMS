
import * as React from 'react';
import styles from './SearchWp.module.scss';
import { ISearchWpProps } from './ISearchWpProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';
import MultiSelect from "@khanacademy/react-multi-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { PrimaryButton, getSubmenuItems, Button } from 'office-ui-fabric-react';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { SPOperation } from './SPServices/SPOperation';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { MultiSelectComponent, CheckBoxSelection, Inject } from '@syncfusion/ej2-react-dropdowns';
require('./InternalSearch.css');
export interface ISelectState {
  selectedOption?: string;
  selectedSector: any;
  selectedSkill: any;
  options: any;
  KeyOption: any;
  SearchMode: boolean;
  SelectedExp: any;
}
export default class SearchWp extends React.Component<ISearchWpProps, ISelectState, {}> {
  public ops: SPOperation;
  public keyword = [
    { value: 'eight', label: 'eight', clearableValue: false },
  ];
  public maxSelected = 3;
  private fields: object = { text: 'value', value: 'label' };
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '',
      selectedSector: [],
      selectedSkill: [],
      options: [],
      KeyOption: [],
      SearchMode: false,
      SelectedExp: [2, 5]
    };
    this.handleChange = this.handleChange.bind(this);
    this.ops = new SPOperation();
  }
  //slider functions start
  public SliderhandleChange = (event, newValue) => {
    this.setState({
      SelectedExp: newValue
    });
  }
  //slider functions end

  public componentDidMount() {
    this.ops.getSector(this.props.context).then((sector: any) => {
      this.ops.GetSkill(this.props.context).then((skill: any) => {
        this.keyword = skill;
        this.setState({
          options: sector,
          KeyOption: skill
        });
      });

    });

  }
  public mulObj: MultiSelectComponent;
  public mulObj1: MultiSelectComponent;
  public select = () => {
    this.setState({
      selectedSector: this.mulObj.value || [],
      selectedSkill: this.mulObj1.value || []
    });
  }

  private handleChange = (selectedOption) => {
    let skillClone = selectedOption.map(skill => skill.label);
    this.setState({
      selectedOption,
      selectedSkill: skillClone
    });
  }
  public SubmitSkill = () => {
    window.location.href = this.props.context.pageContext.web.absoluteUrl + "/sitePages/SearchResult.aspx?sk=" + encodeURIComponent(this.state.selectedSkill);
  }
  public submitRequest = () => {
    window.location.href = this.props.context.pageContext.web.absoluteUrl + "/sitePages/SearchResult.aspx?stor=" + encodeURIComponent(this.state.selectedSector) + "&sk=" + encodeURIComponent(this.state.selectedSkill) + "&exp=" + encodeURIComponent(this.state.SelectedExp);
  }
  public render(): React.ReactElement<ISearchWpProps> {
    const { selectedOption } = this.state;
    const value = selectedOption;
    const { selectedSector } = this.state;
    const { selectedSkill } = this.state;


    return (
      <div className={styles.searchWp}>
        <div className="container-fluid">
          {!this.state.SearchMode ?
            <div>
              <div className="row searchOnMiddleDiv1">
                {/* <Spinner size={SpinnerSize.large} /> */}

                <div className="col-md-7 offset-md-1 searchOnMiddleDiv2">

                  <div className="form-group searchOnMiddleDiv3">
                    <label className="labelSearchkeyword"><h6>Search by Keyword</h6>{this.state.selectedSkill.length > 2 ? <span className="spanSearchkeyword">**Maximum skill 3 selected</span> : <></>}</label>
                    <Select
                      name="form-field-name"
                      multi  //for Multi select
                      autofocus
                      placeholder="Search"
                      value={value}
                      onChange={this.handleChange}
                      options={this.state.selectedSkill.length < 3 ? this.keyword : null}
                      clearable={true}
                    />
                  </div>


                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label style={{ width: "100%" }}><h6 style={{ visibility: "hidden" }}>Search</h6></label>
                    <PrimaryButton text="Search" onClick={this.SubmitSkill} className="buttonSave" disabled={this.state.selectedSkill.length == 0} />
                  </div>
                </div>
                <div className="col-md-1">

                </div>
              </div>
              <div className="row advanceDiv">
                <div className="col-md-11 offset-md-1 AdvanceDivMargin1">
                  <a style={{ color: "#196EAE" }} onClick={() => { this.setState({ SearchMode: true }); }}>Advanced Search</a>
                </div>
              </div>
            </div> :
            <div>
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <h4 className="AdvanceH">Advanced Search</h4>
                  <button onClick={() => { this.setState({ SearchMode: false }); }} type="button" className="close AdvanceHClose" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  {/* <a onClick={()=>{this.setState({SearchMode:false})}}>Advance Search</a> */}
                  <hr className="hrclear" />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <div className="form-group">
                    <label><strong><span className="mandatory">*</span>Skill:</strong></label>
                    <MultiSelectComponent id="mtselement" ref={(scope1) => { this.mulObj1 = scope1; }} dataSource={this.state.KeyOption}
                      placeholder="Skills" mode="CheckBox"
                      showDropDownIcon={true} change={this.select}
                      maximumSelectionLength={3} filterBarPlaceholder="Search Skills" popupHeight="350px"
                      fields={this.fields}
                      allowFiltering={true} 
                      filtering={(e: FilteringEventArgs)=>{
                      let query = new Query();
                      query = (e.text != "") ? query.where("value","contains", e.text, true) : query;
                      e.updateData(this.state.KeyOption, query);
                }}
                      >
                      <Inject services={[CheckBoxSelection]} />
                    </MultiSelectComponent>

                  </div>
                </div>
                <div className="col-md-3"></div>
              </div>
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <div className="form-group">
                    <label><strong>Sector:</strong></label>
                    <MultiSelectComponent id="checkbox" ref={(scope) => { this.mulObj = scope; }} dataSource={this.state.options}
                      placeholder="Sector" mode="CheckBox"
                      showDropDownIcon={true} change={this.select}
                      maximumSelectionLength={3} filterBarPlaceholder="Search Sectors" popupHeight="350px"
                      fields={this.fields}
                      allowFiltering={true} 
                      filtering={(e: FilteringEventArgs)=>{
                      let query = new Query();
                      query = (e.text != "") ? query.where("value","contains", e.text, true) : query;
                      e.updateData(this.state.options, query);
                      }}
                      style={{ border: "1px solid" }} >
                      <Inject services={[CheckBoxSelection]} />
                    </MultiSelectComponent>
                  </div>
                </div>
                <div className="col-md-3"></div>
                <div className="col-md-6 offset-md-3">
                  <div className="form-group">
                    <label><strong>Experience: {this.state.SelectedExp[0]} {Number(this.state.SelectedExp[0])>1?"Yrs":"Yr"} - {this.state.SelectedExp[1]} {Number(this.state.SelectedExp[1])>1?"Yrs":"Yr"}</strong></label>
                    <div style={{ width: "100%" }}>
                      <Slider
                        min={0}
                        max={20}
                        value={this.state.SelectedExp}
                        onChange={this.SliderhandleChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3"></div>
                <div className="col-md-12 offset-md-3 marginButtonDiv">
                  <PrimaryButton text="Search" onClick={this.submitRequest} className="buttonSave" disabled={this.state.selectedSkill.length == 0} />
                  {/* <PrimaryButton text="Search"  className="buttonSave" /> */}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}
