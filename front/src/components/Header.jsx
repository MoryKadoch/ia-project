import { AppBar, Toolbar, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { spacing } from '@mui/system';

const useStyles = makeStyles(() => ({
    appBar: {
        marginBottom: spacing(4),
        backgroundColor: 'black !important',
    },
}));

const Header = () => {
    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    Digit Recognizer
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
