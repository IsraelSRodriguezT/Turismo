import React from 'react';
import Layout from './Layout';

function AdminLayout({ children, title = 'Panel de Administración' }) {
  return (
    <Layout title={title}>
      {children}
    </Layout>
  );
}

export default AdminLayout;
