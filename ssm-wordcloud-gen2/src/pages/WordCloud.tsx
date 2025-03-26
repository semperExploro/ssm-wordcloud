import WordCloudComponent from "../components/WordCloud.tsx";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import APIGateway from "../API";
export default function WordCloud() {
  const [showInput, setShowInput] = useState(false);
  const APIGatewayManager = new APIGateway();
  useEffect(() => {
    // Show input box after animation completes
    const timer = setTimeout(() => setShowInput(true), 250);
    return () => clearTimeout(timer);
  }, []);
  const pStyles: CSS.Properties = {
    fontSize: '1.5rem',
    width: '60%',
    color: '#003062',
    fontFamily: 'Muli, Rubik, Helvetica, sans-serif'
  };
  const h1Styles: CSS.Properties = {
    display: 'block',
    position: 'relative',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginTop: '2rem',
    marginBottom: '1rem',
    color: '#003062',
    textAlign: 'center',
    fontFamily: 'Muli, Rubik, Helvetica, sans-serif'
  };
  const aStyles: CSS.Properties = { 
      color: 'white',
      backgroundColor: '#003062',
      fontSize: '1.5rem',
      border: 'none',
      padding: '1rem',
      textAlign: 'center',
      display: 'block',
      fontFamily: 'Muli, Rubik, Helvetica, sans-serif'
  }


return (
    <div>
      <h1 style={h1Styles}>What Others Have Said</h1>
      <div 
        style={{
              display: 'block',
              position: 'relative',
              flexDirection: 'column',
              alignItems: 'center',
              height: '50vh',
              justifyContent: 'center',
              textAlign: 'center',    
              paddingBottom: '3rem',          
          }}>

        <WordCloudComponent />
        
        </div>
        <div 
          style={{
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '10rem',
            paddingTop: '3rem',
            paddingBottom: '3rem',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: '1.5rem',
            backgroundColor: 'floralwhite'
          }}>
              <p style={pStyles}>The American church's recent engagement with politics has led many to view Christianity as a political monolith. But is this true? Do Christians have to vote a certain way or support particular causes? Can Christianity transcend some of these categories and complicate the prevailing narrative?</p>
              <p style={pStyles}>We invite those of all faith backgrounds and political persuasions to join us for a series of talks and Q&A revolving around the research and experience of Dr. Hahrie Han and Michael Wear.</p>
              <p style={pStyles}><strong>Hahrie Han</strong> is a political science professor at Johns Hopkins University, as well as an award-winning author of five books relating to politics and social activism, including her latest, <i>Undivided: The Quest for Racial Solidarity in An American Church</i>. <strong>Michael Wear</strong> is a former White House staffer and current president of the Center for Christianity and Public Life, and his latest book is titled <i>The Spirit of Our Politics: Spiritual Formation and the Renovation of Public Life</i>.</p>
              <p style={pStyles}><strong>Jenny Yang</strong>, the former Vice President of Advocacy and Policy at World Relief and current External Relations Officer at UNHCR, will be the host and facilitator.</p>
              <p style={pStyles}>We look forward to seeing you on <strong>Tuesday, April 8, at 6pm</strong> at the Scott-Bates Commons Salons (3301 N Charles St, Baltimore, MD 21218).</p>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSewuzyTrt9dpMe1B0gD2b0su9BTsKxKmPgjWxn8tTmel8j6Lw/viewform" target="_blank"><button>
                RSVP Here</button>
            </a>
              <p style={pStyles}><img src="/p_c_banner.png" alt="Politics and the Church" width="100%" /></p>
        </div>
        <div 
          style={{
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            marginTop: '3rem',
            marginBottom: '3rem'
          }}>
            <p style={pStyles}><img src="/ssm_logo_003062.png" alt="SSM Logo" width={200} /></p>
            <p style={pStyles}>This event is sponsored by Stepping Stone Ministry, a student organization at the Homewood Campus of Johns Hopkins University. We have large group meetings on Friday nights, small group meetings throughout the week, and church services with <a href="https://www.gracelifechurch.com/" target="_blank">Grace Life Church</a> in Catonsville on Sunday mornings. To learn more about us, click the button below.</p>
            <a href="https://ssm.gracelifechurch.com/" target="_blank"><button>
                Visit Our Website</button>
            </a>

        </div>
    </div>
  );
}

function homepageanimation() {
  return <div
      style={{
          position: 'relative',
          width: '100%',
          height: '10rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
      }}
  >
      {/* Moving Image Placeholder */}
      <motion.div
          initial={{ x: 0 }}
          animate={{ x: -150 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
              width: '10rem',
              height: '10rem',
              backgroundColor: '#d3d3d3',
              borderRadius: '0.5rem',
          }}        >
          <img src="/jhu_logo.png" alt="JHU Logo" width={200} height={200} />
      </motion.div>

      {/* Text Appearing */}
      <motion.h1
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
              position: 'absolute',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#003062',
          }}        >
          Stepping Stone Ministry
      </motion.h1>
  </div>;
}