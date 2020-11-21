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
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'DemsWebPartStrings';
import Dems from './components/Dems';
var DemsWebPart = /** @class */ (function (_super) {
    __extends(DemsWebPart, _super);
    function DemsWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DemsWebPart.prototype.render = function () {
        var element = React.createElement(Dems, {
            context: this.context,
            profileList: this.properties.profileList,
            emailTemplate: this.properties.emailTemplate,
            forSector: this.properties.forSector,
            forSkill: this.properties.forSkill
        });
        ReactDom.render(element, this.domElement);
    };
    DemsWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(DemsWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    DemsWebPart.prototype.getPropertyPaneConfiguration = function () {
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
    };
    return DemsWebPart;
}(BaseClientSideWebPart));
export default DemsWebPart;
//# sourceMappingURL=DemsWebPart.js.map