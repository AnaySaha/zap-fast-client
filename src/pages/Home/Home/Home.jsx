import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../services/services';
import ClientLogosMarquee from './ClientLogosMarquee/ClientLogosMarquee';
import Benefits from './Benefits/Benefits';

const Home = () => {
    return (
        <div>
            <Banner/>
            <Services></Services>
            <ClientLogosMarquee></ClientLogosMarquee>
            <Benefits></Benefits>
        </div>
    );
};

export default Home;