import React, { useState, useEffect } from 'react';
import HenCard  from "./HenCard";
import { ethers } from 'ethers';
import {
    Box,
    Heading,
    SimpleGrid,
    Text,
} from '@chakra-ui/react';



const UserProfile = ({ currentAccount, contractInstance }) => {
    const [ownedHens, setOwnedHens] = useState([]);
    const [numHensSold, setNumHensSold] = useState(0);

    useEffect(() => {
        if (currentAccount && contractInstance) {
            const loadUserProfile = async () => {
                try {
                    // Call your smart contract functions to get user profile data
                    const hens = await contractInstance.getOwnedHens(currentAccount);

                    setOwnedHens(hens);
                } catch (error) {
                    console.error('Error loading user profile:', error);
                }
            };
            loadUserProfile();
        }
    }, [currentAccount, contractInstance]);

    console.log(ownedHens);

    const handleSetForSale = async (hen, price) => {
        try {
            // Ensure price is a string before using parseEther
            const parsedPrice = ethers.utils.parseEther(price.toString());

            // Call your smart contract function to set/unset the hen for sale
            await contractInstance.setHenForSale(hen.id, parsedPrice, {
                from: currentAccount,
            });

            // Refresh the list of owned hens after setting for sale
            const updatedHens = await contractInstance.getOwnedHens(currentAccount);
            setOwnedHens(updatedHens);
        } catch (error) {
            console.error('Error setting hen for sale:', error);
        }
    };


    return (
        <Box maxW="xl" mx="auto" p={8}>
            <Heading mb={8}>User Profile</Heading>
            <Text mb={4}>Account Address: {currentAccount}</Text>
            <Text mb={4}>Number of Hens Sold: {numHensSold}</Text>
            <Heading size="md" mb={4}>
                Owned Hens
            </Heading>
            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
                {ownedHens.map((hen) => (
                    <HenCard key={hen.id} hen={hen} onSetForSale={handleSetForSale} />
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default UserProfile;
