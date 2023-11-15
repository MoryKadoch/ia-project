import { AppBar, Toolbar, Typography } from '@mui/material';
import { spacing, styled } from '@mui/system';

const StyledAppBar = styled(AppBar)({
    marginBottom: spacing(4),
    backgroundColor: 'black !important',
});

const Header = () => {
    return (
        <StyledAppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div">
                    Digit Recognizer
                </Typography>
            </Toolbar>
        </StyledAppBar>
    );
};

export default Header;
