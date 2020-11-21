import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DemsWebPartStrings';
import Dems from './components/Dems';
import { IDemsProps } from './components/IDemsProps';

export interface IDemsWebPartProps {
  profileList: string;
  emailTemplate:string;
  forSector:string;
  forSkill:string;
}

export default class DemsWebPart extends BaseClientSideWebPart <IDemsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDemsProps> = React.createElement(
      Dems,
      {
        context: this.context,
        profileList: this.properties.profileList,
        emailTemplate: this.properties.emailTemplate,
        forSector: this.properties.forSector,
        forSkill: this.properties.forSkill
        
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('profileList', {
                  label: strings.ProfileListFieldLabel
                }),
                PropertyPaneTextField('emailTemplate', {
                  label: strings.EmailTemplateFieldLabel
                }),
                PropertyPaneTextField('forSector', {
                  label: strings.ForSectorFieldLabel
                }),
                PropertyPaneTextField('forSkill', {
                  label: strings.ForSkillFieldLabel
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
