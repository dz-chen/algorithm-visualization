import eventProxy from "../eventProxy.js"
let React = require('react');


//let node = [], link = [];  用不上
//let selectLink;



//关于显示代码：此组件作为消息订阅者!
class GraphTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tab: 1,
            code:'hello cg!'
        };
        this.SELECTED_LINK_COLOR = "#ff0000";
        this.DEFAULT_LINK_COLOR = "#3a6bdb";
        this.onShowCode=this.onShowCode.bind(this);  //绑定消息监听函数
    }
   
    render(){
        let content = this.setContent(this.props); //props继承自panel，而panel的props来自App
        return ( 
            <div style={{width: '100%', height:'100%'}}>
                <div id="tab">
                    <div style={{backgroundColor:this.state.tab===1?"#999":"#CCC"}} onClick={this.setPTab.bind(this)}>顶点</div>
                    <div style={{backgroundColor:this.state.tab===2?"#999":"#CCC"}} onClick={this.setLTab.bind(this)}>边</div>
                    <div style={{backgroundColor:this.state.tab===3?"#999":"#CCC"}} onClick={this.setCodeTab.bind(this)}>代码</div>
                </div>
                <div id="tabContent">{content}</div>
            </div>
        );
    }

    ///当GraphSVG组件传递代码过来时，调整tab状态，使其处于代码显示栏，同时更新代码
    onShowCode(code){  
        this.setState({tab:3});
        this.setState({code:code});
    }

    componentDidMount(){
        eventProxy.on(window.showCode,this.onShowCode);  //window.showCode见index.js
    }

    //点击“顶点”
    setPTab(){
        this.setState({
            tab: 1
        });
    }
    //点击“边”
    setLTab(){
        this.setState({
            tab: 2
        });
    }

    //点击“代码”
    setCodeTab(){
        this.setState({
            tab: 3
        });
    }

    setContent( {node, link} ){
        switch(this.state.tab){
            case 1:
                //顶点
                return this.renderPoint(node);
                break;
            case 2:
                //边
                return this.renderLink(link);
                break;
            case 3:
                return this.renderCode();
                break;
        }
        return "ERROR";
    }
    renderPoint(nodes){
        let td = nodes.map(node=>{
            return (
                <tr key={node.name}>
                    <td>{node.name}</td>
                    <td>{node.lng}</td>
                    <td>{node.lat}</td>
                </tr>
            );
        });
        return (
            <table>
                <thead>
                    <tr>
                        <th>地点</th>
                        <th>经度</th>
                        <th>纬度</th>
                    </tr>
                </thead>
                <tbody>
                    {td}
                </tbody>
            </table>
        );
    }
    renderLink(links){
        let td = links.map((link, index)=>{
            let ifVisible = link.polyline.isVisible();
            let color = link.polyline.getStrokeColor();
            let ifHighlight = color === this.SELECTED_LINK_COLOR;

            return (
                <tr key={link+"-"+index} onClick={this.highlightLink(link).bind(this)} style={{backgroundColor:ifHighlight?"#DDD":"#FFF"}}>
                    <td>{link.node1.name+" -> "+link.node2.name}</td>
                    <td>{link.dis}</td>
                    <td onClick={this.setLink(link).bind(this)}>{ifVisible?"Yes":"No"}</td>
                </tr>
            );
        });
        return (
            <table>
                <thead>
                    <tr>
                        <th>路线</th>
                        <th>距离</th>
                        <th>选择</th>
                    </tr> 
                </thead>
                <tbody>
                    {td}
                </tbody>
            </table>
        );
    }

    //渲染代码，使用layer  (iframe高度无法使用相对高度，应为tabContent的限制)
    renderCode(){
        return(
           
            <textarea   cols="80" rows="30" value={this.state.code} autoFocus readOnly></textarea>
           
        );
    }
    highlightLink(link){
        return function(event){
            let links = this.props.link;
            links.forEach(l=>{
                l.polyline.setStrokeColor(this.DEFAULT_LINK_COLOR);
            });
            link.polyline.setStrokeColor(this.SELECTED_LINK_COLOR);
            this.props.updateState(null, links);
        }
    }
    setLink(link){
        return function(event){
            let links = this.props.link;
            let visible = link.polyline.isVisible();

            if(visible)link.polyline.hide();
            else link.polyline.show();

            this.props.updateState(null, links);
        }
    }
}

export default GraphTable;