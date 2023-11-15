import { AppBar, Toolbar, Typography } from '@mui/material';
import { spacing, styled } from '@mui/system';

const FooterStyled = styled(AppBar)(({ theme }) => ({
    top: 'auto',
    bottom: 0,
    backgroundColor: 'black !important',
    padding: spacing(2),
    alignItems: 'center',
    marginTop: 100,
}));

const FooterText = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    '& a': {
        color: 'white',
        textDecoration: 'none',
        marginLeft: 5,
        marginRight: 5,
    },
}));

const Footer = () => {
    return (
        <FooterStyled position="static">
            <Toolbar>
                <FooterText variant="body1">
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
                </FooterText>
            </Toolbar>
        </FooterStyled>
    );
}

export default Footer;
