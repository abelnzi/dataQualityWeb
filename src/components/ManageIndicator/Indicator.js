import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Indicators from '../data/Indicators.json'
import {baseUrl,getData,deleteData,postData} from '../service/FecthingData'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  root: {
      flexGrow: 1,
    },
  button: {
    margin: theme.spacing(1),
  },
}));

const Indicator = (props) => {
    const classes = useStyles();
    
    const [radio, setRadio] = useState("");
    const [goup, setGroup] = useState(true);
    const [goupLabel, setGroupLabel] = useState("Data Element group");
    const [groupData, setGroupData] = useState([]);
    const [elt, setElt] = useState(true);
    const [eltValue, setEltValue] = useState();
    const [eltData, setEltData] = useState([]);
    const [eltLabel, setEltLabel] = useState("Data Element");
    const [dset, setDset] = useState(true);
    const [dsetValue, setDsetValue] = useState();
    const [dsetData, setDsetData] = useState([]);
    const [desg, setDesg] = useState(true);
    const [desgValue, setDesgValue] = useState();
    const [desgData, setDesgData] = useState([]);
    const [btn, setBtn] = useState(true);
    

      const radioChange = async (event) => {
        setGroup(false)
        setElt(true)
        setDset(true)
        setDesg(true)

        var lib=event.target.value
        setRadio(lib)
        if(lib==="DE"){
          setGroupLabel("Data Element group")
          setEltLabel("Data Element")
          var endpoint=baseUrl+"/api/dataElementGroups.json?&paging=false"
          var resp=await getData(endpoint)
          setGroupData(resp.dataElementGroups)
        } else {
          setGroupLabel("Indicator group")
          setEltLabel("Indicator")
          var endpoint=baseUrl+"/api/indicatorGroups.json?&paging=false"
          var resp=await getData(endpoint)
          setGroupData(resp.indicatorGroups)
        }
        //console.log("========value========"+event.target.value)
      }

      const groupChange= async (event, values) => {
        //console.log("========radio========"+radio)
        setElt(false)
        if(radio==="DE"){
          var endpoint=baseUrl+"/api/dataElementGroups/"+values.id+".json?fields=dataElements%5BdisplayName,id%5D"
          var resp=await getData(endpoint)
          setEltData(resp.dataElements)
        } else {
          var endpoint=baseUrl+"/api/indicatorGroups/"+values.id+".json?fields=indicators%5BdisplayName,id%5D"
          var resp=await getData(endpoint)
          setEltData(resp.indicators)
        }
      }

      const elementChange= async (event, values) => {
        setDset(false)
        setEltValue(values)
        if(radio==="DE"){
          var endpoint=baseUrl+"/api/dataElements/"+values.id+".json?fields=dataSets%5BdisplayName,id,periodType%5D,dataSetElements%5BdataSet%5BdisplayName,id,periodType%5D"
          var resp=await getData(endpoint)
          console.log("========resp DE========"+JSON.stringify(resp))
          var arrayDataset=[resp.dataSetElements[0].dataSet]
          setDsetData(arrayDataset)
        } else {
          //Get numerator and denominator
          var endpoint=baseUrl+"/api/indicators/"+values.id+".json?fields=displayName,id,numerator,denominator"
          var resp=await getData(endpoint)
          var indicator=filterElt(resp)
          //Get Dataset
          var endpoint=baseUrl+"/api/dataSets.json?fields=displayName,id&filter=dataSetElements.dataElement.id:in:%"+indicator.numerator+","+indicator.denominator+"%5D&paging=false"
          var resp=await getData(endpoint)
          console.log("========resp IND========"+JSON.stringify(resp))
          setDsetData(resp.dataSets)
        }
      }

      const filterElt=(indicator)=>{
        var numerator = indicator.numerator.substring(2, 13)
        var denominator = indicator.denominator.substring(2, 13)
        var ind=new Object()
        ind.numerator=numerator
        ind.denominator=denominator
        console.log('==========ind============'+ind)
        return ind
      }

      const datasetChange= async (event, values) => {
        setDesg(false)
        setDsetValue(values)
        
          var endpoint=baseUrl+"/api/dataElementOperands.json?fields=displayName,id&filter=dataElement.id:eq:"+eltValue.id+"&paging=false"
          var resp=await getData(endpoint)
          setDesgData(resp.dataElementOperands)
          setBtn(false)
      }

      const variableChange= async (event, values) => {
        setDesgValue(values)
        
        
      }

      const handleSubmit = async () => {
        console.log("==========props.id============"+props.id)
        console.log("==========eltValue============"+JSON.stringify(eltValue))
        console.log("==========dsetValue============"+JSON.stringify(dsetValue))
        console.log("==========dsetValue============"+JSON.stringify(dsetValue))
        console.log("==========desgValue============"+JSON.stringify(desgValue))
        
        var endpoint=baseUrl+"/api/dataStore/qualitydashboard/settings"        
        var resp=await getData(endpoint)
        var list=[]
        resp.indicator.map((item)=>{
          var dataObject=new Object();
          dataObject.id=item.id
          dataObject.name=item.name
          dataObject.type=item.type
          dataObject.uid=item.uid
          dataObject.code_group=item.code_group
          dataObject.uid=item.uid
          dataObject.name_dhis=item.name_dhis
          dataObject.dataSetID=item.dataSetID
          dataObject.dataSetName=item.dataSetName
          dataObject.dataElementOperandID=item.dataElementOperandID
          if(item.id===props.id){
            if(radio==="DE"){
              dataObject.type="dataElement"
            }else(
              dataObject.type="indicator"
            )
            dataObject.uid=eltValue.id
            dataObject.name_dhis=eltValue.displayName
            dataObject.dataSetID=dsetValue.id
            dataObject.dataSetName=dsetValue.displayName
            dataObject.dataElementOperandID=desgValue
          }
          list.push(dataObject)
        })

        resp.indicator=list
        console.log("==========resp Indicators============"+JSON.stringify(resp))
        await deleteData(endpoint)
        await postData(endpoint,resp)   
        
        props.back()

      };

    return ( 
        <>
         <Grid  container spacing={3} direction="row" justify="center" alignItems="center">
            <Grid item  >
              <RadioGroup
                    aria-label="Location"
                    name="location"
                    //className={classes.group}
                    //value={location}
                    onChange={radioChange}
                    row={true}
                    >
                      <FormControlLabel value="DE" control={<Radio />} label="Data element" />
                      <FormControlLabel value="IN" control={<Radio />} label="Indicator" />
              </RadioGroup>
            </Grid>
            <Grid item  >
              <Autocomplete
                    id="group"
                    options={groupData}
                    getOptionLabel={(option) => option.displayName}
                    style={{ width: 250 }}
                    disabled={goup}
                    onChange={groupChange}
                    renderInput={(params) => <TextField {...params} label={goupLabel} variant="outlined" />}
                />
              </Grid>
              <Grid item >
                <Autocomplete
                    id="element"
                    options={eltData}
                    getOptionLabel={(option) => option.displayName}
                    style={{ width: 250 }}
                    disabled={elt}
                    onChange={elementChange}
                    renderInput={(params) => <TextField {...params} label={eltLabel} variant="outlined" />}
                />
              </Grid>
              <Grid item >
                <Autocomplete
                    id="dataset"
                    options={dsetData}
                    getOptionLabel={(option) => option.displayName}
                    style={{ width: 250 }}
                    disabled={dset}
                    onChange={datasetChange}
                    renderInput={(params) => <TextField {...params} label="Data set" variant="outlined" />}
                />
              </Grid>
              <Grid item >
                <Autocomplete
                    id="variable"
                    options={desgData}
                    getOptionLabel={(option) => option.displayName}
                    style={{ width: 250 }}
                    disabled={desg}
                    onChange={variableChange}
                    renderInput={(params) => <TextField {...params} label="Variable" variant="outlined" />}
                />
              </Grid>
              <Grid item>
                  <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      //endIcon={<Icon>send</Icon>}
                      disabled={btn}
                      onClick={handleSubmit}
                  >
                      Send
                  </Button>
                </Grid>
            </Grid>
        </>
     );
}
 
export default Indicator;