import React from 'react';
import HeadInfo from '../reports-component/HeadInfo.js'
import BodyInfo from '../reports-component/BodyInfo.js'
require("../../css/map.new.css");
const $=window.jQuery;  

window.contentType="action";

class Reports extends React.Component{

  render() {
    return (
      <div id="reportsContainer">
        <HeadInfo />
        <BodyInfo />
      </div>
     
    );
  }


  
}

export default Reports;