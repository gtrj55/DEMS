import * as React from 'react';
import styles from './Dems.module.scss';
import { Dropdown, TextField } from 'office-ui-fabric-react';
function CartComponent({CardEmp,state}){
    return (
        <div className="col-md-3">
        <button type="button" id="btnModel" data-toggle="modal" data-target="#myModal"  className="${styles.button}">Open Modal</button>
      <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog">
              <div className="modal-content">
                  <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                  </div>
                  <div className="modal-body">
                  <TextField ariaLabel="Required without visible label" iconProps={{ iconName: 'Attach' }} value={state.AttachmentName} placeholder="Please Select Attachment First" name="AttachmentName"  onChange={this.handleChangeText} disabled />
                    <h4 className="sendText">Send Email</h4>
                  <TextField ariaLabel="Required without visible label" placeholder="To" name="To" value={state.inputText.To} onChange={this.handleChangeText} required onGetErrorMessage={this.errorCheck}/>
                  <TextField ariaLabel="Required without visible label" placeholder="Add subject" name="Subject" value={state.inputText.Subject} onChange={this.handleChangeText} required onGetErrorMessage={this.errorCheck}/>
                  <TextField ariaLabel="Required without visible label" placeholder="Message" name="Message" required multiline value={state.inputText.Message} onChange={this.handleChangeText} rows={3}/>
                  </div>
                  <div className="modal-footer">
                  <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.handlePopUpSave}>Save changes</button>
                      <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                  </div>
              </div>
          </div>
      </div>
      {
        CardEmp
      }
      
          </div>
    )
}
export default CartComponent;
