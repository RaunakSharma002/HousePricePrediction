import {AppBar, Button, Toolbar, Typography} from "@mui/material";
import { Link } from "react-router-dom";

function Navbar(){
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>Real Estate Evaluation</Typography>
                    <Button color="inherit" component={Link} to="/"> Data Entry</Button>
                    <Button color="inherit" component={Link} to="/prediction"> Prediction</Button>
                </Toolbar>

            </AppBar>
        </>
    );
}
export default Navbar;