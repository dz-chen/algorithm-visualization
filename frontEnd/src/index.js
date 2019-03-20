import * as serviceWorker from './serviceWorker';

//引入三个组件  
import Map from "./app/component/Map.js";   
import Sidebar from "./app/component/Sidebar.js";
import Panel from "./app/component/Panel.js";

import MyMenu from "./app/MyMenu.js";


//引入jQuery  (换到了html中引入)
//let $ = require("jquery");
//window.$ = $;
//window.jQuery = $;

//引入自定义样式
require("./css/map.new.css");

//引入layer.js
//require("./app/layer/skin/default/layer.css");
//let layer = require("./app/layer/layer.js");
//window.layer = layer;

//引入React
let React = require("react");
let ReactDOM = require("react-dom");

window.MyMenu = MyMenu;
window.showCode="showCode";          //组件间消息传递的标志
window.showAction="showAction";

class APP extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            node: [],
            link: []
        };
    }
    render(){
        return (
            <div id="container">
                <Sidebar updateState={this.updateState.bind(this)} node={this.state.node} link={this.state.link}/>
                <Map updateState={this.updateState.bind(this)} node={this.state.node} link={this.state.link}/>
                <Panel updateState={this.updateState.bind(this)} node={this.state.node} link={this.state.link}/>
            </div>
        );
    }
    /**
     * 更新node和link的回调函数
     * @param {*} node 
     * @param {*} link 
     */
    updateState(node, link){
        let oldNode = this.state.node;
        let oldLink = this.state.link;
        this.setState({
            node: node || oldNode,  //当结果为真时，返回第一个为真的值
            link: link || oldLink
        });
    }
}














ReactDOM.render(<APP />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
