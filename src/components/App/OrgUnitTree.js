import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import InitialOrgunits from '../data/InitialOrgunits'

//const data = InitialOrgunits.organisationUnits[0]

const API_ENDPOINT='https://dhis2.jsi.com/dhis/api/29/organisationUnits.json?userDataViewFallback=true&fields=id,displayName,level,children[displayName,level,id,children[displayName,level,id]]&paging=false'


const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});



export default function RecursiveTreeView(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [data, setData] = React.useState([]);

   async function fetchData() {
    await (await fetch(API_ENDPOINT, {
              method: 'GET',
              credentials: 'include',
              headers: {
                  Accept: 'application/json',
              },
          })).json()
            .then(res => setData(res.organisationUnits[0]))
            .catch(err =>console.log("err :"+err));
  } 

  useEffect(() => {
    //fetchData();
    //console.log('Data '+ data)
    setData(InitialOrgunits.organisationUnits[0])
  }); 

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
    props.setOrgunit(nodeIds)
    console.log("==============handleToggle orgunit=============== : "+nodeIds)
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    props.setOrgunit(nodeIds)
    console.log("==============handleSelect orgunit =============== : "+nodeIds)
  };

  const renderTree = nodes => (
      <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.displayName}>
        {Array.isArray(nodes.children) ? nodes.children.map(node => renderTree(node)) : null}
      </TreeItem>
  );

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
    >
      {renderTree(data)}
    </TreeView>
  );
}