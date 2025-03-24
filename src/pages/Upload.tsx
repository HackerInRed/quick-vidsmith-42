
import React from 'react';
import Layout from '../components/Layout';
import { UploadProcessor } from '../components/upload/UploadProcessor';

const Upload = () => {
  return (
    <Layout fullWidth>
      <div className="min-h-screen bg-gradient-to-b from-vidsmith-darker to-black pt-8">
        <UploadProcessor />
      </div>
    </Layout>
  );
};

export default Upload;
