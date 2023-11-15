import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { spacing } from '@mui/system';

const useStyles = makeStyles(() => ({
    footer: {
        top: 'auto',
        bottom: 0,
        backgroundColor: 'black !important',
        padding: spacing(2),
        alignItems: 'center',
        marginTop: 100,
      },
      footerText: {
        textAlign: 'center',
        color: 'white',
        '& a': {
          color: 'white',
          textDecoration: 'none',
          marginLeft: 5,
          marginRight: 5,
        },
      },
}));

const Footer = () => {
    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.footer}>
            <Toolbar>
                <Typography variant="body1" className={classes.footerText}>
                    Made with ❤️ by<br></br>
                    <a href="https://github.com/MoryKadoch" target="_blank">
                        Mory
                    </a>{' '}
                    &{' '}
                    <a href="https://github.com/Dedhal" target="_blank">
                        Joris
                    </a>{' '}
                    &{' '}
                    <a href="https://github.com/Rambele" target="_blank">
                        Rachid
                    </a>{' '}
                    &{' '}
                    <a href="https://github.com/yakinos" target="_blank">
                        Yakine
                    </a>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Footer;
