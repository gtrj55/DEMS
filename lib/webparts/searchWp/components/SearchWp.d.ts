import * as React from 'react';
import { ISearchWpProps } from './ISearchWpProps';
import 'react-select-plus/dist/react-select-plus.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { SPOperation } from './SPServices/SPOperation';
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
export interface ISelectState {
    selectedOption?: string;
    selectedSector: any;
    selectedSkill: any;
    options: any;
    KeyOption: any;
    SearchMode: boolean;
    SelectedExp: any;
}
export default class SearchWp extends React.Component<ISearchWpProps, ISelectState, {}> {
    ops: SPOperation;
    keyword: {
        value: string;
        label: string;
        clearableValue: boolean;
    }[];
    maxSelected: number;
    private fields;
    constructor(props: any);
    SliderhandleChange: (event: any, newValue: any) => void;
    componentDidMount(): void;
    mulObj: MultiSelectComponent;
    mulObj1: MultiSelectComponent;
    select: () => void;
    private handleChange;
    SubmitSkill: () => void;
    submitRequest: () => void;
    render(): React.ReactElement<ISearchWpProps>;
}
//# sourceMappingURL=SearchWp.d.ts.map