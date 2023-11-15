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

                    console.log(hens);

                    setOwnedHens(hens);
                } catch (error) {
                    console.error('Error loading user profile:', error);
                }
            };
            loadUserProfile();
        }
    }, [currentAccount, contractInstance]);

    const handleSetForSale = async (hen, price) => {
        try {
            const parsedPrice = ethers.utils.parseEther(price.toString());

            // Call your smart contract function to set/unset the hen for sale
            const tx = await contractInstance.setHenForSale(hen.id, parsedPrice, {
                from: currentAccount,
            });
            await tx.wait();

        
            // Refresh the list of owned hens after setting for sale
            const updatedHens = await contractInstance.getOwnedHens(currentAccount);
            setOwnedHens(updatedHens);

            // Now log the updated hen
            console.log('Hen Object after updating:', updatedHens.find(updatedHen => updatedHen.id === hen.id));
        } catch (error) {
            console.error('Error setting hen for sale:', error);
        }
    };


    

    console.log(ownedHens);

 


    return (
        <Box maxW="xl" mx="auto" className='w-2/3' p={8}>
            <Heading mb={8}>User Profile</Heading>
            <Text mb={4}>Account Address: {currentAccount}</Text>
            <Heading size="md" mb={4}>
                Owned Hens
            </Heading>
            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
                {ownedHens.map((hen) => (
                    <HenCard key={hen.id} hen={hen} onSetForSale={handleSetForSale} contractInstance={contractInstance} />
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default UserProfile;
