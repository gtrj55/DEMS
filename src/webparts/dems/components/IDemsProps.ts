import { WebPartContext } from "@microsoft/sp-webpart-base"; 
export interface IDemsProps {
  context:WebPartContext;
  profileList:string;
  emailTemplate:string;
  forSector:string;
  forSkill:string;
}
