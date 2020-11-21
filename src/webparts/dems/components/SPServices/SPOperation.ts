import {
	sp, ICamlQuery
}
from '@pnp/sp/presets/all';
import {
	Web
}
from "@pnp/sp/webs";
import {
	WebPartContext
}
from '@microsoft/sp-webpart-base';
import {
	IDropdownOption
}
from 'office-ui-fabric-react';
export class SPOperation {
	public Skill: IDropdownOption[] = [];
	public Sector: IDropdownOption[] = [];
	protected onInit(context: WebPartContext) {
		// other init code may be present      
		sp.setup({
			spfxContext: context
		});
	}
	public getFilteredItem1(ItemID): Promise < any > {
		// return new Promise < any > (async(resolve, reject) => {
		// 	sp.web.lists.getByTitle('EmpStage').items.getById(Number(ItemID)).select("ID", "AttachmentFiles").expand("AttachmentFiles").get().then((results: any) => {
		// 		resolve(results);
		// 	});
		// });
		return new Promise < any > (async(resolve, reject) => {
		// 	//sp.web.getFileByServerRelativePath("/sites/DEMSMicrositetest/Shared Documents/1024857.pdf").recycle();
			sp.web.lists.getByTitle('Profile Database').items.select("FileLeafRef").filter("FileLeafRef eq '"+ItemID+".pdf'").get().then(result=>{				
				let ArrayOfGID=result.map(item=>item.FileLeafRef.split(".")[0])
				resolve(result.length>0?true:false)
			})
		 });
	}
	public CreateSharedProfileItem(valuesS: any): Promise < string > {
		return new Promise < string > (async(resolve, reject) => {
			sp.web.lists.getByTitle("Notification").items.add(valuesS).then((results: any) => {
				resolve("Value Inserted");
			});
		});
	}
	public NotFoundNotifySend(queryOfNotFound: any): Promise < string > {
		return new Promise < string > (async(resolve, reject) => {
			sp.web.lists.getByTitle("scheduleQuery").items.add(queryOfNotFound).then((results: any) => {
				resolve("Value Inserted");
			});
		});
	}
	public getNotification(context: WebPartContext,listNameForSector,listNameForSkill,listNameForEmailTemplate): Promise < any > {
        this.onInit(context);
		return new Promise < any > (async(resolve, reject) => {
			this.getDataFromList(listNameForSector).then((Sector: IDropdownOption[]) => {
				this.setterVariable(Sector, "Sector");
			});
			this.getDataFromList(listNameForSkill).then((Skill: IDropdownOption[]) => {
				this.setterVariable(Skill, "Skill");
				sp.web.lists.getByTitle(listNameForEmailTemplate).items.get().then((Notification: any) => {
					resolve([Notification, this.Sector, this.Skill]);
				});
			});
		});
	}
	public setterVariable(AllObject, objectType) {
		let TempArray=[];		
		if(objectType == "Sector") {
			AllObject.map(item=>TempArray.push({Id:item,text:item}));
			this.Sector=TempArray
		}
		else {
			TempArray=[];	
			AllObject.map(item=>TempArray.push({Id:item,text:item}));
			this.Skill = TempArray;
		}	
	}
	public getDataFromList(ListName): Promise < any > {
		let ListData: IDropdownOption[] = [];
		return new Promise < any > (async(resolve, reject) => {
			sp.web.lists.getByTitle(ListName).items.top(1000).get().then((results: any) => {
				results.map((result) => {
					ListData.push(result.Title);
				});
				resolve(ListData);
			});
		});
	}
	public ResultCollection1(ObjColl, skillarr, sector,listName): Promise < any > {
		let collectionOfItem: any[] = [];
		let AllId: any[] = [];
		let clusterOfSector: any[] = [];
		return new Promise < any > (async(resolve, reject) => {
			const list = sp.web.lists.getByTitle(listName);
			const caml: ICamlQuery = {
				ViewXml: '<View>' + ObjColl + '</View>',
			};
			// get list items
			const items = await list.getItemsByCAMLQuery(caml);
			if(skillarr.length == 1) {} else if(skillarr.length == 2) {
				items.map(all => {
					return(all.Skills.toLowerCase().indexOf(skillarr[0].toLowerCase()) !== -1 && all.Skills.toLowerCase().indexOf(skillarr[1].toLowerCase()) !== -1) ? collectionOfItem.push(all) : null;
				});
			} else if(skillarr.length == 3) {
				items.map(all => {
					return(all.Skills.toLowerCase().indexOf(skillarr[0].toLowerCase()) !== -1 && all.Skills.toLowerCase().indexOf(skillarr[1].toLowerCase()) !== -1 && all.Skills.toLowerCase().indexOf(skillarr[2].toLowerCase()) !== -1) ? collectionOfItem.push(all) : null;
				});
				items.map(all => {
					return((all.Skills.toLowerCase().indexOf(skillarr[0].toLowerCase()) !== -1 && all.Skills.toLowerCase().indexOf(skillarr[1].toLowerCase()) !== -1) || (all.Skills.toLowerCase().indexOf(skillarr[0].toLowerCase()) !== -1 && all.Skills.toLowerCase().indexOf(skillarr[2].toLowerCase()) !== -1) || (all.Skills.toLowerCase().indexOf(skillarr[1].toLowerCase()) !== -1 && all.Skills.toLowerCase().indexOf(skillarr[2].toLowerCase()) !== -1)) ? collectionOfItem.push(all) : null;
				});
			}
			collectionOfItem.push.apply(collectionOfItem, items);
			collectionOfItem.map(x => AllId.filter(a => a.Id == x.Id).length > 0 ? null : AllId.push(x)); //remove duplicate value from array
			resolve(AllId);
		});
	}

	public createNotification(data1): Promise < string > {
		return new Promise < string > (async(resolve, reject) => {
			sp.web.lists.getByTitle('Notification').items.add(data1).then((results: any) => {
				resolve("Data " + results.data.ID + "has been successfully feded");
			});
		});
	}
	public getCurrentUserInformation(): Promise < string > {
		return new Promise < string > (async(resolve, reject) => {
			sp.web.currentUser.get().then((r: any) => {
				resolve(r['Title']+"/"+r['Email']);
			});
		});
	}
}