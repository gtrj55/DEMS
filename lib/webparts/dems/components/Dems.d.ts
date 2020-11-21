import * as React from 'react';
import { IDemsProps } from './IDemsProps';
import "bootstrap/dist/css/bootstrap.min.css";
import { IDemsState } from './IDemsState';
import { SPOperation } from './SPServices/SPOperation';
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
export default class Dems extends React.Component<IDemsProps, IDemsState, {}> {
    /**
     *
     */
    spOp: SPOperation;
    private fields;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(): void;
    toggleHideDialog: () => void;
    mulObj: MultiSelectComponent;
    mulObj1: MultiSelectComponent;
    select: () => void;
    SliderhandleChange: (event: any, newValue: any) => void;
    pageProfileFilter: () => void;
    skillSearchFunction: (skill: any) => void;
    AllSearchFunction: (skill: any, sector: any, Exp: any) => void;
    SectorString: (sector: any) => string;
    CamlQueryFinder(arr: any, sectorCreationString: any, Exp: any): string;
    cardOption: (id: any, name: any, gid: any) => void;
    cardCheck: (event: any, id: any, resource: any) => void;
    toggleCheck: () => void;
    NotifySend: () => void;
    handleRequestForMeeting: () => void;
    handleChangeText: (e: any) => void;
    handlePopUpSave: () => void;
    cancelClear: () => void;
    errorCheck: (e: any) => "" | "Please fill the value";
    render(): React.ReactElement<IDemsProps>;
}
//# sourceMappingURL=Dems.d.ts.map