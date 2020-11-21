declare interface IDemsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  ProfileListFieldLabel: string;
  EmailTemplateFieldLabel: string;
  ForSectorFieldLabel: string;
  ForSkillFieldLabel: string;
}

declare module 'DemsWebPartStrings' {
  const strings: IDemsWebPartStrings;
  export = strings;
}
