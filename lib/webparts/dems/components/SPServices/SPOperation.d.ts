import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IDropdownOption } from 'office-ui-fabric-react';
export declare class SPOperation {
    Skill: IDropdownOption[];
    Sector: IDropdownOption[];
    protected onInit(context: WebPartContext): void;
    getFilteredItem1(ItemID: any): Promise<any>;
    CreateSharedProfileItem(valuesS: any): Promise<string>;
    NotFoundNotifySend(queryOfNotFound: any): Promise<string>;
    getNotification(context: WebPartContext, listNameForSector: any, listNameForSkill: any, listNameForEmailTemplate: any): Promise<any>;
    setterVariable(AllObject: any, objectType: any): void;
    getDataFromList(ListName: any): Promise<any>;
    ResultCollection1(ObjColl: any, skillarr: any, sector: any, listName: any): Promise<any>;
    createNotification(data1: any): Promise<string>;
    getCurrentUserInformation(): Promise<string>;
}
//# sourceMappingURL=SPOperation.d.ts.map