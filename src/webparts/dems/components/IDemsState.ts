import { IDropdownOption } from "office-ui-fabric-react";

export interface IDemsState {
  ResumeURL: string;
  card:any;
  option:any;
  inputText:any;
  AttachmentName:string;
  buttonHasBeenClicked:boolean;
  NotificationMessage:any;
  currentUser:string;
  currentUserEmail:string;
  dSkill:any[];
  dSector:any[];
  dExp:any[];
  dSkillSelected:any[];
  dSectorSelected:any[];
  defaultSkill:any;
  defaultSector:any;
  hideDialog:boolean;
  EmailAddressValidation?:boolean;
  SubjectValidation?:boolean;
  NotFound:boolean;
  ShowMessageMeetingForReview:boolean;
  isChecked:boolean;
  NotFoundQuery?:string;
  isApply:boolean;
  isSend:boolean;
  SharingResourceName:string;
}
