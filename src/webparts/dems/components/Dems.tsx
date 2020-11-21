import * as React from 'react';
import styles from './Dems.module.scss';
import { IDemsProps } from './IDemsProps';
import "bootstrap/dist/css/bootstrap.min.css";
import { SPComponentLoader } from '@microsoft/sp-loader';
import { IDemsState } from './IDemsState';
import { SPOperation } from './SPServices/SPOperation';
import { TextField, PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { IconButton } from 'office-ui-fabric-react';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { Query } from '@syncfusion/ej2-data';
import { MultiSelectComponent, CheckBoxSelection, Inject } from '@syncfusion/ej2-react-dropdowns';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import Slider from '@material-ui/core/Slider';
import * as $ from 'jquery';

require('./InternalDems.css');

const modelProps = {
  isBlocking: false,

};
const dialogContentProps = {
  type: DialogType.largeHeader,
  title: 'All emails together',
  subText: 'Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails.',
};

export default class Dems extends React.Component<IDemsProps, IDemsState, {}> {
  /**
   *
   */

  public spOp: SPOperation;
private fields: object = { text: 'text', value: 'Id' };
  constructor(props) {
    super(props);
    SPComponentLoader.loadCss('//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css');
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
    SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
      SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js', { globalExportsName: 'jQuery' }).then((): void => {
      });
    });
    
    this.spOp = new SPOperation();
    this.state = {
      ResumeURL: '',
      card: [],
      option: [],
      inputText: [],
      AttachmentName: "",
      buttonHasBeenClicked: true,
      NotificationMessage: [],
      currentUser: "",
      currentUserEmail: "",
      dSkill: [],
      dSector: [],
      dSectorSelected: [],
      dSkillSelected: [],
      dExp: [2, 5],
      defaultSkill: [],
      defaultSector: [],
      hideDialog: true,
      NotFound: false,
      ShowMessageMeetingForReview: false,
      isChecked: false,
      isApply: false,
      isSend: false,
      SharingResourceName:''
    };
  }
  public componentDidMount() {
    let decodeURL = decodeURIComponent(window.location.href);
    let queryParms = new UrlQueryParameterCollection(decodeURL.replace(/#/g, "Sharp"));
    let sector1 = queryParms.getValue("stor");
    let sector: any;
    let skill: any;
    let Exp: any;
    //replace sharp to # and slipt it to an array
    if (sector1 && sector1 != "null") {
      sector = sector1.replace(/Sharp/g, "#");
      sector = decodeURIComponent(sector).split(",");
    }

    let skill1 = queryParms.getValue("sk");
    if (skill1) {
      skill = skill1.replace(/Sharp/g, "#");
      skill = decodeURIComponent(skill).split(",");

    }

    let Exp1 = queryParms.getValue("exp");
    if (Exp1) {
      Exp = Exp1.split(",").map(function (item) {
        return parseInt(item);
      });
    }

    this.spOp.getNotification(this.props.context,this.props.forSector,this.props.forSkill,this.props.emailTemplate).then((result: any) => {
      this.setState({
        NotificationMessage: result[0],
        dSector: result[1],
        dSkill: result[2],
        isApply: skill ? (skill.length > 0) : false,
        defaultSector: sector,
        defaultSkill: skill
      });
    });
    if (skill && sector == undefined && Exp == undefined)
      this.skillSearchFunction(skill);
    else if (skill && sector && Exp)
      this.AllSearchFunction(skill, sector, Exp);
    else if (sector == undefined && Exp && skill)
      this.AllSearchFunction(skill, undefined, Exp);

    this.spOp.getCurrentUserInformation().then((name: string) => {
      this.setState({
        currentUser: name.split("/")[0],
        currentUserEmail: name.split("/")[1]
      });
    });
  }
  public componentDidUpdate() {
    this.state.card.map(item =>
      this.state.option.map(items => {
        if (items.Id == item.Id) {
          let checking = document.getElementsByClassName("checkboxNew" + item.Id)[0] as HTMLInputElement;
          checking.checked = true;
        }
      }));
  }
  //Start predefined function used in some controls  --1
  public toggleHideDialog = () => {
    this.setState({
      hideDialog: !this.state.hideDialog
    });
  }
  public mulObj: MultiSelectComponent;
  public mulObj1: MultiSelectComponent;

  public select = () => {
    this.setState({
      dSectorSelected: this.mulObj.value || [],
      dSkillSelected: this.mulObj1.value || []
    });
  }
  //slider functions start
  public SliderhandleChange = (event, newValue) => {
    this.setState({
      dExp: newValue
    });
  }
  //slider functions end
  //End predefined function used in some controls  --1

  public pageProfileFilter = () => {
    this.AllSearchFunction(this.state.dSkillSelected, this.state.dSectorSelected, this.state.dExp);
  }

  public skillSearchFunction = (skill) => {
    let query1 = this.CamlQueryFinder(skill, null, null);
    this.spOp.ResultCollection1(query1, skill, null,this.props.profileList).then((result) => {
      this.setState({
        option: result,
        dSkillSelected: skill,
        dExp: [0, 20],
        NotFoundQuery: query1,
        NotFound: result.length > 0 ? false : true
      });
    });
  }

  public AllSearchFunction = (skill, sector, Exp) => {
    let sectorCreationString: any;
    let query1: string;
    if (sector) {
      sectorCreationString = this.SectorString(sector);
      query1 = this.CamlQueryFinder(skill, sectorCreationString, Exp);
    }
    else {
      query1 = this.CamlQueryFinder(skill, null, Exp);
    }

    this.spOp.ResultCollection1(query1, skill, sector,this.props.profileList).then((result) => {
      this.setState({
        option: result,
        dSkillSelected: skill,
        dSectorSelected: sector ? sector : [],
        dExp: Exp,
        ResumeURL: "",
        NotFoundQuery: query1,
        isApply: skill ? (skill.length > 0) : false,
        isChecked: false,
        isSend: false,
        NotFound: result.length > 0 ? false : true
      });
    });
    // Apply button click notification for analytics
    // let applyValueSaveNoti: any;
    // if (!sector) {
    //   sector = []
    // }
    // if (sector.length > 0 && Exp.length > 0)
    //   applyValueSaveNoti = {
    //     Title: "Search Profile",
    //     Message: "Apply Button Clicked",
    //     SearchedSector: sector.toString(),
    //     SearchedExp: Exp.toString(),
    //     SearchedSkill: skill.toString()
    //   }
    // else if (sector.length == 0 && Exp.length > 0)
    //   applyValueSaveNoti = {
    //     Title: "Search Profile",
    //     Message: "Apply Button Clicked",
    //     SearchedExp: Exp.toString(),
    //     SearchedSkill: skill.toString()
    //   }
    // else
    //   applyValueSaveNoti = {
    //     Title: "Search Profile",
    //     Message: "Apply Button Clicked",
    //     SearchedSkill: skill.toString()
    //   }

    // this.spOp.createNotification(applyValueSaveNoti)
  }
  public SectorString = (sector): string => {
    if (sector.length == 1) {
      return '<Eq><FieldRef Name="Domain" /><Value Type="Note">' + sector[0] + '</Value></Eq>';
    }
    else if (sector.length == 2) {
      return '<Or><Eq><FieldRef Name="Domain" /><Value Type="Note">' + sector[0] + '</Value></Eq><Eq><FieldRef Name="Domain" /><Value Type="Note">' + sector[1] + '</Value></Eq></Or>';
    }
    else if (sector.length == 3) {
      return '<Or><Eq><FieldRef Name="Domain" /><Value Type="Note">' + sector[0] + '</Value></Eq><Or><Eq><FieldRef Name="Domain" /><Value Type="Note">' + sector[1] + '</Value></Eq><Eq><FieldRef Name="Domain" /><Value Type="Note">' + sector[2] + '</Value></Eq></Or></Or>';
    }
  }

  public CamlQueryFinder(arr, sectorCreationString, Exp): string {
    let query: string = '';
    if (arr.length == 1)
      if (!sectorCreationString && !Exp)
        query = query.concat('<Query><Where><Contains><FieldRef Name="Skills" /><Value Type="Note">' + arr[0] + '</Value></Contains></Where></Query>');
      else if (!sectorCreationString && Exp)
        query = query.concat('<Query><Where><And><Contains><FieldRef Name="Skills" /><Value Type="Note">' + arr[0] + '</Value></Contains><And><Geq><FieldRef Name="YOE" /><Value Type="Number">' + Exp[0] + '</Value></Geq><Leq><FieldRef Name="YOE" /><Value Type="Number">' + Exp[1] + '</Value></Leq></And></And></Where></Query>');
      else
        query = query.concat('<Query><Where><And><Contains><FieldRef Name="Skills" /><Value Type="Note">' + arr[0] + '</Value></Contains><And><And><Geq><FieldRef Name="YOE" /><Value Type="Number">' + Exp[0] + '</Value></Geq><Leq><FieldRef Name="YOE" /><Value Type="Number">' + Exp[1] + '</Value></Leq></And>' + sectorCreationString + '</And></And></Where></Query>');
    else if (arr.length == 2) {
      if (!sectorCreationString && !Exp)
        query = query.concat('<Query><Where><Or><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains></Or></Where></Query>');
      else if (!sectorCreationString && Exp)
        query = query.concat('<Query><Where><And><Or><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains></Or><And><Geq><FieldRef Name="YOE" /><Value Type="Number">' + Exp[0] + '</Value></Geq><Leq><FieldRef Name="YOE" /><Value Type="Number">' + Exp[1] + '</Value></Leq></And></And></Where></Query>');
      else
        query = query.concat('<Query><Where><And><Or><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains></Or><And><And><Geq><FieldRef Name="YOE" /><Value Type="Number">' + Exp[0] + '</Value></Geq><Leq><FieldRef Name="YOE" /><Value Type="Number">' + Exp[1] + '</Value></Leq></And>' + sectorCreationString + '</And></And></Where></Query>');
    }
    else if (arr.length == 3) {
      if (!sectorCreationString && !Exp)
        query = query.concat('<Query><Where><Or><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><Or><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[2] + '</Value></Contains></Or></Or></Where></Query>');
      else if (!sectorCreationString && Exp)
        query = query.concat('<Query><Where><And><Or><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><Or><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[2] + '</Value></Contains></Or></Or><And><Geq><FieldRef Name="YOE" /><Value Type="Number">' + Exp[0] + '</Value></Geq><Leq><FieldRef Name="YOE" /><Value Type="Number">' + Exp[1] + '</Value></Leq></And></And></Where></Query>');
      else
        query = query.concat('<Query><Where><And><Or><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><Or><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[2] + '</Value></Contains></Or></Or><And><And><Geq><FieldRef Name="YOE" /><Value Type="Number">' + Exp[0] + '</Value></Geq><Leq><FieldRef Name="YOE" /><Value Type="Number">' + Exp[1] + '</Value></Leq></And>' + sectorCreationString + '</And></And></Where></Query>');
    }
    else {
      query = query.concat('<Query><Where><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[2] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[3] + '</Value></Contains></And></And></And></Where></Query>');
      query = query.concat('<Query><Where><Or><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[2] + '</Value></Contains></And></And><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[3] + '</Value></Contains></And></And></Or></Where></Query>');
      query = query.concat('<Query><Where><Or><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[2] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[3] + '</Value></Contains></And></And><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[2] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[3] + '</Value></Contains></And></And></Or></Where></Query>');
      query = query.concat('<Query><Where><Or><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains></And><Or><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[2] + '</Value></Contains></And><Or><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[3] + '</Value></Contains></And><Or><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[2] + '</Value></Contains></And><Or><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[3] + '</Value></Contains></And><And><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[2] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[3] + '</Value></Contains></And></Or></Or></Or></Or></Or></Where></Query>');
      query = query.concat('<Query><Where><Or><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[0] + '</Value></Contains><Or><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[1] + '</Value></Contains><Or><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[2] + '</Value></Contains><Contains><FieldRef Name="Skills"/><Value Type="Note">' + arr[3] + '</Value></Contains></Or></Or></Or></Where></Query>');
    }

    return query;
  }

  public cardOption = (id,name,gid) => {       //select card and give url of document library document(profile)   
    var elems = document.querySelectorAll(".ActiveClassOnCartSelection");
      [].forEach.call(elems, function (el) {
        el.classList.remove("ActiveClassOnCartSelection");
      });
      var element = document.getElementsByClassName("forSelection" + id)[0];
      element.classList.add("ActiveClassOnCartSelection");
    this.setState({
          ResumeURL: this.props.context.pageContext.web.absoluteUrl+"/ProfileDatabase/"+gid+ ".pdf#view=FitH",
          AttachmentName: gid+".pdf",
          SharingResourceName:name        
          // NotFound:false
        });
        this.spOp.getFilteredItem1(gid).then(result=>{
          if(!result)
          this.setState({
            ResumeURL: null,
            AttachmentName: null,
            SharingResourceName:null        
            // NotFound:false
          });
        });

  }

  public cardCheck = (event, id, resource) => {
    if (event.target.type == "checkbox")
      if (event.target.checked) {
        this.setState({
          card: [...this.state.card, ...this.state.option.filter(item => item.Id == id)]
        });
        // }, () => {
        //   let NofityMessage = this.state.NotificationMessage.filter(noti => noti.Title == "Selected")
        //   NofityMessage = NofityMessage[0].Message.replace("{selected}", resource);
        //   NofityMessage = NofityMessage.replace("{currentUser}", this.state.currentUser);
        //   let data1 = { Title: "Added In Cart", Message: NofityMessage }
        //   this.spOp.createNotification(data1)
        // })
      }
      else {
        this.setState({
          card: this.state.card.filter(item => item.Id != id)
        });
        // }, () => {
        //   let NofityMessage = this.state.NotificationMessage.filter(noti => noti.Title == "Deselected")
        //   NofityMessage = NofityMessage[0].Message.replace("{selected}", resource);
        //   NofityMessage = NofityMessage.replace("{currentUser}", this.state.currentUser);
        //   let data1 = { Title: "Removed From Cart", Message: NofityMessage }
        //   this.spOp.createNotification(data1)
        // })
      }
    else {
      this.setState({
        card: this.state.card.filter(item => item.Id != id)
      }, () => {
        // let NofityMessage = this.state.NotificationMessage.filter(noti => noti.Title == "Deselected")
        // NofityMessage = NofityMessage[0].Message.replace("{selected}", resource);
        // NofityMessage = NofityMessage.replace("{currentUser}", this.state.currentUser);

        // let data1 = { Title: "Removed From Cart", Message: NofityMessage }
        // this.spOp.createNotification(data1)
        const checking = document.getElementsByClassName("checkboxNew" + id)[0] as HTMLInputElement;
        if (checking)
          checking.checked = false;
      });
    }
  }
  public toggleCheck = () => {
    this.setState({ isChecked: !this.state.isChecked });
  }
  public NotifySend = () => {
    let query = this.state.NotFoundQuery.replace(/Note/g, "Text");
    var specialChars = "'&#+";
    for (let i = 0; i < specialChars.length; i++) {
      if (query.indexOf(specialChars[i]) > -1) {
        query = replaceAll(query, specialChars[i], "%" + Number(specialChars[i].charCodeAt(0)).toString(16));
      }
    }
    if (this.state.NotFoundQuery) {
      let queryNotFound = { Title: this.state.currentUser, query: "<View>" + query + "</View>", Skills: this.state.dSkillSelected.join("/"), EmailID: this.state.currentUserEmail };
      this.spOp.NotFoundNotifySend(queryNotFound).then(result => {
        this.setState({
          isSend: true
        });
      });
    }

    function replaceAll(str, find, replace) {
      return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    function escapeRegExp(str) {
      return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
  }
  public handleRequestForMeeting = () => {
    let expByUrl: string;
    let NofityMessage = this.state.NotificationMessage.filter(noti => noti.Title == "Meeting");
    let resource = this.state.card.map(card => card.Name + "(" + card.Global_x0020_Group_x0020_ID + ")");
    resource = resource.toString();
    NofityMessage = NofityMessage[0].Message.replace("{selected}", resource);
    NofityMessage = NofityMessage.replace("{currentUser}", this.state.currentUser);
    let data1: any;
    if (this.state.dSectorSelected.length > 0)
      data1 = {
        Title: "Request For Meeting",
        Message: NofityMessage,
        InvitedResource: resource,
        SearchedSector: this.state.dSectorSelected.toString(),
        SearchedSkill: this.state.dSkillSelected.toString(),
        SearchedExp: expByUrl
      };
    else if (this.state.dSectorSelected.length == 0)
      data1 = {
        Title: "Request For Meeting",
        Message: NofityMessage,
        InvitedResource: resource,
        SearchedSkill: this.state.dSkillSelected.toString(),
        SearchedExp: expByUrl
      };
    else {
      data1 = {
        Title: "Request For Meeting",
        Message: NofityMessage,
        InvitedResource: resource,
        SearchedSkill: this.state.dSkillSelected.toString(),
      };
    }
    this.spOp.createNotification(data1).then(result => {
      this.setState({
        ShowMessageMeetingForReview: true
      }, () => {
        setTimeout(() => {
          this.setState({
            ShowMessageMeetingForReview: false,
            card: []
          });
          const frameZones = (document.querySelectorAll('.checkboxinput') as any as Array<HTMLElement>);
          Array.prototype.forEach.call(frameZones, function (node) {
            if (node.checked) {
              node.checked = !node.checked;
            }
          });

          // const checking=document.getElementsByClassName("checkboxinput")[0] as HTMLInputElement;
          //     checking.checked=false
        }, 3000);
      });
    });
  }
  public handleChangeText = (e) => {
    const inputTextClone = { ...this.state.inputText };
    inputTextClone[e.target.name] = e.target.value;
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let correctIDs = false;
    let emailArray = [];
    e.target.value.indexOf(";") > 0 ?
      emailArray = e.target.value.split(";") : emailArray.push(e.target.value);

    for (var i in emailArray) {
      if (emailArray[i].match(mailformat)) {
        correctIDs = true;
      }
      else {
        correctIDs = false;
        break;
      }
    }
    if (e.target.name == "To") {
      if (correctIDs)
        this.setState({ inputText: inputTextClone, EmailAddressValidation: true });
      else
        this.setState({ inputText: inputTextClone, EmailAddressValidation: false });
    }
    else
      this.setState({ inputText: inputTextClone });
  }

 
  public handlePopUpSave = () => {
    let NofityMessage = this.state.NotificationMessage.filter(noti => noti.Title == "Share");
    NofityMessage = NofityMessage[0].Message.replace("{selected}", this.state.SharingResourceName);
    NofityMessage = NofityMessage.replace("{currentUser}", this.state.currentUser);
    NofityMessage = NofityMessage.replace("{EmailTo}", this.state.inputText.To);
    let data1 = { Title: "Shared Profile", Message: NofityMessage, To: this.state.inputText.To, Subject: this.state.inputText.Subject, ProfileMessage: this.state.inputText.Message?this.state.inputText.Message.replace(/(?:\r\n|\r|\n)/g, '<br/>'):"", SharedProfileAttName: this.state.AttachmentName };
    this.spOp.CreateSharedProfileItem(data1).then(result => {
      this.setState({
        inputText: []
      });
    });
    this.toggleHideDialog();
  }
  public cancelClear = () => {
    this.setState({
      inputText: []
    });
    this.toggleHideDialog();
  }
  public errorCheck = (e) => {
    if (e == "")
      return "Please fill the value";
    else
      return "";
  }

  //end of multichoice function
  public render(): React.ReactElement<IDemsProps> {
    
    let NoOfFilteredEmp;
    NoOfFilteredEmp = this.state.option.map(opt => {
      return (
        <div className={"card flex-row flex-wrap mt-2 CardMainDiv forSelection" + opt.ID} key={opt.ID} >
          <div className="card-header border-0 CardImage ">
            <img src={require('./Images/User.png')} alt="" />
          </div>
          <div className="card-block px-3 pt-3 CardInformation" onClick={() => this.cardOption(opt.ID,opt.Name+"("+opt.Global_x0020_Group_x0020_ID+")",opt.Global_x0020_Group_x0020_ID)} key={opt.ID}>

            <b className="card-title" >{opt.Global_x0020_Group_x0020_ID}</b>
            <p className="card-text">{opt.YOE > 1 ? opt.YOE + " Yrs." : opt.YOE + " Yr."} Exp.</p>
            {/* <p>IN-{opt.City}</p> */}
          </div>
          <div className="card-block px-1 checkboxPosition">
            <input className={"form-check-input checkboxinput checkboxNew" + opt.ID} type="checkbox" onClick={(e) => this.cardCheck(e, opt.ID, opt.Name)} id={opt.ID} />
          </div>
        </div>
      );
    });



    const CardEmp = this.state.card.map(opt => {
      return (

        <div className="card flex-row flex-wrap mt-2 CardMainDiv">
          <div className="card-header border-0 CardImage">
            <img src={require('./Images/User.png')} alt="" />
          </div>
          <div className="card-block px-3 pt-3 CardInformation" onClick={() => this.cardOption(opt.ID,opt.Name+"("+opt.Global_x0020_Group_x0020_ID+")",opt.Global_x0020_Group_x0020_ID)} key={opt.ID}>
            <b className="card-title" >{opt.Global_x0020_Group_x0020_ID}</b>
            <p className="card-text">{opt.YOE > 1 ? opt.YOE + " Yrs." : opt.YOE + " Yr."} Exp.</p>
            {/* <p>IN-{opt.City}</p> */}
          </div>
          <div className="card-block px-1 checkboxPositionDelete">
            <IconButton iconProps={{ iconName: 'Delete' }} title="Delete" ariaLabel="Delete" onClick={(e) => this.cardCheck(e, opt.ID, opt.Name)} className="FloatIcon" />
          </div>

        </div>
      );

    });

    return (
      <div className={styles.dems}>
        <div className="container-fluid">
          <div className="row headerFilter">
            <div className="col-md-3 col-sm-12">
              <MultiSelectComponent id="checkbox" ref={(scope) => { this.mulObj = scope; }} dataSource={this.state.dSector}
                placeholder="Sector" mode="CheckBox"
                fields={this.fields}
                showDropDownIcon={true} change={this.select} value={this.state.defaultSector}
                
                maximumSelectionLength={3} filterBarPlaceholder="Search Sectors" popupHeight="350px" allowFiltering={true} 
                filtering={(e: FilteringEventArgs)=>{
                  let query = new Query();
                  query = (e.text != "") ? query.where("text","contains", e.text, true) : query;
                  e.updateData(this.state.dSector, query);
                }}

                >
                <Inject services={[CheckBoxSelection]} />
              </MultiSelectComponent>
            </div>
            <div className="col-md-3 col-sm-12">
              <MultiSelectComponent id="mtselement" ref={(scope) => { this.mulObj1 = scope; }} dataSource={this.state.dSkill}
                placeholder="Skills" mode="CheckBox"
                showDropDownIcon={true} change={this.select} value={this.state.defaultSkill}
                maximumSelectionLength={3} filterBarPlaceholder="Search Skills" popupHeight="350px"
                allowFiltering={true}
                fields={this.fields} 
                filtering={(e: FilteringEventArgs)=>{
                  let query = new Query();
                  query = (e.text != "") ? query.where("text","contains", e.text, true) : query;
                  e.updateData(this.state.dSkill, query);
                }} >
                <Inject services={[CheckBoxSelection]} />
              </MultiSelectComponent>
            </div>
            <div className="col-md-4 col-sm-12">
              <div style={{ width: "100%" }}>
                <div>
                  Experience: <b><span className="InputExp">{this.state.dExp[0]}</span>{this.state.dExp[0] > 1 ? "Yrs" : "Yr"} - <span className="InputExp">{this.state.dExp[1]}</span>{this.state.dExp[1] > 1 ? "Yrs" : "Yr"}</b>

                </div>
                <Slider
                  min={0}
                  max={20}
                  value={this.state.dExp}
                  onChange={this.SliderhandleChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                />
              </div>
            </div>

            <div className="col-md-1">
              <PrimaryButton text="Apply" onClick={this.pageProfileFilter} className="ApplyButtonStyle" />
              {/* <PrimaryButton text="Apply" className="ApplyButtonStyle" />  */}
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="col-md-3 mb-2 addScrollBar">
            <h4 className="ResourceListH"><i className="fa fa-arrow-left" aria-hidden="true"></i> Resource List</h4><hr className="ResourceListHr" />


            <div className="removeOverflow">
              {
                NoOfFilteredEmp
              }
            </div>

          </div>
          {!this.state.NotFound ?
            <div className="col-md-6 ProfileDivFrame">

              {this.state.AttachmentName ? <IconButton iconProps={{ iconName: 'Share' }} title="Share Profile" ariaLabel="Share Profile" onClick={this.toggleHideDialog} className="FloatIcon" /> : <IconButton style={{ visibility: "hidden" }} iconProps={{ iconName: 'Share' }} title="Share Profile" ariaLabel="Share Profile" className="FloatIcon" />}
              <iframe id="myiFrame" className="IframeClass" src={this.state.ResumeURL} height="100%" width="100%"></iframe>

            </div> :
            <div className="col-md-6 ProfileDivFrame">
              <div className={styles.NotFoundDiv}>
                <div className={styles.innerDivNotFound}>
                  <img className={styles.imgNotFound} src={require('./Images/NotFoundImage.png')} alt="" />

                </div>
                <hr className={styles.hrNotFound} />
                <h3 className={styles.h3NotFound}>Sorry we couldn't find any profile</h3>
                {!this.state.isSend ?
                  <div className={styles.divNotify} >
                    <p onClick={this.toggleCheck}><input id="field_terms" type="checkbox" checked={this.state.isChecked} required name="terms" />
                      <label>Check to Notify if in future employee matches found.</label></p>
                    <button type="button" disabled={!this.state.isChecked || !this.state.isApply} className="btn btn-primary sendButtonNotify" onClick={this.NotifySend}>Send</button>
                  </div> :
                  <div className={styles.divNotify}>
                    <div className="alert alert-success" role="alert">
                      <b>Thank you for showing interest.. we will get back to you soon</b>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
          <div className="col-md-3 cardmtDiv">
            {
              CardEmp.length > 0 ?
                <div className="cartmtDivInner">
                  <h5 className="ResourceListH">Selected Resources</h5>
                  <PrimaryButton className="primaryRFM" onClick={this.handleRequestForMeeting} text="REQUEST FOR MEETING" />
                </div> : <h4 className="ResourceListH">Selected Resources</h4>}
            {this.state.ShowMessageMeetingForReview ? <div className="alert alert-success">
              Meeting Request done<strong> Successfully!</strong>
            </div>
              : <></>}
            <hr className="ResourceListHr" />
            <div className="addScrollBarCard">
              <Dialog
                hidden={this.state.hideDialog}
                onDismiss={this.cancelClear}
                modalProps={modelProps}
                containerClassName={'ms-dialogMainOverride ' + "textDialog"}
              >
                <br />
                <TextField ariaLabel="Required without visible label" iconProps={{ iconName: 'Attach' }} value={this.state.AttachmentName} placeholder="Please Select Attachment First" name="AttachmentName" onChange={this.handleChangeText} disabled />
                <h4 className="sendText">Send Email</h4>
                <TextField ariaLabel="Required without visible label" placeholder="To" name="To" value={this.state.inputText.To} onChange={this.handleChangeText} required onGetErrorMessage={this.errorCheck} />
                <TextField ariaLabel="Required without visible label" placeholder="Add subject" name="Subject" value={this.state.inputText.Subject} onChange={this.handleChangeText} required onGetErrorMessage={this.errorCheck} />
                <TextField ariaLabel="Required without visible label" placeholder="Message" name="Message" multiline value={this.state.inputText.Message} onChange={this.handleChangeText} rows={3} /><br />
                <DialogFooter>
                  <PrimaryButton onClick={this.handlePopUpSave} text="Send" disabled={!this.state.EmailAddressValidation || !this.state.inputText.Subject} className="SendButtonColor" />
                  <DefaultButton onClick={this.cancelClear} text="Cancel" />
                </DialogFooter>
              </Dialog>
              {
                CardEmp
              }
            </div>
          </div>
        </div>

      </div>
    );
  }
}
