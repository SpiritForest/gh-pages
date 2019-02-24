import React from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
// import IntegrationDownshift from './Other'

const styles = theme => ({
  paper: {
    display: "flex",
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 10,
    width: "30%",
    minWidth: 200
  },
  search: {
    paddingLeft: 20,
    width: "100%",
    height: "3rem",
    fontSize: "1.3rem",
  }
});


class Search extends React.Component { 
  state = {
    name: '',
  };

  handleChange = ({target: { value }}) => {
    this.setState({ name: value });
    this.props.handleSearch(value);
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper elevation={1} className={classes.paper}>
        <InputBase placeholder="Enter your name" className={classes.search} value={this.state.name} onChange={this.handleChange} {...this.props.InputProps}/>
        <IconButton aria-label="Search" disabled={true} >
          <SearchIcon />
        </IconButton>
        <Divider />
      </Paper>
      )
    }
}

export default withStyles(styles)(Search);