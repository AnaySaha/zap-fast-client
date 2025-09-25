import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../services/services';
import ClientLogosMarquee from './ClientLogosMarquee/ClientLogosMarquee';

const Home = () => {
    return (
        <div>
            <Banner/>
            <Services></Services>
            <ClientLogosMarquee></ClientLogosMarquee>
        </div>
    );
};

export default Home;