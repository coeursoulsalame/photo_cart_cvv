import React from 'react';
import { Container } from '@mui/material';
import ClientMain from './main/ClientMain';

const ClientPage = () => {

    return (
        <Container maxWidth={false} disableGutters>
            <ClientMain/>
        </Container>
    );
};

export default ClientPage;
