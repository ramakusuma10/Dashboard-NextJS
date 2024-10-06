'use client';
import { LockOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, Typography,Space,notification } from 'antd';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/app/libs/auth';

const { Title } = Typography;

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const openNotification = (type: 'success' | 'error', message: string) => {
    notification[type]({
      message: type === 'success' ? 'Login Berhasil' : 'Login Gagal',
      description: message,
      placement: 'top',
    });
  };

  const onFinish = (values: { username: string; password: string }) => {
    const { username, password } = values;
    const isLoggedIn = login(username, password);
    
    if (isLoggedIn) {
      document.cookie = "authToken=authenticated; path=/"; // Menyimpan token di cookies
      openNotification('success', 'Selamat datang! Anda berhasil login.');
      router.push('/'); // Arahkan ke halaman dashboard
    } else {
      setError('Email atau password salah.');
      openNotification('error', 'Silakan coba lagi.');
    }
  };

  return (
    <Space
    direction="vertical"
    align="center"
    className='w-full h-screen justify-center'
  >
    <Card className='w-[400px] shadow-lg'>
      <Space direction="vertical" align="center" className='w-full'>
        <SmileOutlined className="text-4xl text-blue-500" />
        <Title level={3} className='mt-4'>Login</Title>
      </Space>

      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className='w-full'
      >
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  </Space>
  );
}