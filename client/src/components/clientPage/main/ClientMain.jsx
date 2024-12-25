import React, {useState} from 'react';
import { Container, Button, Box } from '@mui/material';
import ServiceModal from '../modal/service/ServiceModal';

import { useSnackbar } from 'notistack';  // временно

const ClientMain = () => {
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar(); //временный стейт

    const handleRepairClick = () => {
        enqueueSnackbar('Функционал в разработке', { variant: 'error' });  // на время разработки
    };

    const modalOpen = () => {
        setServiceModalOpen(true);
    };

    const modalClose = () => {
        setServiceModalOpen(false);
    };

    console.log('render');
    
    return (
        <>
            <Container
                maxWidth={false}
                disableGutters
                sx={{
                    width: '100%', 
                    height: '100vh',  
                }}
            >
                <Box
                    sx={{
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100%', 
                        flexDirection: 'row', 
                    }}
                >
                    <Button
                        size='large'
                        variant="contained" 
                        onClick={modalOpen}
                        color="success"
                        sx={{ p: 3, fontSize: '2rem' }}
                    >
                        Обслуживание вагонеток
                    </Button>

                    <Button
                        size='large'
                        variant="contained" 
                        sx={{ ml: 2, p: 3, fontSize: '2rem' }} 
                        color="success"
                        onClick={handleRepairClick} 
                    >
                        Вывести в ремонт
                    </Button>

                    <Button
                        size='large'
                        variant="outlined"
                        sx={{ ml: 2, p: 3, fontSize: '2rem' }} 
                        color="primary"
                        component="a" 
                        href="/service"  
                        rel="noopener noreferrer"
                    >
                        Администрирование
                    </Button>
                </Box>
            </Container>

            <ServiceModal
                open={serviceModalOpen}
                onClose={modalClose}
            />
        </>
    );
};

export default ClientMain;