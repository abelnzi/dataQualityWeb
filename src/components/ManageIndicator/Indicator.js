import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Indicators from '../data/Indicators.json'

const Indicator = (props) => {
    const [data, setData] = useState([]);
    const filterList = () => {
        console.log("==============props.codeGP=============== : "+props.codeGP)
        var list=Indicators.indicator.filter(ind=>ind.code_group===props.codeGP)
        setData(list)
      };

    useEffect(() => {       
        filterList()
      },[]); 

    return ( 
        <>
         {console.log("==============props.codeGP=============== : "+props.codeGP)}
        <Autocomplete
                id="combo-box-demo"
                options={data}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                //onChange={handleSelect}
                renderInput={(params) => <TextField {...params} label="Indicator" variant="outlined" />}
            />
        </>
     );
}
 
export default Indicator;