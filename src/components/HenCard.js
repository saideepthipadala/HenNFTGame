import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
    Box,
    Button,
    Heading,
    Text,
    Stack,
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
} from '@chakra-ui/react';

const HenCard = ({ hen, onSetForSale , contractInstance}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [priceInput, setPriceInput] = useState('');
    const [salesChanged, setSalesChanged] = useState(false);

    useEffect(() => {
        setSalesChanged(!salesChanged);
    }, [hen.forSale]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmSale = () => {
        onSetForSale(hen, parseFloat(priceInput));
        setSalesChanged((prev) => !prev);
        handleCloseModal();
    };

    const handleRemoveFromSale = () => {
        contractInstance.withdrawHenFromSale(hen.id)
        setSalesChanged((prev) => !prev);
    };

    return (
        <Box p={4} borderWidth="1px" className='w-full' borderRadius="lg" textAlign="center">
            <Heading size="md" mb={2}>
                {hen.name}
            </Heading>
            <Text>Hen ID: {hen.id.toString()}</Text>
            <Text>Generation: {hen.generation.toString()}</Text>
            <Text>Gender: {hen.gender ? 'Male' : 'Female'}</Text>
            {hen.forSale ? (
                <Stack mt={4} direction="column" align="center">
                    <Text>Price: {ethers.utils.formatEther(hen.price)} ETH</Text>
                    <Badge colorScheme="green">For Sale</Badge>
                    <Button mt={2} colorScheme="red" className='max-w-full' onClick={handleRemoveFromSale}>
                        <span className='text-sm'>Remove from Sale</span>
                    </Button>
                </Stack>
            ) : (
                <Stack mt={4} direction="column" align="center">
                    <Text>Not for Sale</Text>
                        <Button mt={2} colorScheme="teal" onClick={handleOpenModal}>
                        Set for Sale
                    </Button>
                </Stack>
            )}

            {/* Modal for entering the price */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Set Price for Sale</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Enter the price in ETH:</Text>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter price"
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="teal" onClick={handleConfirmSale}>
                            Confirm
                        </Button>
                        <Button onClick={handleCloseModal}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>

    );
};

export default HenCard;
