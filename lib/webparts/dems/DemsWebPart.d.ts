import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
export interface IDemsWebPartProps {
    profileList: string;
    emailTemplate: string;
    forSector: string;
    forSkill: string;
}
export default class DemsWebPart extends BaseClientSideWebPart<IDemsWebPartProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=DemsWebPart.d.ts.map