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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import styles from './Dems.module.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import { SPComponentLoader } from '@microsoft/sp-loader';
import { SPOperation } from './SPServices/SPOperation';
import { TextField, PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { IconButton } from 'office-ui-fabric-react';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { Query } from '@syncfusion/ej2-data';
import { MultiSelectComponent, CheckBoxSelection, Inject } from '@syncfusion/ej2-react-dropdowns';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import Slider from '@material-ui/core/Slider';
require('./InternalDems.css');
var modelProps = {
    isBlocking: false,
};
var dialogContentProps = {
    type: DialogType.largeHeader,
    title: 'All emails together',
    subText: 'Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails.',
};
var Dems = /** @class */ (function (_super) {
    __extends(Dems, _super);
    function Dems(props) {
        var _this = _super.call(this, props) || this;
        _this.fields = { text: 'text', value: 'Id' };
        //Start predefined function used in some controls  --1
        _this.toggleHideDialog = function () {
            _this.setState({
                hideDialog: !_this.state.hideDialog
            });
        };
        _this.select = function () {
            _this.setState({
                dSectorSelected: _this.mulObj.value || [],
                dSkillSelected: _this.mulObj1.value || []
            });
        };
        //slider functions start
        _this.SliderhandleChange = function (event, newValue) {
            _this.setState({
                dExp: newValue
            });
        };
        //slider functions end
        //End predefined function used in some controls  --1
        _this.pageProfileFilter = function () {
            _this.AllSearchFunction(_this.state.dSkillSelected, _this.state.dSectorSelected, _this.state.dExp);
        };
        _this.skillSearchFunction = function (skill) {
            var query1 = _this.CamlQueryFinder(skill, null, null);
            _this.spOp.ResultCollection1(query1, skill, null, _this.props.profileList).then(function (result) {
                _this.setState({
                    option: result,
                    dSkillSelected: skill,
                    dExp: [0, 20],
                    NotFoundQuery: query1,
                    NotFound: result.length > 0 ? false : true
                });
            });
        };
        _this.AllSearchFunction = function (skill, sector, Exp) {
            var sectorCreationString;
            var query1;
            if (sector) {
                sectorCreationString = _this.SectorString(sector);
                query1 = _this.CamlQueryFinder(skill, sectorCreationString, Exp);
            }
            else {
                query1 = _this.CamlQueryFinder(skill, null, Exp);
            }
            _this.spOp.ResultCollection1(query1, skill, sector, _this.props.profileList).then(function (result) {
                _this.setState({
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
        };
        _this.SectorString = function (sector) {
            if (sector.length == 1) {
                return '<Eq><FieldRef Name="Domain" /><Value Type="Note">' + sector[0] + '</Value></Eq>';
            }
            else if (sector.length == 2) {
                return '<Or><Eq><FieldRef Name="Domain" /><Value Type="Note">' + sector[0] + '</Value></Eq><Eq><FieldRef Name="Domain" /><Value Type="Note">' + sector[1] + '</Value></Eq></Or>';
            }
            else if (sector.length == 3) {
                return '<Or><Eq><FieldRef Name="Domain" /><Value Type="Note">' + sector[0] + '</Value></Eq><Or><Eq><FieldRef Name="Domain" /><Value Type="Note">' + sector[1] + '</Value></Eq><Eq><FieldRef Name="Domain" /><Value Type="Note">' + sector[2] + '</Value></Eq></Or></Or>';
            }
        };
        _this.cardOption = function (id, name, gid) {
            var elems = document.querySelectorAll(".ActiveClassOnCartSelection");
            [].forEach.call(elems, function (el) {
                el.classList.remove("ActiveClassOnCartSelection");
            });
            var element = document.getElementsByClassName("forSelection" + id)[0];
            element.classList.add("ActiveClassOnCartSelection");
            _this.setState({
                ResumeURL: _this.props.context.pageContext.web.absoluteUrl + "/ProfileDatabase/" + gid + ".pdf#view=FitH",
                AttachmentName: gid + ".pdf",
                SharingResourceName: name
                // NotFound:false
            });
            _this.spOp.getFilteredItem1(gid).then(function (result) {
                if (!result)
                    _this.setState({
                        ResumeURL: null,
                        AttachmentName: null,
                        SharingResourceName: null
                        // NotFound:false
                    });
            });
        };
        _this.cardCheck = function (event, id, resource) {
            if (event.target.type == "checkbox")
                if (event.target.checked) {
                    _this.setState({
                        card: _this.state.card.concat(_this.state.option.filter(function (item) { return item.Id == id; }))
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
                    _this.setState({
                        card: _this.state.card.filter(function (item) { return item.Id != id; })
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
                _this.setState({
                    card: _this.state.card.filter(function (item) { return item.Id != id; })
                }, function () {
                    // let NofityMessage = this.state.NotificationMessage.filter(noti => noti.Title == "Deselected")
                    // NofityMessage = NofityMessage[0].Message.replace("{selected}", resource);
                    // NofityMessage = NofityMessage.replace("{currentUser}", this.state.currentUser);
                    // let data1 = { Title: "Removed From Cart", Message: NofityMessage }
                    // this.spOp.createNotification(data1)
                    var checking = document.getElementsByClassName("checkboxNew" + id)[0];
                    if (checking)
                        checking.checked = false;
                });
            }
        };
        _this.toggleCheck = function () {
            _this.setState({ isChecked: !_this.state.isChecked });
        };
        _this.NotifySend = function () {
            var query = _this.state.NotFoundQuery.replace(/Note/g, "Text");
            var specialChars = "'&#+";
            for (var i = 0; i < specialChars.length; i++) {
                if (query.indexOf(specialChars[i]) > -1) {
                    query = replaceAll(query, specialChars[i], "%" + Number(specialChars[i].charCodeAt(0)).toString(16));
                }
            }
            if (_this.state.NotFoundQuery) {
                var queryNotFound = { Title: _this.state.currentUser, query: "<View>" + query + "</View>", Skills: _this.state.dSkillSelected.join("/"), EmailID: _this.state.currentUserEmail };
                _this.spOp.NotFoundNotifySend(queryNotFound).then(function (result) {
                    _this.setState({
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
        };
        _this.handleRequestForMeeting = function () {
            var expByUrl;
            var NofityMessage = _this.state.NotificationMessage.filter(function (noti) { return noti.Title == "Meeting"; });
            var resource = _this.state.card.map(function (card) { return card.Name + "(" + card.Global_x0020_Group_x0020_ID + ")"; });
            resource = resource.toString();
            NofityMessage = NofityMessage[0].Message.replace("{selected}", resource);
            NofityMessage = NofityMessage.replace("{currentUser}", _this.state.currentUser);
            var data1;
            if (_this.state.dSectorSelected.length > 0)
                data1 = {
                    Title: "Request For Meeting",
                    Message: NofityMessage,
                    InvitedResource: resource,
                    SearchedSector: _this.state.dSectorSelected.toString(),
                    SearchedSkill: _this.state.dSkillSelected.toString(),
                    SearchedExp: expByUrl
                };
            else if (_this.state.dSectorSelected.length == 0)
                data1 = {
                    Title: "Request For Meeting",
                    Message: NofityMessage,
                    InvitedResource: resource,
                    SearchedSkill: _this.state.dSkillSelected.toString(),
                    SearchedExp: expByUrl
                };
            else {
                data1 = {
                    Title: "Request For Meeting",
                    Message: NofityMessage,
                    InvitedResource: resource,
                    SearchedSkill: _this.state.dSkillSelected.toString(),
                };
            }
            _this.spOp.createNotification(data1).then(function (result) {
                _this.setState({
                    ShowMessageMeetingForReview: true
                }, function () {
                    setTimeout(function () {
                        _this.setState({
                            ShowMessageMeetingForReview: false,
                            card: []
                        });
                        var frameZones = document.querySelectorAll('.checkboxinput');
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
        };
        _this.handleChangeText = function (e) {
            var inputTextClone = __assign({}, _this.state.inputText);
            inputTextClone[e.target.name] = e.target.value;
            var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            var correctIDs = false;
            var emailArray = [];
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
                    _this.setState({ inputText: inputTextClone, EmailAddressValidation: true });
                else
                    _this.setState({ inputText: inputTextClone, EmailAddressValidation: false });
            }
            else
                _this.setState({ inputText: inputTextClone });
        };
        _this.handlePopUpSave = function () {
            var NofityMessage = _this.state.NotificationMessage.filter(function (noti) { return noti.Title == "Share"; });
            NofityMessage = NofityMessage[0].Message.replace("{selected}", _this.state.SharingResourceName);
            NofityMessage = NofityMessage.replace("{currentUser}", _this.state.currentUser);
            NofityMessage = NofityMessage.replace("{EmailTo}", _this.state.inputText.To);
            var data1 = { Title: "Shared Profile", Message: NofityMessage, To: _this.state.inputText.To, Subject: _this.state.inputText.Subject, ProfileMessage: _this.state.inputText.Message ? _this.state.inputText.Message.replace(/(?:\r\n|\r|\n)/g, '<br/>') : "", SharedProfileAttName: _this.state.AttachmentName };
            _this.spOp.CreateSharedProfileItem(data1).then(function (result) {
                _this.setState({
                    inputText: []
                });
            });
            _this.toggleHideDialog();
        };
        _this.cancelClear = function () {
            _this.setState({
                inputText: []
            });
            _this.toggleHideDialog();
        };
        _this.errorCheck = function (e) {
            if (e == "")
                return "Please fill the value";
            else
                return "";
        };
        SPComponentLoader.loadCss('//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css');
        SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
        SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
        SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then(function (jQuery) {
            SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js', { globalExportsName: 'jQuery' }).then(function () {
            });
        });
        _this.spOp = new SPOperation();
        _this.state = {
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
            SharingResourceName: ''
        };
        return _this;
    }
    Dems.prototype.componentDidMount = function () {
        var _this = this;
        var decodeURL = decodeURIComponent(window.location.href);
        var queryParms = new UrlQueryParameterCollection(decodeURL.replace(/#/g, "Sharp"));
        var sector1 = queryParms.getValue("stor");
        var sector;
        var skill;
        var Exp;
        //replace sharp to # and slipt it to an array
        if (sector1 && sector1 != "null") {
            sector = sector1.replace(/Sharp/g, "#");
            sector = decodeURIComponent(sector).split(",");
        }
        var skill1 = queryParms.getValue("sk");
        if (skill1) {
            skill = skill1.replace(/Sharp/g, "#");
            skill = decodeURIComponent(skill).split(",");
        }
        var Exp1 = queryParms.getValue("exp");
        if (Exp1) {
            Exp = Exp1.split(",").map(function (item) {
                return parseInt(item);
            });
        }
        this.spOp.getNotification(this.props.context, this.props.forSector, this.props.forSkill, this.props.emailTemplate).then(function (result) {
            _this.setState({
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
        this.spOp.getCurrentUserInformation().then(function (name) {
            _this.setState({
                currentUser: name.split("/")[0],
                currentUserEmail: name.split("/")[1]
            });
        });
    };
    Dems.prototype.componentDidUpdate = function () {
        var _this = this;
        this.state.card.map(function (item) {
            return _this.state.option.map(function (items) {
                if (items.Id == item.Id) {
                    var checking = document.getElementsByClassName("checkboxNew" + item.Id)[0];
                    checking.checked = true;
                }
            });
        });
    };
    Dems.prototype.CamlQueryFinder = function (arr, sectorCreationString, Exp) {
        var query = '';
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
    };
    //end of multichoice function
    Dems.prototype.render = function () {
        var _this = this;
        var NoOfFilteredEmp;
        NoOfFilteredEmp = this.state.option.map(function (opt) {
            return (React.createElement("div", { className: "card flex-row flex-wrap mt-2 CardMainDiv forSelection" + opt.ID, key: opt.ID },
                React.createElement("div", { className: "card-header border-0 CardImage " },
                    React.createElement("img", { src: require('./Images/User.png'), alt: "" })),
                React.createElement("div", { className: "card-block px-3 pt-3 CardInformation", onClick: function () { return _this.cardOption(opt.ID, opt.Name + "(" + opt.Global_x0020_Group_x0020_ID + ")", opt.Global_x0020_Group_x0020_ID); }, key: opt.ID },
                    React.createElement("b", { className: "card-title" }, opt.Global_x0020_Group_x0020_ID),
                    React.createElement("p", { className: "card-text" },
                        opt.YOE > 1 ? opt.YOE + " Yrs." : opt.YOE + " Yr.",
                        " Exp.")),
                React.createElement("div", { className: "card-block px-1 checkboxPosition" },
                    React.createElement("input", { className: "form-check-input checkboxinput checkboxNew" + opt.ID, type: "checkbox", onClick: function (e) { return _this.cardCheck(e, opt.ID, opt.Name); }, id: opt.ID }))));
        });
        var CardEmp = this.state.card.map(function (opt) {
            return (React.createElement("div", { className: "card flex-row flex-wrap mt-2 CardMainDiv" },
                React.createElement("div", { className: "card-header border-0 CardImage" },
                    React.createElement("img", { src: require('./Images/User.png'), alt: "" })),
                React.createElement("div", { className: "card-block px-3 pt-3 CardInformation", onClick: function () { return _this.cardOption(opt.ID, opt.Name + "(" + opt.Global_x0020_Group_x0020_ID + ")", opt.Global_x0020_Group_x0020_ID); }, key: opt.ID },
                    React.createElement("b", { className: "card-title" }, opt.Global_x0020_Group_x0020_ID),
                    React.createElement("p", { className: "card-text" },
                        opt.YOE > 1 ? opt.YOE + " Yrs." : opt.YOE + " Yr.",
                        " Exp.")),
                React.createElement("div", { className: "card-block px-1 checkboxPositionDelete" },
                    React.createElement(IconButton, { iconProps: { iconName: 'Delete' }, title: "Delete", ariaLabel: "Delete", onClick: function (e) { return _this.cardCheck(e, opt.ID, opt.Name); }, className: "FloatIcon" }))));
        });
        return (React.createElement("div", { className: styles.dems },
            React.createElement("div", { className: "container-fluid" },
                React.createElement("div", { className: "row headerFilter" },
                    React.createElement("div", { className: "col-md-3 col-sm-12" },
                        React.createElement(MultiSelectComponent, { id: "checkbox", ref: function (scope) { _this.mulObj = scope; }, dataSource: this.state.dSector, placeholder: "Sector", mode: "CheckBox", fields: this.fields, showDropDownIcon: true, change: this.select, value: this.state.defaultSector, maximumSelectionLength: 3, filterBarPlaceholder: "Search Sectors", popupHeight: "350px", allowFiltering: true, filtering: function (e) {
                                var query = new Query();
                                query = (e.text != "") ? query.where("text", "contains", e.text, true) : query;
                                e.updateData(_this.state.dSector, query);
                            } },
                            React.createElement(Inject, { services: [CheckBoxSelection] }))),
                    React.createElement("div", { className: "col-md-3 col-sm-12" },
                        React.createElement(MultiSelectComponent, { id: "mtselement", ref: function (scope) { _this.mulObj1 = scope; }, dataSource: this.state.dSkill, placeholder: "Skills", mode: "CheckBox", showDropDownIcon: true, change: this.select, value: this.state.defaultSkill, maximumSelectionLength: 3, filterBarPlaceholder: "Search Skills", popupHeight: "350px", allowFiltering: true, fields: this.fields, filtering: function (e) {
                                var query = new Query();
                                query = (e.text != "") ? query.where("text", "contains", e.text, true) : query;
                                e.updateData(_this.state.dSkill, query);
                            } },
                            React.createElement(Inject, { services: [CheckBoxSelection] }))),
                    React.createElement("div", { className: "col-md-4 col-sm-12" },
                        React.createElement("div", { style: { width: "100%" } },
                            React.createElement("div", null,
                                "Experience: ",
                                React.createElement("b", null,
                                    React.createElement("span", { className: "InputExp" }, this.state.dExp[0]),
                                    this.state.dExp[0] > 1 ? "Yrs" : "Yr",
                                    " - ",
                                    React.createElement("span", { className: "InputExp" }, this.state.dExp[1]),
                                    this.state.dExp[1] > 1 ? "Yrs" : "Yr")),
                            React.createElement(Slider, { min: 0, max: 20, value: this.state.dExp, onChange: this.SliderhandleChange, valueLabelDisplay: "auto", "aria-labelledby": "range-slider" }))),
                    React.createElement("div", { className: "col-md-1" },
                        React.createElement(PrimaryButton, { text: "Apply", onClick: this.pageProfileFilter, className: "ApplyButtonStyle" })))),
            React.createElement("div", { className: "container-fluid" },
                React.createElement("div", { className: "col-md-3 mb-2 addScrollBar" },
                    React.createElement("h4", { className: "ResourceListH" },
                        React.createElement("i", { className: "fa fa-arrow-left", "aria-hidden": "true" }),
                        " Resource List"),
                    React.createElement("hr", { className: "ResourceListHr" }),
                    React.createElement("div", { className: "removeOverflow" }, NoOfFilteredEmp)),
                !this.state.NotFound ?
                    React.createElement("div", { className: "col-md-6 ProfileDivFrame" },
                        this.state.AttachmentName ? React.createElement(IconButton, { iconProps: { iconName: 'Share' }, title: "Share Profile", ariaLabel: "Share Profile", onClick: this.toggleHideDialog, className: "FloatIcon" }) : React.createElement(IconButton, { style: { visibility: "hidden" }, iconProps: { iconName: 'Share' }, title: "Share Profile", ariaLabel: "Share Profile", className: "FloatIcon" }),
                        React.createElement("iframe", { id: "myiFrame", className: "IframeClass", src: this.state.ResumeURL, height: "100%", width: "100%" })) :
                    React.createElement("div", { className: "col-md-6 ProfileDivFrame" },
                        React.createElement("div", { className: styles.NotFoundDiv },
                            React.createElement("div", { className: styles.innerDivNotFound },
                                React.createElement("img", { className: styles.imgNotFound, src: require('./Images/NotFoundImage.png'), alt: "" })),
                            React.createElement("hr", { className: styles.hrNotFound }),
                            React.createElement("h3", { className: styles.h3NotFound }, "Sorry we couldn't find any profile"),
                            !this.state.isSend ?
                                React.createElement("div", { className: styles.divNotify },
                                    React.createElement("p", { onClick: this.toggleCheck },
                                        React.createElement("input", { id: "field_terms", type: "checkbox", checked: this.state.isChecked, required: true, name: "terms" }),
                                        React.createElement("label", null, "Check to Notify if in future employee matches found.")),
                                    React.createElement("button", { type: "button", disabled: !this.state.isChecked || !this.state.isApply, className: "btn btn-primary sendButtonNotify", onClick: this.NotifySend }, "Send")) :
                                React.createElement("div", { className: styles.divNotify },
                                    React.createElement("div", { className: "alert alert-success", role: "alert" },
                                        React.createElement("b", null, "Thank you for showing interest.. we will get back to you soon"))))),
                React.createElement("div", { className: "col-md-3 cardmtDiv" },
                    CardEmp.length > 0 ?
                        React.createElement("div", { className: "cartmtDivInner" },
                            React.createElement("h5", { className: "ResourceListH" }, "Selected Resources"),
                            React.createElement(PrimaryButton, { className: "primaryRFM", onClick: this.handleRequestForMeeting, text: "REQUEST FOR MEETING" })) : React.createElement("h4", { className: "ResourceListH" }, "Selected Resources"),
                    this.state.ShowMessageMeetingForReview ? React.createElement("div", { className: "alert alert-success" },
                        "Meeting Request done",
                        React.createElement("strong", null, " Successfully!"))
                        : React.createElement(React.Fragment, null),
                    React.createElement("hr", { className: "ResourceListHr" }),
                    React.createElement("div", { className: "addScrollBarCard" },
                        React.createElement(Dialog, { hidden: this.state.hideDialog, onDismiss: this.cancelClear, modalProps: modelProps, containerClassName: 'ms-dialogMainOverride ' + "textDialog" },
                            React.createElement("br", null),
                            React.createElement(TextField, { ariaLabel: "Required without visible label", iconProps: { iconName: 'Attach' }, value: this.state.AttachmentName, placeholder: "Please Select Attachment First", name: "AttachmentName", onChange: this.handleChangeText, disabled: true }),
                            React.createElement("h4", { className: "sendText" }, "Send Email"),
                            React.createElement(TextField, { ariaLabel: "Required without visible label", placeholder: "To", name: "To", value: this.state.inputText.To, onChange: this.handleChangeText, required: true, onGetErrorMessage: this.errorCheck }),
                            React.createElement(TextField, { ariaLabel: "Required without visible label", placeholder: "Add subject", name: "Subject", value: this.state.inputText.Subject, onChange: this.handleChangeText, required: true, onGetErrorMessage: this.errorCheck }),
                            React.createElement(TextField, { ariaLabel: "Required without visible label", placeholder: "Message", name: "Message", multiline: true, value: this.state.inputText.Message, onChange: this.handleChangeText, rows: 3 }),
                            React.createElement("br", null),
                            React.createElement(DialogFooter, null,
                                React.createElement(PrimaryButton, { onClick: this.handlePopUpSave, text: "Send", disabled: !this.state.EmailAddressValidation || !this.state.inputText.Subject, className: "SendButtonColor" }),
                                React.createElement(DefaultButton, { onClick: this.cancelClear, text: "Cancel" }))),
                        CardEmp)))));
    };
    return Dems;
}(React.Component));
export default Dems;
//# sourceMappingURL=Dems.js.map