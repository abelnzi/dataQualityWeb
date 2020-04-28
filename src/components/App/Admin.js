import React,{Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Table from './AdminTable'
import Indicator from '../ManageIndicator/Indicator'
import {baseUrl,getData,postData} from '../service/FecthingData'
import Indicators from '../data/Indicators.json'

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            conf: false,
            id:null
         }
         this.onChoice = this.onChoice.bind(this)
         this.back = this.back.bind(this)
    }

    async init(){
        var endpoint=baseUrl+"/api/dataStore/qualitydashboard/settings"
        var resp=await getData(endpoint)
        //resp.then(res => res)
        //.catch(err =>console.log("err :"+err))
        //console.log("==========resp============"+JSON.stringify(resp))

        if(resp.httpStatusCode===404){
           await postData(endpoint,Indicators)
        }
        
    }

    componentDidMount () {
        this.init()
    } 

    onChoice(id){
        this.setState({
                conf: true,
                id: id
        })
    }

    back (){
        this.setState({
                conf: false
        })
    }

    render() { 
        
        if(this.state.conf===false){
           
            return ( 
                <Grid container spacing={3}>
                     <Grid item xs={12}  >
                        <Table onChoice={this.onChoice} />
                    </Grid>
                </Grid>
             );
        }else{
            console.log("========this.state.conf==========="+this.state.conf)
            return ( 
                <Grid container spacing={3}>
                     <Grid item xs={12}  >
                        <Indicator id={this.state.id} back={this.back} />
                    </Grid>
                </Grid>
             );
        }
       
    }
}
 
export default Admin;