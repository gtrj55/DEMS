import {sp} from '@pnp/sp/presets/all';	
import { Web } from "@pnp/sp/webs";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IDropdownOption } from 'office-ui-fabric-react';

export class SPOperation{
    protected onInit(context:WebPartContext) {
          sp.setup({
            spfxContext: context
          });
      }
    public getSector(context:WebPartContext):Promise<any>{
        this.onInit(context);
        let sectorList:any[]=[];
        return new Promise<any[]>(async(resolve,reject)=>{
            sp.web.lists.getByTitle('Sector').items.select("Title").get().then((results:any)=>{
                results.map((result:any)=>{
                    sectorList.push({value:result.Title,label:result.Title});
                });
                resolve(sectorList);
            });              
        });
    }
    public GetSkill(context:WebPartContext):Promise<any>{
        this.onInit(context);
        let SkillList:any=[];
        return new Promise<IDropdownOption[]>(async(resolve,reject)=>{
            sp.web.lists.getByTitle('Skill').items.select("Title").get().then((results:any)=>{
                results.map((result:any)=>{
                    SkillList.push({value:result.Title,label:result.Title});
                });
                resolve(SkillList);
            });              
        });

    }
}