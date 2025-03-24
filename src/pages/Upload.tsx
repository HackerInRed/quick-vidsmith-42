
import React from 'react';
import Layout from '../components/Layout';
import { UploadHero } from '../components/upload/UploadHero';
import { UploadProcessor } from '../components/upload/UploadProcessor';

const Upload = () => {
  return (
    <Layout fullWidth>
      <div className="min-h-screen bg-gradient-to-b from-vidsmith-darker to-black">
        <UploadHero />
        <UploadProcessor />
      </div>
    </Layout>
  );
};

export default Upload;
