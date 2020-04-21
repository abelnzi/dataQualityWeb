import React,{ useState } from 'react';
import RecursiveTreeView from './OrgUnitTree';
import DatePicker from './DatePicker';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router-dom';
import SelectIndicators from './SelectIndicators'


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
      },
    button: {
      margin: theme.spacing(1),
    },
  }));

  
 
const Dashboard = (props) => {
    const [redirection, setRedirection] =  useState(false);
    const classes = useStyles();

    const setOrgunit = (orgunit) => {
        console.log("===========Dashborad orgunit=================== :"+orgunit)
        props.setOrgunit(orgunit)
    };

    const setPeriod = (period) => {
        //console.log("==============Dashborad period=============== : "+period)
        props.setPeriod(period)
    };

    const renderRedirect = () => {
        if (redirection) {
        //console.log("redirection : "+redirection)
          return <Redirect to='/charts' />
        }
      }

    const handleSubmit = () => {
        setRedirection(true)
        props.handleSubmit()

    };
   
    
    return ( 
        
        <div className={classes.root}>                 
            {renderRedirect()}

            <form  >
                <Grid xs={12} container direction="row" justify="center" alignItems="center">
                    <Grid item xs={12} container direction="row" justify="center" alignItems="center">
                    <Typography variant="h4" gutterBottom>
                        Selection of parameters
                    </Typography>
                    </Grid>
                                            
                    <Grid item xs={2}>
                        <br/><br/><br/>
                        <strong>Organisation unit</strong> <RecursiveTreeView  setOrgunit={setOrgunit} />
                    </Grid>
                    <Grid item xs={2}>
                        <strong>Period</strong> <DatePicker setPeriod={setPeriod} />
                    </Grid>
                    <Grid item xs={1}>                       
                    </Grid>
                    <Grid item xs={2}>
                        <SelectIndicators />
                    </Grid>
                    <Grid item xs={1}>                       
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            //endIcon={<Icon>send</Icon>}
                            onClick={handleSubmit}
                        >
                            Send
                        </Button>
                    </Grid>
                    
                </Grid>
            </form>               
               
        </div>
     );
}
 
export default Dashboard;