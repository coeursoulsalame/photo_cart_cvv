import React from 'react';
import { Container } from '@mui/material';
import Header from './header/Header';
import Gallery from './gallery/Gallery';

const ServicePage = () => {
    
    return (
        <Container maxWidth={false} disableGutters>
            <Header/>
            <Gallery/>
        </Container>
    );
};

export default ServicePage;
