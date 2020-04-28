import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
//import Indicators from '../data/Indicators.json'
import {baseUrl,getData} from '../service/FecthingData'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const init=async()=>{
  var endpoint=baseUrl+"/api/dataStore/qualitydashboard/settings"
  var resp=await getData(endpoint)
    if (resp.status === 'ERROR') {
      console.error(resp.message)
      return []
  }
  //console.log("==========resp============"+JSON.stringify(resp))
  return resp
  
}

const data = async () => {
  var indicators=await init()  
  var list=[]
  indicators.indicator.map((item)=>{
      var dataObject=new Object();
      dataObject.id=item.id
      dataObject.name=item.name
      dataObject.type=item.type
      dataObject.uid=item.uid      
      dataObject.name_dhis=item.name_dhis
      dataObject.dataSetID=item.dataSetID
      dataObject.dataSetName=item.dataSetName
      dataObject.dataElementOperandID=item.dataElementOperandID
      dataObject.code_group=item.code_group
      var group=indicators.groups.filter(set=>set.code===item.code_group)      
      dataObject.groupName=group[0].name
      list.push(dataObject)
    }
  )
console.log("==========list============"+JSON.stringify(list))
 return list
};

const AdminTable = (props) => {
  const [rows, setRows] = useState([]);

  const classes = useStyles();

  const onChoice=(id) =>{
    //console.log("========id==========="+id)
    props.onChoice(id)
  }

  useEffect(() => {
    //console.log("==========data============"+data())
    async function load() {
      setRows(await data())
    }   
    load()
  },[])

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Group</TableCell>
            <TableCell>Reference numerator</TableCell>
            <TableCell>Data element/indicator</TableCell>
            <TableCell>Dataset</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
       {console.log("==========rows============"+JSON.stringify(rows))}
          {rows.map((row) => (
              <TableRow key={row.groupName}>
                <TableCell component="th" scope="row">
                  {row.groupName}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.name_dhis}</TableCell>
                <TableCell>{row.dataSetName}</TableCell>
                <TableCell >
                <Link  onClick={()=>onChoice(row.id)} >
                    edit
                </Link>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AdminTable;