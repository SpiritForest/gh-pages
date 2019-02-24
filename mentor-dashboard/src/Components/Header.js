import React, { Component } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import Autocomplete from './Autocomplete';

class Header extends Component {

  render() {
    return (
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" color="inherit">
					Mentor-Dashboard
					</Typography>
					<Autocomplete {...this.props}/>
				</Toolbar>
			</AppBar>
    );
  }
}

export default Header;