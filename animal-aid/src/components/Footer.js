import { Grid, Box, Typography, Container } from "@material-ui/core";

export default function Footer()
{
    return (
    <footer>
        <Box bgcolor="primary.main" color="primary.contrastText" maxHeight="40px" minHeight="40px">
            <Container maxWidth="lg">
                <Typography>Animal Aid</Typography>
            </Container>
        </Box>
    </footer>
    );
}